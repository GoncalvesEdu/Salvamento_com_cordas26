# ==========================================================================
# Servidor API & Banco de Dados - Portal 2º GB CBMESP
# Core de Segurança RBAC Blindado:
# - Endpoint /api/auth/login ignora 100% qualquer campo 'role' vindo da requisição.
# - O perfil (role) do usuário é obtido EXCLUSIVAMENTE da coluna usuarios.role no BD.
# - Engine Anti-Cheat de Quiz com Randomização Determinística (Seed SHA256).
# - Hashing PBKDF2-HMAC-SHA256, SQLite WAL + Busy Timeout & Parametrização Segura (?).
# ==========================================================================
import http.server
import socketserver
import json
import sqlite3
import urllib.parse
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2 import errors
import hashlib
import secrets
import uuid
import mimetypes
import shutil
import csv
import io
import time
import random
from datetime import datetime, date
import math

PORT = int(os.environ.get('PORT', 8082))

# ------------------------------------------------------------------
# CONFIGURAÇÃO DE CONEXÃO COM O BANCO DE DADOS POSTGRESQL
# ------------------------------------------------------------------
PERSISTENT_DIR = os.environ.get('PERSISTENT_DIR', '/data')
print("[SERVER API] Inicializando conexão com PostgreSQL via DATABASE_URL")

if os.path.exists(PERSISTENT_DIR) and os.path.isdir(PERSISTENT_DIR):
    UPLOAD_DIR = os.environ.get('UPLOADS_DIR', os.path.join(PERSISTENT_DIR, 'uploads'))
else:
    UPLOAD_DIR = os.path.join(os.path.dirname(__file__), 'uploads')

os.makedirs(UPLOAD_DIR, exist_ok=True)
print(f"[SERVER API] Utilizando pasta de uploads em: {UPLOAD_DIR}")
SESSIONS = {}

def calculate_student_pacing_status(modulos_concluidos, total_modulos=7, current_dt=None):
    if current_dt is None:
        current_dt = date.today()
    elif isinstance(current_dt, datetime):
        current_dt = current_dt.date()

    start_date = date(2026, 8, 3)
    end_date = date(2026, 8, 13)
    total_course_days = (end_date - start_date).days + 1

    if current_dt < start_date:
        expected_modules = 0
    elif current_dt >= end_date:
        expected_modules = total_modulos
    else:
        days_elapsed = (current_dt - start_date).days + 1
        expected_modules = math.ceil((days_elapsed / float(total_course_days)) * total_modulos)

    if modulos_concluidos == 0:
        status_key = 'nao_iniciado'
        status_label = 'Não iniciado'
        status_color = '#f87171'
    elif modulos_concluidos < expected_modules:
        status_key = 'atrasado'
        status_label = 'Atrasado'
        status_color = '#f5c23d'
    else:
        status_key = 'em_dia'
        status_label = 'Em dia'
        status_color = '#4ade80'

    return {
        'status_key': status_key,
        'status_label': status_label,
        'status_color': status_color,
        'expected_modules': expected_modules,
        'modulos_concluidos': modulos_concluidos,
        'total_modulos': total_modulos
    }

LOGIN_ATTEMPTS = {}
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_TIME_SECONDS = 300

ALLOWED_UPLOAD_EXTENSIONS = {'.pdf', '.pptx', '.docx', '.zip', '.mp4', '.png', '.jpg', '.jpeg', '.csv'}
MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024

os.makedirs(UPLOAD_DIR, exist_ok=True)

manual_oficial_name = 'Manual de Salvamento em Altura v3.pdf'
manual_dest = os.path.join(UPLOAD_DIR, manual_oficial_name)
if not os.path.exists(manual_dest):
    candidates = [
        os.path.join(os.path.dirname(__file__), manual_oficial_name),
        r'C:\Users\Edu\Desktop\salvamento-cordas-portal\Manual de Salvamento em Altura v3.pdf'
    ]
    for cand in candidates:
        if os.path.exists(cand):
            try:
                shutil.copy2(cand, manual_dest)
            except Exception:
                pass
            break

def hash_password_pbkdf2(password, salt_hex=None):
    if not salt_hex:
        salt_hex = secrets.token_hex(16)
    salt_bytes = bytes.fromhex(salt_hex)
    dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt_bytes, 100000)
    return f"pbkdf2_sha256${salt_hex}${dk.hex()}"

def verify_password(password, stored_hash):
    if stored_hash.startswith("pbkdf2_sha256$"):
        parts = stored_hash.split('$')
        if len(parts) == 3:
            salt_hex = parts[1]
            check_hash = hash_password_pbkdf2(password, salt_hex)
            return check_hash == stored_hash
    legacy_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
    return legacy_hash == stored_hash

def get_db():
    db_url = os.environ.get("DATABASE_URL") or "postgresql://db_salvamento_com_cordas_user:nZvQsGoE6ED6ne026zkML02fjEbtlKWo@dpg-d9mc56ijobas73ao7fk0-a.oregon-postgres.render.com/db_salvamento_com_cordas"
    conn = psycopg2.connect(
        db_url,
        cursor_factory=RealDictCursor
    )
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute('''
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                senha_hash TEXT NOT NULL,
                nome TEXT NOT NULL,
                re TEXT UNIQUE NOT NULL,
                estacao TEXT NOT NULL,
                role TEXT CHECK(role IN ('aluno', 'instrutor', 'admin')) NOT NULL,
                senha_provisoria SMALLINT DEFAULT 1,
                primeiro_acesso_em TIMESTAMP DEFAULT NULL,
                status TEXT DEFAULT 'ativo',
                desligado_em TIMESTAMP DEFAULT NULL,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ''')

        cur.execute("ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS senha_provisoria SMALLINT DEFAULT 1")
        cur.execute("ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS primeiro_acesso_em TIMESTAMP DEFAULT NULL")
        cur.execute("ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ativo'")
        cur.execute("ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS desligado_em TIMESTAMP DEFAULT NULL")

        cur.execute('''
            CREATE TABLE IF NOT EXISTS alunos (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                re TEXT UNIQUE NOT NULL,
                estacao TEXT NOT NULL,
                status TEXT DEFAULT 'ativo',
                desligado_em TIMESTAMP DEFAULT NULL,
                ultimo_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ''')

        cur.execute('''
            CREATE TABLE IF NOT EXISTS progresso_modulos (
                id SERIAL PRIMARY KEY,
                aluno_re TEXT NOT NULL,
                modulo_id INTEGER NOT NULL,
                nota DOUBLE PRECISION DEFAULT 0.0,
                tempo_gasto INTEGER DEFAULT 0,
                status TEXT DEFAULT 'concluido',
                data_conclusao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (aluno_re) REFERENCES alunos(re)
            );
        ''')

        cur.execute('''
            CREATE TABLE IF NOT EXISTS certificados (
                id SERIAL PRIMARY KEY,
                aluno_re TEXT NOT NULL,
                codigo_hash TEXT UNIQUE NOT NULL,
                data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (aluno_re) REFERENCES alunos(re)
            );
        ''')

        cur.execute('''
            CREATE TABLE IF NOT EXISTS arquivos_instrutoria (
                id SERIAL PRIMARY KEY,
                nome_arquivo TEXT NOT NULL,
                nome_original TEXT NOT NULL,
                nome_salvo TEXT NOT NULL,
                caminho_arquivo TEXT NOT NULL,
                tamanho TEXT NOT NULL,
                mime_type TEXT DEFAULT 'application/pdf',
                visivel_para TEXT DEFAULT 'todos',
                data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ''')

        cur.execute("ALTER TABLE arquivos_instrutoria ADD COLUMN IF NOT EXISTS visivel_para TEXT DEFAULT 'todos'")

        cur.execute('''
            CREATE TABLE IF NOT EXISTS logs_auditoria (
                id SERIAL PRIMARY KEY,
                acao TEXT NOT NULL,
                executado_por TEXT NOT NULL,
                detalhes TEXT NOT NULL,
                data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ''')

        cur.execute('''
            CREATE TABLE IF NOT EXISTS quiz_questions (
                id TEXT PRIMARY KEY,
                curso_id TEXT NOT NULL,
                modulo_id TEXT NOT NULL,
                question_text TEXT NOT NULL
            );
        ''')

        cur.execute('''
            CREATE TABLE IF NOT EXISTS quiz_options (
                id TEXT PRIMARY KEY,
                question_id TEXT NOT NULL REFERENCES quiz_questions(id),
                option_text TEXT NOT NULL,
                is_correct INTEGER NOT NULL DEFAULT 0
            );
        ''')

        cur.execute('''
            CREATE TABLE IF NOT EXISTS quiz_attempts (
                id TEXT PRIMARY KEY,
                aluno_re TEXT NOT NULL,
                curso_id TEXT NOT NULL,
                modulo_id TEXT NOT NULL,
                seed TEXT NOT NULL,
                question_order TEXT NOT NULL,
                option_order TEXT NOT NULL,
                started_at TEXT NOT NULL,
                submitted_at TEXT,
                score DOUBLE PRECISION
            );
        ''')

        cur.execute('''
            CREATE TABLE IF NOT EXISTS quiz_answers (
                attempt_id TEXT NOT NULL REFERENCES quiz_attempts(id),
                question_id TEXT NOT NULL,
                chosen_option_id TEXT NOT NULL,
                is_correct INTEGER NOT NULL,
                PRIMARY KEY (attempt_id, question_id)
            );
        ''')

        # Inserir Usuário Instrutor Padronizado
        instrutor_pass = hash_password_pbkdf2('2gb2026')
        cur.execute('''
            INSERT INTO usuarios (username, senha_hash, nome, re, estacao, role, senha_provisoria, status)
            VALUES ('instrutor.2gb', %s, 'Comando de Instrução 2º GB', 'INSTRUTOR-01', '2º GB / Comando', 'instrutor', 0, 'ativo')
            ON CONFLICT (username) DO UPDATE SET senha_hash = EXCLUDED.senha_hash, role = 'instrutor'
        ''', (instrutor_pass,))

        # Inserir Conta Fictícia Dedicada para Testes de Produção (RE: 999999-9)
        teste_pass = hash_password_pbkdf2('999999-9')
        cur.execute('''
            INSERT INTO usuarios (username, senha_hash, nome, re, estacao, role, senha_provisoria, status)
            VALUES ('999999-9', %s, 'ALUNO DE TESTE (NÃO USAR EM PRODUÇÃO)', '999999-9', '2º GB / TESTE', 'aluno', 0, 'ativo')
            ON CONFLICT (username) DO UPDATE SET senha_hash = EXCLUDED.senha_hash, role = 'aluno'
        ''', (teste_pass,))

        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"[INIT_DB ERROR] Erro durante inicializacao do banco PostgreSQL: {e}")
        raise e
    finally:
        conn.close()
    try:
        sync_uploaded_files_in_db()
    except Exception:
        pass

def sync_uploaded_files_in_db():
    try:
        conn = get_db()
        cur = conn.cursor()

        repo_dir = os.path.dirname(__file__)
        repo_uploads = os.path.join(repo_dir, 'uploads')
        search_dirs = [UPLOAD_DIR, repo_uploads, repo_dir]

        for d in search_dirs:
            if not os.path.exists(d) or not os.path.isdir(d): continue
            for fn in os.listdir(d):
                if 'phtls' in fn.lower():
                    continue
                if fn.lower().endswith(tuple(ALLOWED_UPLOAD_EXTENSIONS)):
                    file_path = os.path.join(d, fn)
                    if not os.path.isfile(file_path): continue

                    if d != UPLOAD_DIR:
                        target_path = os.path.join(UPLOAD_DIR, fn)
                        if not os.path.exists(target_path) or os.path.getsize(target_path) != os.path.getsize(file_path):
                            try:
                                shutil.copy2(file_path, target_path)
                                print(f"[AUTO-SYNC] Copiado {fn} para {UPLOAD_DIR}")
                            except Exception: pass
                        file_path = target_path

                    sz_mb = os.path.getsize(file_path) / (1024 * 1024)
                    sz_str = f"{sz_mb:.2f} MB"
                    mime = mimetypes.guess_type(file_path)[0] or 'application/pdf'

                    fn_low = fn.lower()
                    visib = 'todos' if any(k in fn_low for k in ['qts', 'manual', 'dip', 'salvamento']) else 'instrutor'
                    cur.execute('SELECT COUNT(*) as cnt FROM arquivos_instrutoria WHERE nome_arquivo = %s OR nome_original = %s OR nome_salvo = %s', (fn, fn, fn))
                    if cur.fetchone()['cnt'] == 0:
                        cur.execute('''
                            INSERT INTO arquivos_instrutoria (nome_arquivo, nome_original, nome_salvo, caminho_arquivo, tamanho, mime_type, visivel_para)
                            VALUES (%s, %s, %s, %s, %s, %s, %s)
                        ''', (fn, fn, fn, file_path, sz_str, mime, visib))
                        print(f"[AUTO-SYNC] Registrado no BD ({visib}): {fn}")

        conn.commit()
        conn.close()
    except Exception as e:
        print("[AUTO-SYNC] Erro no auto-sync de arquivos:", e)

def gerar_ordem_deterministica(aluno_re, curso_id, modulo_id, attempt_id, question_ids, options_by_question):
    seed_str = f"{aluno_re}:{curso_id}:{modulo_id}:{attempt_id}"
    seed = hashlib.sha256(seed_str.encode('utf-8')).hexdigest()
    rng = random.Random(seed)

    question_order = question_ids[:]
    rng.shuffle(question_order)

    option_order = {}
    for qid, opts in options_by_question.items():
        shuffled = opts[:]
        rng.shuffle(shuffled)
        option_order[qid] = shuffled

    return seed, question_order, option_order

def check_rate_limit(key):
    now = time.time()
    if key in LOGIN_ATTEMPTS:
        attempts, first_attempt_time = LOGIN_ATTEMPTS[key]
        if now - first_attempt_time > LOCKOUT_TIME_SECONDS:
            LOGIN_ATTEMPTS.pop(key, None)
            return True, 0
        if attempts >= MAX_LOGIN_ATTEMPTS:
            remaining = int(LOCKOUT_TIME_SECONDS - (now - first_attempt_time))
            return False, max(1, remaining)
    return True, 0

def record_failed_attempt(key):
    now = time.time()
    if key in LOGIN_ATTEMPTS:
        attempts, first_attempt_time = LOGIN_ATTEMPTS[key]
        if now - first_attempt_time > LOCKOUT_TIME_SECONDS:
            LOGIN_ATTEMPTS[key] = (1, now)
        else:
            LOGIN_ATTEMPTS[key] = (attempts + 1, first_attempt_time)
    else:
        LOGIN_ATTEMPTS[key] = (1, now)

def clear_rate_limit(key):
    LOGIN_ATTEMPTS.pop(key, None)

def sanitize_filename(filename):
    clean_name = os.path.basename(filename)
    clean_name = clean_name.replace('..', '').replace('/', '').replace('\\', '')
    return clean_name if clean_name else 'arquivo_upload.pdf'

def parse_multipart(body_bytes, boundary):
    parts = body_bytes.split(b'--' + boundary)
    extracted_files = []

    for part in parts:
        if b'filename=' in part:
            header_end = part.find(b'\r\n\r\n')
            if header_end != -1:
                headers = part[:header_end].decode('utf-8', errors='ignore')
                file_content = part[header_end + 4:]
                
                if file_content.endswith(b'\r\n'):
                    file_content = file_content[:-2]
                if file_content.endswith(b'--'):
                    file_content = file_content[:-2]

                filename = 'arquivo_upload.pdf'
                for line in headers.split('\r\n'):
                    if 'Content-Disposition' in line and 'filename=' in line:
                        fn_part = line.split('filename=')[1].strip()
                        filename = fn_part.strip('"\'')
                
                clean_fn = sanitize_filename(filename)
                extracted_files.append({
                    'filename': clean_fn,
                    'content': file_content
                })
    return extracted_files

def smart_parse_csv_content(csv_text):
    csv_text = csv_text.lstrip('\ufeff')
    delimiter = ';' if ';' in csv_text and ',' not in csv_text[:500] else ','
    reader = csv.reader(io.StringIO(csv_text), delimiter=delimiter)
    rows = [[cell.strip(' "\'\t\r\n') for cell in r] for r in reader if any(r)]

    if not rows:
        return [], [], "CSV vazio ou sem linhas reconhecidas."

    header_raw = [c.lower() for c in rows[0]]

    idx_re, idx_nome, idx_grad, idx_estacao = -1, -1, -1, -1

    for i, col in enumerate(header_raw):
        if col == 're' or col.startswith('re ') or col.endswith(' re') or 'registro' in col:
            idx_re = i
        elif 'nome' in col or 'aluno' in col:
            idx_nome = i
        elif 'grad' in col or 'posto' in col or 'patente' in col:
            idx_grad = i
        elif 'opm' in col or 'estacao' in col or 'grupamento' in col or 'unidade' in col or 'cia' in col:
            idx_estacao = i

    is_header = False
    if idx_re != -1 or idx_nome != -1 or idx_grad != -1 or 're' in header_raw or 'nome' in header_raw or 'grad' in header_raw:
        is_header = True

    data_rows = rows[1:] if is_header else rows
    parsed_results = []
    debug_logs = []

    ranks = ['SD PM', 'CB PM', 'SGT', 'TEN', 'CAP', 'MAJ', 'CORONEL', '1º SGT', '2º SGT', '3º SGT', '1º TEN', '2º TEN', 'AL PM', 'SGT PM', '3ºSGT PM', '2º TEN PM', '1º TEN PM']

    for line_num, r in enumerate(data_rows, start=2 if is_header else 1):
        if len(r) == 0 or not any(r):
            continue

        c_re = r[idx_re] if idx_re != -1 and idx_re < len(r) else ''
        c_nome = r[idx_nome] if idx_nome != -1 and idx_nome < len(r) else ''
        c_grad = r[idx_grad] if idx_grad != -1 and idx_grad < len(r) else ''
        c_est = r[idx_estacao] if idx_estacao != -1 and idx_estacao < len(r) else ''

        if any(rk.lower() in c_re.lower() for rk in ranks):
            real_grad = c_re
            real_re = c_grad if c_grad else c_nome
            real_nome = c_nome if real_re != c_nome else c_grad
            c_grad, c_re, c_nome = real_grad, real_re, real_nome

        nome_final = f"{c_grad} {c_nome}".strip() if c_grad and not c_nome.startswith(c_grad) else c_nome
        estacao_final = c_est if c_est else '2º GB'

        log_str = f"Linha {line_num:02d} | RAW: {r} -> PARSED => RE: '{c_re}' | Grad: '{c_grad}' | Nome: '{nome_final}' | Estação: '{estacao_final}'"
        debug_logs.append(log_str)

        parsed_results.append({
            'linha': line_num,
            're': c_re,
            'grad': c_grad,
            'nome_limpo': c_nome,
            'nome_completo': nome_final,
            'estacao': estacao_final,
            'raw_row': r
        })

    return parsed_results, debug_logs, None

class RBACPortalHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, data, code=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def authenticate_request(self, required_role=None):
        auth_header = self.headers.get('Authorization', '')
        token = auth_header.replace('Bearer ', '').strip()

        parsed = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed.query)

        if not token:
            token = query.get('token', [''])[0]

        if 'download' in self.path:
            if token and token in SESSIONS:
                return SESSIONS[token]
            return {'user_id': 0, 'username': 'public', 'role': 'aluno'}

        if not token or token not in SESSIONS:
            self.send_json({'error': 'Não autorizado (401)', 'message': 'Sessão inválida ou expirada.'}, 401)
            return None

        session_user = SESSIONS[token]

        if required_role:
            if isinstance(required_role, list):
                if session_user['role'] not in required_role:
                    self.send_json({'error': 'Acesso Proibido (403)', 'message': f'Sem permissão. Perfil atual: {session_user["role"]}.'}, 403)
                    return None
            elif session_user['role'] != required_role and session_user['role'] != 'admin':
                self.send_json({'error': 'Acesso Proibido (403)', 'message': f'Acesso exclusivo para {required_role}. Perfil atual: {session_user["role"]}.'}, 403)
                return None

        return session_user

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query_params = urllib.parse.parse_qs(parsed.query)

        if path == '/api/instrutoria/download':
            user = self.authenticate_request(required_role=['aluno', 'instrutor', 'admin'])
            if not user:
                return

            file_id = query_params.get('id', [''])[0]
            if not file_id:
                return self.send_json({'error': 'ID do arquivo ausente'}, 400)

            conn = get_db()
            cur = conn.cursor()
            cur.execute('SELECT * FROM arquivos_instrutoria WHERE id = %s', (file_id,))
            file_row = cur.fetchone()
            conn.close()

            if not file_row:
                return self.send_json({'error': 'Arquivo não encontrado no BD (404)'}, 404)

            file_dict = dict(file_row)
            if 'phtls' in str(file_dict.get('nome_arquivo', '')).lower() or 'phtls' in str(file_dict.get('nome_original', '')).lower():
                return self.send_json({'error': 'Acesso Proibido (403)', 'message': 'Arquivo de referência interna reservado. Download indisponível.'}, 403)

            visib = file_dict.get('visivel_para', 'instrutor')
            user_role = user.get('role', 'aluno')
            if visib == 'instrutor' and user_role not in ('instrutor', 'admin'):
                return self.send_json({'error': 'Acesso Proibido (403)', 'message': 'Acesso exclusivo para instrutores credenciados.'}, 403)

            physical_path = file_dict['caminho_arquivo']
            safe_base_filename = os.path.basename(physical_path)
            physical_path = os.path.join(UPLOAD_DIR, safe_base_filename)
            original_name = file_dict.get('nome_original') or file_dict.get('nome_arquivo') or safe_base_filename

            if not os.path.exists(physical_path):
                candidates = [
                    os.path.join(UPLOAD_DIR, safe_base_filename),
                    os.path.join(UPLOAD_DIR, 'Manual de Salvamento em Altura v3.pdf'),
                    os.path.join(os.path.dirname(__file__), 'Manual de Salvamento em Altura v3.pdf')
                ]
                for cand in candidates:
                    if os.path.exists(cand):
                        physical_path = cand
                        break

            if not os.path.exists(physical_path):
                return self.send_json({'error': f'Arquivo físico não encontrado em disco'}, 404)

            try:
                with open(physical_path, 'rb') as f:
                    file_bytes = f.read()

                mime_type = file_dict.get('mime_type') or mimetypes.guess_type(physical_path)[0] or 'application/pdf'

                self.send_response(200)
                self.send_header('Content-Type', mime_type)
                self.send_header('Content-Length', str(len(file_bytes)))
                self.send_header('Content-Disposition', f'inline; filename="{original_name}"')
                self.end_headers()
                self.wfile.write(file_bytes)
                return
            except Exception as e:
                return self.send_json({'error': f'Erro ao ler arquivo: {str(e)}'}, 500)

        elif path in ('/api/instrutoria/relatorio-turma', '/api/instrutoria/alunos', '/api/instrutoria/dashboard'):
            user = self.authenticate_request(required_role='instrutor')
            if not user:
                return

            filter_status = query_params.get('status', ['todos'])[0].lower()

            conn = get_db()
            cur = conn.cursor()

            # Consultar dinamicamente os módulos ativos cadastrados no curso
            cur.execute("SELECT DISTINCT CAST(modulo_id AS TEXT) as mod_id FROM quiz_questions WHERE curso_id = 'salvamento_cordas' ORDER BY CAST(modulo_id AS INTEGER)")
            modulos_ativos_rows = cur.fetchall()
            modulos_ativos_ids = [r['mod_id'] for r in modulos_ativos_rows]
            total_modulos_curso = max(len(modulos_ativos_ids), 1)

            if modulos_ativos_ids:
                placeholders = ', '.join(['%s'] * len(modulos_ativos_ids))
                params_filter = modulos_ativos_ids * 3
            else:
                placeholders = "'-1'"
                params_filter = []

            where_status = ""
            if filter_status == 'ativo':
                where_status = "AND COALESCE(u.status, 'ativo') = 'ativo'"
            elif filter_status == 'desligado':
                where_status = "AND u.status = 'desligado'"

            sql_query = f'''
                SELECT u.id, u.nome, u.re, u.estacao, u.senha_provisoria, u.primeiro_acesso_em,
                       COALESCE(u.status, 'ativo') as status, u.desligado_em, u.data_criacao as data_cadastro,
                       COUNT(DISTINCT CASE WHEN CAST(p.modulo_id AS TEXT) IN ({placeholders}) THEN CAST(p.modulo_id AS TEXT) END) as modulos_concluidos,
                       COALESCE(AVG(CASE WHEN CAST(p.modulo_id AS TEXT) IN ({placeholders}) THEN p.nota END), 0) as media_notas,
                       COALESCE(SUM(CASE WHEN CAST(p.modulo_id AS TEXT) IN ({placeholders}) THEN p.tempo_gasto END), 0) as tempo_total_segundos
                FROM usuarios u
                LEFT JOIN progresso_modulos p ON u.re = p.aluno_re
                WHERE u.role = 'aluno' {where_status}
                GROUP BY u.id ORDER BY u.id DESC
            '''

            cur.execute(sql_query, params_filter)
            alunos = [dict(r) for r in cur.fetchall()]

            cur.execute("SELECT COUNT(*) as cnt FROM usuarios WHERE role = 'aluno' AND COALESCE(status, 'ativo') = 'ativo'")
            total_ativos = cur.fetchone()['cnt']

            cur.execute("SELECT COUNT(*) as cnt FROM usuarios WHERE role = 'aluno' AND status = 'desligado'")
            total_desligados = cur.fetchone()['cnt']

            conclusao_por_modulo = {}
            for m_id in modulos_ativos_ids:
                m_num = int(m_id) if m_id.isdigit() else m_id
                if total_ativos > 0:
                    cur.execute('''
                        SELECT COUNT(DISTINCT p.aluno_re) as count_concluidos
                        FROM progresso_modulos p
                        JOIN usuarios u ON p.aluno_re = u.re
                        WHERE CAST(p.modulo_id AS TEXT) = %s AND COALESCE(u.status, 'ativo') = 'ativo'
                    ''', (str(m_id),))
                    c_count = cur.fetchone()['count_concluidos']
                    pct = round((c_count / total_ativos) * 100)
                else:
                    c_count = 0
                    pct = 0
                
                conclusao_por_modulo[f'modulo_{m_id}'] = {
                    'modulo_id': m_num,
                    'concluidos': c_count,
                    'total_alunos': total_ativos,
                    'porcentagem': pct
                }

            today_str = datetime.now().strftime('%Y-%m-%d')
            alertas = []
            alertas_atencao = []
            cnt_nao_iniciados = 0
            cnt_atrasados = 0
            cnt_em_dia = 0

            for a in alunos:
                pacing = calculate_student_pacing_status(a['modulos_concluidos'], total_modulos_curso)
                a['status_ritmo'] = pacing['status_key']
                a['status_ritmo_label'] = pacing['status_label']
                a['status_ritmo_color'] = pacing['status_color']
                a['modulos_esperados'] = pacing['expected_modules']

                if a['status'] == 'ativo':
                    if pacing['status_key'] == 'nao_iniciado':
                        cnt_nao_iniciados += 1
                        alertas_atencao.append(a)
                    elif pacing['status_key'] == 'atrasado':
                        cnt_atrasados += 1
                        alertas_atencao.append(a)
                    else:
                        cnt_em_dia += 1

                    ult_acesso = str(a['data_cadastro'])[:10] if a['data_cadastro'] else ''
                    pendente = a['modulos_concluidos'] < total_modulos_curso
                    nao_acessou_hoje = (ult_acesso != today_str)

                    if nao_acessou_hoje or pendente or a['senha_provisoria'] == 1:
                        motivo = 'Senha Provisória Pendente' if a['senha_provisoria'] == 1 else ('Sem acesso no dia/noite' if nao_acessou_hoje else 'Módulos pendentes')
                        alertas.append({
                            're': a['re'],
                            'nome': a['nome'],
                            'estacao': a['estacao'],
                            'modulos_concluidos': a['modulos_concluidos'],
                            'total_modulos': total_modulos_curso,
                            'pendencias': total_modulos_curso - a['modulos_concluidos'],
                            'nao_acessou_hoje': nao_acessou_hoje,
                            'motivo': motivo
                        })

            conn.close()

            pacing_sample = calculate_student_pacing_status(0, total_modulos_curso)

            return self.send_json({
                'success': True,
                'total_ativos': total_ativos,
                'total_desligados': total_desligados,
                'total_modulos': total_modulos_curso,
                'alunos': alunos,
                'conclusao_por_turma': conclusao_por_modulo,
                'alertas': alertas,
                'alertas_atencao': alertas_atencao,
                'resumo_atencao': {
                    'total_precisam_atencao': len(alertas_atencao),
                    'cnt_nao_iniciados': cnt_nao_iniciados,
                    'cnt_atrasados': cnt_atrasados,
                    'cnt_em_dia': cnt_em_dia,
                    'prazo_certificacao': '13/08/2026',
                    'ritmo_esperado_hoje': pacing_sample['expected_modules']
                }
            })

        elif path == '/api/instrutoria/certificados':
            user = self.authenticate_request(required_role='instrutor')
            if not user:
                return

            conn = get_db()
            cur = conn.cursor()
            cur.execute('''
                SELECT c.id, c.aluno_re, c.codigo_hash, c.data_emissao,
                       u.nome, u.estacao
                FROM certificados c
                JOIN usuarios u ON c.aluno_re = u.re
                ORDER BY c.id DESC
            ''')
            certificados = [dict(r) for r in cur.fetchall()]
            conn.close()
        elif path == '/api/instrutoria/relatorio-erros':
            user = self.authenticate_request(required_role=['instrutor', 'admin'])
            if not user:
                return

            conn = get_db()
            cur = conn.cursor()
            cur.execute('''
                SELECT 
                    q.id AS question_id,
                    q.modulo_id,
                    q.question_text,
                    COUNT(a.is_correct) AS total_respostas,
                    SUM(CASE WHEN a.is_correct = 0 THEN 1 ELSE 0 END) AS total_erros,
                    SUM(CASE WHEN a.is_correct = 1 THEN 1 ELSE 0 END) AS total_acertos,
                    ROUND(CAST(SUM(CASE WHEN a.is_correct = 0 THEN 1 ELSE 0 END) AS FLOAT) * 100.0 / COUNT(a.is_correct), 1) AS percentual_erro
                FROM quiz_answers a
                JOIN quiz_questions q ON a.question_id = q.id
                GROUP BY q.id, q.modulo_id, q.question_text
                ORDER BY percentual_erro DESC, total_respostas DESC
            ''')
            relatorio = [dict(r) for r in cur.fetchall()]

            cur.execute('''
                SELECT 
                    q.modulo_id,
                    COUNT(a.is_correct) AS total_respostas_modulo,
                    SUM(CASE WHEN a.is_correct = 0 THEN 1 ELSE 0 END) AS total_erros_modulo,
                    ROUND(CAST(SUM(CASE WHEN a.is_correct = 0 THEN 1 ELSE 0 END) AS FLOAT) * 100.0 / COUNT(a.is_correct), 1) AS percentual_erro_modulo
                FROM quiz_answers a
                JOIN quiz_questions q ON a.question_id = q.id
                GROUP BY q.modulo_id
                ORDER BY percentual_erro_modulo DESC
            ''')
            por_modulo = [dict(r) for r in cur.fetchall()]
            conn.close()

            return self.send_json({
                'success': True,
                'relatorio_questoes': relatorio,
                'resumo_modulos': por_modulo
            })

        elif path == '/api/instrutoria/arquivos':
            user = self.authenticate_request(required_role=['aluno', 'instrutor', 'admin'])
            if not user:
                return

            sync_uploaded_files_in_db()

            conn = get_db()
            cur = conn.cursor()

            user_role = user.get('role', 'aluno')
            if user_role in ('instrutor', 'admin'):
                cur.execute("SELECT * FROM arquivos_instrutoria WHERE LOWER(nome_arquivo) NOT LIKE '%phtls%' ORDER BY id DESC")
            else:
                cur.execute("SELECT * FROM arquivos_instrutoria WHERE (visivel_para = 'todos' OR visivel_para IS NULL) AND LOWER(nome_arquivo) NOT LIKE '%phtls%' ORDER BY id DESC")

            raw_files = [dict(r) for r in cur.fetchall()]
            conn.close()

            arquivos = []
            for f in raw_files:
                f_dict = dict(f)
                if 'nome_original' not in f_dict or not f_dict['nome_original'] or f_dict['nome_original'] == 'arquivo.pdf':
                    f_dict['nome_original'] = f_dict.get('nome_arquivo', 'Manual de Salvamento em Altura v3.pdf')
                if 'visivel_para' not in f_dict or not f_dict['visivel_para']:
                    fn_low = f_dict['nome_original'].lower()
                    f_dict['visivel_para'] = 'todos' if any(k in fn_low for k in ['qts', 'manual', 'dip', 'salvamento']) else 'instrutor'
                arquivos.append(f_dict)

            return self.send_json({'success': True, 'arquivos': arquivos})

        elif path == '/api/aluno/meu-progresso':
            user = self.authenticate_request(required_role=['aluno', 'instrutor', 'admin'])
            if not user:
                return

            conn = get_db()
            cur = conn.cursor()
            cur.execute('SELECT modulo_id, nota, status, data_conclusao FROM progresso_modulos WHERE aluno_re = %s', (user['re'],))
            progresso = [dict(r) for r in cur.fetchall()]
            conn.close()

            return self.send_json({'success': True, 'progresso': progresso})

        else:
            super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        content_type = self.headers.get('Content-Type', '')

        payload = {}
        if length > 0 and 'multipart/form-data' not in content_type:
            try:
                body_data = self.rfile.read(length).decode('utf-8', errors='ignore')
                payload = json.loads(body_data)
            except Exception:
                payload = {}

        # ------------------------------------------------------------------
        # LOGIN DE USUÁRIO - SEGURANÇA RBAC BLINDADA
        # IGNERA 100% O CAMPO 'role' DA REQUISIÇÃO E USA O ROLE DO BANCO DE DADOS
        # ------------------------------------------------------------------
        if path == '/api/auth/login':
            username = payload.get('username', '').strip()
            password = payload.get('password', '').strip()

            client_ip = self.client_address[0]
            rate_key = f"{client_ip}_{username}"

            allowed, wait_sec = check_rate_limit(rate_key)
            if not allowed:
                return self.send_json({
                    'success': False,
                    'message': f'Muitas tentativas de login incorretas. Conta bloqueada temporariamente por {wait_sec} segundos para proteção contra força bruta.'
                }, 429)

            if not username or not password:
                return self.send_json({'success': False, 'message': 'RE/Usuário e Senha são obrigatórios'}, 400)

            conn = get_db()
            cur = conn.cursor()

            # Buscar usuário pelo RE ou Username no Banco de Dados
            cur.execute("SELECT id, username, senha_hash, nome, re, estacao, role, senha_provisoria, primeiro_acesso_em, COALESCE(status, 'ativo') as status FROM usuarios WHERE username = %s OR re = %s", (username, username))
            user_row = cur.fetchone()

            # MUDANÇA 3: Recusar login se o RE não estiver pré-cadastrado no BD (via CSV ou cadastro manual)
            if not user_row:
                conn.close()
                return self.send_json({
                    'success': False,
                    'message': 'RE não encontrado. Procure a instrutoria para cadastro.'
                }, 401)

            user_dict = dict(user_row)

            # Buscar Nome e Estação (Cia/OPM) oficiais da tabela de alunos caso existam
            cur.execute('SELECT nome, estacao FROM alunos WHERE re = %s', (user_dict['re'],))
            aluno_row = cur.fetchone()
            if aluno_row:
                user_dict['nome'] = aluno_row['nome']
                user_dict['estacao'] = aluno_row['estacao']

            if not verify_password(password, user_dict['senha_hash']):
                conn.close()
                record_failed_attempt(rate_key)
                return self.send_json({'success': False, 'message': 'RE ou Senha incorretos.'}, 401)

            clear_rate_limit(rate_key)

            if user_dict['status'] == 'desligado':
                conn.close()
                return self.send_json({
                    'success': False,
                    'message': 'Acesso desativado. Procure a instrutoria.'
                }, 403)

            # TOKEN E SESSÃO CARREGAM RIGOROSAMENTE O ROLE VINDO DO BANCO DE DADOS
            token = 'TOKEN_' + secrets.token_hex(16)
            SESSIONS[token] = {
                'user_id': user_dict['id'],
                'username': user_dict['username'],
                'nome': user_dict['nome'],
                're': user_dict['re'],
                'estacao': user_dict['estacao'],
                'role': user_dict['role'],  # STRICTLY FROM DATABASE
                'senha_provisoria': user_dict['senha_provisoria'],
                'status': user_dict['status'],
                'created_at': datetime.now().isoformat()
            }

            cur.execute('SELECT modulo_id, nota FROM progresso_modulos WHERE aluno_re = %s', (user_dict['re'],))
            progresso = [dict(r) for r in cur.fetchall()]
            conn.close()

            must_change = (user_dict['senha_provisoria'] == 1)

            return self.send_json({
                'success': True,
                'token': token,
                'user': user_dict,  # user_dict.role veio da query SQL do BD
                'must_change_password': must_change,
                'progresso': progresso
            })

        # ------------------------------------------------------------------
        # PORTAL SALVAMENTO COM CORDAS - SERVER API
        # # teste de persistência de disco no render para forçar um deploy no Render.
        # ------------------------------------------------------------------
        elif path == '/api/quiz/start':
            user = self.authenticate_request(required_role='aluno')
            if not user:
                return

            if user.get('status') == 'desligado':
                return self.send_json({'error': 'Acesso Desativado (403)', 'message': 'Acesso desativado. Procure a instrutoria.'}, 403)

            curso_id = payload.get('curso_id', 'salvamento_cordas')
            modulo_id = str(payload.get('modulo_id', '1'))
            aluno_re = user['re']

            conn = get_db()
            cur = conn.cursor()

            cur.execute('''
                SELECT id, seed, question_order, option_order FROM quiz_attempts
                WHERE aluno_re = %s AND curso_id = %s AND modulo_id = %s AND submitted_at IS NULL
                ORDER BY started_at DESC LIMIT 1
            ''', (aluno_re, curso_id, modulo_id))
            attempt_row = cur.fetchone()

            if attempt_row:
                attempt_id = attempt_row['id']
                seed = attempt_row['seed']
                question_order = json.loads(attempt_row['question_order'])
                option_order = json.loads(attempt_row['option_order'])

                # Validar se as opções registradas na tentativa ainda existem no BD
                valid_attempt = True
                for qid in question_order:
                    cur.execute('SELECT COUNT(*) as cnt FROM quiz_questions WHERE id = %s', (qid,))
                    if cur.fetchone()['cnt'] == 0:
                        valid_attempt = False
                        break
                    for op_id in option_order.get(qid, []):
                        cur.execute('SELECT COUNT(*) as cnt FROM quiz_options WHERE id = %s', (op_id,))
                        if cur.fetchone()['cnt'] == 0:
                            valid_attempt = False
                            break
                
                if not valid_attempt:
                    cur.execute('DELETE FROM quiz_attempts WHERE id = %s', (attempt_id,))
                    conn.commit()
                    attempt_row = None

            if not attempt_row:
                attempt_id = str(uuid.uuid4())
                
                cur.execute('SELECT id, question_text FROM quiz_questions WHERE curso_id = %s AND CAST(modulo_id AS TEXT) = %s', (curso_id, str(modulo_id)))
                q_rows = cur.fetchall()

                if not q_rows:
                    conn.close()
                    return self.send_json({'error': 'Nenhuma questão cadastrada para este módulo'}, 404)

                q_ids = [r['id'] for r in q_rows]
                options_by_q = {}

                for qid in q_ids:
                    cur.execute('SELECT id FROM quiz_options WHERE question_id = %s', (qid,))
                    op_rows = cur.fetchall()
                    options_by_q[qid] = [r['id'] for r in op_rows]

                seed, question_order, option_order = gerar_ordem_deterministica(
                    aluno_re, curso_id, modulo_id, attempt_id, q_ids, options_by_q
                )

                now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                cur.execute('''
                    INSERT INTO quiz_attempts (id, aluno_re, curso_id, modulo_id, seed, question_order, option_order, started_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ''', (attempt_id, aluno_re, curso_id, modulo_id, seed, json.dumps(question_order), json.dumps(option_order), now_str))
                conn.commit()

            questions_payload = []
            for qid in question_order:
                cur.execute('SELECT question_text FROM quiz_questions WHERE id = %s', (qid,))
                q_row = cur.fetchone()
                if not q_row: continue

                ordered_op_ids = option_order.get(qid, [])
                options_payload = []

                for op_id in ordered_op_ids:
                    cur.execute('SELECT option_text FROM quiz_options WHERE id = %s', (op_id,))
                    op_row = cur.fetchone()
                    if op_row:
                        options_payload.append({
                            'option_id': op_id,
                            'option_text': op_row['option_text']
                        })

                questions_payload.append({
                    'question_id': qid,
                    'question_text': q_row['question_text'],
                    'options': options_payload
                })

            conn.close()

            return self.send_json({
                'success': True,
                'attempt_id': attempt_id,
                'curso_id': curso_id,
                'modulo_id': modulo_id,
                'questions': questions_payload
            })

        elif path == '/api/quiz/answer':
            user = self.authenticate_request(required_role='aluno')
            if not user:
                return

            if user.get('status') == 'desligado':
                return self.send_json({'error': 'Acesso Desativado (403)', 'message': 'Acesso desativado. Procure a instrutoria.'}, 403)

            attempt_id = payload.get('attempt_id', '').strip()
            question_id = payload.get('question_id', '').strip()
            chosen_option_id = payload.get('chosen_option_id', '').strip()

            if not attempt_id or not question_id or not chosen_option_id:
                return self.send_json({'error': 'Campos attempt_id, question_id e chosen_option_id são obrigatórios'}, 400)

            conn = get_db()
            cur = conn.cursor()

            cur.execute('SELECT is_correct FROM quiz_options WHERE id = %s AND question_id = %s', (chosen_option_id, question_id))
            op_row = cur.fetchone()

            if not op_row:
                conn.close()
                return self.send_json({'error': 'Opção ou questão inválida'}, 400)

            is_correct_val = op_row['is_correct']

            cur.execute('''
                INSERT INTO quiz_answers (attempt_id, question_id, chosen_option_id, is_correct)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (attempt_id, question_id) DO UPDATE SET
                    chosen_option_id = EXCLUDED.chosen_option_id,
                    is_correct = EXCLUDED.is_correct
            ''', (attempt_id, question_id, chosen_option_id, is_correct_val))

            cur.execute('SELECT modulo_id, question_order FROM quiz_attempts WHERE id = %s', (attempt_id,))
            att_row = cur.fetchone()
            
            attempt_completed = False
            score = 0.0

            if att_row:
                raw_mod_id = str(att_row['modulo_id'])
                mod_id_val = int(raw_mod_id) if raw_mod_id.isdigit() else raw_mod_id
                q_order = json.loads(att_row['question_order'])
                total_q = len(q_order)

                cur.execute('SELECT COUNT(*) as answered_count, SUM(is_correct) as correct_count FROM quiz_answers WHERE attempt_id = %s', (attempt_id,))
                ans_summary = cur.fetchone()

                if ans_summary['answered_count'] >= total_q:
                    attempt_completed = True
                    score = round((ans_summary['correct_count'] / total_q) * 100.0, 1)
                    now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                    cur.execute('''
                        UPDATE quiz_attempts
                        SET submitted_at = %s, score = %s
                        WHERE id = %s
                    ''', (now_str, score, attempt_id))

                    cur.execute('''
                        INSERT INTO progresso_modulos (aluno_re, modulo_id, nota, tempo_gasto, status, data_conclusao)
                        VALUES (%s, %s, %s, 300, 'concluido', %s)
                        ON CONFLICT (aluno_re, modulo_id) DO UPDATE SET
                            nota = EXCLUDED.nota,
                            tempo_gasto = EXCLUDED.tempo_gasto,
                            status = EXCLUDED.status,
                            data_conclusao = EXCLUDED.data_conclusao
                    ''', (user['re'], mod_id_val, score, now_str))

            conn.commit()
            conn.close()

            return self.send_json({
                'success': True,
                'correct': bool(is_correct_val == 1),
                'score': score,
                'attempt_completed': attempt_completed,
                'message': 'Resposta correta! Módulo Concluído com Nota 100!' if is_correct_val == 1 else 'Resposta incorreta. Revise o material e tente novamente.'
            })

        elif path == '/api/aluno/progresso':
            user = self.authenticate_request(required_role='aluno')
            if not user:
                return

            if user.get('status') == 'desligado':
                return self.send_json({'error': 'Acesso Desativado (403)', 'message': 'Acesso desativado. Procure a instrutoria.'}, 403)

            modulo_id_str = str(payload.get('modulo_id', '1'))
            chosen_option_id = payload.get('chosen_option_id')
            opcao_selecionada = payload.get('opcao_selecionada')

            qid = f"sc_mod{modulo_id_str}_q1"

            if chosen_option_id is None and opcao_selecionada is not None:
                letters = ['opA', 'opB', 'opC', 'opD']
                idx = int(opcao_selecionada)
                chosen_option_id = f"{qid}_{letters[idx]}" if idx < len(letters) else f"{qid}_opA"

            conn = get_db()
            cur = conn.cursor()

            cur.execute('SELECT is_correct FROM quiz_options WHERE id = %s AND question_id = %s', (chosen_option_id, qid))
            op_row = cur.fetchone()

            if not op_row:
                conn.close()
                return self.send_json({'error': 'Opção de quiz não encontrada no banco de dados'}, 400)

            is_corr = (op_row['is_correct'] == 1)

            if not is_corr:
                conn.close()
                return self.send_json({
                    'success': True,
                    'acertou': False,
                    'correct': False,
                    'nota': 0,
                    'message': 'Resposta incorreta. Revise o material do módulo e tente novamente.'
                })

            now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            cur.execute('''
                INSERT INTO progresso_modulos (aluno_re, modulo_id, nota, tempo_gasto, status, data_conclusao)
                VALUES (%s, %s, 100.0, 300, 'concluido', %s)
            ''', (user['re'], int(modulo_id_str), now_str))

            conn.commit()
            conn.close()

            return self.send_json({
                'success': True,
                'acertou': True,
                'correct': True,
                'nota': 100,
                'message': f'🎉 Excelente! Resposta correta. Módulo {modulo_id_str} Concluído com Nota 100!'
            })

        elif path == '/api/instrutoria/upload':
            user = self.authenticate_request(required_role='instrutor')
            if not user:
                return

            if length > MAX_UPLOAD_SIZE_BYTES:
                return self.send_json({'error': 'Arquivo excede o limite máximo permitido de 50 MB'}, 400)

            body_bytes = self.rfile.read(length) if length > 0 else b''

            if 'boundary=' not in content_type:
                return self.send_json({'error': 'Requisição deve ser multipart/form-data com boundary'}, 400)

            boundary = content_type.split('boundary=')[1].encode('utf-8')
            extracted_files = parse_multipart(body_bytes, boundary)

            if not extracted_files:
                return self.send_json({'error': 'Nenhum arquivo válido encontrado no corpo da requisição'}, 400)

            saved_records = []
            conn = get_db()
            cur = conn.cursor()

            for f in extracted_files:
                orig_name = sanitize_filename(f['filename'])
                file_data = f['content']

                ext = os.path.splitext(orig_name)[1].lower()
                if ext not in ALLOWED_UPLOAD_EXTENSIONS:
                    conn.close()
                    return self.send_json({'error': f'Extensão de arquivo "{ext}" não é permitida por motivos de segurança.'}, 400)

                saved_name = f"{uuid.uuid4().hex}_{orig_name}"
                physical_path = os.path.join(UPLOAD_DIR, saved_name)

                with open(physical_path, 'wb') as disk_file:
                    disk_file.write(file_data)

                size_bytes = len(file_data)
                size_str = f"{size_bytes / (1024 * 1024):.2f} MB" if size_bytes >= 1048576 else f"{size_bytes / 1024:.1f} KB"
                mime = mimetypes.guess_type(orig_name)[0] or 'application/octet-stream'
                now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                visib_val = 'instrutor'
                if b'visivel_para=todos' in body_bytes or 'visivel_para=todos' in self.path:
                    visib_val = 'todos'

                cur.execute('''
                    INSERT INTO arquivos_instrutoria (nome_arquivo, nome_original, nome_salvo, caminho_arquivo, tamanho, mime_type, visivel_para, data_upload)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ''', (orig_name, orig_name, saved_name, physical_path, size_str, mime, visib_val, now_str))
                
                new_id = cur.lastrowid
                saved_records.append({
                    'id': new_id,
                    'nome_original': orig_name,
                    'caminho_arquivo': physical_path,
                    'tamanho': size_str,
                    'mime_type': mime,
                    'visivel_para': visib_val,
                    'data_upload': now_str
                })

            conn.commit()
            conn.close()

            return self.send_json({
                'success': True,
                'message': 'Arquivo(s) validado(s), salvo(s) em disco e registrado(s) no BD',
                'arquivos': saved_records
            })

        elif path == '/api/instrutoria/importar-csv-alunos':
            user = self.authenticate_request(required_role='instrutor')
            if not user:
                return

            body_bytes = self.rfile.read(length) if length > 0 else b''

            csv_text = ''
            if 'boundary=' in content_type:
                boundary = content_type.split('boundary=')[1].encode('utf-8')
                extracted = parse_multipart(body_bytes, boundary)
                if extracted:
                    csv_text = extracted[0]['content'].decode('utf-8', errors='ignore')
            else:
                csv_text = body_bytes.decode('utf-8', errors='ignore')

            if not csv_text.strip():
                return self.send_json({'error': 'Arquivo CSV vazio ou formato inválido'}, 400)

            parsed_rows, debug_logs, err = smart_parse_csv_content(csv_text)

            if err:
                return self.send_json({'error': err}, 400)

            sucesso_list = []
            erros_list = []

            conn = get_db()
            cur = conn.cursor()

            for item in parsed_rows:
                line_idx = item['linha']
                re_val = item['re']
                nome_completo = item['nome_completo']
                estacao_val = item['estacao']

                if not re_val:
                    erros_list.append(f"Linha {line_idx}: RE é obrigatório e está em branco.")
                    continue

                if not item['nome_limpo']:
                    erros_list.append(f"Linha {line_idx} (RE {re_val}): Nome do aluno é obrigatório.")
                    continue

                cur.execute('SELECT id, nome FROM usuarios WHERE re = %s OR username = %s', (re_val, re_val))
                dup = cur.fetchone()
                if dup:
                    erros_list.append(f"Linha {line_idx} (RE {re_val}): RE já cadastrado no banco para '{dup['nome']}'.")
                    continue

                try:
                    re_hash = hash_password_pbkdf2(re_val)
                    cur.execute('''
                        INSERT INTO usuarios (username, senha_hash, nome, re, estacao, role, senha_provisoria, status)
                        VALUES (%s, %s, %s, %s, %s, 'aluno', 1, 'ativo')
                    ''', (re_val, re_hash, nome_completo, re_val, estacao_val))

                    cur.execute('''
                        INSERT INTO alunos (nome, re, estacao, status)
                        VALUES (%s, %s, %s, 'ativo')
                        ON CONFLICT(re) DO UPDATE SET nome=excluded.nome, estacao=excluded.estacao
                    ''', (nome_completo, re_val, estacao_val))

                    sucesso_list.append({
                        'linha': line_idx,
                        're': re_val,
                        'nome': nome_completo,
                        'estacao': estacao_val
                    })
                except Exception as ex:
                    erros_list.append(f"Linha {line_idx} (RE {re_val}): Erro ao gravar no BD ({str(ex)})")

            conn.commit()

            total_linhas = len(parsed_rows)
            log_det = f"IMPORTAÇÃO CSV LOTE: Total={total_linhas}, Sucesso={len(sucesso_list)}, Erros={len(erros_list)}"
            cur.execute('''
                INSERT INTO logs_auditoria (acao, executado_por, detalhes)
                VALUES ('IMPORTACAO_LOTE_CSV', %s, %s)
            ''', (user['username'], log_det))
            conn.commit()

            conn.close()

            return self.send_json({
                'success': True,
                'total_processados': total_linhas,
                'total_sucesso': len(sucesso_list),
                'total_erros': len(erros_list),
                'alunos_importados': sucesso_list,
                'erros': erros_list,
                'debug_logs': debug_logs,
                'message': f"{len(sucesso_list)} alunos importados com sucesso. {len(erros_list)} linhas com erro."
            })

        elif path == '/api/instrutoria/desligar-aluno':
            user = self.authenticate_request(required_role='instrutor')
            if not user:
                return

            aluno_re = payload.get('re', '').strip()
            if not aluno_re:
                return self.send_json({'success': False, 'message': 'RE do aluno é obrigatório'}, 400)

            now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            conn = get_db()
            cur = conn.cursor()
            cur.execute('''
                UPDATE usuarios
                SET status = 'desligado', desligado_em = %s
                WHERE re = %s AND role = 'aluno'
            ''', (now_str, aluno_re))

            cur.execute('''
                UPDATE alunos
                SET status = 'desligado', desligado_em = %s
                WHERE re = %s
            ''', (now_str, aluno_re))

            for t, u in list(SESSIONS.items()):
                if u.get('re') == aluno_re:
                    del SESSIONS[t]

            conn.commit()
            conn.close()

            return self.send_json({
                'success': True,
                'message': f'Aluno RE {aluno_re} desligado com sucesso. Acesso bloqueado (Histórico mantido).'
            })

        elif path == '/api/instrutoria/reativar-aluno':
            user = self.authenticate_request(required_role='instrutor')
            if not user:
                return

            aluno_re = payload.get('re', '').strip()
            if not aluno_re:
                return self.send_json({'success': False, 'message': 'RE do aluno é obrigatório'}, 400)

            conn = get_db()
            cur = conn.cursor()
            cur.execute('''
                UPDATE usuarios
                SET status = 'ativo', desligado_em = NULL
                WHERE re = %s AND role = 'aluno'
            ''', (aluno_re,))

            cur.execute('''
                UPDATE alunos
                SET status = 'ativo', desligado_em = NULL
                WHERE re = %s
            ''', (aluno_re,))

            conn.commit()
            conn.close()

            return self.send_json({
                'success': True,
                'message': f'Aluno RE {aluno_re} reativado com sucesso. Acesso restabelecido.'
            })

        elif path == '/api/instrutoria/excluir-aluno':
            user = self.authenticate_request(required_role='instrutor')
            if not user:
                return

            aluno_re = payload.get('re', '').strip()
            nome_confirmacao = payload.get('nome_confirmacao', '').strip()

            if not aluno_re or not nome_confirmacao:
                return self.send_json({'success': False, 'message': 'RE e Nome para confirmação são obrigatórios'}, 400)

            conn = get_db()
            cur = conn.cursor()

            cur.execute("SELECT nome FROM usuarios WHERE re = %s AND role = 'aluno'", (aluno_re,))
            row = cur.fetchone()

            if not row:
                conn.close()
                return self.send_json({'success': False, 'message': f'Aluno RE {aluno_re} não encontrado'}, 404)

            nome_real = row['nome']
            if nome_confirmacao.strip().lower() != nome_real.strip().lower():
                conn.close()
                return self.send_json({
                    'success': False,
                    'message': f'O nome digitado ("{nome_confirmacao}") não confere exatamente com o nome cadastrado ("{nome_real}"). Exclusão abortada.'
                }, 400)

            detalhes_log = f"EXCLUSÃO PERMANENTE: RE={aluno_re}, Nome={nome_real}, ExecutadoPor={user['username']}"
            cur.execute('''
                INSERT INTO logs_auditoria (acao, executado_por, detalhes)
                VALUES ('EXCLUSAO_DEFINITIVA_ALUNO', %s, %s)
            ''', (user['username'], detalhes_log))

            cur.execute('DELETE FROM progresso_modulos WHERE aluno_re = %s', (aluno_re,))
            cur.execute('DELETE FROM certificados WHERE aluno_re = %s', (aluno_re,))
            cur.execute('DELETE FROM alunos WHERE re = %s', (aluno_re,))
            cur.execute('DELETE FROM usuarios WHERE re = %s', (aluno_re,))

            for t, u in list(SESSIONS.items()):
                if u.get('re') == aluno_re:
                    del SESSIONS[t]

            conn.commit()
            conn.close()

            return self.send_json({
                'success': True,
                'message': f'Aluno {nome_real} (RE: {aluno_re}) e todos os seus registros foram excluídos PERMANENTEMENTE do sistema.'
            })

        elif path == '/api/auth/alterar-senha-provisoria':
            user = self.authenticate_request(required_role=['aluno', 'instrutor', 'admin'])
            if not user:
                return

            nova_senha = payload.get('nova_senha', '').strip()
            confirmacao = payload.get('confirmacao', '').strip()

            if not nova_senha or len(nova_senha) < 4:
                return self.send_json({'success': False, 'message': 'A nova senha deve ter no mínimo 4 caracteres'}, 400)

            if nova_senha != confirmacao:
                return self.send_json({'success': False, 'message': 'A confirmação de senha não confere'}, 400)

            if nova_senha == user['re']:
                return self.send_json({'success': False, 'message': 'A nova senha deve ser diferente do seu RE de cadastro'}, 400)

            novo_hash = hash_password_pbkdf2(nova_senha)
            now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            conn = get_db()
            cur = conn.cursor()
            cur.execute('''
                UPDATE usuarios
                SET senha_hash = %s, senha_provisoria = 0, primeiro_acesso_em = %s
                WHERE id = %s OR username = %s OR re = %s
            ''', (novo_hash, now_str, user['user_id'], user['username'], user['re']))

            conn.commit()
            conn.close()

            tok = self.headers.get('Authorization', '').replace('Bearer ', '').strip()
            if tok in SESSIONS:
                SESSIONS[tok]['senha_provisoria'] = 0

            return self.send_json({
                'success': True,
                'message': 'Nova senha definida com sucesso! Acesso liberado.'
            })

        elif path == '/api/instrutoria/resetar-senha-aluno':
            user = self.authenticate_request(required_role='instrutor')
            if not user:
                return

            aluno_re = payload.get('re', '').strip()
            if not aluno_re:
                return self.send_json({'success': False, 'message': 'RE do aluno é obrigatório'}, 400)

            re_hash = hash_password_pbkdf2(aluno_re)

            conn = get_db()
            cur = conn.cursor()
            cur.execute('''
                UPDATE usuarios
                SET senha_hash = %s, senha_provisoria = 1, primeiro_acesso_em = NULL
                WHERE re = %s AND role = 'aluno'
            ''', (re_hash, aluno_re))

            if cur.rowcount == 0:
                conn.close()
                return self.send_json({'success': False, 'message': f'Aluno RE {aluno_re} não encontrado'}, 404)

            conn.commit()
            conn.close()

            return self.send_json({
                'success': True,
                'message': f'Senha do aluno RE {aluno_re} resetada com sucesso para o padrão (próprio RE).'
            })

        elif path == '/api/aluno/certificado':
            user = self.authenticate_request(required_role='aluno')
            if not user:
                return

            if user.get('status') == 'desligado':
                return self.send_json({'error': 'Acesso Desativado (403)', 'message': 'Acesso desativado. Procure a instrutoria.'}, 403)

            codigo_hash = payload.get('hash')
            aluno_re = user['re']

            if not codigo_hash:
                return self.send_json({'success': False, 'message': 'Código Hash obrigatório'}, 400)

            conn = get_db()
            cur = conn.cursor()
            try:
                cur.execute('''
                    INSERT INTO certificados (aluno_re, codigo_hash)
                    VALUES (%s, %s)
                ''', (aluno_re, codigo_hash))
                conn.commit()
                conn.close()
                return self.send_json({'success': True, 'message': 'Certificado registrado no BD'})
            except errors.UniqueViolation:
                conn.close()
                return self.send_json({'success': True, 'message': 'Certificado já existente'})

        else:
            return self.send_json({'error': 'Endpoint não encontrado (404)'}, 404)

if __name__ == '__main__':
    init_db()
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", PORT), RBACPortalHandler) as httpd:
        print(f"Servidor API com Core RBAC Blindado (Role do BD) rodando em http://localhost:{PORT}")
        httpd.serve_forever()
