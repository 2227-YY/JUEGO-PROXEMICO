
// ¡PROXÉMICA EN ACCIÓN! //

(function () 
{
  'use strict';

  
  // ESTADO GLOBAL DE LA APLICACIÓN //

  const state = {
    teams: {
      1: { name: 'Equipo Fénix', badge: '⚡', score: 0, color: '#ff6b35' },
      2: { name: 'Equipo Titanes', badge: '🛡️', score: 0, color: '#00b4d8' }
    },
    currentTurn: 1, // 1 o 2
    currentRound: 1, // 1 o 2
    voiceEnabled: true,
    geminiLive: false,
    selectedConceptCard: null,
    selectedDefinitionCard: null,
    matchedCount: 0,
    currentQuestionIndex: 0,
    questionAnswered: false,
    lastSpeechText: '',
    confettiAnimationId: null
  };


  // RONDA 1 (UNIR CONCEPTOS) //

  const CONCEPTS_DATA = [
    {
      id: 'proxemica',
      concept: 'Proxémica',
      definition: 'Disciplina que estudia cómo los seres humanos emplean el espacio físico y las distancias en la comunicación interpersonal.',
      hint: 'Piensa en el término acuñado por Edward T. Hall que describe el estudio general de nuestra burbuja espacial.'
    },
    {
      id: 'intima',
      concept: 'Distancia íntima',
      definition: 'Zona de 0 a 45 cm, reservada para personas de máxima confianza, afecto, abrazos, caricias y confidencias.',
      hint: 'Es la distancia más cercana de todas; ¡menos de medio metro, al alcance de un susurro o un abrazo!'
    },
    {
      id: 'personal',
      concept: 'Distancia personal',
      definition: 'Zona de 45 cm a 1.20 metros, usada en conversaciones cotidianas con amigos y compañeros en el recreo o reuniones.',
      hint: 'Equivale aproximadamente a la longitud de un brazo extendido al charlar con amigos de confianza.'
    },
    {
      id: 'social',
      concept: 'Distancia social',
      definition: 'Zona de 1.20 a 3.60 metros, común en ambientes laborales, comerciales y con personas que apenas conocemos.',
      hint: 'Es la separación habitual en una oficina, con un cajero de banco o al hacer compras en una tienda.'
    },
    {
      id: 'publica',
      concept: 'Distancia pública',
      definition: 'Zona de más de 3.60 metros, propia de conferencias, discursos formales, auditorios grandes y eventos multitudinarios.',
      hint: 'Se utiliza cuando un orador se dirige a un público amplio en un auditorio o plaza.'
    },
    {
      id: 'respeto',
      concept: 'Respeto del espacio personal',
      definition: 'Capacidad empática de reconocer, valorar y no invadir la distancia física y emocional de los demás sin su consentimiento.',
      hint: 'Se basa en la empatía y la convivencia sana: nunca traspasar la burbuja de otra persona si nota incomodidad.'
    }
  ];

  
  //  RONDA 2 (COMPLETAR FRASES) //

  const QUESTIONS_DATA = [
    {
      id: 1,
      statement: 'En un ascensor lleno o en el transporte público en hora pico, nos vemos forzados a reducir nuestra separación a menos de 45 cm con desconocidos, entrando involuntariamente en la distancia <span class="blank-highlight">_______</span>, lo cual suele provocar tensión o incomodidad.',
      options: [
        { text: 'íntima', isCorrect: true },
        { text: 'pública', isCorrect: false },
        { text: 'social', isCorrect: false },
        { text: 'laboral', isCorrect: false }
      ],
      explanation: 'La distancia íntima (0 a 45 cm) está reservada para personas de confianza. Cuando desconocidos entran en ella por falta de espacio, nuestro cerebro reacciona con alerta o incomodidad.',
      hint: 'Es la distancia menor a 45 cm donde normalmente solo permitimos a seres muy queridos.'
    },
    {
      id: 2,
      statement: 'Cuando un expositor dicta una conferencia magistral frente a 200 personas en un auditorio a más de 4 metros de la primera fila, está empleando la distancia <span class="blank-highlight">_______</span>.',
      options: [
        { text: 'pública', isCorrect: true },
        { text: 'personal', isCorrect: false },
        { text: 'íntima', isCorrect: false },
        { text: 'confidencial', isCorrect: false }
      ],
      explanation: 'La distancia pública supera los 3.60 metros. Es la zona propicia para conferencias, discursos políticos, presentaciones artísticas y clases multitudinarias.',
      hint: 'Supera los 3.6 metros y está pensada para hablar a un público general.'
    },
    {
      id: 3,
      statement: 'El antropólogo Edward T. Hall demostró que la proxémica varía profundamente según el contexto <span class="blank-highlight">_______</span>; por ejemplo, en culturas latinas o mediterráneas la cercanía física suele ser mayor que en culturas nórdicas o anglosajonas.',
      options: [
        { text: 'cultural', isCorrect: true },
        { text: 'climático', isCorrect: false },
        { text: 'tecnológico', isCorrect: false },
        { text: 'astronómico', isCorrect: false }
      ],
      explanation: 'Cada cultura codifica de manera diferente el espacio. Lo que en un país latino es un saludo cálido habitual, en un país nórdico puede sentirse como una invasión.',
      hint: 'Tiene que ver con las tradiciones, costumbres y hábitos compartidos por una sociedad.'
    },
    {
      id: 4,
      statement: 'Al conversar con un compañero de clase en el patio escolar o compartir una mesa en una cafetería, nos situamos naturalmente en la distancia <span class="blank-highlight">_______</span> (entre 45 cm y 1.20 metros).',
      options: [
        { text: 'personal', isCorrect: true },
        { text: 'pública', isCorrect: false },
        { text: 'remota', isCorrect: false },
        { text: 'satelital', isCorrect: false }
      ],
      explanation: 'La distancia personal (45 cm - 1.2 m) es la burbuja típica para interacciones cara a cara con amigos, conocidos y familiares en situaciones relajadas.',
      hint: 'Abarca desde 45 cm hasta 1.2 metros, al alcance del brazo.'
    },
    {
      id: 5,
      statement: 'Si durante una conversación notas que la otra persona da sutilmente un paso hacia atrás, su lenguaje proxémico te comunica que:',
      options: [
        { text: 'Siente invadido su espacio personal y necesita reestablecer una distancia cómoda', isCorrect: true },
        { text: 'Quiere que te acerques aún más rápido a ella', isCorrect: false },
        { text: 'Ha terminado formalmente la conversación para siempre', isCorrect: false },
        { text: 'Está practicando pasos de baile de salón', isCorrect: false }
      ],
      explanation: 'Retroceder es una respuesta proxémica involuntaria: indica que la otra persona siente su espacio vulnerado y busca restaurar su zona de confort.',
      hint: 'Retroceder suele ser una señal no verbal de búsqueda de comodidad y espacio.'
    },
    {
      id: 6,
      statement: 'Al hacer un trámite en la ventanilla de un banco o solicitar informes a una recepcionista, la separación adecuada corresponde a la distancia <span class="blank-highlight">_______</span> (1.20 a 3.60 m).',
      options: [
        { text: 'social', isCorrect: true },
        { text: 'íntima', isCorrect: false },
        { text: 'afectiva', isCorrect: false },
        { text: 'secreta', isCorrect: false }
      ],
      explanation: 'La distancia social (1.2 a 3.6 metros) permite interactuar cordialmente y sin contacto físico con profesionales, clientes o personas que no conocemos íntimamente.',
      hint: 'Se usa en negocios, trámites y con personas que tratamos por primera vez.'
    },
    {
      id: 7,
      statement: 'El principio ético que nos orienta a respetar los límites físicos y emocionales de los demás sin juzgarlos se denomina <span class="blank-highlight">_______</span>.',
      options: [
        { text: 'empatía', isCorrect: true },
        { text: 'indiferencia', isCorrect: false },
        { text: 'competitividad', isCorrect: false },
        { text: 'autoritarismo', isCorrect: false }
      ],
      explanation: 'La empatía nos capacita para ponernos en el lugar del otro, reconocer sus señales no verbales y respetar su espacio sin imponer nuestros propios límites.',
      hint: 'Es la capacidad humana de ponerse en el lugar de la otra persona.'
    },
    {
      id: 8,
      statement: 'El espacio personal no es una barrera rígida de metal, sino una burbuja <span class="blank-highlight">_______</span> que cambia según el nivel de ruido, el entorno, el estado de ánimo y la confianza entre las personas.',
      options: [
        { text: 'dinámica y flexible', isCorrect: true },
        { text: 'rígida e inmutable', isCorrect: false },
        { text: 'completamente estática', isCorrect: false },
        { text: 'inexistente en el ser humano', isCorrect: false }
      ],
      explanation: 'El espacio personal se expande o se contrae según la situación: en un lugar ruidoso nos acercamos más, mientras que en un lugar silencioso o tenso preferimos mayor distancia.',
      hint: 'Significa que puede cambiar y adaptarse según las circunstancias.'
    }
  ];

  
  // ELEMENTOS //
  
  const DOM = {
    // Header & Scoreboard
    header: document.getElementById('game-header'),
    scoreboard: document.getElementById('scoreboard'),
    team1Card: document.getElementById('team-1-card'),
    team2Card: document.getElementById('team-2-card'),
    team1Badge: document.getElementById('team-1-badge'),
    team2Badge: document.getElementById('team-2-badge'),
    displayTeam1Name: document.getElementById('display-team-1-name'),
    displayTeam2Name: document.getElementById('display-team-2-name'),
    displayTeam1Score: document.getElementById('display-team-1-score'),
    displayTeam2Score: document.getElementById('display-team-2-score'),
    currentRoundBadge: document.getElementById('current-round-badge'),
    roundProgressFill: document.getElementById('round-progress-fill'),
    roundCounter: document.getElementById('round-counter'),
    mobileQrBtn: document.getElementById('mobile-qr-btn'),
    toggleVoiceBtn: document.getElementById('toggle-voice-btn'),
    rulesBtn: document.getElementById('rules-btn'),
    restartBtn: document.getElementById('restart-btn'),

    // Screens
    setupScreen: document.getElementById('setup-screen'),
    round1Screen: document.getElementById('round-1-screen'),
    round2Screen: document.getElementById('round-2-screen'),
    resultsScreen: document.getElementById('results-screen'),

    // Setup Form
    team1Input: document.getElementById('team-1-input'),
    team2Input: document.getElementById('team-2-input'),
    team1Avatars: document.getElementById('team-1-avatars'),
    team2Avatars: document.getElementById('team-2-avatars'),
    startGameBtn: document.getElementById('start-game-btn'),

    // Round 1
    conceptsContainer: document.getElementById('concepts-container'),
    definitionsContainer: document.getElementById('definitions-container'),
    round1Feedback: document.getElementById('round-1-feedback'),
    round1FeedbackBadge: document.getElementById('round-1-feedback-badge'),
    round1FeedbackText: document.getElementById('round-1-feedback-text'),
    round1CompleteBox: document.getElementById('round-1-complete-box'),
    goToRound2Btn: document.getElementById('go-to-round-2-btn'),

    // Round 2
    questionNumberBadge: document.getElementById('question-number-badge'),
    questionTurnTag: document.getElementById('question-turn-tag'),
    questionStatement: document.getElementById('question-statement'),
    optionsGrid: document.getElementById('options-grid'),
    explanationBox: document.getElementById('explanation-box'),
    explanationIcon: document.getElementById('explanation-icon'),
    explanationTitle: document.getElementById('explanation-title'),
    explanationText: document.getElementById('explanation-text'),
    nextQuestionBtn: document.getElementById('next-question-btn'),

    // Results 
    winnerTitle: document.getElementById('winner-title'),
    winnerMessage: document.getElementById('winner-message'),
    resultsTrophy: document.getElementById('results-trophy'),
    finalTeam1Badge: document.getElementById('final-team-1-badge'),
    finalTeam2Badge: document.getElementById('final-team-2-badge'),
    finalTeam1Name: document.getElementById('final-team-1-name'),
    finalTeam2Name: document.getElementById('final-team-2-name'),
    finalTeam1Points: document.getElementById('final-team-1-points'),
    finalTeam2Points: document.getElementById('final-team-2-points'),
    finalTeam1Box: document.getElementById('final-team-1-box'),
    finalTeam2Box: document.getElementById('final-team-2-box'),
    rematchBtn: document.getElementById('rematch-btn'),
    newGameBtn: document.getElementById('new-game-btn'),
    confettiCanvas: document.getElementById('confetti-canvas'),

    // Mascot (Proxi)
    speechBubble: document.getElementById('speech-bubble'),
    bubbleText: document.getElementById('bubble-text'),
    repeatSpeechBtn: document.getElementById('repeat-speech-btn'),
    petAvatarWrapper: document.getElementById('pet-avatar-wrapper'),
    askHintBtn: document.getElementById('ask-hint-btn'),
    aiStatusDot: document.querySelector('.ai-dot'),
    aiStatusText: document.getElementById('ai-status-text'),

    // Modales
    rulesModal: document.getElementById('rules-modal'),
    closeRulesBtn: document.getElementById('close-rules-btn'),
    gotRulesBtn: document.getElementById('got-rules-btn'),

    mobileModal: document.getElementById('mobile-modal'),
    closeMobileBtn: document.getElementById('close-mobile-btn'),
    gotMobileBtn: document.getElementById('got-mobile-btn'),
    mobileUrlInput: document.getElementById('mobile-url-input'),
    copyUrlBtn: document.getElementById('copy-url-btn'),
    copyStatusText: document.getElementById('copy-status-text'),
    qrCodeImg: document.getElementById('qr-code-img')
  };

  
  // EFECTOS DE SONIDO (WEB AUDIO API NATIVO) //
  
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!state.voiceEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'match' || type === 'correct') {
        // Melodía triunfal ascendente (Do - Mi - Sol - Do alto)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          noteOsc.type = 'triangle';
          noteOsc.frequency.setValueAtTime(freq, now + i * 0.08);
          noteGain.gain.setValueAtTime(0.2, now + i * 0.08);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
          noteOsc.start(now + i * 0.08);
          noteOsc.stop(now + i * 0.08 + 0.22);
        });
      } else if (type === 'wrong') {
        // Sonido suave de error no estridente
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.26);
      } else if (type === 'hint') {
        // Campanilla mágica brillante
        const hintNotes = [784, 988, 1175];
        hintNotes.forEach((freq, idx) => {
          const hOsc = ctx.createOscillator();
          const hGain = ctx.createGain();
          hOsc.connect(hGain);
          hGain.connect(ctx.destination);
          hOsc.type = 'sine';
          hOsc.frequency.setValueAtTime(freq, now + idx * 0.09);
          hGain.gain.setValueAtTime(0.15, now + idx * 0.09);
          hGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.3);
          hOsc.start(now + idx * 0.09);
          hOsc.stop(now + idx * 0.09 + 0.32);
        });
      }
    } catch (e) {
      // AudioContext no disponible o bloqueado por navegador
    }
  }

  
  // SÍNTESIS DE VOZ Y COMPORTAMIENTO DE LA MASCOTA "PROXI" //

  let synthVoices = [];
  function loadVoices() {
    if ('speechSynthesis' in window) {
      synthVoices = window.speechSynthesis.getVoices();
    }
  }
  if ('speechSynthesis' in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function proxiSpeak(text) {
    if (!state.voiceEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Detener locución previa

    const cleanText = text.replace(/<[^>]*>?/gm, ''); // Quitar etiquetas HTML
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Buscar la mejor voz en español disponible
    if (synthVoices.length === 0) loadVoices();
    const esVoice = synthVoices.find(v => v.lang.startsWith('es-') || v.lang === 'es' || v.lang.includes('Spanish')) || synthVoices[0];
    if (esVoice) utterance.voice = esVoice;

    utterance.lang = 'es-ES';
    utterance.pitch = 1.15; // Tono ligeramente juvenil y amigable
    utterance.rate = 1.02;  // Ritmo natural y claro

    // Animar boca de la mascota mientras habla
    utterance.onstart = () => {
      DOM.petAvatarWrapper.classList.add('is-speaking');
    };

    utterance.onend = () => {
      DOM.petAvatarWrapper.classList.remove('is-speaking');
    };

    utterance.onerror = () => {
      DOM.petAvatarWrapper.classList.remove('is-speaking');
    };

    window.speechSynthesis.speak(utterance);
  }

  function proxiSay(text, mood = 'neutral', speakNow = true) {
    state.lastSpeechText = text;
    DOM.bubbleText.innerHTML = text;

    // Actualizar estados visuales de la mascota
    DOM.petAvatarWrapper.classList.remove('mood-happy', 'mood-thinking');
    if (mood === 'happy') {
      DOM.petAvatarWrapper.classList.add('mood-happy');
      setTimeout(() => DOM.petAvatarWrapper.classList.remove('mood-happy'), 2500);
    } else if (mood === 'thinking') {
      DOM.petAvatarWrapper.classList.add('mood-thinking');
    }

    if (speakNow) {
      proxiSpeak(text);
    }
  }

  
  //  GOOGLE GEMINI API
  
  async function checkServerStatus() {
    try {
      const response = await fetch('/api/status');
      if (response.ok) {
        const data = await response.json();
        if (data.geminiConfigured) {
          state.geminiLive = true;
          DOM.aiStatusDot.classList.add('gemini-live');
          DOM.aiStatusText.textContent = 'Gemini AI Conectado';
        } else {
          state.geminiLive = false;
          DOM.aiStatusDot.classList.add('active');
          DOM.aiStatusText.textContent = 'Pistas Inteligentes Activas';
        }
      }
    } catch (e) {
      // Modo local/offline sin servidor activo
      state.geminiLive = false;
      DOM.aiStatusDot.classList.add('active');
      DOM.aiStatusText.textContent = 'Pistas de Proxi Activas';
    }
  }

  
  // SOLICITAR PISTAS
  
  async function requestHint() {
    const activeTeam = state.teams[state.currentTurn];
    proxiSay('Mmm, déjame revisar mis sensores espaciales para darte una pista clave...', 'thinking', false);
    playSound('hint');

    // Construir carga útil según la ronda activa
    let payload = {
      round: state.currentRound,
      teamName: activeTeam.name
    };

    if (state.currentRound === 1) {
      if (state.selectedConceptCard) {
        const conceptId = state.selectedConceptCard.dataset.conceptId;
        const item = CONCEPTS_DATA.find(c => c.id === conceptId);
        payload.concept = item.concept;
        payload.definition = item.definition;
      } else {
        // Si no han seleccionado tarjeta aún, tomamos el primer par no completado
        const remaining = CONCEPTS_DATA.filter(c => {
          const el = document.querySelector(`.concept-card[data-concept-id="${c.id}"]`);
          return el && !el.classList.contains('matched');
        });
        const currentTarget = remaining[0] || CONCEPTS_DATA[0];
        payload.concept = currentTarget.concept;
        payload.definition = currentTarget.definition;
      }
    } else {
      const q = QUESTIONS_DATA[state.currentQuestionIndex];
      payload.question = q.statement.replace(/<[^>]*>?/gm, '');
    }

    try {
      const response = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.hint) {
          proxiSay(`💡 <strong>Pista para ${activeTeam.name}:</strong> ${resData.hint}`, 'happy');
          return;
        }
      }
    } catch (err) {
      // Servidor no disponible
    }

    // Fallback pedagógico precargado
    let localHint = '';
    if (state.currentRound === 1) {
      const targetId = state.selectedConceptCard ? state.selectedConceptCard.dataset.conceptId : 'proxemica';
      const item = CONCEPTS_DATA.find(c => c.id === targetId) || CONCEPTS_DATA[0];
      localHint = item.hint;
    } else {
      const q = QUESTIONS_DATA[state.currentQuestionIndex];
      localHint = q.hint;
    }

    proxiSay(`💡 <strong>Pista de Proxi para ${activeTeam.name}:</strong> ${localHint}`, 'happy');
  }

  
  // GESTIÓN DE TURNOS Y MARCADOR

  function updateScoreboard() {
    DOM.displayTeam1Name.textContent = state.teams[1].name;
    DOM.displayTeam2Name.textContent = state.teams[2].name;
    DOM.displayTeam1Score.textContent = `${state.teams[1].score} pts`;
    DOM.displayTeam2Score.textContent = `${state.teams[2].score} pts`;
    DOM.team1Badge.textContent = state.teams[1].badge;
    DOM.team2Badge.textContent = state.teams[2].badge;

    // Indicador activo de turno
    if (state.currentTurn === 1) {
      DOM.team1Card.classList.add('active-turn');
      DOM.team2Card.classList.remove('active-turn');
    } else {
      DOM.team2Card.classList.add('active-turn');
      DOM.team1Card.classList.remove('active-turn');
    }

    // Progreso
    if (state.currentRound === 1) {
      DOM.currentRoundBadge.textContent = 'Ronda 1: Unir Tarjetas';
      const pct = Math.round((state.matchedCount / CONCEPTS_DATA.length) * 100);
      DOM.roundProgressFill.style.width = `${pct}%`;
      DOM.roundCounter.textContent = `Pares: ${state.matchedCount} de ${CONCEPTS_DATA.length}`;
    } else {
      DOM.currentRoundBadge.textContent = 'Ronda 2: Completar Frases';
      const pct = Math.round(((state.currentQuestionIndex + 1) / QUESTIONS_DATA.length) * 100);
      DOM.roundProgressFill.style.width = `${pct}%`;
      DOM.roundCounter.textContent = `Frase: ${state.currentQuestionIndex + 1} de ${QUESTIONS_DATA.length}`;
    }
  }

  function switchTurn() {
    state.currentTurn = state.currentTurn === 1 ? 2 : 1;
    updateScoreboard();
  }

  
  // INICIO Y CONFIGURACIÓN DEL JUEGO
  
  function initApp() {
    checkServerStatus();

    // Eventos de selección de avatar
    setupAvatarPickers();

    // Eventos de modal móvil / QR
    if (DOM.mobileQrBtn) {
      DOM.mobileQrBtn.addEventListener('click', () => showMobileModal(true));
    }
    if (DOM.closeMobileBtn) {
      DOM.closeMobileBtn.addEventListener('click', () => showMobileModal(false));
    }
    if (DOM.gotMobileBtn) {
      DOM.gotMobileBtn.addEventListener('click', () => showMobileModal(false));
    }
    if (DOM.mobileModal) {
      DOM.mobileModal.addEventListener('click', (e) => {
        if (e.target === DOM.mobileModal) showMobileModal(false);
      });
    }
    if (DOM.copyUrlBtn) {
      DOM.copyUrlBtn.addEventListener('click', copyMobileUrl);
    }

    // Eventos principales
    DOM.startGameBtn.addEventListener('click', startGame);
    DOM.toggleVoiceBtn.addEventListener('click', toggleVoice);
    DOM.rulesBtn.addEventListener('click', () => showModal(true));
    DOM.closeRulesBtn.addEventListener('click', () => showModal(false));
    DOM.gotRulesBtn.addEventListener('click', () => showModal(false));
    DOM.rulesModal.addEventListener('click', (e) => {
      if (e.target === DOM.rulesModal) showModal(false);
    });

    DOM.askHintBtn.addEventListener('click', requestHint);
    DOM.repeatSpeechBtn.addEventListener('click', () => {
      if (state.lastSpeechText) proxiSpeak(state.lastSpeechText);
    });

    DOM.restartBtn.addEventListener('click', confirmRestart);
    DOM.goToRound2Btn.addEventListener('click', startRound2);
    DOM.nextQuestionBtn.addEventListener('click', handleNextQuestion);
    DOM.rematchBtn.addEventListener('click', restartWithSameTeams);
    DOM.newGameBtn.addEventListener('click', restartFromScratch);

    // Mensaje de bienvenida de la mascota
    proxiSay('¡Hola exploradores! Soy Proxi, su guía espacial en este viaje de comunicación y proxémica. Configuren sus equipos y pulsen ¡Comenzar Desafío!', 'happy', false);
  }

  function setupAvatarPickers() {
    const setupPicker = (container, teamNum) => {
      container.querySelectorAll('.avatar-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('.avatar-opt').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.teams[teamNum].badge = btn.dataset.badge;
          playSound('click');
        });
      });
    };
    setupPicker(DOM.team1Avatars, 1);
    setupPicker(DOM.team2Avatars, 2);
  }

  function toggleVoice() {
    state.voiceEnabled = !state.voiceEnabled;
    if (state.voiceEnabled) {
      DOM.toggleVoiceBtn.querySelector('.icon').textContent = '🔊';
      DOM.toggleVoiceBtn.querySelector('.btn-text').textContent = 'Voz: ON';
      DOM.toggleVoiceBtn.classList.remove('secondary');
      proxiSay('¡Voz activada! Estaré acompañándolos con explicaciones y pistas.', 'happy');
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      DOM.petAvatarWrapper.classList.remove('is-speaking');
      DOM.toggleVoiceBtn.querySelector('.icon').textContent = '🔇';
      DOM.toggleVoiceBtn.querySelector('.btn-text').textContent = 'Voz: OFF';
      DOM.toggleVoiceBtn.classList.add('secondary');
    }
  }

  function showModal(show) {
    DOM.rulesModal.style.display = show ? 'flex' : 'none';
    if (show) playSound('click');
  }

  function showMobileModal(show) {
    if (!DOM.mobileModal) return;
    DOM.mobileModal.style.display = show ? 'flex' : 'none';
    if (show) {
      playSound('click');
      let targetUrl = 'http://192.168.40.175:3000';
      if (window.location.protocol.startsWith('http') && window.location.hostname && window.location.hostname !== 'localhost') {
        targetUrl = window.location.origin;
      }
      DOM.mobileUrlInput.value = targetUrl;
      DOM.qrCodeImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(targetUrl);
      DOM.copyStatusText.textContent = '';
    }
  }

  async function copyMobileUrl() {
    try {
      const url = DOM.mobileUrlInput.value;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        DOM.mobileUrlInput.select();
        document.execCommand('copy');
      }
      playSound('click');
      DOM.copyStatusText.textContent = '✅ ¡Enlace copiado al portapapeles!';
      setTimeout(() => {
        if (DOM.copyStatusText) DOM.copyStatusText.textContent = '';
      }, 3500);
    } catch (e) {
      DOM.mobileUrlInput.select();
      DOM.copyStatusText.textContent = '👉 Selecciona y copia el enlace arriba';
    }
  }

  function confirmRestart() {
    if (confirm('¿Estás seguro de que deseas reiniciar la partida actual?')) {
      restartFromScratch();
    }
  }

  function startGame() {
    playSound('click');

    // Leer nombres configurados
    const t1Name = DOM.team1Input.value.trim() || 'Equipo Fénix';
    const t2Name = DOM.team2Input.value.trim() || 'Equipo Titanes';
    state.teams[1].name = t1Name;
    state.teams[2].name = t2Name;
    state.teams[1].score = 0;
    state.teams[2].score = 0;
    state.currentTurn = 1;
    state.currentRound = 1;
    state.matchedCount = 0;

    // Mostrar barra de marcadores y botón de reinicio
    DOM.scoreboard.style.display = 'flex';
    DOM.restartBtn.style.display = 'inline-flex';

    // Ocultar pantalla de configuración e iniciar Ronda 1
    DOM.setupScreen.style.display = 'none';
    DOM.resultsScreen.style.display = 'none';
    DOM.round2Screen.style.display = 'none';
    DOM.round1Screen.style.display = 'flex';

    updateScoreboard();
    buildRound1Board();

    proxiSay(`¡Comienza el juego! Ronda 1: Unir Tarjetas. Turno para ${state.teams[1].name}. Empareja un concepto con su definición.`, 'happy');
  }

  // RONDA 1: LÓGICA DE UNIR CONCEPTOS

  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function buildRound1Board() {
    DOM.conceptsContainer.innerHTML = '';
    DOM.definitionsContainer.innerHTML = '';
    DOM.round1Feedback.style.display = 'none';
    DOM.round1CompleteBox.style.display = 'none';

    state.selectedConceptCard = null;
    state.selectedDefinitionCard = null;
    state.matchedCount = 0;

    // Columna 1: Conceptos ordenados o mezclados
    const conceptsList = shuffleArray(CONCEPTS_DATA);
    conceptsList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'match-card concept-card';
      card.dataset.conceptId = item.id;
      card.innerHTML = `
        <span class="match-card-content">${item.concept}</span>
        <span class="match-card-status">●</span>
      `;
      card.addEventListener('click', () => onConceptCardClick(card));
      DOM.conceptsContainer.appendChild(card);
    });

    // Columna 2: Definiciones mezcladas aleatoriamente
    const definitionsList = shuffleArray(CONCEPTS_DATA);
    definitionsList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'match-card definition-card';
      card.dataset.conceptId = item.id;
      card.innerHTML = `
        <span class="match-card-content">${item.definition}</span>
        <span class="match-card-status">●</span>
      `;
      card.addEventListener('click', () => onDefinitionCardClick(card));
      DOM.definitionsContainer.appendChild(card);
    });

    updateScoreboard();
  }

  function onConceptCardClick(card) {
    if (card.classList.contains('matched')) return;
    playSound('click');

    // Deseleccionar concepto anterior si lo había
    if (state.selectedConceptCard) {
      state.selectedConceptCard.classList.remove('selected-team-1', 'selected-team-2');
    }

    state.selectedConceptCard = card;
    card.classList.add(`selected-team-${state.currentTurn}`);

    // Si ya había una definición seleccionada previamente, verificar coincidencia
    if (state.selectedDefinitionCard) {
      checkMatch();
    }
  }

  function onDefinitionCardClick(card) {
    if (card.classList.contains('matched')) return;
    playSound('click');

    // Deseleccionar definición anterior si la había
    if (state.selectedDefinitionCard) {
      state.selectedDefinitionCard.classList.remove('selected-team-1', 'selected-team-2');
    }

    state.selectedDefinitionCard = card;
    card.classList.add(`selected-team-${state.currentTurn}`);

    // Si ya había un concepto seleccionado, verificar coincidencia
    if (state.selectedConceptCard) {
      checkMatch();
    }
  }

  function checkMatch() {
    const conceptCard = state.selectedConceptCard;
    const defCard = state.selectedDefinitionCard;
    const teamNum = state.currentTurn;
    const team = state.teams[teamNum];

    const isMatch = conceptCard.dataset.conceptId === defCard.dataset.conceptId;

    if (isMatch) {
      // ¡ACIERTO! +10 Puntos
      playSound('match');
      team.score += 10;
      state.matchedCount++;

      conceptCard.classList.remove(`selected-team-${teamNum}`);
      defCard.classList.remove(`selected-team-${teamNum}`);

      conceptCard.classList.add('matched', `matched-team-${teamNum}`);
      defCard.classList.add('matched', `matched-team-${teamNum}`);

      conceptCard.querySelector('.match-card-status').textContent = '✓';
      defCard.querySelector('.match-card-status').textContent = '✓';

      const conceptItem = CONCEPTS_DATA.find(c => c.id === conceptCard.dataset.conceptId);

      // Feedback visual y de mascota
      showRound1Feedback(true, `¡Excelente deducción para ${team.name}! +10 puntos por asociar "${conceptItem.concept}".`);
      proxiSay(`¡Fantástico, ${team.name}! +10 puntos. Asociaron correctamente: ${conceptItem.concept}.`, 'happy');

      state.selectedConceptCard = null;
      state.selectedDefinitionCard = null;

      // Comprobar si se completaron los 6 pares
      if (state.matchedCount >= CONCEPTS_DATA.length) {
        setTimeout(onRound1Complete, 1200);
      } else {
        // Cambiar turno para que el otro equipo participe
        switchTurn();
      }
    } else {
      // ¡ERROR! Retroalimentación constructiva y rotación de turno
      playSound('wrong');

      conceptCard.classList.add('mismatch');
      defCard.classList.add('mismatch');

      const conceptItem = CONCEPTS_DATA.find(c => c.id === conceptCard.dataset.conceptId);
      showRound1Feedback(false, `¡Esa definición no corresponde a "${conceptItem.concept}"! Turno para ${state.teams[teamNum === 1 ? 2 : 1].name}.`);
      proxiSay(`¡Cerca! Esa no es la definición exacta de ${conceptItem.concept}. El turno pasa a ${state.teams[teamNum === 1 ? 2 : 1].name} para intentar.`, 'thinking');

      setTimeout(() => {
        conceptCard.classList.remove('mismatch', `selected-team-${teamNum}`);
        defCard.classList.remove('mismatch', `selected-team-${teamNum}`);
        state.selectedConceptCard = null;
        state.selectedDefinitionCard = null;
        switchTurn();
      }, 900);
    }

    updateScoreboard();
  }

  function showRound1Feedback(isSuccess, text) {
    DOM.round1Feedback.style.display = 'flex';
    DOM.round1FeedbackBadge.className = `feedback-badge ${isSuccess ? 'success' : 'error'}`;
    DOM.round1FeedbackBadge.textContent = isSuccess ? '✅ ¡Correcto!' : '❌ Intento Fallido';
    DOM.round1FeedbackText.textContent = text;
  }

  function onRound1Complete() {
    playSound('match');
    DOM.round1CompleteBox.style.display = 'flex';
    DOM.round1CompleteBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    proxiSay(`¡Impresionante trabajo de ambos equipos! Han dominado los 6 conceptos fundamentales de la proxémica. ¡Avanzamos a la Ronda 2!`, 'happy');
  }

  // RONDA 2: LÓGICA DE COMPLETAR FRASES 
  function startRound2() {
    playSound('click');
    state.currentRound = 2;
    state.currentQuestionIndex = 0;

    DOM.round1Screen.style.display = 'none';
    DOM.round2Screen.style.display = 'flex';

    updateScoreboard();
    loadQuestion(0);

    proxiSay(`¡Bienvenidos a la Ronda 2: Completar Frases! Cada respuesta correcta sumará 15 puntos. Turno de ${state.teams[state.currentTurn].name}.`, 'happy');
  }

  function loadQuestion(index) {
    const q = QUESTIONS_DATA[index];
    state.questionAnswered = false;

    // Actualizar metadatos de pregunta
    DOM.questionNumberBadge.textContent = `Pregunta ${index + 1} de ${QUESTIONS_DATA.length}`;
    const activeTeam = state.teams[state.currentTurn];
    DOM.questionTurnTag.textContent = `Turno de: ${activeTeam.name} (${activeTeam.badge})`;
    DOM.questionTurnTag.className = `question-turn-tag team-${state.currentTurn}`;

    // Enunciado
    DOM.questionStatement.innerHTML = q.statement;

    // Opciones desordenadas
    DOM.optionsGrid.innerHTML = '';
    DOM.explanationBox.style.display = 'none';

    const letters = ['A', 'B', 'C', 'D'];
    const shuffledOptions = shuffleArray(q.options);

    shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span class="option-letter">${letters[idx]}</span>
        <span class="option-text">${opt.text}</span>
      `;
      btn.addEventListener('click', () => handleOptionSelect(btn, opt, q));
      DOM.optionsGrid.appendChild(btn);
    });

    updateScoreboard();
  }

  function handleOptionSelect(btn, option, question) {
    if (state.questionAnswered) return;
    state.questionAnswered = true;

    const teamNum = state.currentTurn;
    const team = state.teams[teamNum];
    const optionButtons = DOM.optionsGrid.querySelectorAll('.option-btn');

    // Deshabilitar todos los botones
    optionButtons.forEach(b => b.disabled = true);

    if (option.isCorrect) {
      // ¡ACIERTO! +15 Puntos
      playSound('correct');
      btn.classList.add('correct');
      team.score += 15;

      DOM.explanationIcon.textContent = '🎉';
      DOM.explanationTitle.textContent = `¡Respuesta Correcta, ${team.name}! (+15 pts)`;
      DOM.explanationText.textContent = question.explanation;
      DOM.explanationBox.style.display = 'flex';

      proxiSay(`¡Extraordinario, ${team.name}! +15 puntos. ${question.explanation}`, 'happy');
    } else {
      // ¡ERROR! Mostrar respuesta correcta y explicación
      playSound('wrong');
      btn.classList.add('wrong');

      // Resaltar la correcta en verde
      optionButtons.forEach(b => {
        const text = b.querySelector('.option-text').textContent.trim();
        const correctOpt = question.options.find(o => o.isCorrect);
        if (text === correctOpt.text) {
          b.classList.add('correct');
        }
      });

      const correctOpt = question.options.find(o => o.isCorrect);
      DOM.explanationIcon.textContent = '💡';
      DOM.explanationTitle.textContent = `¡No te preocupes! La respuesta era: "${correctOpt.text}"`;
      DOM.explanationText.textContent = question.explanation;
      DOM.explanationBox.style.display = 'flex';

      proxiSay(`¡Cerca! La opción acertada era "${correctOpt.text}". Recuerda que: ${question.explanation}`, 'thinking');
    }

    updateScoreboard();

    // Cambiar etiqueta del botón en la última pregunta
    if (state.currentQuestionIndex >= QUESTIONS_DATA.length - 1) {
      DOM.nextQuestionBtn.querySelector('span').textContent = 'Ver Resultados Finales 🏆';
    } else {
      DOM.nextQuestionBtn.querySelector('span').textContent = 'Siguiente Frase ➔';
    }

    DOM.explanationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function handleNextQuestion() {
    playSound('click');
    state.currentQuestionIndex++;

    if (state.currentQuestionIndex < QUESTIONS_DATA.length) {
      // Alternar turno para la siguiente pregunta
      switchTurn();
      loadQuestion(state.currentQuestionIndex);
      proxiSay(`Siguiente reto. Turno para ${state.teams[state.currentTurn].name}. ¡A por esos 15 puntos!`, 'neutral');
    } else {
      // Fin del juego -> Mostrar pantalla de resultados
      showFinalResults();
    }
  }

  // PANTALLA FINAL: RESULTADOS
  function showFinalResults() {
    playSound('victory');

    DOM.round2Screen.style.display = 'none';
    DOM.resultsScreen.style.display = 'block';

    const t1 = state.teams[1];
    const t2 = state.teams[2];

    DOM.finalTeam1Badge.textContent = t1.badge;
    DOM.finalTeam2Badge.textContent = t2.badge;
    DOM.finalTeam1Name.textContent = t1.name;
    DOM.finalTeam2Name.textContent = t2.name;
    DOM.finalTeam1Points.textContent = t1.score;
    DOM.finalTeam2Points.textContent = t2.score;

    DOM.finalTeam1Box.classList.remove('winner-box');
    DOM.finalTeam2Box.classList.remove('winner-box');

    let victoryMessage = '';

    if (t1.score > t2.score) {
      DOM.finalTeam1Box.classList.add('winner-box');
      DOM.resultsTrophy.textContent = '🏆';
      DOM.winnerTitle.textContent = `¡${t1.name} es el Gran Campeón Proxémico!`;
      DOM.winnerMessage.textContent = `¡Felicitaciones a ${t1.name} por su increíble desempeño y puntuación de ${t1.score} puntos!`;
      victoryMessage = `¡Victoria para ${t1.name} con ${t1.score} puntos! Ambos equipos han demostrado un dominio excepcional de las distancias humanas.`;
    } else if (t2.score > t1.score) {
      DOM.finalTeam2Box.classList.add('winner-box');
      DOM.resultsTrophy.textContent = '🏆';
      DOM.winnerTitle.textContent = `¡${t2.name} es el Gran Campeón Proxémico!`;
      DOM.winnerMessage.textContent = `¡Felicitaciones a ${t2.name} por su magnífico desempeño y puntuación de ${t2.score} puntos!`;
      victoryMessage = `¡Victoria para ${t2.name} con ${t2.score} puntos! Un gran aplauso para ambos equipos por su respeto y entusiasmo.`;
    } else {
      DOM.resultsTrophy.textContent = '🤝';
      DOM.finalTeam1Box.classList.add('winner-box');
      DOM.finalTeam2Box.classList.add('winner-box');
      DOM.winnerTitle.textContent = '¡Un Empate Legendario!';
      DOM.winnerMessage.textContent = `Ambos equipos han empatado con ${t1.score} puntos. ¡Ambos son Maestros del Espacio Personal y la Empatía!`;
      victoryMessage = `¡Tenemos un emocionante empate con ${t1.score} puntos! Ambos equipos son campeones de la proxémica.`;
    }

    proxiSay(victoryMessage, 'happy');
    startConfetti();
  }
  // EFECTO DE CONFETI PARA CELEBRACIÓN 
  function startConfetti() {
    const canvas = DOM.confettiCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.offsetWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;

    window.addEventListener('resize', () => {
      if (DOM.resultsScreen.style.display !== 'none') {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
      }
    });

    const particles = [];
    const colors = ['#f59e0b', '#ec4899', '#38bdf8', '#10b981', '#a855f7', '#f43f5e', '#facc15'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 6 + 4,
        d: Math.random() * 90,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngleIncremental: Math.random() * 0.07 + 0.05,
        tiltAngle: 0
      });
    }

    if (state.confettiAnimationId) {
      cancelAnimationFrame(state.confettiAnimationId);
    }

    function renderConfetti() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();

        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngle) * 15;

        if (p.y > height) {
          p.x = Math.random() * width;
          p.y = -20;
          p.tilt = Math.random() * 10 - 10;
        }
      }

      state.confettiAnimationId = requestAnimationFrame(renderConfetti);
    }

    renderConfetti();
  }

  function stopConfetti() {
    if (state.confettiAnimationId) {
      cancelAnimationFrame(state.confettiAnimationId);
      state.confettiAnimationId = null;
    }
    const canvas = DOM.confettiCanvas;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // ------------------------------------------------------------
  // REINICIO DE PARTIDA
  // ------------------------------------------------------------
  function restartWithSameTeams() {
    stopConfetti();
    startGame();
  }

  function restartFromScratch() {
    stopConfetti();
    DOM.resultsScreen.style.display = 'none';
    DOM.round1Screen.style.display = 'none';
    DOM.round2Screen.style.display = 'none';
    DOM.scoreboard.style.display = 'none';
    DOM.restartBtn.style.display = 'none';
    DOM.setupScreen.style.display = 'flex';

    state.teams[1].score = 0;
    state.teams[2].score = 0;
    state.currentTurn = 1;
    state.currentRound = 1;
    state.matchedCount = 0;

    proxiSay('¡Reiniciamos la aventura! Configuren sus equipos y listos para volver a desafiarse.', 'happy');
  }

  // Iniciar la app
  document.addEventListener('DOMContentLoaded', initApp);

})();
