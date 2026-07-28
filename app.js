// ==========================================================================
// Lógica Front-End SPA - Portal 2º GB CBMESP
// Autenticação Simplificada (RE e Senha) & RBAC Seguro no Back-End
// Engine Anti-Cheat de Quiz: Randomização Determinística por Candidato
// ==========================================================================

const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? `${window.location.protocol}//${window.location.hostname}:8082/api`
  : `${window.location.origin}/api`;

// Dados Visuais dos Módulos (Imagens Fotorrealistas de Alta Fidelidade Técnica por Estação)
const modulesData = {
  1: {
    title: "Estação 1: Trabalhador Suspenso & Trauma de Suspensão",
    subtitle: "Atendimento Pré-Hospitalar (PHTLS) e Doutrina Técnica no Resgate de Suspenso Inerte",
    slides: [
      {
        tag: "ESTAÇÃO 1 - SLIDE 1 DE 3",
        title: "Fisiopatologia da Suspensão Inerte & Fita de Alívio",
        subtitle: "Prevenção da estagnação venosa e choque por sequestro venoso.",
        image: "images/aph_mod1_suspensao_inerte.png",
        bullets: [
          "<strong>Síndrome da Suspensão Inerte:</strong> O aprisionamento venoso nas extremidades inferiores reduz o retorno venoso e o débito cardíaco.",
          "<strong>Janela Crítica de Atuação:</strong> Sintomas de pré-síncope e perda de consciência ocorrem entre 5 e 15 minutos de imobilidade.",
          "<strong>Uso Obrigatório da Fita de Alívio (Pedaleira):</strong> Permite a contração da musculatura das pernas, bombeando o sangue de volta ao coração.",
          "<strong>Checklist de Segurança:</strong> Inspeção prévia do cinto paraquedista, fitas, mosquetões de aço/alumínio e linha de vida belay."
        ]
      },
      {
        tag: "ESTAÇÃO 1 - SLIDE 2 DE 3",
        title: "Protocolo PHTLS de Desmobilização Pós-Resgate",
        subtitle: "Manejo da síndrome do refluxo venoso e prevenção da parada cardíaca súbita.",
        image: "images/aph_mod1_posicao_semissentada.png",
        bullets: [
          "<strong>Atenção Crítica no Solo:</strong> NUNCA deitar a vítima abruptamente em decúbito dorsal plano logo após a retirada do cinto.",
          "<strong>Posição Semissentada (30° a 45°):</strong> Manter o tronco elevado inicialmente para evitar a sobrecarga aguda do ventrículo direito.",
          "<strong>Monitoramento de Sinais Vitais:</strong> Avaliação contínua da pressão arterial, oximetria de pulso e padrão ventilatório.",
          "<strong>Oxigenoterapia de Alto Fluxo:</strong> Oferecer suporte ventilatório com máscara de reservatório conforme indicação do PHTLS."
        ]
      },
      {
        tag: "ESTAÇÃO 1 - SLIDE 3 DE 3",
        title: "Doutrina de Dupla Proteção & Comunicação Tática",
        subtitle: "Redundância estrutural e coordenação da equipe de resgate.",
        image: "images/sc_mod1_dupla_protecao.png",
        bullets: [
          "<strong>Dupla Proteção (Redundância):</strong> Operador e vítima devem estar ancorados em duas linhas independentes (Trabalho + Back-up).",
          "<strong>Padronização de Comandos:</strong> Utilização rigorosa dos comandos de voz: 'Mesa', 'Corda', 'Atenção', 'Livre'.",
          "<strong>Checklist Cruzado (Buddy Check):</strong> Verificação dupla de mosquetões rosqueados e arremates de segurança antes do descenso."
        ]
      }
    ]
  },
  2: {
    title: "Estação 2: Poço & Espaço Confinado",
    subtitle: "Atendimento Pré-Hospitalar em Ambientes de Risco Atmosférico e Acesso Vertical",
    slides: [
      {
        tag: "ESTAÇÃO 2 - SLIDE 1 DE 3",
        title: "Avaliação Atmosférica & Suporte Aéreo PHTLS",
        subtitle: "Segurança de cena em poços e ambientes com deficiência de oxigênio.",
        image: "images/aph_mod2_atendimento_confinado.png",
        bullets: [
          "<strong>Monitoramento Multigás:</strong> Verificação obrigatória de O₂, CO e H₂S antes da entrada do socorrista de APH.",
          "<strong>Proteção Respiratória (SCBA / Ar Mandado):</strong> Uso de equipamento autônomo quando houver risco de contaminação atmosférica.",
          "<strong>Gerenciamento de Via Aérea:</strong> Manutenção da permeabilidade com cânula orofaríngea e colar cervical de resgate.",
          "<strong>Iluminação Tática:</strong> Emprego de lanternas intrinsecamente seguras (à prova de explosão)."
        ]
      },
      {
        tag: "ESTAÇÃO 2 - SLIDE 2 DE 3",
        title: "Imobilização Vertical com KED & Prancha Curta",
        subtitle: "Estabilização e extração de vítima em geometria restrita.",
        image: "images/aph_mod2_ked_poco.png",
        bullets: [
          "<strong>Aplicação do Colete KED:</strong> Fixação sequencial (tórax, abdômen, virilha e cabeça) para rigidez espinhal no eixo vertical.",
          "<strong>Alinhamento Neutro no Poço:</strong> Manter a cabeça estabilizada sem flexão ou extensão durante o içamento vertical.",
          "<strong>Linha de Vida no Colete:</strong> Ancoragem de segurança dedicada no ponto dorsal do cinto/colete de extração.",
          "<strong>Comunicação por Rádio ou Sinal de Corda:</strong> Padronização do içamento milimétrico para evitar choques nas paredes do poço."
        ]
      },
      {
        tag: "ESTAÇÃO 2 - SLIDE 3 DE 3",
        title: "Nós de Conexão & Autoblocantes para Poço",
        subtitle: "Segurança de subida e retenção de carga.",
        image: "images/sc_mod2_nos_friccionantes.png",
        bullets: [
          "<strong>Nó Prusik & Machard:</strong> Blocagem bidirecional e unidirecional para trava de segurança em sistemas de poço.",
          "<strong>Pescador Duplo:</strong> União definitiva de anéis de cordinete de 6mm a 7mm sobre cordas de 10.5mm ou 11mm.",
          "<strong>Regra dos Diâmetros:</strong> Cordinete friccionante deve ter de 60% a 70% do diâmetro da corda principal."
        ]
      }
    ]
  },
  3: {
    title: "Estação 3: Estrutura Elevada",
    subtitle: "Atendimento de Trauma por Queda de Altura e Operações em Plataformas",
    slides: [
      {
        tag: "ESTAÇÃO 3 - SLIDE 1 DE 3",
        title: "Avaliação Primária XABCDE PHTLS em Altura",
        subtitle: "Abordagem rápida e controle de hemorragias em locais elevados.",
        image: "images/aph_mod3_xabcde_altura.png",
        bullets: [
          "<strong>Passo X (Hemorragia Exsangüinante):</strong> Aplicação imediata de torniquete tático ou curativo compressivo antes do transporte.",
          "<strong>Passo A (Via Aérea + Cervical):</strong> Estabilização manual da coluna cervical e abertura de via aérea sem hiperextensão.",
          "<strong>Passo B (Ventilação) & C (Circulação):</strong> Avaliação de expansibilidade torácica e perfusão periférica no local elevado.",
          "<strong>Ancoragem da Vítima:</strong> Conectar a vítima à estrutura com fita de ancoragem dedicada durante o atendimento."
        ]
      },
      {
        tag: "ESTAÇÃO 3 - SLIDE 2 DE 3",
        title: "Segurança e Ancoragem Dupla do Socorrista",
        subtitle: "Protocolo de atendimento médico com proteção total contra quedas.",
        image: "images/aph_mod3_seguranca_socorrista.png",
        bullets: [
          "<strong>Dupla Ancoragem do Socorrista:</strong> O socorrista de APH deve manter talabarte duplo com absorvedor de energia conectado a pontos estruturais.",
          "<strong>Posicionamento de Trabalho:</strong> Uso de talabarte de posicionamento para manter as mãos livres durante os procedimentos de APH.",
          "<strong>Gerenciamento de Materiais:</strong> Todos os equipamentos médicos (bolsas, colares, ambu) devem estar presos por fiel para evitar quedas.",
          "<strong>Zona de Exclusão no Solo:</strong> Isolamento da área abaixo da estrutura contra queda de objetos."
        ]
      },
      {
        tag: "ESTAÇÃO 3 - SLIDE 3 DE 3",
        title: "Ancoragens Equalizadas em Y & Limites de Ângulo",
        subtitle: "Distribuição técnica de forças em pontos elevados.",
        image: "images/sc_mod3_ancoragem_y.png",
        bullets: [
          "<strong>Equalização Autoadaptável:</strong> Distribuição de carga uniforme entre dois ou mais pontos estruturais.",
          "<strong>Regra dos Ângulos no Y:</strong> Ângulo a 60° (58% por ponto), 90° (71% por ponto), 120° (100% por ponto - Limite Crítico!).",
          "<strong>Pontos Bombeiros Comprovados:</strong> Fixação apenas em vigas I, colunas de concreto armado e olhais certificados."
        ]
      }
    ]
  },
  4: {
    title: "Estação 4: Movimentação Operacional de Vítima",
    subtitle: "Manejo em Maca Sked Envelopada, RMC PHTLS 10ª Ed e Desmultiplicação Z-Rig",
    slides: [
      {
        tag: "ESTAÇÃO 4 - SLIDE 1 DE 3",
        title: "Maca Sked Envelopada & Imobilização Operacional",
        subtitle: "Empacotamento rígido para transposição vertical e horizontal.",
        image: "images/aph_mod4_maca_sked_envelopamento.png",
        bullets: [
          "<strong>Envelopamento Rígido:</strong> Passagem das tirantes fiveladas em ilhós cruzados garantindo rigidez estrutural completa.",
          "<strong>Fixação dos Pés e Cabeça:</strong> Uso de blocos imobilizadores laterais e tirantes de pé para evitar deslocamento interno.",
          "<strong>Tirantes de Içamento:</strong> Instalação de aranha de suspensão ajustável para alteração do ângulo (horizontal/vertical).",
          "<strong>Protetor de Corda e Cordoalha:</strong> Verificação dos pontos de fricção com a borda antes de autorizar o içamento."
        ]
      },
      {
        tag: "ESTAÇÃO 4 - SLIDE 2 DE 3",
        title: "Restrição de Movimentos da Coluna (RMC / PHTLS 10ª Ed)",
        subtitle: "Diretrizes atualizadas para controle espinhal e prevenção de hipotermia.",
        image: "images/aph_mod4_rmc_phtls.png",
        bullets: [
          "<strong>Indicação Seletiva de RMC:</strong> Aplicação rigorosa em pacientes com dor palpal, déficit neurológico ou mecanismo de trauma grave.",
          "<strong>Rolamento em Bloco (4 Socorristas):</strong> Movimentação coordenada sob comando do socorrista da cabeça (via aérea).",
          "<strong>Prevenção Ativa da Hipotermia:</strong> Envelopamento da vítima com manta térmica aluminizada antes de fechar a maca Sked.",
          "<strong>Monitoramento Continuado:</strong> Reavaliação neurovascular periférica após o fechamento das tirantes da maca."
        ]
      },
      {
        tag: "ESTAÇÃO 4 - SLIDE 3 DE 3",
        title: "Desmultiplicação de Força Z-Rig 3:1 & Trava de Segurança",
        subtitle: "Vantagem mecânica com retenção automatizada de carga.",
        image: "images/sc_mod3_z_rig_31.png",
        bullets: [
          "<strong>Sistema Z-Rig 3:1:</strong> Utiliza 1 polia móvel na carga e 1 polia fixa na ancoragem, reduzindo o esforço a 1/3 teórico.",
          "<strong>Trava de Captura (Capture Cam):</strong> Nó autoblocante ou blocador mecânico na polia fixa para retenção imediata.",
          "<strong>Rendimento Real vs Teórico:</strong> Atrito das polias e cordas reduz a vantagem mecânica real para aproximadamente 2.5:1."
        ]
      }
    ]
  },
  5: {
    title: "Estação 5: Barranco & Terreno Inclinado",
    subtitle: "Atendimento Pré-Hospitalar e Transposição em Encostas e Despenhadeiros",
    slides: [
      {
        tag: "ESTAÇÃO 5 - SLIDE 1 DE 3",
        title: "Imobilização em Prancha Longa com Tirante Aranha",
        subtitle: "Estabilização firme em superfícies irregulares e declives.",
        image: "images/aph_mod5_prancha_barranco.png",
        bullets: [
          "<strong>Tirante Tipo Aranha:</strong> Ancoragem de 10 pontos para impedir o deslizamento da vítima durante a inclinação em barrancos.",
          "<strong>Estabilização do Rolamento Secundário:</strong> Uso de estacas e anéis de ancoragem para fixar a prancha antes do tracionamento.",
          "<strong>Proteção contra Escombros e Vegetação:</strong> Uso de óculos de proteção e manta de lona sobre o paciente.",
          "<strong>Avaliação de Choque Hipovolêmico:</strong> Controle estrito de temperatura e pulso em ambientes úmidos/frios."
        ]
      },
      {
        tag: "ESTAÇÃO 5 - SLIDE 2 DE 3",
        title: "Içamento em Rampa com Socorrista Acompanhante",
        subtitle: "Suporte de APH continuado durante a subida da prancha/maca.",
        image: "images/aph_mod5_transposicao_rampa.png",
        bullets: [
          "<strong>Socorrista Acompanhante:</strong> Conectado ao sistema de içamento ao lado da maca para guiar e manter a via aérea alinhada.",
          "<strong>Linha de Tração Secundária:</strong> Sistema 3:1 ou Vector 5:1 tracionando a maca com linha belay redundante.",
          "<strong>Gerenciamento de Esforço Físico:</strong> Revezamento dos puxadores no topo da rampa para evitar fadiga muscular da equipe.",
          "<strong>Comunicação de Subida:</strong> Sinalização clara para pausar o tracionamento caso a vítima apresente vômito ou instabilidade."
        ]
      },
      {
        tag: "ESTAÇÃO 5 - SLIDE 3 DE 3",
        title: "Sistemas Compostos Vector 5:1 & Proteção de Borda",
        subtitle: "Multiplicação avançada para elevação pesada em encostas.",
        image: "images/sc_mod3_vector_51.png",
        bullets: [
          "<strong>Sistema 5:1 Composto:</strong> Combinação de um sistema 3:1 tracionando um 2:1 secundário para resgates em pirambeiras pesadas.",
          "<strong>Polias de Placa Oscilante:</strong> Eficiência superior e menor atrito durante o tracionamento continuado.",
          "<strong>Protetor Articulado de Calha/Quina:</strong> Proteção da corda contra quinas vivas de pedras e concreto."
        ]
      }
    ]
  },
  6: {
    title: "Estação 6: Escadas & Tripés Operacionais",
    subtitle: "Extração Vertical com Tripé de Resgate, Escada Prolongável e Pick-Off Tático",
    slides: [
      {
        tag: "ESTAÇÃO 6 - SLIDE 1 DE 3",
        title: "Extração Vertical com Tripé Operacional & Suporte Cervical",
        subtitle: "Pontos de ancoragem altos para passagem limpa de maca e socorrista.",
        image: "images/aph_mod6_tripe_resgate_aph.png",
        bullets: [
          "<strong>Vantagem do Ponto Alto (Tripé):</strong> Eleva a polia acima da borda, facilitando a transposição vertical do paciente imobilizado.",
          "<strong>Suporte Cervical Continuado:</strong> Manutenção do alinhamento manual da coluna durante todo o içamento pela cabeça.",
          "<strong>Tirantes de Pernas do Tripé:</strong> Verificação das correntes/fitas de limitação das pernas do tripé para evitar abertura.",
          "<strong>Linha Belay no Tripé:</strong> Passagem da linha de vida independente por segunda polia no cabeçote do tripé."
        ]
      },
      {
        tag: "ESTAÇÃO 6 - SLIDE 2 DE 3",
        title: "Transposição de Borda & Escada Prolongável",
        subtitle: "Descenso e içamento técnico através de estruturas de escada.",
        image: "images/aph_mod6_escada_extracao.png",
        bullets: [
          "<strong>Escada Guiada / Prolongável:</strong> Utilização da escada como trilho de deslizamento suave para a maca cesto/Sked.",
          "<strong>Controle de Centro de Gravidade:</strong> Socorristas projetam o corpo para fora da borda mantendo base firme nas travessas.",
          "<strong>Passagem de Nó sob Tensão:</strong> Transferência de carga da linha principal para nó autoblocante secundário se necessário.",
          "<strong>Arremate de Chegada no Solo:</strong> Transferência imediata do paciente para a ambulância de suporte avançado (USA)."
        ]
      },
      {
        tag: "ESTAÇÃO 6 - SLIDE 3 DE 3",
        title: "Manobra de Resgate Pick-Off Tático (Desenganche)",
        subtitle: "Retirada de vítima suspensa por talabarte ou cinto rompido.",
        image: "images/sc_mod4_pick_off.png",
        bullets: [
          "<strong>Conexão Direta à Vítima:</strong> Transferência da carga da vítima para o cinto do resgatador por fita ajustável.",
          "<strong>Alívio da Tensão Presa:</strong> Uso de mini-sistema ou pedaleira para aliviar a tensão do talabarte da vítima antes de soltá-lo.",
          "<strong>Descenso Duplo Controlado:</strong> Descer com a vítima acoplada usando descensor autofrenante com controle de velocidade."
        ]
      }
    ]
  },
  final: {
    title: "Exame de Certificação: Prova Final (20 Questões)",
    subtitle: "Avaliação teórica integradora abrangendo as 6 Estações de Resgate e Protocolo PHTLS 10ª Edição",
    slides: [
      {
        tag: "EXAME DE CERTIFICAÇÃO - 20 QUESTÕES",
        title: "Prova Final de Salvamento com Cordas & APH",
        subtitle: "Avaliação abrangente para emissão do Certificado Oficial do 2º GB.",
        image: "images/logo_salvamento_2gb.png",
        bullets: [
          "<strong>Estrutura do Exame:</strong> 20 questões de múltipla escolha abarcando o conteúdo técnico e de APH das 6 estações.",
          "<strong>Critério de Aprovação:</strong> Aproveitamento mínimo de 70% de acertos para liberação do Certificado Oficial.",
          "<strong>Navegação Interativa:</strong> Responda às 20 questões sequencialmente navegando pelos botões de Questão Anterior e Próxima.",
          "<strong>Emissão de Certificado:</strong> Após a conclusão com sucesso, seu certificado com autenticidade em banco de dados será liberado instantaneamente."
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
let userProgress = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, final: false };

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
    localStorage.setItem('cb_user_data', JSON.stringify(currentUser));

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
      localStorage.setItem('cb_user_data', JSON.stringify(currentUser));
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

let currentQuizQuestions = [];
let currentQuizIndex = 0;
let quizAnswersMap = {};

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
    currentQuizQuestions = data.questions;
    currentQuizIndex = 0;
    quizAnswersMap = {};

    renderQuizQuestionState();

  } catch (err) {
    alert("❌ Erro de conexão ao buscar prova no servidor.");
  }
}

function renderQuizQuestionState() {
  const qData = currentQuizQuestions[currentQuizIndex];
  if (!qData) return;

  currentQuestionId = qData.question_id;
  selectedOptionId = quizAnswersMap[currentQuestionId] || null;

  const isFinalExam = (currentModule === 'final');
  const totalQ = currentQuizQuestions.length;

  const counterEl = document.getElementById('quiz-question-counter');
  const titleBadge = document.getElementById('quiz-title-badge');

  if (isFinalExam || totalQ > 1) {
    if (counterEl) {
      counterEl.style.display = 'inline-block';
      counterEl.innerText = `Questão ${currentQuizIndex + 1} de ${totalQ}`;
    }
    if (titleBadge) {
      titleBadge.innerHTML = `<i class="fa-solid fa-trophy"></i> Prova Final (20 Questões)`;
    }
  } else {
    if (counterEl) counterEl.style.display = 'none';
    if (titleBadge) titleBadge.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Avaliação do Módulo`;
  }

  document.getElementById('quiz-question-text').innerText = qData.question_text;
  const optsBox = document.getElementById('quiz-options-list');

  optsBox.innerHTML = qData.options.map(op => {
    const isSel = (op.option_id === selectedOptionId) ? 'selected' : '';
    return `
      <button type="button" class="quiz-option-btn ${isSel}" data-option-id="${op.option_id}" onclick="selectQuizOptionById('${op.option_id}', this)">
        ${op.option_text}
      </button>
    `;
  }).join('');

  const btnPrev = document.getElementById('btn-quiz-prev-q');
  const btnNext = document.getElementById('btn-quiz-next-q');
  const btnSubmit = document.getElementById('btn-submit-quiz');

  if (totalQ > 1) {
    if (btnPrev) btnPrev.style.display = (currentQuizIndex > 0) ? 'inline-flex' : 'none';
    if (btnNext) btnNext.style.display = (currentQuizIndex < totalQ - 1) ? 'inline-flex' : 'none';

    if (btnSubmit) {
      if (currentQuizIndex === totalQ - 1) {
        btnSubmit.innerHTML = 'Finalizar Prova & Enviar Respostas <i class="fa-solid fa-paper-plane"></i>';
        btnSubmit.style.display = 'inline-flex';
      } else {
        btnSubmit.style.display = 'none';
      }
    }
  } else {
    if (btnPrev) btnPrev.style.display = 'none';
    if (btnNext) btnNext.style.display = 'none';
    if (btnSubmit) {
      btnSubmit.style.display = 'inline-flex';
      btnSubmit.innerHTML = 'Submeter Resposta da Avaliação <i class="fa-solid fa-paper-plane"></i>';
    }
  }
}

function navigateQuizQuestion(direction) {
  const newIndex = currentQuizIndex + direction;
  if (newIndex >= 0 && newIndex < currentQuizQuestions.length) {
    currentQuizIndex = newIndex;
    renderQuizQuestionState();
  }
}

function selectQuizOptionById(optId, el) {
  selectedOptionId = optId;
  quizAnswersMap[currentQuestionId] = optId;
  document.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

// SUBMETER RESPOSTA DA AVALIAÇÃO / PROVA FINAL AO SERVIDOR
async function handleQuizSubmission() {
  const totalQ = currentQuizQuestions.length;

  if (totalQ > 1) {
    // Validar se todas as questões da Prova Final foram respondidas
    for (let i = 0; i < totalQ; i++) {
      const qid = currentQuizQuestions[i].question_id;
      if (!quizAnswersMap[qid]) {
        alert(`⚠️ Por favor, responda à Questão ${i + 1} antes de finalizar a Prova Final.`);
        currentQuizIndex = i;
        renderQuizQuestionState();
        return;
      }
    }
  } else if (!selectedOptionId) {
    alert("Por favor, selecione uma alternativa.");
    return;
  }

  try {
    if (totalQ === 1) {
      const res = await fetch(`${API_BASE_URL}/aluno/progresso`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          modulo_id: String(currentModule),
          chosen_option_id: selectedOptionId
        })
      });

      const data = await res.json();
      if (!data.success) {
        alert(`❌ Erro ao validar avaliação: ${data.message || data.error}`);
        return;
      }

      if (data.correct || data.acertou) {
        alert(data.message || `🎉 Excelente! Resposta correta no Módulo ${currentModule}. Módulo Concluído com Nota 100!`);
        userProgress[currentModule] = true;
        updateCourseProgressBar();

        if (typeof currentModule === 'number' && currentModule < 6) {
          loadModule(currentModule + 1);
        } else {
          loadModule('final');
        }
      } else {
        alert(data.message || "❌ Resposta incorreta. Revise o material do módulo e tente novamente.");
      }
    } else {
      // Submeter todas as 20 respostas da Prova Final
      let correctCount = 0;
      for (let i = 0; i < totalQ; i++) {
        const qData = currentQuizQuestions[i];
        const chosenOpt = quizAnswersMap[qData.question_id];

        const res = await fetch(`${API_BASE_URL}/quiz/answer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            attempt_id: currentAttemptId,
            question_id: qData.question_id,
            chosen_option_id: chosenOpt
          })
        });

        const ansData = await res.json();
        if (ansData.correct) correctCount++;
      }

      const scorePct = Math.round((correctCount / totalQ) * 100);

      if (scorePct >= 70) {
        alert(`🏆 PARABÉNS! Você foi APROVADO na Prova Final com ${scorePct}% de acertos (${correctCount} de ${totalQ} questões)!\n\nSeu Certificado Oficial do 2º GB CBMESP foi liberado com sucesso!`);
        userProgress['final'] = true;
        updateCourseProgressBar();
        generateCertificate();
      } else {
        alert(`⚠️ Você obteve ${scorePct}% de acertos (${correctCount} de ${totalQ} questões).\n\nO aproveitamento mínimo necessário é de 70%. Revise o conteúdo das 6 estações e tente novamente.`);
      }
    }
  } catch (e) {
    alert("❌ Erro de conexão ao enviar respostas da prova para o servidor.");
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
  const savedToken = localStorage.getItem('cb_auth_token');
  const savedUser = localStorage.getItem('cb_user_data');

  if (savedToken && savedUser) {
    try {
      authToken = savedToken;
      currentUser = JSON.parse(savedUser);
      currentRole = currentUser.role || 'aluno';

      updateHeaderUserInfo();

      if (currentUser.senha_provisoria === 1) {
        showScreen('screen-reset-password');
      } else if (currentRole === 'instrutor' || currentRole === 'admin') {
        showScreen('screen-instrutoria');
      } else {
        loadModule(1);
        showScreen('screen-classroom');
      }
    } catch (e) {
      logoutSession();
    }
  }
}

function logoutSession() {
  authToken = '';
  currentUser = null;
  currentRole = 'aluno';
  localStorage.removeItem('cb_auth_token');
  localStorage.removeItem('cb_user_data');
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
