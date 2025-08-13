const translations = {
    pt: {
        title: "Breakout Calendar",
        gameTitle: "Breakout Calendar",
        player: "Jogador",
        score: "Pontos",
        lives: "Vidas",
        pause: "Pausar",
        restart: "Reiniciar",
        welcome: "Bem-vindo ao Breakout Calendar!",
        instructions: "Quebre os compromissos da sua agenda com a bola!",
        legend: "Legenda dos Blocos:",
        lightAppointment: "Compromisso Leve (1 hit)",
        mediumAppointment: "Compromisso Médio (2 hits)",
        meetingAppointment: "Reunião (3 hits)",
        allHandsAppointment: "All Hands (Indestrutível)",
        enterName: "Digite seu nome (máx 3 letras):",
        start: "Começar",
        records: "Recordes:",
        gameOver: "Fim de Jogo!",
        finalScore: "Pontuação Final:",
        blocksDestroyed: "Blocos Destruídos:",
        playAgain: "Jogar Novamente",
        sourceCode: "Código Fonte",
        sponsor: "Apoiar",
        resume: "Retomar",
        monday: "SEG",
        tuesday: "TER",
        wednesday: "QUA",
        thursday: "QUI",
        friday: "SEX",
        saturday: "SAB",
        sunday: "DOM"
    },
    en: {
        title: "Breakout Calendar",
        gameTitle: "Breakout Calendar",
        player: "Player",
        score: "Score",
        lives: "Lives",
        pause: "Pause",
        restart: "Restart",
        welcome: "Welcome to Breakout Calendar!",
        instructions: "Break your calendar appointments with the ball!",
        legend: "Block Legend:",
        lightAppointment: "Light Appointment (1 hit)",
        mediumAppointment: "Medium Appointment (2 hits)",
        meetingAppointment: "Meeting (3 hits)",
        allHandsAppointment: "All Hands (Indestructible)",
        enterName: "Enter your name (max 3 letters):",
        start: "Start",
        records: "Records:",
        gameOver: "Game Over!",
        finalScore: "Final Score:",
        blocksDestroyed: "Blocks Destroyed:",
        playAgain: "Play Again",
        sourceCode: "Source Code",
        sponsor: "Sponsor",
        resume: "Resume",
        monday: "MON",
        tuesday: "TUE",
        wednesday: "WED",
        thursday: "THU",
        friday: "FRI",
        saturday: "SAT",
        sunday: "SUN"
    },
    es: {
        title: "Breakout Calendar",
        gameTitle: "Breakout Calendar",
        player: "Jugador",
        score: "Puntos",
        lives: "Vidas",
        pause: "Pausar",
        restart: "Reiniciar",
        welcome: "¡Bienvenido a Breakout Calendar!",
        instructions: "¡Rompe las citas de tu calendario con la pelota!",
        legend: "Leyenda de Bloques:",
        lightAppointment: "Cita Ligera (1 golpe)",
        mediumAppointment: "Cita Media (2 golpes)",
        meetingAppointment: "Reunión (3 golpes)",
        allHandsAppointment: "All Hands (Indestructible)",
        enterName: "Ingresa tu nombre (máx 3 letras):",
        start: "Comenzar",
        records: "Récords:",
        gameOver: "¡Fin del Juego!",
        finalScore: "Puntuación Final:",
        blocksDestroyed: "Bloques Destruidos:",
        playAgain: "Jugar de Nuevo",
        sourceCode: "Código Fuente",
        sponsor: "Patrocinar",
        resume: "Reanudar",
        monday: "LUN",
        tuesday: "MAR",
        wednesday: "MIÉ",
        thursday: "JUE",
        friday: "VIE",
        saturday: "SÁB",
        sunday: "DOM"
    }
};

let currentLanguage = 'pt';

function loadLanguage() {
    const savedLang = localStorage.getItem('language');
    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
    }
}

function changeLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        updateTexts();
        updateDocumentLanguage();
    }
}

function updateTexts() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
}

function updateDocumentLanguage() {
    document.documentElement.lang = currentLanguage === 'pt' ? 'pt-BR' : 
                                   currentLanguage === 'es' ? 'es-ES' : 'en-US';
}

function getText(key) {
    return translations[currentLanguage][key] || key;
}

function initializeI18n() {
    loadLanguage();
    updateTexts();
    updateDocumentLanguage();
}