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
from datetime import datetime

PORT = 8081
DB_PATH = 'salvamento_2gb.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute('''
        CREATE TABLE IF NOT EXISTS alunos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            re TEXT UNIQUE NOT NULL,
            estacao TEXT NOT NULL,
            ultimo_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ''')

    try:
        cur.execute('ALTER TABLE alunos ADD COLUMN ultimo_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
    except sqlite3.OperationalError:
        pass

    cur.execute('''
        CREATE TABLE IF NOT EXISTS progresso_modulos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            aluno_re TEXT NOT NULL,
            modulo_id INTEGER NOT NULL,
            nota REAL DEFAULT 0.0,
            tempo_gasto INTEGER DEFAULT 0,
            status TEXT DEFAULT 'concluido',
            data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            data_conclusao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (aluno_re) REFERENCES alunos(re)
        );
    ''')

    try:
        cur.execute('ALTER TABLE progresso_modulos ADD COLUMN tempo_gasto INTEGER DEFAULT 180')
    except sqlite3.OperationalError:
        pass

    try:
        cur.execute("ALTER TABLE progresso_modulos ADD COLUMN status TEXT DEFAULT 'concluido'")
    except sqlite3.OperationalError:
        pass

    cur.execute('''
        CREATE TABLE IF NOT EXISTS certificados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            aluno_re TEXT NOT NULL,
            codigo_hash TEXT UNIQUE NOT NULL,
            data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (aluno_re) REFERENCES alunos(re)
        );
    ''')

    cur.execute('''
        CREATE TABLE IF NOT EXISTS arquivos_instrutoria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_arquivo TEXT NOT NULL,
            caminho_arquivo TEXT NOT NULL,
            tamanho TEXT,
            data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ''')

    conn.commit()
    conn.close()

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

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
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
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
                GROUP BY a.id
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
                        WHERE modulo_id = ?
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
                VALUES (?, ?, ?, ?)
                ON CONFLICT(re) DO UPDATE SET nome=excluded.nome, estacao=excluded.estacao
            ''', (nome, re, estacao, now_str))

            conn.commit()

            cur.execute('SELECT modulo_id, nota FROM progresso_modulos WHERE aluno_re = ?', (re,))
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
                VALUES (?, ?, ?, ?, ?)
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
                    VALUES (?, ?)
                ''', (aluno_re, codigo_hash))
                conn.commit()
                conn.close()
                return self.send_json({'success': True, 'message': 'Certificado registrado no BD'})
            except sqlite3.IntegrityError:
                conn.close()
                return self.send_json({'success': True, 'message': 'Certificado já existente'})

        elif path == '/api/instrutoria/arquivo-simulado':
            nome_arquivo = payload.get('name', 'Material_Tecnico.pdf')
            tamanho = payload.get('size', '2.5 MB')

            conn = get_db()
            cur = conn.cursor()
            cur.execute('''
                INSERT INTO arquivos_instrutoria (nome_arquivo, caminho_arquivo, tamanho)
                VALUES (?, ?, ?)
            ''', (nome_arquivo, f'uploads/{nome_arquivo}', tamanho))
            conn.commit()
            conn.close()

            return self.send_json({'success': True, 'message': 'Arquivo registrado no BD da Instrutoria'})

        else:
            return self.send_json({'error': 'Endpoint não encontrado'}, 404)

if __name__ == '__main__':
    init_db()
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), UnifiedPortalHandler) as httpd:
        print(f"Servidor Unificado (Web + BD) rodando em http://localhost:{PORT}")
        httpd.serve_forever()
