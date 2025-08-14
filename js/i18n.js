class I18nManager {
    constructor() {
        this.translations = {};
        this.currentLanguage = 'pt';
        this.supportedLanguages = ['pt', 'en', 'es'];
        this.fallbackLanguage = 'pt';
    }

    async loadTranslations() {
        try {
            const loadPromises = this.supportedLanguages.map(async (lang) => {
                const response = await fetch(`./translations/${lang}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load ${lang} translations`);
                }
                const translations = await response.json();
                this.translations[lang] = translations;
            });

            await Promise.all(loadPromises);
        } catch (error) {
            console.error('Error loading translations:', error);
            this.loadFallbackTranslations();
        }
    }

    loadFallbackTranslations() {
        this.translations = {
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
                sunday: "DOM",
                congratulations: "Parabéns!",
                noRecords: "Nenhum recorde ainda",
                confirmClearRecords: "Tem certeza que deseja limpar todos os recordes?",
                confirmImportRecords: "Importar recordes? Isso substituirá os recordes atuais.",
                recordsImported: "Recordes importados com sucesso!",
                importError: "Erro ao importar recordes. Verifique o arquivo.",
                newRecord: "Novo recorde! Parabéns!",
                touchInstructions: "Toque e arraste na tela para mover a raquete"
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
                sunday: "SUN",
                congratulations: "Congratulations!",
                noRecords: "No records yet",
                confirmClearRecords: "Are you sure you want to clear all records?",
                confirmImportRecords: "Import records? This will replace current records.",
                recordsImported: "Records imported successfully!",
                importError: "Error importing records. Check the file.",
                newRecord: "New record! Congratulations!",
                touchInstructions: "Touch and drag on screen to move the paddle"
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
                sunday: "DOM",
                congratulations: "¡Felicitaciones!",
                noRecords: "Aún no hay récords",
                confirmClearRecords: "¿Estás seguro de que quieres borrar todos los récords?",
                confirmImportRecords: "¿Importar récords? Esto reemplazará los récords actuales.",
                recordsImported: "¡Récords importados exitosamente!",
                importError: "Error al importar récords. Verifica el archivo.",
                newRecord: "¡Nuevo récord! ¡Felicitaciones!",
                touchInstructions: "Toca y arrastra en la pantalla para mover la paleta"
            }
        };
    }

    loadLanguage() {
        const savedLang = localStorage.getItem('language');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLanguage = savedLang;
        }
    }

    changeLanguage(lang) {
        if (this.supportedLanguages.includes(lang)) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.updateTexts();
            this.updateDocumentLanguage();
        }
    }

    updateTexts() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getText(key);
            if (translation) {
                element.textContent = translation;
            }
        });
    }

    updateDocumentLanguage() {
        const languageMap = {
            'pt': 'pt-BR',
            'en': 'en-US',
            'es': 'es-ES'
        };
        document.documentElement.lang = languageMap[this.currentLanguage] || 'pt-BR';
    }

    getText(key) {
        const currentTranslations = this.translations[this.currentLanguage];
        const fallbackTranslations = this.translations[this.fallbackLanguage];
        
        return currentTranslations?.[key] || 
               fallbackTranslations?.[key] || 
               key;
    }

    async initialize() {
        await this.loadTranslations();
        this.loadLanguage();
        this.updateTexts();
        this.updateDocumentLanguage();
    }

    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

const i18nManager = new I18nManager();

function getText(key) {
    return i18nManager.getText(key);
}

function changeLanguage(lang) {
    i18nManager.changeLanguage(lang);
}

async function initializeI18n() {
    await i18nManager.initialize();
}