export default [
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'script',
            globals: {
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                alert: 'readonly',
                confirm: 'readonly',
                localStorage: 'readonly',
                fetch: 'readonly',
                navigator: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                requestAnimationFrame: 'readonly',
                cancelAnimationFrame: 'readonly',
                Image: 'readonly',
                FileReader: 'readonly',
                Blob: 'readonly',
                URL: 'readonly',
                // Project globals
                BreakoutGame: 'readonly',
                I18nManager: 'readonly',
                RecordsManager: 'readonly',
                game: 'writable',
                i18nManager: 'readonly',
                recordsManager: 'readonly',
                getText: 'readonly',
                changeLanguage: 'readonly',
                initializeI18n: 'readonly',
                saveRecord: 'readonly',
                displayRecords: 'readonly',
                clearRecords: 'readonly',
                exportRecords: 'readonly',
                importRecords: 'readonly',
                showStartScreen: 'readonly',
                showGameScreen: 'readonly',
                showGameOverScreen: 'readonly',
                isGameScreenVisible: 'readonly',
                validatePlayerName: 'readonly',
                getGameStats: 'readonly',
                updateGameUI: 'readonly',
                addGameControls: 'readonly',
                showAdvancedControls: 'readonly',
                closeModal: 'readonly',
                setTheme: 'readonly',
                initializeTheme: 'readonly'
            }
        },
        rules: {
            'indent': ['error', 4],
            'quotes': ['error', 'single', { avoidEscape: true }],
            'semi': ['error', 'always'],
            'no-console': 'off',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-undef': 'error'
        }
    },
    {
        files: ['tests/**/*.js'],
        languageOptions: {
            globals: {
                // Jest globals
                describe: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                jest: 'readonly',
                global: 'writable',
                HTMLCanvasElement: 'readonly'
            }
        }
    },
    {
        ignores: ['node_modules/**', 'coverage/**', 'dist/**', '*.min.js']
    }
];
