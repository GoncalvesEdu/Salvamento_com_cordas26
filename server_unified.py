# ==========================================================================
# Servidor Unificado Portal EAD Salvamento com Cordas 2º GB (Porta 8081)
# Servidor Web + Banco de Dados SQLite em uma única porta fácil de acessar
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
from datetime import datetime

PORT = int(os.environ.get('PORT', 8081))

def init_db():
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute('''
            CREATE TABLE IF NOT EXISTS alunos (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                re TEXT UNIQUE NOT NULL,
                estacao TEXT NOT NULL,
                ultimo_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ''')

        cur.execute('ALTER TABLE alunos ADD COLUMN IF NOT EXISTS ultimo_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP')

        cur.execute('''
            CREATE TABLE IF NOT EXISTS progresso_modulos (
                id SERIAL PRIMARY KEY,
                aluno_re TEXT NOT NULL,
                modulo_id TEXT NOT NULL,
                nota DOUBLE PRECISION DEFAULT 0.0,
                tempo_gasto INTEGER DEFAULT 0,
                status TEXT DEFAULT 'concluido',
                data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                data_conclusao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (aluno_re) REFERENCES alunos(re),
                UNIQUE (aluno_re, modulo_id)
            );
        ''')

        cur.execute('ALTER TABLE progresso_modulos ADD COLUMN IF NOT EXISTS tempo_gasto INTEGER DEFAULT 180')
        cur.execute("ALTER TABLE progresso_modulos ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'concluido'")

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
                caminho_arquivo TEXT NOT NULL,
                tamanho TEXT,
                data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ''')

        # Migracao para alterar o tipo de modulo_id de INTEGER para TEXT na tabela progresso_modulos
        try:
            cur.execute('''
                ALTER TABLE progresso_modulos ALTER COLUMN modulo_id TYPE TEXT USING modulo_id::TEXT;
            ''')
        except Exception:
            pass

        # Garantir que a tabela progresso_modulos tenha uma constraint UNIQUE em (aluno_re, modulo_id)
        try:
            cur.execute('''
                ALTER TABLE progresso_modulos ADD CONSTRAINT unique_aluno_modulo UNIQUE (aluno_re, modulo_id);
            ''')
        except Exception:
            pass

        # Migracao para corrigir o RE e senha do Ten Palopoli
        try:
            cur.execute("SELECT id FROM usuarios WHERE re = '1563006-8' OR username = '1563006-8'")
            usr = cur.fetchone()
            if usr:
                import hashlib, secrets
                salt_hex = secrets.token_hex(16)
                salt_bytes = bytes.fromhex(salt_hex)
                dk = hashlib.pbkdf2_hmac('sha256', b'156306-8', salt_bytes, 100000)
                novo_pass_hash = f"pbkdf2_sha256${salt_hex}${dk.hex()}"
                cur.execute('''
                    UPDATE usuarios
                    SET re = '156306-8', username = '156306-8', senha_hash = %s, senha_provisoria = 1, primeiro_acesso_em = NULL
                    WHERE id = %s
                ''', (novo_pass_hash, usr['id']))
        except Exception:
            pass

        # Migracao para cadastrar o CB PM Braga
        try:
            cur.execute("SELECT id FROM usuarios WHERE re = '116666-2' OR username = '116666-2'")
            usr_braga = cur.fetchone()
            if not usr_braga:
                import hashlib, secrets
                salt_hex = secrets.token_hex(16)
                salt_bytes = bytes.fromhex(salt_hex)
                dk = hashlib.pbkdf2_hmac('sha256', b'116666-2', salt_bytes, 100000)
                braga_pass = f"pbkdf2_sha256${salt_hex}${dk.hex()}"
                cur.execute('''
                    INSERT INTO usuarios (username, senha_hash, nome, re, estacao, role, senha_provisoria, status)
                    VALUES ('116666-2', %s, 'CB PM Braga', '116666-2', '2º GB', 'instrutor', 1, 'ativo')
                ''', (braga_pass,))
        except Exception:
            pass

        # Migracao para atualizar questoes dos modulos 4, 5 e 6 para versao altamente tecnica
        try:
            # Modulo 4
            cur.execute('''
                UPDATE quiz_questions 
                SET question_text = %s 
                WHERE id = 'sc_mod4_q1'
            ''', ('Em uma operação de resgate vertical utilizando a Maca Sked envelopada integrada a um sistema de desmultiplicação Z-Rig (3:1), qual é a recomendação técnica correta do manual de Salvamento em Altura e das diretrizes de APH?',))
            cur.execute("UPDATE quiz_options SET option_text = %s, is_correct = 1 WHERE id = 'sc_aph_mod4_q1_opA'", ('O sistema Z-Rig (3:1) por ser um sistema ímpar exige que o terminal da corda de trabalho esteja fixado na carga (bloqueador móvel), a captura de progresso deve ser posicionada no ponto de ancoragem e o envelopamento da maca Sked deve incluir colar cervical para RMC e proteção térmica activa contra hipotermia antes do fechamento.',))
            cur.execute("UPDATE quiz_options SET option_text = %s, is_correct = 0 WHERE id = 'sc_aph_mod4_q1_opB'", ('O sistema Z-Rig (3:1) por ser um sistema par exige que o cabo seja ancorado diretamente na estrutura fixa, dispensando captura de progresso na ancoragem e permitindo que a maca Sked seja fechada sem colar cervical para facilitar a flexão da cabeça.',))
            cur.execute("UPDATE quiz_options SET option_text = %s, is_correct = 0 WHERE id = 'sc_aph_mod4_q1_opC'", ('O nó de captura de progresso (antirretorno) deve ser confeccionado com cordinete Prusik posicionado diretamente sobre o bloqueador móvel (carga) e o envelopamento da Sked deve comprimir o tórax da vítima para máxima rigidez vertical.',))
            cur.execute("UPDATE quiz_options SET option_text = %s, is_correct = 0 WHERE id = 'sc_aph_mod4_q1_opD'", ('Para o tracionamento do Z-Rig, os operadores devem obrigatoriamente calçar luvas de raspas grossas de vaqueta e o terminal da corda de trabalho deve ser fixado diretamente na ancoragem primária.',))

            # Modulo 5
            cur.execute('''
                UPDATE quiz_questions 
                SET question_text = %s 
                WHERE id = 'sc_mod5_q1'
            ''', ('Ao montar um sistema de desmultiplicação de forças Vector (5:1) reduzido para o resgate de uma prancha longa em rampa (barranco/terreno inclinado), quais princípios físicos de ancoragem e procedimentos de APH devem ser observados?',))
            cur.execute("UPDATE quiz_options SET option_text = %s, is_correct = 1 WHERE id = 'sc_aph_mod5_q1_opA'", ('A polia fixa na ancoragem sofre o "efeito polia" suportando o dobro da tração aplicada (2T), a distância da puxada é otimizada usando um bloqueador móvel na linha principal (sistema reduzido ímpar) e a prancha deve ser fixada com tirante tipo aranha e guiada por um socorrista acompanhante focado na via aérea.',))
            cur.execute("UPDATE quiz_options SET option_text = %s, is_correct = 0 WHERE id = 'sc_aph_mod5_q1_opB'", ('O ponto de ancoragem fixo sofre o efeito polia de forma atenuada recebendo apenas 0.5T da tração aplicada, o tracionamento dispensa bloqueadores móveis usando apenas polias estendidas e a prancha deve ser rolada rampa abaixo sem tirante aranha para agilizar a extração.',))
            cur.execute("UPDATE quiz_options SET option_text = %s, is_correct = 0 WHERE id = 'sc_aph_mod5_q1_opC'", ('O sistema Vector (5:1) reduzido, por ser um sistema par, exige que a terminação do cabo esteja ancorada na estrutura e a captura de progresso com Prusik tandem deve ser alocada no bloqueador móvel sobre a maca.',))
            cur.execute("UPDATE quiz_options SET option_text = %s, is_correct = 0 WHERE id = 'sc_aph_mod5_q1_opD'", ('A prancha longa deve ser suspensa verticalmente sem proteção contra rolamento secundário e o socorrista acompanhante deve realizar a tração da corda a partir do solo para economizar força da equipe de cima.',))

            # Modulo 6
            cur.execute('''
                UPDATE quiz_questions 
                SET question_text = %s 
                WHERE id = 'sc_mod6_q1'
            ''', ('Durante a extração vertical de uma vítima utilizando o Tripé Operacional de Resgate e escadas como trilho na transposição de borda, qual é a conduta de segurança e APH adequada?',))
            cur.execute("UPDATE quiz_options SET option_text = %s, is_correct = 1 WHERE id = 'sc_aph_mod6_q1_opA'", ('A transposição de borda exige a manutenção do controle cervical manual e linha de vida de segurança (belay) tensionada de forma redundante, garantindo que o tripé atue como ancoragem alta para evitar choque na quina e que a escada funcione como guia estável.',))
            cur.execute("UPDATE quiz_options SET option_text = %s, is_correct = 0 WHERE id = 'sc_aph_mod6_q1_opB'", ('A linha de vida de segurança deve ser afrouxada para dar maior mobilidade na transposição de borda e o tripé deve ser posicionado com as pernas sobre solo instável sem amarração limitadora.',))
            cur.execute("UPDATE quiz_options SET option_text = %s, is_correct = 0 WHERE id = 'sc_aph_mod6_q1_opC'", ('O tripé operacional deve ser dispensado na transposição de borda para evitar atrito nas pernas de alumínio, sendo a escada prolongável mantida sem fixação ou tirantes nas quinas vivas.',))
            cur.execute("UPDATE quiz_options SET option_text = %s, is_correct = 0 WHERE id = 'sc_aph_mod6_q1_opD'", ('O socorrista deve acelerar a descida abruptamente sem comunicação prévia com a equipe do topo, permitindo que a maca gire livremente e bata na calha ou borda de concreto.',))
        except Exception:
            pass

        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"[INIT_DB UNIFIED ERROR] {e}")
        raise e
    finally:
        conn.close()

def get_db():
    db_url = os.environ.get("DATABASE_URL", "")
    if not db_url or "oregon-postgres.render.com" not in db_url:
        db_url = "postgresql://db_salvamento_com_cordas_user:nZvQsGoE6ED6ne026zkML02fjEbtlKWo@dpg-d9mc56ijobas73ao7fk0-a.oregon-postgres.render.com/db_salvamento_com_cordas"
    try:
        conn = psycopg2.connect(db_url, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"[GET_DB UNIFIED WARNING] Falha na conexao principal ({e}), tentando URL externa...")
        ext_url = "postgresql://db_salvamento_com_cordas_user:nZvQsGoE6ED6ne026zkML02fjEbtlKWo@dpg-d9mc56ijobas73ao7fk0-a.oregon-postgres.render.com/db_salvamento_com_cordas"
        return psycopg2.connect(ext_url, cursor_factory=RealDictCursor)

class UnifiedPortalHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, data, code=200):
        def default_serializer(o):
            if isinstance(o, (datetime, date)):
                return o.isoformat()
            return str(o)
        body = json.dumps(data, ensure_ascii=False, default=default_serializer).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == '/api/instrutoria/dashboard' or path == '/api/instrutoria/alunos':
            conn = get_db()
            cur = conn.cursor()

            cur.execute('''
                SELECT a.id, a.nome, a.re, a.estacao, a.data_cadastro,
                       COUNT(DISTINCT p.modulo_id) as modulos_concluidos,
                       COALESCE(AVG(p.nota), 0) as media_notas,
                       COALESCE(SUM(p.tempo_gasto), 0) as tempo_total_segundos
                FROM alunos a
                LEFT JOIN progresso_modulos p ON a.re = p.aluno_re
                GROUP BY a.id, a.nome, a.re, a.estacao, a.senha_provisoria
                ORDER BY a.id DESC
            ''')
            alunos = [dict(r) for r in cur.fetchall()]

            total_alunos = len(alunos)
            conclusao_por_modulo = {}

            for m in range(1, 5):
                if total_alunos > 0:
                    cur.execute('''
                        SELECT COUNT(DISTINCT aluno_re) as count_concluidos
                        FROM progresso_modulos
                        WHERE modulo_id = %s
                    ''', (m,))
                    c_count = cur.fetchone()['count_concluidos']
                    pct = round((c_count / total_alunos) * 100)
                else:
                    c_count = 0
                    pct = 0
                
                conclusao_por_modulo[f'modulo_{m}'] = {
                    'modulo_id': m,
                    'concluidos': c_count,
                    'total_alunos': total_alunos,
                    'porcentagem': pct
                }

            today_str = datetime.now().strftime('%Y-%m-%d')
            alertas = []
            for a in alunos:
                ult_acesso = str(a['data_cadastro'])[:10] if a['data_cadastro'] else ''
                pendente = a['modulos_concluidos'] < 4
                nao_acessou_hoje = (ult_acesso != today_str)

                if nao_acessou_hoje or pendente:
                    alertas.append({
                        're': a['re'],
                        'nome': a['nome'],
                        'estacao': a['estacao'],
                        'modulos_concluidos': a['modulos_concluidos'],
                        'pendencias': 4 - a['modulos_concluidos'],
                        'nao_acessou_hoje': nao_acessou_hoje,
                        'motivo': 'Sem acesso no dia/noite' if nao_acessou_hoje else 'Módulos pendentes'
                    })

            conn.close()

            return self.send_json({
                'success': True,
                'total_alunos': total_alunos,
                'alunos': alunos,
                'conclusao_por_turma': conclusao_por_modulo,
                'alertas': alertas
            })

        elif path == '/api/instrutoria/certificados':
            conn = get_db()
            cur = conn.cursor()
            cur.execute('''
                SELECT c.id, c.aluno_re, c.codigo_hash, c.data_emissao,
                       a.nome, a.estacao
                FROM certificados c
                JOIN alunos a ON c.aluno_re = a.re
                ORDER BY c.id DESC
            ''')
            certificados = [dict(r) for r in cur.fetchall()]
            conn.close()
            return self.send_json({'success': True, 'certificados': certificados})

        elif path == '/api/instrutoria/arquivos':
            conn = get_db()
            cur = conn.cursor()
            cur.execute('SELECT * FROM arquivos_instrutoria ORDER BY id DESC')
            arquivos = [dict(r) for r in cur.fetchall()]
            conn.close()
            return self.send_json({'success': True, 'arquivos': arquivos})

        # Para qualquer outra rota, serve os arquivos estáticos (index.html, app.js, images...)
        else:
            super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        body_data = self.rfile.read(length).decode('utf-8') if length > 0 else '{}'

        try:
            payload = json.loads(body_data)
        except Exception:
            payload = {}

        if path == '/api/aluno/login':
            nome = payload.get('nome')
            re = payload.get('re')
            estacao = payload.get('estacao')

            if not nome or not re or not estacao:
                return self.send_json({'success': False, 'message': 'Campos obrigatórios ausentes'}, 400)

            conn = get_db()
            cur = conn.cursor()
            now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            cur.execute('''
                INSERT INTO alunos (nome, re, estacao, data_cadastro)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT(re) DO UPDATE SET nome=excluded.nome, estacao=excluded.estacao
            ''', (nome, re, estacao, now_str))

            conn.commit()

            cur.execute('SELECT modulo_id, nota FROM progresso_modulos WHERE aluno_re = %s', (re,))
            progresso = [dict(r) for r in cur.fetchall()]
            conn.close()

            return self.send_json({
                'success': True,
                'message': 'Aluno registrado com sucesso no BD',
                'aluno': {'nome': nome, 're': re, 'estacao': estacao},
                'progresso': progresso
            })

        elif path == '/api/aluno/progresso':
            aluno_re = payload.get('re')
            modulo_id = payload.get('modulo_id')
            nota = payload.get('nota', 100)
            tempo_gasto = payload.get('tempo_gasto', 300)

            if not aluno_re or not modulo_id:
                return self.send_json({'success': False, 'message': 'RE e módulo são obrigatórios'}, 400)

            conn = get_db()
            cur = conn.cursor()
            now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            cur.execute('''
                INSERT INTO progresso_modulos (aluno_re, modulo_id, nota, tempo_gasto, data_conclusao)
                VALUES (%s, %s, %s, %s, %s)
            ''', (aluno_re, modulo_id, nota, tempo_gasto, now_str))

            conn.commit()
            conn.close()

            return self.send_json({'success': True, 'message': 'Progresso e nota registrados no BD com sucesso'})

        elif path == '/api/aluno/certificado':
            aluno_re = payload.get('re')
            codigo_hash = payload.get('hash')

            if not aluno_re or not codigo_hash:
                return self.send_json({'success': False, 'message': 'RE e Hash obrigatórios'}, 400)

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

        elif path == '/api/instrutoria/arquivo-simulado':
            nome_arquivo = payload.get('name', 'Material_Tecnico.pdf')
            tamanho = payload.get('size', '2.5 MB')

            conn = get_db()
            cur = conn.cursor()
            cur.execute('''
                INSERT INTO arquivos_instrutoria (nome_arquivo, caminho_arquivo, tamanho)
                VALUES (%s, %s, %s)
            ''', (nome_arquivo, f'uploads/{nome_arquivo}', tamanho))
            conn.commit()
            conn.close()

            return self.send_json({'success': True, 'message': 'Arquivo registrado no BD da Instrutoria'})

        else:
            return self.send_json({'error': 'Endpoint não encontrado'}, 404)

if __name__ == '__main__':
    init_db()
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("0.0.0.0", PORT), UnifiedPortalHandler) as httpd:
        print(f"Servidor Unificado rodando em 0.0.0.0:{PORT}")
        httpd.serve_forever()
