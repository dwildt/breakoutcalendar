// Mock das traduções para teste
const translations = {
    pt: { monday: 'SEG', tuesday: 'TER' },
    en: { monday: 'MON', tuesday: 'TUE' },
    es: { monday: 'LUN', tuesday: 'MAR' }
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

describe('Internationalization', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.lang = '';
        currentLanguage = 'pt';
    });

    test('should load default language as Portuguese', () => {
        loadLanguage();
        expect(currentLanguage).toBe('pt');
    });

    test('should load saved language from localStorage', () => {
        localStorage.setItem('language', 'en');
        loadLanguage();
        expect(currentLanguage).toBe('en');
    });

    test('should change language and save to localStorage', () => {
        changeLanguage('es');
        expect(currentLanguage).toBe('es');
        expect(localStorage.getItem('language')).toBe('es');
    });

    test('should not change to invalid language', () => {
        const originalLang = currentLanguage;
        changeLanguage('invalid');
        expect(currentLanguage).toBe(originalLang);
    });

    test('should return correct text for given key', () => {
        currentLanguage = 'en';
        const result = getText('monday');
        expect(result).toBe('MON');
    });

    test('should return key if translation not found', () => {
        currentLanguage = 'pt';
        const result = getText('nonexistent');
        expect(result).toBe('nonexistent');
    });

    test('should update document language attribute', () => {
        currentLanguage = 'en';
        updateDocumentLanguage();
        expect(document.documentElement.lang).toBe('en-US');
        
        currentLanguage = 'es';
        updateDocumentLanguage();
        expect(document.documentElement.lang).toBe('es-ES');
        
        currentLanguage = 'pt';
        updateDocumentLanguage();
        expect(document.documentElement.lang).toBe('pt-BR');
    });

    test('should update text elements with data-i18n attribute', () => {
        document.body.innerHTML = `
            <span data-i18n="monday">Test</span>
            <div data-i18n="tuesday">Test2</div>
        `;
        
        currentLanguage = 'pt';
        updateTexts();
        
        expect(document.querySelector('[data-i18n="monday"]').textContent).toBe('SEG');
        expect(document.querySelector('[data-i18n="tuesday"]').textContent).toBe('TER');
    });

    test('should initialize i18n correctly', () => {
        localStorage.setItem('language', 'es');
        document.body.innerHTML = '<span data-i18n="monday">Test</span>';
        
        initializeI18n();
        
        expect(currentLanguage).toBe('es');
        expect(document.documentElement.lang).toBe('es-ES');
        expect(document.querySelector('[data-i18n="monday"]').textContent).toBe('LUN');
    });
});