// ==========================================================================
// Lógica Front-End SPA - Portal 2º GB CBMESP
// Autenticação Simplificada (RE e Senha) & RBAC Seguro no Back-End
// Engine Anti-Cheat de Quiz: Randomização Determinística por Candidato
// ==========================================================================

const API_BASE_URL = 'http://localhost:8082/api';

// Dados Visuais dos Módulos (Imagens Fotorrealistas de Alta Fidelidade Técnica)
const modulesData = {
  1: {
    title: "Módulo 1: Doutrina & Fisiologia no Salvamento Vertical",
    subtitle: "Fundamentos NFPA 1983/2500 e Proteção contra Síndrome da Suspensão Inerte",
    slides: [
      {
        tag: "MÓDULO 1 - SLIDE 1 DE 3",
        title: "Doutrina de Segurança & Fator de Queda (FQ)",
        subtitle: "Conceitos fundamentais de retenção e absorção de choque.",
        image: "images/sc_mod1_fator_queda.png",
        bullets: [
          "<strong>Fator de Queda (FQ):</strong> Razão entre a altura da queda e o comprimento útil de corda ativa (FQ = H / L).",
          "<strong>Limite Crítico (FQ &lt; 1):</strong> Quedas com FQ &ge; 1 geram forças de impacto perigosas no corpo e ancoragens.",
          "<strong>Força de Choque Máxima:</strong> Normas NFPA limitam a força máxima transmitida ao bombeiro em 6 kN.",
          "<strong>Zelo pelo Equipamento:</strong> Inspeção diária de fitas, mosquetões de aço/alumínio e cordas de capa e alma."
        ]
      },
      {
        tag: "MÓDULO 1 - SLIDE 2 DE 3",
        title: "Síndrome da Suspensão Inerte (Trauma de Suspensão)",
        subtitle: "Fisiopatologia da estagnação venosa e choque hipovolêmico.",
        image: "images/sc_mod1_suspensao_inerte.png",
        bullets: [
          "<strong>Estagnação Venosa:</strong> A imobilidade no cinto (cadeira) prende o sangue nas extremidades inferiores.",
          "<strong>Janela Crítica de Ação:</strong> Sintomas graves (pré-síncope, perda de consciência) surgem entre 5 e 15 minutos.",
          "<strong>Fita de Alívio / Pedaleira:</strong> Utilização imediata da fita de alívio para promover a contração muscular.",
          "<strong>Protocolo de Manejo:</strong> Nunca deitar a vítima abruptamente após o resgate para evitar sobrecarga cardíaca."
        ]
      },
      {
        tag: "MÓDULO 1 - SLIDE 3 DE 3",
        title: "Doutrina de Dupla Proteção & Linha de Vida",
        subtitle: "Sistemas redundantes e comunicação padronizada.",
        image: "images/sc_mod1_dupla_protecao.png",
        bullets: [
          "<strong>Dupla Proteção (Redundância):</strong> Todo operador ou vítima deve estar conectado a duas linhas independentes (Trabalho + Back-up).",
          "<strong>Comando Voz e Gesto:</strong> Padronização dos comandos: 'Mesa', 'Corda', 'Atenção', 'Livre'.",
          "<strong>Checklist Cruzado:</strong> Verificação de mosquetões rosqueados e nós antes de liberar o sistema."
        ]
      }
    ]
  },
  2: {
    title: "Módulo 2: Nós e Amarrações Práticas em Operações",
    subtitle: "Confecção, Peinagem e Aplicação Tática dos Nós de Salvamento",
    slides: [
      {
        tag: "MÓDULO 2 - SLIDE 1 DE 3",
        title: "Nós de Enfiamento e Alça: Oito Duplo e Borboleta Alpina",
        subtitle: "Resistência estrutural e facilidade de desatem.",
        image: "images/sc_mod2_oito_duplo.png",
        bullets: [
          "<strong>Nó Oito Duplo Guiado:</strong> Nó principal de encordoamento e fixação em ancoragens. Redução de resistência: ~20-25%.",
          "<strong>Nó Borboleta Alpina:</strong> Alça no meio da corda que suporta tração multidirecional (em 3 eixos) sem deformar.",
          "<strong>Peinagem Obrigatória:</strong> As voltas do nó devem ser organizadas sem cruzamentos sobrepostos para distribuição uniforme de carga."
        ]
      },
      {
        tag: "MÓDULO 2 - SLIDE 2 DE 3",
        title: "Nós de Emenda e Conexão de Cordas",
        subtitle: "União de cordas de mesmo diâmetro e confecção de anéis.",
        image: "images/sc_mod2_pescador_duplo.png",
        bullets: [
          "<strong>Pescador Duplo (Double Fisherman):</strong> União definitiva de duas cordas ou confecção de anéis de cordinete.",
          "<strong>Nó de Fita (Water Knot):</strong> Exclusivo para junção de fitas tubulares de poliamida com arremate de segurança.",
          "<strong>Sobra de Segurança:</strong> Manter sobra mínima de 10 cm nas extremidades de todos os nós operacionais."
        ]
      },
      {
        tag: "MÓDULO 2 - SLIDE 3 DE 3",
        title: "Nós Friccionantes / Autoblocantes",
        subtitle: "Prusik, Machard e Bachmann para subida e trava de segurança.",
        image: "images/sc_mod2_nos_friccionantes.png",
        bullets: [
          "<strong>Nó Prusik:</strong> Blocagem bidirecional feita com cordinete de 6mm a 7mm sobre corda de 10.5mm ou 11mm.",
          "<strong>Nó Machard (Klemheist):</strong> Blocagem unidirecional com desblocagem facilitada sob tensão parcial.",
          "<strong>Regra dos Diâmetros:</strong> O cordinete friccionante deve ter entre 60% e 70% do diâmetro da corda principal."
        ]
      }
    ]
  },
  3: {
    title: "Módulo 3: Ancoragens Equalizadas & Multiplicadores de Força",
    subtitle: "Equalização de Ancoragens em Y e Sistemas Z-Rig 3:1",
    slides: [
      {
        tag: "MÓDULO 3 - SLIDE 1 DE 3",
        title: "Ancoragens Fracionadas e Equalizadas em Y",
        subtitle: "Distribuição de cargas entre múltiplos pontos estruturais.",
        image: "images/sc_mod3_ancoragem_y.png",
        bullets: [
          "<strong>Equalização Autoadaptável:</strong> Permite ajuste automático do ponto central de ancoragem caso a linha de tração mude.",
          "<strong>Regra dos Ângulos no Y:</strong><br>&bull; Ângulo 60º: Carga em cada ponto = 58% do total.<br>&bull; Ângulo 90º: Carga em cada ponto = 71% do total.<br>&bull; Ângulo 120º: Carga em cada ponto = 100% (Crítico!).",
          "<strong>Redundância Estrutural:</strong> Ancorar sempre em estruturas bombeiras comprovadas (vigas I, pilares de concreto)."
        ]
      },
      {
        tag: "MÓDULO 3 - SLIDE 2 DE 3",
        title: "Sistemas de Redução de Força (Desmultiplicação Z-Rig 3:1)",
        subtitle: "Multiplicação mecânica de força com polias de alto rendimento.",
        image: "images/sc_mod3_z_rig_31.png",
        bullets: [
          "<strong>Sistema Z-Rig 3:1:</strong> Utiliza 1 polia móvel na carga e 1 polia fixa na ancoragem para reduzir o esforço de tracionamento a 1/3.",
          "<strong>Vantagem Mecânica Real vs Teórica:</strong> Devido ao atrito das polias e cordas, o rendimento real do 3:1 gira em torno de 2.5:1.",
          "<strong>Nó Friccionante de Trava (Capture Cam):</strong> Prusik ou blocador ventral instalado na polia fixa para reter a carga a cada puxada."
        ]
      },
      {
        tag: "MÓDULO 3 - SLIDE 3 DE 3",
        title: "Sistemas Compostos Vector 5:1 & Vantagem Mecânica",
        subtitle: "Sistemas avançados para elevação de macas pesadas.",
        image: "images/sc_mod3_vector_51.png",
        bullets: [
          "<strong>Sistema 5:1 Composto:</strong> Combinação de um sistema 3:1 tracionando um 2:1 secundário para resgates exigentes.",
          "<strong>Gerenciamento de Corda:</strong> Controle rigoroso de sobra para evitar nós de emaranhamento durante a elevação.",
          "<strong>Polias de Placas Oscilantes:</strong> Uso de polias duplas com rolamento de esferas selado para máxima eficiência."
        ]
      }
    ]
  },
  4: {
    title: "Módulo 4: Manobras de Resgate & Manejo de Maca Sked",
    subtitle: "Pick-Off Tático, Transposição de Borda e Maca Envelopada",
    slides: [
      {
        tag: "MÓDULO 4 - SLIDE 1 DE 3",
        title: "Manobras de Resgate Pick-Off (Desenganche Tático)",
        subtitle: "Retirada de vítima suspensa por talabarte ou corda rompida.",
        image: "images/sc_mod4_pick_off.png",
        bullets: [
          "<strong>Aproximação Controlada:</strong> O resgatador desce pela corda de trabalho até posicionar-se ao lado da vítima.",
          "<strong>Conexão Direta:</strong> Conectar a vítima ao cinto do resgatador por fita de ancoragem ajustável (linha de transferência).",
          "<strong>Alívio de Tensão & Corte Seguro:</strong> Tracionar a vítima com pedaleira/mini-sistema para aliviar o talabarte preso antes da liberação."
        ]
      },
      {
        tag: "MÓDULO 4 - SLIDE 2 DE 3",
        title: "Manejo e Envelopamento de Maca Sked / Cesto",
        subtitle: "Imobilização espinhal e proteção em espaços confinados.",
        image: "images/sc_mod4_maca_sked.png",
        bullets: [
          "<strong>Rigidez & Flexibilidade:</strong> A maca Sked garante imobilização completa e desliza sobre superfícies irregulares.",
          "<strong>Amarra de Envelopamento:</strong> Passagem das fitas em ilhós cruzados para travamento do paciente.",
          "<strong>Suspensão Horizontal e Vertical:</strong> Ajuste das tirantes de içamento conforme a geometria do poço ou edificação."
        ]
      },
      {
        tag: "MÓDULO 4 - SLIDE 3 DE 3",
        title: "Transposição de Borda & Passagem de Nó",
        subtitle: "Superação de quinas vivas e arremate final de resgate.",
        image: "images/sc_mod4_transposicao_borda.png",
        bullets: [
          "<strong>Protetores de Corda:</strong> Instalação obrigatória de protetores articulados de alumínio ou lona em quinas de concreto.",
          "<strong>Técnica de Transposição:</strong> Manter o centro de gravidade projetado para fora da borda com pé de apoio alto.",
          "<strong>Passagem de Nó em Descenso:</strong> Transferência de carga da linha de descenso para nó autoblocante secundário."
        ]
      }
    ]
  }
};

// Estado Global da Aplicação
let currentUser = null;
let currentRole = 'aluno';
let authToken = localStorage.getItem('cb_auth_token') || '';
let currentModule = 1;
let currentSlideIndex = 0;
let currentStudentFilter = 'ativo';
let userProgress = { 1: false, 2: false, 3: false, 4: false };

// Estado da Tentativa do Quiz
let currentAttemptId = null;
let currentQuestionId = null;
let selectedOptionId = null;

// Inicialização da Aplicação
document.addEventListener('DOMContentLoaded', () => {
  setupNavigationEvents();
  setupLoginForm();
  checkExistingSession();
});

function showScreen(screenId) {
  if (currentUser && currentUser.senha_provisoria === 1 && screenId !== 'screen-reset-password' && screenId !== 'screen-login') {
    alert("⚠️ Você está acessando com a Senha Provisória de cadastro. É obrigatório redefinir sua senha antes de navegar pelo portal.");
    screenId = 'screen-reset-password';
  }

  if (screenId === 'screen-instrutoria' && currentRole !== 'instrutor' && currentRole !== 'admin') {
    alert("⛔ ACESSO NEGADO: Apenas instrutores credenciados podem acessar a Área da Instrutoria.");
    screenId = 'screen-classroom';
  }

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
  }

  if (screenId === 'screen-instrutoria') {
    loadDatabaseStudentReport();
    loadInstructorFiles();
  }
}

function setupLoginForm() {
  document.getElementById('btn-submit-login')?.addEventListener('click', handleLogin);
  document.getElementById('login-senha')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
}

// ------------------------------------------------------------------
// LOGIN ÚNICO SIMPLIFICADO (RE E SENHA)
// O perfil (role) vem 100% do Banco de Dados no Back-End
// ------------------------------------------------------------------
async function handleLogin() {
  const re = document.getElementById('login-re').value.trim();
  const senha = document.getElementById('login-senha').value.trim();
  const errBox = document.getElementById('auth-error-message');

  if (!re || !senha) {
    if (errBox) {
      errBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Por favor, informe seu RE e Senha de Acesso.';
      errBox.style.display = 'block';
    }
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: re,
        password: senha
      })
    });

    const data = await res.json();

    if (!data.success) {
      if (errBox) {
        errBox.innerHTML = `<i class="fa-solid fa-ban"></i> ${data.message || 'Erro ao autenticar.'}`;
        errBox.style.display = 'block';
      }
      return;
    }

    authToken = data.token;
    localStorage.setItem('cb_auth_token', authToken);
    currentUser = data.user;
    currentRole = data.user.role; // ROLE VEIO RIGOROSAMENTE DO BD DO SERVIDORE

    updateHeaderUserInfo();

    if (data.must_change_password || data.user.senha_provisoria === 1) {
      showScreen('screen-reset-password');
    } else if (currentRole === 'instrutor' || currentRole === 'admin') {
      showScreen('screen-instrutoria');
    } else {
      loadModule(1);
      showScreen('screen-classroom');
    }
  } catch (err) {
    if (errBox) {
      errBox.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Erro ao conectar ao servidor API.';
      errBox.style.display = 'block';
    }
  }
}

function switchLoginTab(tabType) {
  const btnAluno = document.getElementById('tab-btn-aluno');
  const btnInstrutor = document.getElementById('tab-btn-instrutor');
  const titleEl = document.getElementById('login-title');
  const subEl = document.getElementById('login-subtitle');
  const reLabel = document.getElementById('login-re-label');
  const passLabel = document.getElementById('login-pass-label');
  const reInput = document.getElementById('login-re');
  const passInput = document.getElementById('login-senha');
  const submitBtn = document.getElementById('btn-submit-login');
  const errBox = document.getElementById('auth-error-message');

  if (errBox) errBox.style.display = 'none';

  // Rótulos e Placeholders genéricos e padronizados para AMBAS as abas (RE e Senha)
  if (reLabel) reLabel.innerText = 'RE DO BOMBEIRO MILITAR';
  if (passLabel) passLabel.innerText = 'SENHA DE ACESSO';
  if (reInput) {
    reInput.value = ''; // NUNCA pré-preenche credenciais (Segurança)
    reInput.placeholder = 'Ex: 123456-7';
  }
  if (passInput) {
    passInput.value = '';
    passInput.placeholder = 'Digite sua senha de acesso';
  }

  if (tabType === 'instrutor') {
    if (btnAluno) btnAluno.className = 'login-tab-btn inactive';
    if (btnInstrutor) btnInstrutor.className = 'login-tab-btn active-instrutor';
    if (titleEl) titleEl.innerText = 'Painel da Instrutoria';
    if (subEl) subEl.innerText = 'Área Restrita para Comando de Instrução do 2º GB';
    if (submitBtn) {
      submitBtn.innerHTML = 'Acessar Painel do Instrutor <i class="fa-solid fa-key"></i>';
      submitBtn.style.background = 'linear-gradient(135deg, #d97706, #92400e)';
      submitBtn.style.borderColor = '#f5c23d';
      submitBtn.style.boxShadow = '0 4px 20px rgba(217, 119, 6, 0.4)';
    }
  } else {
    if (btnAluno) btnAluno.className = 'login-tab-btn active-aluno';
    if (btnInstrutor) btnInstrutor.className = 'login-tab-btn inactive';
    if (titleEl) titleEl.innerText = 'Acesso do Aluno';
    if (subEl) subEl.innerText = 'Credenciamento Individual para Instrução EAD - 2º GB';
    if (submitBtn) {
      submitBtn.innerHTML = 'Acessar Sala de Aula <i class="fa-solid fa-arrow-right"></i>';
      submitBtn.style.background = 'linear-gradient(135deg, var(--color-tactical-blue), var(--color-tactical-blue-dark))';
      submitBtn.style.borderColor = 'var(--color-tactical-blue-light)';
      submitBtn.style.boxShadow = '0 4px 20px rgba(35, 123, 189, 0.4)';
    }
  }
}

// ------------------------------------------------------------------
// REDEFINIÇÃO OBRIGATÓRIA DE SENHA PROVISÓRIA
// ------------------------------------------------------------------
async function handleAlterarSenhaProvisoria(event) {
  if (event) event.preventDefault();

  const novaSenha = document.getElementById('reset-nova-senha').value.trim();
  const confirmacao = document.getElementById('reset-confirmacao').value.trim();
  const errBox = document.getElementById('reset-error-message');

  if (!novaSenha || !confirmacao) {
    if (errBox) {
      errBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Preencha a nova senha e a confirmação.';
      errBox.style.display = 'block';
    }
    return;
  }

  if (novaSenha !== confirmacao) {
    if (errBox) {
      errBox.innerHTML = '<i class="fa-solid fa-xmark"></i> As senhas digitadas não coincidem.';
      errBox.style.display = 'block';
    }
    return;
  }

  if (novaSenha === currentUser?.re) {
    if (errBox) {
      errBox.innerHTML = '<i class="fa-solid fa-ban"></i> A nova senha não pode ser igual ao seu RE de cadastro.';
      errBox.style.display = 'block';
    }
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/alterar-senha-provisoria`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ nova_senha: novaSenha, confirmacao: confirmacao })
    });

    const data = await res.json();

    if (!data.success) {
      if (errBox) {
        errBox.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${data.message}`;
        errBox.style.display = 'block';
      }
      return;
    }

    alert("✅ Nova senha pessoal definida com sucesso! Acesso liberado.");
    
    // Atualizar no cliente e liberar navegação
    if (currentUser) {
      currentUser.senha_provisoria = 0;
    }
    
    if (currentRole === 'instrutor' || currentRole === 'admin') {
      showScreen('screen-instrutoria');
    } else {
      loadModule(1);
      showScreen('screen-classroom');
    }
  } catch (err) {
    if (errBox) {
      errBox.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Erro ao alterar senha no servidor.';
      errBox.style.display = 'block';
    }
  }
}

// ------------------------------------------------------------------
// CADASTRO EM LOTE DE ALUNOS VIA UPLOAD DE CSV
// ------------------------------------------------------------------
async function handleImportarCSVAlunos(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${API_BASE_URL}/instrutoria/importar-csv-alunos`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData
    });

    const data = await res.json();

    if (!data.success) {
      alert(`❌ Erro na importação do arquivo CSV: ${data.error || data.message}`);
      return;
    }

    renderResumoImportacaoCSV(data);
  } catch (err) {
    alert("❌ Erro de conexão ao enviar o arquivo CSV para o servidor.");
  } finally {
    event.target.value = '';
  }
}

function renderResumoImportacaoCSV(data) {
  document.getElementById('summary-success-count').innerText = data.total_sucesso;
  document.getElementById('summary-error-count').innerText = data.total_erros;

  const debugBox = document.getElementById('summary-debug-logs');
  const errSection = document.getElementById('summary-errors-section');
  const errList = document.getElementById('summary-errors-list');
  const succList = document.getElementById('summary-success-list');

  if (data.debug_logs && data.debug_logs.length > 0) {
    debugBox.innerHTML = data.debug_logs.map(log => `<div>${log}</div>`).join('');
  } else {
    debugBox.innerHTML = '<div>Nenhum log retornado pelo servidor.</div>';
  }

  if (data.erros && data.erros.length > 0) {
    errSection.style.display = 'block';
    errList.innerHTML = data.erros.map(e => `<div><i class="fa-solid fa-circle-xmark"></i> ${e}</div>`).join('');
  } else {
    errSection.style.display = 'none';
    errList.innerHTML = '';
  }

  if (data.alunos_importados && data.alunos_importados.length > 0) {
    succList.innerHTML = data.alunos_importados.map(a => `
      <div style="padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between;">
        <span><strong>${a.nome}</strong> (RE: <code>${a.re}</code>)</span>
        <span style="color: var(--color-gold-patch); font-weight: 700;">${a.estacao}</span>
      </div>
    `).join('');
  } else {
    succList.innerHTML = '<span style="color: var(--color-text-muted);">Nenhum aluno cadastrado nesta operação.</span>';
  }

  document.getElementById('resumoImportacaoModal')?.classList.remove('hidden');
}

function closeResumoModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('resumoImportacaoModal')?.classList.add('hidden');
  loadDatabaseStudentReport();
}

// ------------------------------------------------------------------
// RESET ADMINISTRATIVO DE SENHA PELO INSTRUTOR
// ------------------------------------------------------------------
async function resetStudentPassword(re, nome) {
  if (!confirm(`🔑 Tem certeza que deseja resetar a senha do aluno ${nome} (RE: ${re})?\n\nA senha voltará a ser o RE dele e exigirá redefinição obrigatória no próximo acesso.`)) {
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/instrutoria/resetar-senha-aluno`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ re: re })
    });

    const data = await res.json();
    if (data.success) {
      alert(`✅ Senha do aluno ${nome} (RE: ${re}) resetada com sucesso!`);
      loadDatabaseStudentReport();
    } else {
      alert(`❌ Erro ao resetar senha: ${data.message}`);
    }
  } catch (err) {
    alert("❌ Erro de conexão ao resetar senha.");
  }
}

// ------------------------------------------------------------------
// DESLIGAR ALUNO (SOFT DELETE) & REATIVAR
// ------------------------------------------------------------------
async function softDeleteStudent(re, nome) {
  if (!confirm(`🚫 Confirmar DESLIGAMENTO do aluno ${nome} (RE: ${re})?\n\n- O aluno NÃO conseguirá mais realizar login no portal.\n- Todo o histórico de progresso, notas e certificados permanecerá salvo.\n- A ação poderá ser revertida a qualquer momento no filtro "Desligados".`)) {
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/instrutoria/desligar-aluno`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ re: re })
    });

    const data = await res.json();
    if (data.success) {
      alert(`🚫 Aluno ${nome} (RE: ${re}) foi desligado com sucesso. O histórico foi mantido no banco de dados.`);
      loadDatabaseStudentReport();
    } else {
      alert(`❌ Erro ao desligar aluno: ${data.message}`);
    }
  } catch (err) {
    alert("❌ Erro ao conectar ao servidor para desligar o aluno.");
  }
}

async function reactivateStudent(re, nome) {
  if (!confirm(`🔄 Confirmar REATIVAÇÃO do aluno ${nome} (RE: ${re})?\n\nO acesso do aluno ao portal será imediatamente liberado.`)) {
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/instrutoria/reativar-aluno`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ re: re })
    });

    const data = await res.json();
    if (data.success) {
      alert(`✅ Aluno ${nome} (RE: ${re}) foi reativado com sucesso!`);
      loadDatabaseStudentReport();
    } else {
      alert(`❌ Erro ao reativar aluno: ${data.message}`);
    }
  } catch (err) {
    alert("❌ Erro ao conectar ao servidor para reativar o aluno.");
  }
}

// ------------------------------------------------------------------
// EXCLUIR ALUNO DEFINITIVAMENTE (HARD DELETE PERMANENTE EM CASCATA)
// ------------------------------------------------------------------
function openExcluirModal(re, nomeReal) {
  document.getElementById('excluir-target-re').value = re;
  document.getElementById('excluir-target-nome-real').value = nomeReal;
  document.getElementById('target-aluno-nome-display').innerText = nomeReal;
  
  const inputConfirm = document.getElementById('input-confirmar-nome-aluno');
  inputConfirm.value = '';
  
  const btnDelete = document.getElementById('btn-confirmar-hard-delete');
  btnDelete.disabled = true;
  btnDelete.style.opacity = '0.5';
  btnDelete.style.cursor = 'not-allowed';

  document.getElementById('excluirAlunoModal')?.classList.remove('hidden');
}

function closeExcluirModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('excluirAlunoModal')?.classList.add('hidden');
}

function validateHardDeleteInput() {
  const nomeReal = document.getElementById('excluir-target-nome-real').value.trim().toLowerCase();
  const inputTyped = document.getElementById('input-confirmar-nome-aluno').value.trim().toLowerCase();
  const btnDelete = document.getElementById('btn-confirmar-hard-delete');

  if (inputTyped === nomeReal && nomeReal.length > 0) {
    btnDelete.disabled = false;
    btnDelete.style.opacity = '1';
    btnDelete.style.cursor = 'pointer';
  } else {
    btnDelete.disabled = true;
    btnDelete.style.opacity = '0.5';
    btnDelete.style.cursor = 'not-allowed';
  }
}

async function handleConfirmarExclusaoDefinitiva(event) {
  if (event) event.preventDefault();

  const re = document.getElementById('excluir-target-re').value;
  const inputTyped = document.getElementById('input-confirmar-nome-aluno').value.trim();

  try {
    const res = await fetch(`${API_BASE_URL}/instrutoria/excluir-aluno`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        re: re,
        nome_confirmacao: inputTyped
      })
    });

    const data = await res.json();

    if (!data.success) {
      alert(`❌ Erro na exclusão permanente: ${data.message}`);
      return;
    }

    alert(`💀 EXCLUSÃO PERMANENTE CONCLUÍDA:\n\n${data.message}`);
    closeExcluirModal();
    loadDatabaseStudentReport();
  } catch (err) {
    alert("❌ Erro de conexão ao tentar excluir definitivamente o aluno.");
  }
}

// ------------------------------------------------------------------
// RELATÓRIO DO INSTRUTOR COM FILTROS DE STATUS
// ------------------------------------------------------------------
function setStudentFilter(filterType) {
  currentStudentFilter = filterType;

  document.getElementById('filter-btn-ativo').className = `filter-btn ${filterType === 'ativo' ? 'active' : ''}`;
  document.getElementById('filter-btn-desligado').className = `filter-btn ${filterType === 'desligado' ? 'active' : ''}`;
  document.getElementById('filter-btn-todos').className = `filter-btn ${filterType === 'todos' ? 'active' : ''}`;

  loadDatabaseStudentReport();
}

async function loadDatabaseStudentReport() {
  const tbody = document.getElementById('db-students-table-body');
  const alertBox = document.getElementById('alerts-list-box');
  const alertCountBadge = document.getElementById('alert-count-badge');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE_URL}/instrutoria/alunos?status=${currentStudentFilter}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (res.status === 403 || res.status === 401) {
      tbody.innerHTML = `<tr><td colspan="7" style="color: #f87171; text-align: center; padding: 2rem;">⛔ Acesso Proibido (403): Apenas Instrutores credenciados podem visualizar este relatório.</td></tr>`;
      return;
    }

    const data = await res.json();
    if (!data.success || !data.alunos) return;

    const totalModulos = data.total_modulos || 4;

    for (let m = 1; m <= totalModulos; m++) {
      const mInfo = data.conclusao_por_turma?.[`modulo_${m}`];
      const pctEl = document.getElementById(`pct-mod-${m}`);
      const fillEl = document.getElementById(`fill-mod-${m}`);
      const subEl = document.getElementById(`sub-mod-${m}`);

      if (mInfo && pctEl && fillEl && subEl) {
        pctEl.innerText = `${mInfo.porcentagem}%`;
        fillEl.style.width = `${mInfo.porcentagem}%`;
        subEl.innerText = `${mInfo.concluidos} de ${mInfo.total_alunos} Alunos Ativos`;
      }
    }

    if (data.alertas && data.alertas.length > 0) {
      alertCountBadge.innerText = `${data.alertas.length} Alerta(s)`;
      alertBox.innerHTML = data.alertas.map(a => `
        <div style="padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between;">
          <span><strong>${a.nome}</strong> (RE: ${a.re}) - ${a.estacao}</span>
          <span style="color: #f5c23d; font-weight: 800;">⚠️ ${a.motivo}</span>
        </div>
      `).join('');
    } else {
      alertCountBadge.innerText = `0 Alertas`;
      alertBox.innerHTML = `<span style="color: #2a9d68; font-weight: 700;">✅ Nenhuma pendência ou senha provisória pendente na turma de alunos ativos.</span>`;
    }

    if (data.alunos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--color-text-muted); padding: 2rem;">Nenhum aluno encontrado no filtro selecionado (${currentStudentFilter.toUpperCase()}).</td></tr>`;
      return;
    }

    tbody.innerHTML = data.alunos.map(a => {
      const isDesligado = (a.status === 'desligado');
      const isProv = (a.senha_provisoria === 1);
      const modConcluidos = Number(a.modulos_concluidos || 0);
      const pctProgresso = Math.min(100, Math.round((modConcluidos / totalModulos) * 100));

      let statusBadge = '';
      if (isDesligado) {
        statusBadge = `<span style="color: #f87171; background: rgba(185, 28, 28, 0.2); border: 1px solid #f87171; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 800;"><i class="fa-solid fa-user-slash"></i> Desligado (${strDate(a.desligado_em)})</span>`;
      } else if (isProv) {
        statusBadge = `<span style="color: #f5c23d; background: rgba(245, 194, 61, 0.15); border: 1px solid #f5c23d; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 800;"><i class="fa-solid fa-key"></i> Senha Provisória</span>`;
      } else {
        statusBadge = `<span style="color: #2a9d68; background: rgba(42, 157, 104, 0.15); border: 1px solid #2a9d68; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 800;"><i class="fa-solid fa-user-check"></i> Ativo</span>`;
      }

      let btnToggleStatus = isDesligado
        ? `<button class="nav-btn" onclick="reactivateStudent('${a.re}', '${a.nome}')" style="padding: 4px 10px; font-size: 0.78rem; background: rgba(42, 157, 104, 0.2); border-color: #2a9d68; color: #2a9d68;"><i class="fa-solid fa-user-plus"></i> Reativar</button>`
        : `<button class="nav-btn btn-action-soft-delete" onclick="softDeleteStudent('${a.re}', '${a.nome}')" style="padding: 4px 10px; font-size: 0.78rem;"><i class="fa-solid fa-user-minus"></i> Desligar</button>`;

      return `
        <tr style="${isDesligado ? 'opacity: 0.65; background: rgba(185, 28, 28, 0.05);' : ''}">
          <td><strong>${a.nome}</strong></td>
          <td><code>${a.re}</code></td>
          <td>${a.estacao}</td>
          <td>${statusBadge}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 800; color: var(--color-gold-patch);" id="student-progress-ratio-${a.re}">${modConcluidos}/${totalModulos} (${pctProgresso}%)</span>
              <div style="flex: 1; height: 6px; background: var(--color-dark-800); border-radius: 3px; overflow: hidden;">
                <div style="width: ${pctProgresso}%; height: 100%; background: #237bbd;"></div>
              </div>
            </div>
          </td>
          <td><strong style="color: #2a9d68;">${Number(a.media_notas).toFixed(0)} pts</strong></td>
          <td>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${!isDesligado ? `<button class="nav-btn" onclick="resetStudentPassword('${a.re}', '${a.nome}')" style="padding: 4px 8px; font-size: 0.75rem; background: rgba(35, 123, 189, 0.2); border-color: #237bbd; color: var(--color-tactical-blue-light);"><i class="fa-solid fa-key"></i> Reset Senha</button>` : ''}
              ${btnToggleStatus}
              <button class="nav-btn btn-action-hard-delete" onclick="openExcluirModal('${a.re}', '${a.nome}')" style="padding: 4px 8px; font-size: 0.75rem;"><i class="fa-solid fa-trash-can"></i> Excluir Definitivamente</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    console.error("Erro ao carregar relatório:", err);
  }
}

function strDate(dt) {
  if (!dt) return '';
  return String(dt).substring(0, 10);
}

// ------------------------------------------------------------------
// PRÉ-CADASTRO MANUAL DE ALUNO
// ------------------------------------------------------------------
async function handleCadastrarAlunoInstrutoria(event) {
  if (event) event.preventDefault();

  const nome = document.getElementById('cad-nome').value.trim();
  const re = document.getElementById('cad-re').value.trim();
  const estacao = document.getElementById('cad-estacao').value.trim();

  if (!nome || !re || !estacao) {
    alert("Preencha todos os campos do aluno.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: re,
        password: re,
        nome: nome,
        estacao: estacao
      })
    });

    const data = await res.json();
    if (data.success) {
      alert(`✅ Aluno ${nome} (RE: ${re}) cadastrado com sucesso no Banco de Dados!\n\nA senha inicial foi definida como o próprio RE do aluno (${re}).`);
      toggleCadastrarAlunoModal();
      loadDatabaseStudentReport();
    } else {
      alert(`❌ Erro ao cadastrar aluno: ${data.message}`);
    }
  } catch (err) {
    alert("❌ Erro ao conectar ao servidor para cadastrar o aluno.");
  }
}

// ------------------------------------------------------------------
// UPLOAD E LISTAGEM DE ARQUIVOS
// ------------------------------------------------------------------
async function handleFileUpload(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('file', files[i]);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/instrutoria/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Arquivo(s) enviado(s) e salvo(s) com sucesso no disco rígido e registrados no Banco de Dados!");
      loadInstructorFiles();
    } else {
      alert(`❌ Erro no upload: ${data.error || data.message}`);
    }
  } catch (err) {
    alert("❌ Erro de conexão ao enviar o arquivo físico para o servidor.");
  }
}

async function loadInstructorFiles() {
  const container = document.getElementById('instrutoria-files-list');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}/instrutoria/arquivos`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();

    if (!data.success || !data.arquivos) return;

    container.innerHTML = data.arquivos.map(f => {
      const downloadUrl = `${API_BASE_URL}/instrutoria/download?id=${f.id}&token=${authToken}`;
      return `
        <div class="file-item-card">
          <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fa-solid fa-file-pdf" style="font-size: 2rem; color: #f87171;"></i>
            <div>
              <strong style="color: #fff; font-size: 0.95rem; display: block;">${f.nome_original || f.nome_arquivo}</strong>
              <span style="font-size: 0.8rem; color: var(--color-text-muted);">${f.tamanho} &bull; Salvo no Servidor em ${f.data_upload}</span>
            </div>
          </div>
          <a href="${downloadUrl}" target="_blank" class="nav-btn" style="background: rgba(35, 123, 189, 0.2); border-color: var(--color-tactical-blue); color: var(--color-tactical-blue-light); text-decoration: none;">
            <i class="fa-solid fa-download"></i> Abrir / Download PDF
          </a>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error("Erro ao carregar lista de arquivos:", err);
  }
}

// ------------------------------------------------------------------
// SALA DE AULA E QUIZ ANTI-CHEAT COM RANDOMIZAÇÃO DETERMINÍSTICA
// ------------------------------------------------------------------
function loadModule(modId) {
  currentModule = modId;
  currentSlideIndex = 0;

  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  document.getElementById(`btn-mod-${modId}`)?.classList.add('active');

  const mData = modulesData[modId];
  if (!mData) return;

  renderSlide();
  document.getElementById('quiz-card-element')?.classList.add('hidden');
  document.getElementById('slide-card-element')?.classList.remove('hidden');
}

function renderSlide() {
  const mData = modulesData[currentModule];
  const slide = mData.slides[currentSlideIndex];

  document.getElementById('slide-module-tag').innerText = slide.tag;
  document.getElementById('slide-counter').innerText = `Slide ${currentSlideIndex + 1} de ${mData.slides.length}`;
  document.getElementById('slide-title').innerText = slide.title;
  document.getElementById('slide-subtitle').innerText = slide.subtitle;
  document.getElementById('slide-img').src = slide.image;

  const bulletsContainer = document.getElementById('slide-bullets');
  bulletsContainer.innerHTML = `<ul>${slide.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`;

  const btnNext = document.getElementById('btn-slide-next');
  if (currentSlideIndex === mData.slides.length - 1) {
    btnNext.innerHTML = 'Fazer Avaliação do Módulo <i class="fa-solid fa-graduation-cap"></i>';
  } else {
    btnNext.innerHTML = 'Próximo Slide <i class="fa-solid fa-chevron-right"></i>';
  }
}

function setupNavigationEvents() {
  document.getElementById('btn-slide-prev')?.addEventListener('click', () => {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      renderSlide();
    }
  });

  document.getElementById('btn-slide-next')?.addEventListener('click', () => {
    const mData = modulesData[currentModule];
    if (currentSlideIndex < mData.slides.length - 1) {
      currentSlideIndex++;
      renderSlide();
    } else {
      startRandomizedQuiz();
    }
  });

  document.querySelectorAll('.menu-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const modId = parseInt(btn.getAttribute('data-mod'));
      loadModule(modId);
    });
  });

  document.getElementById('btn-submit-quiz')?.addEventListener('click', handleQuizSubmission);
  document.getElementById('btn-header-instrutoria')?.addEventListener('click', () => showScreen('screen-instrutoria'));
  document.getElementById('btn-header-logo')?.addEventListener('click', () => {
    if (currentUser) {
      if (currentRole === 'instrutor' || currentRole === 'admin') showScreen('screen-instrutoria');
      else showScreen('screen-classroom');
    } else {
      showScreen('screen-login');
    }
  });
  document.getElementById('btn-sair-sessao')?.addEventListener('click', logoutSession);

  document.getElementById('tab-btn-aluno')?.addEventListener('click', () => switchLoginTab('aluno'));
  document.getElementById('tab-btn-instrutor')?.addEventListener('click', () => switchLoginTab('instrutor'));

  document.getElementById('btn-toggle-bg-canvas')?.addEventListener('click', () => {
    document.body.classList.toggle('dark-bg-mode');
  });
}

// BUSCAR PROVA EMBARALHADA DETERMINISTICAMENTE NO BACK-END
async function startRandomizedQuiz() {
  document.getElementById('slide-card-element')?.classList.add('hidden');
  const quizCard = document.getElementById('quiz-card-element');
  quizCard?.classList.remove('hidden');

  try {
    const res = await fetch(`${API_BASE_URL}/quiz/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        curso_id: 'salvamento_cordas',
        modulo_id: String(currentModule)
      })
    });

    const data = await res.json();
    if (!data.success || !data.questions || data.questions.length === 0) {
      alert("❌ Erro ao iniciar avaliação no servidor.");
      return;
    }

    currentAttemptId = data.attempt_id;
    const qData = data.questions[0]; // Exibe primeira questão sorteada
    currentQuestionId = qData.question_id;
    selectedOptionId = null;

    document.getElementById('quiz-question-text').innerText = qData.question_text;
    const optsBox = document.getElementById('quiz-options-list');

    optsBox.innerHTML = qData.options.map(op => `
      <button type="button" class="quiz-option-btn" data-option-id="${op.option_id}" onclick="selectQuizOptionById('${op.option_id}', this)">
        ${op.option_text}
      </button>
    `).join('');

  } catch (err) {
    alert("❌ Erro de conexão ao buscar prova no servidor.");
  }
}

function selectQuizOptionById(optId, el) {
  selectedOptionId = optId;
  document.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

// SUBMETER RESPOSTA POR OPTION_ID ESTÁVEL AO SERVIDOR
async function handleQuizSubmission() {
  if (!selectedOptionId || !currentAttemptId || !currentQuestionId) {
    alert("Por favor, selecione uma alternativa.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/quiz/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        attempt_id: currentAttemptId,
        question_id: currentQuestionId,
        chosen_option_id: selectedOptionId
      })
    });

    const data = await res.json();

    if (!data.success) {
      alert(`❌ Erro ao validar avaliação: ${data.message || data.error}`);
      return;
    }

    if (data.correct) {
      alert(data.message || `🎉 Excelente! Resposta correta no Módulo ${currentModule}. Módulo Concluído com Nota 100!`);
      userProgress[currentModule] = true;
      updateCourseProgressBar();

      if (currentModule < 4) {
        loadModule(currentModule + 1);
      } else {
        alert("🏆 PARABÉNS! Você concluiu todos os 4 Módulos de Instrução EAD de Salvamento com Cordas!");
        generateCertificate();
      }
    } else {
      alert(data.message || "❌ Resposta incorreta. Revise o material do módulo e tente novamente.");
    }
  } catch (e) {
    alert("❌ Erro de conexão ao enviar resposta do quiz para validação no servidor.");
  }
}

function updateCourseProgressBar() {
  const completed = Object.values(userProgress).filter(Boolean).length;
  const pct = (completed / 4) * 100;
  
  const fill = document.getElementById('course-progress-bar-fill');
  if (fill) fill.style.width = `${pct}%`;

  const txt = document.getElementById('course-progress-text');
  if (txt) txt.innerText = `${completed} de 4 Módulos Concluídos`;
}

function generateCertificate() {
  if (!currentUser) return;

  const dateStr = new Date().toLocaleDateString('pt-BR');
  const codeHash = 'CB-2GB-' + Math.floor(100000 + Math.random() * 900000);

  document.getElementById('cert-user-name').innerText = currentUser.nome || 'BOMBEIRO MILITAR';
  document.getElementById('cert-user-re').innerText = currentUser.re || 'RE-000000';
  document.getElementById('cert-user-estacao').innerText = currentUser.estacao || '2º GB';
  document.getElementById('cert-date').innerText = dateStr;
  document.getElementById('cert-hash').innerText = codeHash;

  showScreen('screen-certificate');
}

function updateHeaderUserInfo() {
  const headerBtnInstrutoria = document.getElementById('btn-header-instrutoria');
  const sessionInfoHeader = document.getElementById('session-info-header');
  const headerUserRe = document.getElementById('header-user-re');

  if (currentUser) {
    if (sessionInfoHeader) sessionInfoHeader.style.display = 'flex';
    if (headerUserRe) {
      headerUserRe.innerText = `Bem-vindo, ${currentUser.nome || 'Militar'} — ${currentUser.estacao || '2º GB'}`;
    }

    if (currentUser.role === 'instrutor' || currentUser.role === 'admin') {
      if (headerBtnInstrutoria) headerBtnInstrutoria.style.display = 'flex';
    } else {
      if (headerBtnInstrutoria) headerBtnInstrutoria.style.display = 'none';
    }
  } else {
    if (sessionInfoHeader) sessionInfoHeader.style.display = 'none';
    if (headerBtnInstrutoria) headerBtnInstrutoria.style.display = 'none';
  }
}

function checkExistingSession() {
  if (authToken) {
    updateHeaderUserInfo();
  }
}

function logoutSession() {
  authToken = '';
  currentUser = null;
  currentRole = 'aluno';
  localStorage.removeItem('cb_auth_token');
  updateHeaderUserInfo();
  showScreen('screen-login');
}

function toggleCadastrarAlunoModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('cadastrarAlunoModal')?.classList.toggle('hidden');
}

function toggleCalcModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('calcModal')?.classList.toggle('hidden');
}

function calcFQ() {
  const dist = parseFloat(document.getElementById('fq-dist').value) || 0;
  const corda = parseFloat(document.getElementById('fq-corda').value) || 1;
  const fq = dist / corda;
  
  document.getElementById('val-fq').innerText = fq.toFixed(2);
  const st = document.getElementById('st-fq');
  
  if (fq < 1) {
    st.innerText = "Seguro (FQ < 1.0)";
    st.style.color = "#2a9d68";
  } else if (fq === 1) {
    st.innerText = "Atenção (FQ = 1.0)";
    st.style.color = "#f5c23d";
  } else {
    st.innerText = "CRÍTICO! Risco de Ruptura (FQ > 1.0)";
    st.style.color = "#f87171";
  }
}

function calcY() {
  const peso = parseFloat(document.getElementById('y-peso').value) || 0;
  const ang = parseInt(document.getElementById('y-ang').value) || 0;
  document.getElementById('y-ang-val').innerText = `${ang}°`;

  const rad = (ang / 2) * (Math.PI / 180);
  const cargaPonto = (peso / 2) / Math.cos(rad);

  document.getElementById('val-y').innerText = `${Math.round(cargaPonto)} kgf`;
  const st = document.getElementById('st-y');

  if (ang <= 60) {
    st.innerText = "Ângulo Recomendado (≤ 60°)";
    st.style.color = "#2a9d68";
  } else if (ang <= 90) {
    st.innerText = "Atenção (60° a 90°)";
    st.style.color = "#f5c23d";
  } else {
    st.innerText = "PERIGO! Sobrecarga Crítica (> 90°)";
    st.style.color = "#f87171";
  }
}
