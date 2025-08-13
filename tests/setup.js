const createLocalStorageMock = () => {
    let store = {};
    return {
        store,
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value; }),
        removeItem: jest.fn((key) => { delete store[key]; }),
        clear: jest.fn(() => { 
            store = {}; 
            createLocalStorageMock.store = store;
        })
    };
};

global.localStorage = createLocalStorageMock();

global.alert = jest.fn();
global.confirm = jest.fn(() => true);

global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(clearTimeout);

Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024
});

Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768
});

Object.defineProperty(window, 'devicePixelRatio', {
    writable: true,
    configurable: true,
    value: 1
});

HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    fillText: jest.fn(),
    createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn()
    })),
    scale: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    canvas: {
        width: 800,
        height: 600
    }
}));

beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    global.localStorage = createLocalStorageMock();
});

const translations = {
    pt: { monday: 'SEG', tuesday: 'TER' },
    en: { monday: 'MON', tuesday: 'TUE' },
    es: { monday: 'LUN', tuesday: 'MAR' }
};

global.getText = jest.fn((key) => translations.pt[key] || key);
global.currentLanguage = 'pt';