// ==========================================================================
// Lógica Front-End SPA - Portal 2º GB CBMESP
// Autenticação Simplificada (RE e Senha) & RBAC Seguro no Back-End
// Engine Anti-Cheat de Quiz: Randomização Determinística por Candidato
// ==========================================================================

const API_BASE_URL = '/api';

// Dados Visuais dos Módulos (Imagens Fotorrealistas de Alta Fidelidade Técnica por Estação)
const modulesData = {
  1: {
    title: "Estação 1: Trabalhador Suspenso & Trauma de Suspensão",
    subtitle: "Atendimento Pré-Hospitalar (PHTLS) e Doutrina Técnica no Resgate de Suspenso Inerte",
    youtubeId: "qzvVESMHxXs",
    semana: 1,
    ordem: 1,
    icon: "fa-person-falling",
    menuLabel: "Estação 1",
    menuSubtext: "Trabalhador Suspenso",
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
    youtubeId: "aQD-0JYT1Ok",
    semana: 1,
    ordem: 2,
    icon: "fa-circle-notch",
    menuLabel: "Estação 2",
    menuSubtext: "Poço & Confinado",
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
    youtubeId: "kACDQnv6Cfo",
    semana: 1,
    ordem: 3,
    icon: "fa-building-user",
    menuLabel: "Estação 3",
    menuSubtext: "Estrutura Elevada",
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
    youtubeId: "1UFhbFW0GRs",
    semana: 1,
    ordem: 4,
    icon: "fa-truck-medical",
    menuLabel: "Estação 4",
    menuSubtext: "Movimentação Vítima",
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
    youtubeId: "6eC2oqs43pQ",
    semana: 1,
    ordem: 5,
    icon: "fa-mountain",
    menuLabel: "Estação 5",
    menuSubtext: "Barranco & Terreno",
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
    youtubeId: "KUlGl2laKwc",
    semana: 1,
    ordem: 6,
    icon: "fa-xmark",
    menuLabel: "Estação 6",
    menuSubtext: "Escadas & Tripés",
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
  7: {
    title: "Estação 7: Vantagem Mecânica (Estendido & Reduzido)",
    subtitle: "Cálculo de Redução de Forças, Atrito e Sistemas de Tração em Altura",
    semana: 2,
    ordem: 1,
    icon: "fa-gears",
    menuLabel: "Estação 7",
    menuSubtext: "Vantagem Mecânica",
    slides: [
      {
        tag: "ESTAÇÃO 7 - SLIDE 1 DE 3",
        title: "Z-Rig 3:1 Reduzido & Captura de Progresso",
        subtitle: "Vantagem mecânica ímpar com ancoragem móvel.",
        image: "images/sc_mod7_zrig_31.png",
        youtubeId: "d87adXQN_0I",
        bullets: [
          "<strong>Sistema Z-Rig 3:1:</strong> Sistema ímpar reduzido que utiliza 1 polia móvel acoplada à corda principal por um bloqueador móvel (carga) e 1 polia fixa na ancoragem, reduzindo o esforço a 1/3 teórico.",
          "<strong>Captura de Progresso:</strong> Antirretorno feito no ponto de ancoragem usando polia PMP (base chata) combinada com cordinete Prusik (mín. 3 voltas). Tandem Prusik obrigatório para peso > 1 pessoa.",
          "<strong>Tracionamento com Descensor:</strong> Emprego de Petzl I'D dispensa captura de progresso por ter autofrenagem. Modelos pré-2019 exigem alavanca em 'belay' ao puxar e 'lock' após travar.",
          "<strong>Operação sem Luvas:</strong> De acordo com a doutrina, o tracionamento direto da vantagem mecânica é realizado sem o uso de luvas para manter sensibilidade tátil e evitar aprisionamentos."
        ]
      },
      {
        tag: "ESTAÇÃO 7 - SLIDE 2 DE 3",
        title: "Sistemas Estendidos vs Reduzidos",
        subtitle: "Análise doutrinária de rendimento prático e volume de corda.",
        image: "images/sc_mod7_extended.png",
        youtubeId: "omA6VkaUFBM",
        bullets: [
          "<strong>Sistemas Reduzidos:</strong> Acoplados à corda de tração principal por bloqueador mecânico ou cordinete Prusik. Otimizam cabo, pois o sistema mecânico não acompanha toda a extensão do percurso.",
          "<strong>Sistemas Estendidos:</strong> Montados diretamente de ponta a ponta na corda principal. Exigem alta metragem de corda (ex: 150m de cabo seriam necessários para subir 30m de desnível em um 5:1 estendido).",
          "<strong>Polia Fixa na Carga:</strong> Nos sistemas estendidos, a fixação se estende por todo o curso da corda, limitando a mobilidade tátil operacional se comparado aos sistemas reduzidos.",
          "<strong>Fator de Atrito Real:</strong> O acréscimo de polias e conectores gera atrito que reduz a vantagem nominal teórica. Polias de alta eficiência são vitais em sistemas estendidos."
        ]
      },
      {
        tag: "ESTAÇÃO 7 - SLIDE 3 DE 3",
        title: "Vector 5:1 Reduzido & Efeito Polia",
        subtitle: "Vantagem mecânica advanced e física aplicada nas ancoragens.",
        image: "images/sc_mod3_vector_51.png",
        bullets: [
          "<strong>Efeito Polia na Ancoragem:</strong> A polia fixa na ancoragem sofre o efeito da ação e reação, resultando em tração de 2T (carga + força de puxada do operador = dobro do peso no ponto fixo).",
          "<strong>Z-Rig e Vector 5:1:</strong> Sistemas com bloqueadores móveis na linha principal reduzem expressivamente a carga teórica no puxador.",
          "<strong>Vector 5:1 Composto:</strong> Combinação de um sistema 3:1 que traciona o cabo de manobra de um 2:1 secundário para ganho mecânico de alto rendimento.",
          "<strong>Proteção de Quinas e Desvios:</strong> Uso de protetor articulado de calha ou quina viva para evitar danos por abrasão e corte de cordas sob tensão de 2T ou superior."
        ]
      }
    ]
  },
  final: {
    title: "Prova: Semana 1 (20 Questões)",
    subtitle: "Avaliação teórica integradora abrangendo as Estações de Resgate 1 a 6 e Protocolo PHTLS",
    semana: 1,
    ordem: 7,
    icon: "fa-trophy",
    menuLabel: "PROVA SEMANA 1",
    menuSubtext: "20 Questões (Avaliação)",
    isExam: true,
    slides: [
      {
        tag: "AVALIAÇÃO SEMANA 1 - 20 QUESTÕES",
        title: "Prova da 1ª Semana (Salvamento & APH)",
        subtitle: "Avaliação abrangente abrangendo Estações 1 a 6 e Atendimento de APH",
        image: "images/logo_salvamento_2gb.png",
        bullets: [
          "<strong>Estrutura do Exame:</strong> 20 questões de múltipla escolha abarcando o conteúdo técnico e de APH das Estações 1 a 6.",
          "<strong>Critério de Aprovação:</strong> Aproveitamento mínimo de 70% de acertos para liberação do conteúdo da Semana 2.",
          "<strong>Navegação Interativa:</strong> Responda às 20 questões sequencialmente navegando pelos botões de Questão Anterior e Próxima.",
          "<strong>Sequência do Curso:</strong> Após aprovação, as instruções da Semana 2 estarão liberadas."
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
let userProgress = {};

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
  } else if (screenId === 'screen-classroom') {
    fetchStudentProgressAndRender();
  }

  updateHeaderUserInfo();
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
    currentRole = data.user.role;
    localStorage.setItem('cb_user_data', JSON.stringify(currentUser));

    if (data.progresso) {
      applyStudentProgress(data.progresso);
    }

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

  loadErrorQuestionsReport();

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

    // Renderizar Seção de Alunos que Precisam de Atenção / Ritmo
    const attentionBox = document.getElementById('attention-students-list');
    const attentionSummaryBadge = document.getElementById('attention-summary-badge');
    const pacingExpectedBadge = document.getElementById('pacing-expected-badge');
    const alertasAtencao = data.alertas_atencao || [];
    const resumoAtencao = data.resumo_atencao || {};

    if (pacingExpectedBadge) {
      pacingExpectedBadge.innerText = `${resumoAtencao.ritmo_esperado_hoje || 0} de ${totalModulos} Módulos Concluídos`;
    }

    if (attentionSummaryBadge) {
      const tot = resumoAtencao.total_precisam_atencao || 0;
      attentionSummaryBadge.innerText = `${tot} Aluno${tot !== 1 ? 's' : ''} Requerem Atenção`;
    }

    if (attentionBox) {
      if (alertasAtencao.length === 0) {
        attentionBox.innerHTML = `<span style="color: #4ade80; font-weight: 700; font-size: 0.85rem;"><i class="fa-solid fa-circle-check"></i> Excelente! 100% dos alunos da turma estão em dia com o ritmo esperado de estudos.</span>`;
      } else {
        attentionBox.innerHTML = alertasAtencao.map(a => {
          const modConc = Number(a.modulos_concluidos || 0);
          const modEsp = Number(a.modulos_esperados || 0);
          const isNaoIniciado = a.status_ritmo === 'nao_iniciado';
          
          const tagBg = isNaoIniciado ? 'background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #f87171;' : 'background: rgba(245, 194, 61, 0.15); border: 1px solid #f5c23d; color: #f5c23d;';
          const iconStr = isNaoIniciado ? '<i class="fa-solid fa-user-xmark"></i> Não iniciado' : '<i class="fa-solid fa-clock"></i> Atrasado';
          const descMsg = isNaoIniciado 
            ? 'Nenhum módulo concluído no portal.' 
            : `Concluiu <strong>${modConc}</strong> módulo(s), mas o esperado para hoje eram <strong>${modEsp}</strong>.`;

          return `
            <div class="attention-item-row" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="${tagBg} padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 800;">${iconStr}</span>
                <div>
                  <strong style="color: #fff; font-size: 0.9rem;">${a.nome}</strong>
                  <span style="font-size: 0.78rem; color: var(--color-text-muted); margin-left: 8px;">RE: <code>${a.re}</code> &bull; ${a.estacao}</span>
                </div>
              </div>
              <div style="font-size: 0.8rem; color: var(--color-text-main);">
                ${descMsg}
              </div>
            </div>
          `;
        }).join('');
      }
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

      const pacingColor = a.status_ritmo_color || '#4ade80';
      const pacingLabel = a.status_ritmo_label || 'Em dia';
      const pacingBadge = `<span style="color: ${pacingColor}; background: rgba(255, 255, 255, 0.05); border: 1px solid ${pacingColor}; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; margin-left: 6px;">${pacingLabel}</span>`;

      let btnToggleStatus = isDesligado
        ? `<button class="nav-btn" onclick="reactivateStudent('${a.re}', '${a.nome}')" style="padding: 4px 10px; font-size: 0.78rem; background: rgba(42, 157, 104, 0.2); border-color: #2a9d68; color: #2a9d68;"><i class="fa-solid fa-user-plus"></i> Reativar</button>`
        : `<button class="nav-btn btn-action-soft-delete" onclick="softDeleteStudent('${a.re}', '${a.nome}')" style="padding: 4px 10px; font-size: 0.78rem;"><i class="fa-solid fa-user-minus"></i> Desligar</button>`;

      return `
        <tr style="${isDesligado ? 'opacity: 0.65; background: rgba(185, 28, 28, 0.05);' : ''}">
          <td><strong>${a.nome}</strong></td>
          <td><code>${a.re}</code></td>
          <td>${a.estacao}</td>
          <td>${statusBadge} ${pacingBadge}</td>
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

  const visibSelect = document.getElementById('upload-visibilidade-select');
  const visibVal = visibSelect ? visibSelect.value : 'instrutor';

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('file', files[i]);
  }
  formData.append('visivel_para', visibVal);

  try {
    const res = await fetch(`${API_BASE_URL}/instrutoria/upload?visivel_para=${visibVal}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      const tagVis = visibVal === 'todos' ? '🌐 Liberado para Alunos e Instrutores' : '🔒 Restrito à Instrutoria';
      alert(`✅ Arquivo enviado e registrado no Banco de Dados!\nNível de Visibilidade: ${tagVis}`);
      loadInstructorFiles();
    } else {
      alert(`❌ Erro no upload: ${data.error || data.message}`);
    }
  } catch (err) {
    alert("❌ Erro de conexão ao enviar o arquivo físico para o servidor.");
  }
}

async function loadInstructorFiles() {
  const containerInst = document.getElementById('instrutoria-files-list');
  const containerClass = document.getElementById('classroom-files-list');

  try {
    const res = await fetch(`${API_BASE_URL}/instrutoria/arquivos`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();

    if (!data.success || !data.arquivos) return;

    const htmlContent = data.arquivos.map(f => {
      const downloadUrl = `${API_BASE_URL}/instrutoria/download?id=${f.id}&token=${authToken}`;
      const isPublic = f.visivel_para === 'todos';
      const badge = isPublic 
        ? `<span style="background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; color: #4ade80; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; margin-left: 8px;">🌐 Liberado para Alunos</span>`
        : `<span style="background: rgba(245, 194, 61, 0.15); border: 1px solid #f5c23d; color: #f5c23d; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; margin-left: 8px;">🔒 Restrito Instrutoria</span>`;

      return `
        <div class="file-item-card" style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fa-solid fa-file-pdf" style="font-size: 2rem; color: #f87171;"></i>
            <div>
              <strong style="color: #fff; font-size: 0.95rem; display: flex; align-items: center;">${f.nome_original || f.nome_arquivo} ${badge}</strong>
              <span style="font-size: 0.8rem; color: var(--color-text-muted);">${f.tamanho} &bull; Disponibilizado em ${f.data_upload}</span>
            </div>
          </div>
          <a href="${downloadUrl}" target="_blank" class="nav-btn" style="background: rgba(35, 123, 189, 0.2); border-color: var(--color-tactical-blue); color: var(--color-tactical-blue-light); text-decoration: none; padding: 6px 14px;">
            <i class="fa-solid fa-download"></i> Abrir / Download PDF
          </a>
        </div>
      `;
    }).join('');

    if (containerInst) containerInst.innerHTML = htmlContent;
    if (containerClass) containerClass.innerHTML = htmlContent;

  } catch (err) {
    console.error("Erro ao carregar lista de arquivos:", err);
  }
}

function openLibraryModal() {
  loadInstructorFiles();
  document.getElementById('modal-library')?.classList.remove('hidden');
}

function closeLibraryModal() {
  document.getElementById('modal-library')?.classList.add('hidden');
}

let cachedErrorQuestions = [];

async function loadErrorQuestionsReport() {
  const tbody = document.getElementById('error-questions-tbody');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE_URL}/instrutoria/relatorio-erros`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();

    if (!data.success) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--color-text-muted); padding: 1rem;">Erro ao carregar o relatório pedagógico de erros.</td></tr>`;
      return;
    }

    cachedErrorQuestions = data.relatorio_questoes || [];
    renderErrorQuestionsReport();

  } catch (err) {
    console.error("Erro ao buscar relatório pedagógico de erros:", err);
  }
}

function renderErrorQuestionsReport() {
  const tbody = document.getElementById('error-questions-tbody');
  const filterSelect = document.getElementById('filter-error-module-select');
  if (!tbody) return;

  const selectedMod = filterSelect ? filterSelect.value : 'todos';

  let filtered = cachedErrorQuestions;
  if (selectedMod !== 'todos') {
    filtered = cachedErrorQuestions.filter(q => String(q.modulo_id) === String(selectedMod));
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--color-text-muted); padding: 1.25rem;">
          <i class="fa-solid fa-circle-check" style="color: #22c55e; margin-right: 6px;"></i> Nenhuma tentativa ou erro registrado nesta categoria até o momento.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(q => {
    const isCritical = q.percentual_erro >= 50.0 && q.total_respostas >= 3;
    const isSmallSample = q.total_respostas < 3;
    
    const rowBg = isCritical ? 'background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444;' : '';
    
    let rateBadge = `<span style="font-weight: 800; color: #4ade80;">${q.percentual_erro}%</span>`;
    if (isCritical) {
      rateBadge = `
        <span style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #f87171; padding: 2px 8px; border-radius: 4px; font-weight: 800; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;">
          <i class="fa-solid fa-triangle-exclamation"></i> ${q.percentual_erro}%
        </span>
      `;
    } else if (q.percentual_erro > 0) {
      rateBadge = `<span style="font-weight: 800; color: #f5c23d;">${q.percentual_erro}%</span>`;
    }

    const modLabel = q.modulo_id === 'final' ? 'Prova Semana 1' : `Estação ${q.modulo_id}`;
    const sampleBadge = isSmallSample ? `<span style="font-size: 0.7rem; color: var(--color-text-muted); display: block;">(Amostra reduzida &lt; 3)</span>` : '';

    return `
      <tr style="${rowBg}">
        <td><strong>${modLabel}</strong></td>
        <td>
          <span style="color: #fff; font-weight: 600;">${q.question_text}</span>
          ${isCritical ? '<div style="font-size: 0.72rem; color: #f87171; margin-top: 3px;">⚠️ Alto índice de erro (&ge; 50% em 3+ respostas). Verificar clareza do enunciado ou reforçar o tema na aula prática.</div>' : ''}
        </td>
        <td style="text-align: center;">${q.total_respostas} ${sampleBadge}</td>
        <td style="text-align: center; color: #f87171; font-weight: 700;">${q.total_erros}</td>
        <td style="text-align: center;">${rateBadge}</td>
      </tr>
    `;
  }).join('');
}

// ------------------------------------------------------------------
// SALA DE AULA E QUIZ ANTI-CHEAT COM RANDOMIZAÇÃO DETERMINÍSTICA
// ------------------------------------------------------------------
function switchWeek(weekNum) {
  const w1List = document.getElementById('week-1-list');
  const w2List = document.getElementById('week-2-list');
  const btnW1 = document.getElementById('btn-week-1');
  const btnW2 = document.getElementById('btn-week-2');

  if (weekNum === 1) {
    w1List?.classList.remove('hidden');
    w2List?.classList.add('hidden');
    btnW1?.classList.add('active');
    btnW2?.classList.remove('active');
  } else {
    w1List?.classList.add('hidden');
    w2List?.classList.remove('hidden');
    btnW2?.classList.add('active');
    btnW1?.classList.remove('active');
  }
}

function getOrderedModules() {
  const list = Object.keys(modulesData).map(key => ({
    id: key,
    ...modulesData[key]
  }));
  list.sort((a, b) => {
    if (a.semana !== b.semana) return a.semana - b.semana;
    return a.ordem - b.ordem;
  });
  return list;
}

function getPreviousModuleId(modId) {
  const ordered = getOrderedModules();
  const idx = ordered.findIndex(m => String(m.id) === String(modId));
  if (idx > 0) {
    return ordered[idx - 1].id;
  }
  return null;
}

function isModuleUnlocked(modId) {
  const ordered = getOrderedModules();
  if (ordered.length === 0) return true;
  if (String(ordered[0].id) === String(modId)) return true;

  // Se já concluiu o módulo, sempre pode acessar
  if (userProgress[modId]) return true;

  // Exceção Histórica para a Semana 2: se o aluno já concluiu/acessou QUALQUER módulo da Semana 2,
  // liberamos os módulos da Semana 2.
  const modInfo = modulesData[modId];
  if (modInfo && modInfo.semana === 2) {
    const hasCompletedAnySemana2 = ordered.some(m => m.semana === 2 && userProgress[m.id]);
    if (hasCompletedAnySemana2) return true;
  }

  // Regra de Progressão Sequencial: o módulo anterior na sequência ordenada deve estar concluído
  const prevId = getPreviousModuleId(modId);
  if (prevId && userProgress[prevId]) return true;

  return false;
}

function renderSidebar() {
  const w1List = document.getElementById('week-1-list');
  const w2List = document.getElementById('week-2-list');
  if (!w1List || !w2List) return;

  w1List.innerHTML = '';
  w2List.innerHTML = '';

  const ordered = getOrderedModules();

  ordered.forEach(mod => {
    const isAct = (String(currentModule) === String(mod.id)) ? 'active' : '';
    const isUnlocked = isModuleUnlocked(mod.id);
    const lockClass = isUnlocked ? '' : 'locked';
    
    let badgeHtml = '';
    if (userProgress[mod.id]) {
      badgeHtml = `
        <span class="mod-completion-badge" style="background: rgba(42, 157, 104, 0.25); border: 1px solid #4ade80; color: #4ade80; font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 10px; margin-left: auto; display: inline-flex; align-items: center; gap: 4px;">
          <i class="fa-solid fa-circle-check"></i> Concluído
        </span>
      `;
    } else if (!isUnlocked) {
      badgeHtml = `
        <span style="font-size: 0.7rem; color: #94a3b8; margin-left: auto; display: inline-flex; align-items: center; gap: 4px;">
          <i class="fa-solid fa-lock"></i> Bloqueado
        </span>
      `;
    }

    let btnHtml = '';
    if (mod.isExam) {
      btnHtml = `
        <button class="menu-item ${isAct} ${lockClass}" id="btn-mod-${mod.id}" data-mod="${mod.id}" onclick="loadModule('${mod.id}')" style="border-color: var(--color-gold-patch); background: rgba(245, 194, 61, 0.08); display: flex; align-items: center; width: 100%; text-align: left;">
          <i class="fa-solid ${mod.icon}" style="color: var(--color-gold-patch); margin-right: 12px; font-size: 1.1rem;"></i>
          <div style="flex: 1;">
            <strong style="display: block; font-size: 0.88rem; color: var(--color-gold-patch);">${mod.menuLabel}</strong>
            <span style="font-size: 0.75rem; color: var(--color-gold-patch);">${mod.menuSubtext}</span>
          </div>
          ${badgeHtml}
        </button>
      `;
    } else {
      btnHtml = `
        <button class="menu-item ${isAct} ${lockClass}" id="btn-mod-${mod.id}" data-mod="${mod.id}" onclick="loadModule('${mod.id}')" style="display: flex; align-items: center; width: 100%; text-align: left;">
          <i class="fa-solid ${mod.icon}" style="margin-right: 12px; font-size: 1.1rem;"></i>
          <div style="flex: 1;">
            <strong style="display: block; font-size: 0.88rem;">${mod.menuLabel}</strong>
            <span style="font-size: 0.75rem;">${mod.menuSubtext}</span>
          </div>
          ${badgeHtml}
        </button>
      `;
    }

    if (mod.semana === 1) {
      w1List.innerHTML += btnHtml;
    } else {
      w2List.innerHTML += btnHtml;
    }
  });
}

function loadModule(modId) {
  if (!isModuleUnlocked(modId)) {
    alert("⚠️ Este módulo está bloqueado. Conclua os módulos anteriores e a Prova correspondente para liberá-lo.");
    return;
  }

  currentModule = modId;
  currentSlideIndex = 0;

  const mData = modulesData[modId];
  if (!mData) return;

  // Alternar automaticamente entre as abas da Semana 1 e Semana 2 baseado no módulo carregado
  if (mData.semana === 1) {
    switchWeek(1);
  } else if (mData.semana === 2) {
    switchWeek(2);
  }

  renderSidebar();

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

  const mediaContainer = document.querySelector('.slide-media-container');
  if (mediaContainer) {
    if (slide && slide.youtubeId) {
      mediaContainer.innerHTML = `
        <div style="width: 100%; margin-bottom: 1.25rem;">
          <div style="position: relative; padding-bottom: 177.78%; height: 0; max-width: 280px; margin: 0 auto; overflow: hidden; border-radius: 12px; border: 1px solid rgba(245, 194, 61, 0.4); box-shadow: 0 12px 35px rgba(0,0,0,0.6); background: #000;">
            <iframe src="https://www.youtube-nocookie.com/embed/${slide.youtubeId}?autoplay=0&rel=0" 
                    title="${slide.title}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px;">
            </iframe>
          </div>
          <div style="font-size: 0.85rem; color: var(--color-gold-patch); font-weight: 800; text-align: center; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="fa-solid fa-circle-play" style="font-size: 1rem;"></i> 🎬 Vídeo Demonstrativo
          </div>
        </div>
      `;

    } else if (mData && mData.youtubeId && currentSlideIndex === 0) {
      mediaContainer.innerHTML = `
        <div style="width: 100%; margin-bottom: 1.25rem;">
          <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; border: 1px solid rgba(245, 194, 61, 0.4); box-shadow: 0 12px 35px rgba(0,0,0,0.6); background: #000;">
            <iframe src="https://www.youtube-nocookie.com/embed/${mData.youtubeId}?autoplay=0&rel=0" 
                    title="${mData.title}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px;">
            </iframe>
          </div>
          <div style="font-size: 0.85rem; color: var(--color-gold-patch); font-weight: 800; text-align: center; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="fa-solid fa-circle-play" style="font-size: 1rem;"></i> 🎬 Vídeoaula Oficial & Explicativa (Estação ${currentModule})
          </div>
        </div>
      `;
    } else {
      mediaContainer.innerHTML = `<img id="slide-img" src="${slide.image}" alt="Ilustração do Módulo" class="slide-img">`;
    }
  }

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


  document.getElementById('btn-submit-quiz')?.addEventListener('click', handleQuizSubmission);
  document.getElementById('btn-header-instrutoria')?.addEventListener('click', () => showScreen('screen-instrutoria'));
  document.getElementById('btn-header-classroom')?.addEventListener('click', () => showScreen('screen-classroom'));
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
    const modIdToSend = String(currentModule === 'NaN' || !currentModule ? '1' : currentModule);
    const res = await fetch(`${API_BASE_URL}/quiz/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        curso_id: 'salvamento_cordas',
        modulo_id: modIdToSend
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success || !data.questions || data.questions.length === 0) {
      const errMsg = data.message || data.error || "Erro ao iniciar avaliação no servidor.";
      alert(`❌ ${errMsg}`);
      return;
    }

    currentAttemptId = data.attempt_id;
    currentQuizQuestions = data.questions;
    currentQuizIndex = 0;
    quizAnswersMap = {};

    renderQuizQuestionState();

  } catch (err) {
    alert(`❌ Erro de conexão ao buscar prova no servidor: ${err.message || err}`);
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
      titleBadge.innerHTML = `<i class="fa-solid fa-trophy"></i> Prova Semana 1 (20 Questões)`;
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
        alert(`⚠️ Por favor, responda à Questão ${i + 1} antes de finalizar a Prova Semana 1.`);
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
        renderSidebar();

        const ordered = getOrderedModules();
        const currentIdx = ordered.findIndex(m => String(m.id) === String(currentModule));
        if (currentIdx >= 0 && currentIdx < ordered.length - 1) {
          const nextModId = ordered[currentIdx + 1].id;
          loadModule(nextModId);
        } else {
          alert("🎉 Parabéns! Você concluiu todas as instruções da Semana 2. Em breve a Prova da Semana 2 e a Prova Final do Curso estarão liberadas!");
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
        alert(`🏆 PARABÉNS! Você foi APROVADO na Prova Semana 1 com ${scorePct}% de acertos (${correctCount} de ${totalQ} questões)!\n\nAgora você está liberado para iniciar a Semana 2.`);
        userProgress['final'] = true;
        updateCourseProgressBar();
        renderSidebar();

        const ordered = getOrderedModules();
        const currentIdx = ordered.findIndex(m => String(m.id) === String(currentModule));
        if (currentIdx >= 0 && currentIdx < ordered.length - 1) {
          const nextModId = ordered[currentIdx + 1].id;
          loadModule(nextModId);
        } else {
          alert("🎉 Parabéns! Você concluiu todas as instruções da Semana 2. Em breve a Prova da Semana 2 e a Prova Final do Curso estarão liberadas!");
        }
      } else {
        alert(`⚠️ Você obteve ${scorePct}% de acertos (${correctCount} de ${totalQ} questões).\n\nO aproveitamento mínimo necessário é de 70%. Revise o conteúdo da Semana 1 e tente novamente.`);
      }
    }
  } catch (e) {
    alert("❌ Erro de conexão ao enviar respostas da prova para o servidor.");
  }
}

function applyStudentProgress(progressoArray) {
  userProgress = {};
  Object.keys(modulesData).forEach(key => {
    userProgress[key] = false;
  });
  if (Array.isArray(progressoArray)) {
    progressoArray.forEach(p => {
      userProgress[String(p.modulo_id)] = true;
    });
  }
  updateCourseProgressBar();
  renderSidebar();
}

async function fetchStudentProgressAndRender() {
  if (!authToken || !currentUser) return;
  try {
    const res = await fetch(`${API_BASE_URL}/aluno/meu-progresso?_t=${Date.now()}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.progresso)) {
      applyStudentProgress(data.progresso);
    } else {
      renderSidebar();
    }
  } catch (err) {
    console.error("Erro ao sincronizar progresso do aluno:", err);
    renderSidebar();
  }
}

function updateCourseProgressBar() {
  const allModules = Object.keys(modulesData);
  const totalCount = allModules.length;
  const completed = allModules.filter(m => userProgress[m] === true).length;
  const pct = totalCount > 0 ? Math.round((completed / totalCount) * 100) : 0;
  
  const fill = document.getElementById('course-progress-bar-fill');
  if (fill) fill.style.width = `${pct}%`;

  const txt = document.getElementById('course-progress-text');
  if (txt) txt.innerText = `${completed} de ${totalCount} Módulos Concluídos (${pct}%)`;

  allModules.forEach(mId => {
    const btn = document.getElementById(`btn-mod-${mId}`);
    if (btn) {
      if (currentModule === mId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });
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
  const headerBtnClassroom = document.getElementById('btn-header-classroom');
  const sessionInfoHeader = document.getElementById('session-info-header');
  const headerUserRe = document.getElementById('header-user-re');
  const mNavAluno = document.getElementById('mobile-nav-aluno');
  const mNavInstrutor = document.getElementById('mobile-nav-instrutor');
  const mBottomNav = document.getElementById('mobile-bottom-nav');
  const mBackToInst = document.getElementById('mtab-back-to-instructor');

  if (currentUser) {
    if (sessionInfoHeader) sessionInfoHeader.style.display = 'flex';
    if (headerUserRe) {
      headerUserRe.innerText = `${currentUser.nome || 'Militar'}`;
    }

    if (mBottomNav) {
      mBottomNav.classList.add('active');
      mBottomNav.style.display = 'flex';
    }

    const isClassroomActive = document.getElementById('screen-classroom')?.classList.contains('active');

    if (currentUser.role === 'instrutor' || currentUser.role === 'admin') {
      if (headerBtnInstrutoria) headerBtnInstrutoria.style.display = 'flex';
      if (headerBtnClassroom) headerBtnClassroom.style.display = 'flex';
      if (mBackToInst) mBackToInst.style.display = 'flex';

      if (isClassroomActive) {
        if (mNavAluno) mNavAluno.style.display = 'flex';
        if (mNavInstrutor) mNavInstrutor.style.display = 'none';
      } else {
        if (mNavAluno) mNavAluno.style.display = 'none';
        if (mNavInstrutor) mNavInstrutor.style.display = 'flex';
      }
    } else {
      if (headerBtnInstrutoria) headerBtnInstrutoria.style.display = 'none';
      if (headerBtnClassroom) headerBtnClassroom.style.display = 'none';
      if (mBackToInst) mBackToInst.style.display = 'none';
      if (mNavAluno) mNavAluno.style.display = 'flex';
      if (mNavInstrutor) mNavInstrutor.style.display = 'none';
    }
  } else {
    if (sessionInfoHeader) sessionInfoHeader.style.display = 'none';
    if (headerBtnInstrutoria) headerBtnInstrutoria.style.display = 'none';
    if (headerBtnClassroom) headerBtnClassroom.style.display = 'none';
    if (mBackToInst) mBackToInst.style.display = 'none';
    if (mBottomNav) {
      mBottomNav.classList.remove('active');
      mBottomNav.style.display = 'none';
    }
  }
}

function mobileScrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function scrollToQuizMobile() {
  showScreen('screen-classroom');
  setTimeout(() => {
    const el = document.getElementById('quiz-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 150);
}

function logout() {
  logoutSession();
}

function checkExistingSession() {
  // Garantir que ao abrir a URL o portal exija sempre o login inicial na tela de acesso
  authToken = '';
  currentUser = null;
  currentRole = 'aluno';
  localStorage.removeItem('cb_auth_token');
  localStorage.removeItem('cb_user_data');
  sessionStorage.removeItem('cb_auth_token');
  sessionStorage.removeItem('cb_user_data');
  updateHeaderUserInfo();
  showScreen('screen-login');
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
