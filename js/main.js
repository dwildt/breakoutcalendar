document.addEventListener('DOMContentLoaded', async function() {
    try {
        await initializeI18n();
        initializeGame();
        displayRecords();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

let game = null;

function initializeGame() {
    game = new BreakoutGame();
    game.playerName = '';
    
    setupEventListeners();
}

function setupEventListeners() {
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const playerNameInput = document.getElementById('playerNameInput');
    
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => game.togglePause());
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', () => game.restart());
    }
    
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', showStartScreen);
    }
    
    if (playerNameInput) {
        playerNameInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
            if (e.target.value.length > 3) {
                e.target.value = e.target.value.slice(0, 3);
            }
        });
        
        playerNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                startGame();
            }
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Escape') {
            if (isGameScreenVisible()) {
                showStartScreen();
            }
        }
    });
    
    window.addEventListener('beforeunload', function(e) {
        if (game && game.isRunning && !game.isPaused) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

function startGame() {
    const playerNameInput = document.getElementById('playerNameInput');
    if (!playerNameInput) {
        return;
    }
    
    let playerName = playerNameInput.value.trim();
    
    if (!playerName) {
        playerName = 'AAA';
        playerNameInput.value = playerName;
    }
    
    if (playerName.length > 3) {
        playerName = playerName.slice(0, 3);
        playerNameInput.value = playerName;
    }
    
    if (!game) {
        return;
    }
    
    game.playerName = playerName;
    
    showGameScreen();
    
    setTimeout(() => {
        game.start();
    }, 100);
}

function showStartScreen() {
    document.getElementById('startScreen').classList.remove('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    
    if (game) {
        game.stop();
    }
    
    displayRecords();
    
    const playerNameInput = document.getElementById('playerNameInput');
    playerNameInput.focus();
}

function showGameScreen() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    
    document.getElementById('playerName').textContent = game.playerName;
    
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.textContent = (typeof getText === 'function' ? getText('pause') : null) || 'Pausar';
    }
}

function showGameOverScreen(score, blocksDestroyed, won = false) {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.remove('hidden');
    
    const gameOverTitle = document.querySelector('#gameOverScreen h2');
    if (gameOverTitle) {
        const congratsText = (typeof getText === 'function' ? getText('congratulations') : null) || 'Parabéns!';
        const gameOverText = (typeof getText === 'function' ? getText('gameOver') : null) || 'Fim de Jogo!';
        gameOverTitle.textContent = won ? congratsText : gameOverText;
    }
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('blocksDestroyed').textContent = blocksDestroyed;
    
    displayRecords();
    
    const playAgainBtn = document.getElementById('playAgainBtn');
    playAgainBtn.focus();
}

function isGameScreenVisible() {
    return !document.getElementById('gameScreen').classList.contains('hidden');
}

function validatePlayerName(name) {
    if (!name || typeof name !== 'string') {
        return false;
    }
    
    const cleanName = name.trim().toUpperCase();
    
    if (cleanName.length === 0 || cleanName.length > 3) {
        return false;
    }
    
    return /^[A-Z]+$/.test(cleanName);
}

function getGameStats() {
    if (!game) {
        return null;
    }
    
    return {
        playerName: game.playerName,
        score: game.score,
        lives: game.lives,
        blocksDestroyed: game.blocksDestroyed,
        isRunning: game.isRunning,
        isPaused: game.isPaused
    };
}

function updateGameUI() {
    if (!game) return;
    
    const stats = getGameStats();
    
    document.getElementById('score').textContent = stats.score;
    document.getElementById('lives').textContent = stats.lives;
    document.getElementById('playerName').textContent = stats.playerName;
}

function addGameControls() {
    const controlsDiv = document.querySelector('.game-controls');
    
    if (window.innerWidth <= 768) {
        const touchControls = document.createElement('div');
        touchControls.className = 'touch-controls';
        touchControls.innerHTML = `
            <div class="touch-instructions">
                <p data-i18n="touchInstructions">Toque e arraste na tela para mover a raquete</p>
            </div>
        `;
        
        controlsDiv.parentNode.insertBefore(touchControls, controlsDiv);
        
        // Apply translations to the newly created element
        if (typeof i18nManager !== 'undefined' && i18nManager.updateTexts) {
            i18nManager.updateTexts();
        }
    }
}

function handleVisibilityChange() {
    if (document.hidden && game && game.isRunning && !game.isPaused) {
        game.togglePause();
    }
}

document.addEventListener('visibilitychange', handleVisibilityChange);

function showAdvancedControls() {
    // Check if modal already exists
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3 data-i18n="gameControls">Controles do Jogo</h3>
            <div class="controls-list">
                <p><strong data-i18n="controlArrows">Setas ←/→ ou A/D:</strong> <span data-i18n="controlMovepaddle">Mover raquete</span></p>
                <p><strong data-i18n="controlMouse">Mouse/Touch:</strong> <span data-i18n="controlMovepaddle">Mover raquete</span></p>
                <p><strong data-i18n="controlSpace">Espaço:</strong> <span data-i18n="controlPause">Pausar/Retomar</span></p>
                <p><strong data-i18n="controlEsc">ESC:</strong> <span data-i18n="controlBackToMenu">Voltar ao menu</span></p>
            </div>
            <div class="modal-actions">
                <button onclick="exportRecords()" data-i18n="exportRecords">Exportar Recordes</button>
                <button onclick="importRecords()" data-i18n="importRecords">Importar Recordes</button>
                <button onclick="clearRecords()" data-i18n="clearRecords">Limpar Recordes</button>
                <button onclick="closeModal()" data-i18n="close">Fechar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Apply translations to the modal
    if (typeof i18nManager !== 'undefined' && i18nManager.updateTexts) {
        i18nManager.updateTexts();
    }
    
    window.closeModal = function() {
        const modalToClose = document.querySelector('.modal');
        if (modalToClose) {
            modalToClose.remove();
        }
    };
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

window.addEventListener('resize', function() {
    if (game) {
        game.resize();
    }
});

window.addEventListener('load', function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(function(error) {
            console.log('ServiceWorker registration failed: ', error);
        });
    }
});

addGameControls();

// Severance Mode functionality
function toggleSeveranceMode() {
    const body = document.body;
    const btn = document.getElementById('severanceModeBtn');
    
    if (body.classList.contains('severance-mode')) {
        // Disable Severance Mode
        body.classList.remove('severance-mode');
        btn.classList.remove('active');
        localStorage.setItem('severanceMode', 'false');
    } else {
        // Enable Severance Mode
        body.classList.add('severance-mode');
        btn.classList.add('active');
        localStorage.setItem('severanceMode', 'true');
    }
}

function initializeSeveranceMode() {
    const severanceMode = localStorage.getItem('severanceMode');
    const body = document.body;
    const btn = document.getElementById('severanceModeBtn');
    
    if (severanceMode === 'true') {
        body.classList.add('severance-mode');
        if (btn) btn.classList.add('active');
    }
}

// Initialize Severance Mode on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSeveranceMode();
});