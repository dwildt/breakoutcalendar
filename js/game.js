class BreakoutGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Cannot get 2D context');
            return;
        }
        
        
        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.lives = 3;
        this.blocksDestroyed = 0;
        this.playerName = '';
        
        this.paddle = {
            width: 100,
            height: 15,
            x: 0,
            y: 0,
            speed: 7
        };
        
        this.ball = {
            x: 0,
            y: 0,
            radius: 8,
            dx: 4,
            dy: -4,
            speed: 4
        };
        
        this.blocks = [];
        this.blockTypes = {
            LIGHT: { hits: 1, points: 10 },
            MEDIUM: { hits: 2, points: 20 },
            MEETING: { hits: 3, points: 30 },
            ALL_HANDS: { hits: Infinity, points: 0 }
        };
        
        this.keys = {
            left: false,
            right: false
        };
        
        this.animationFrame = null;
        this.setupEventListeners();
        
        // Set fixed canvas dimensions
        this.canvas.width = 800;
        this.canvas.height = 600;
    }
    
    getBlockColors() {
        const isSeveranceMode = document.body.classList.contains('severance-mode');
        
        if (isSeveranceMode) {
            return {
                LIGHT: '#38bdf8',      // azul céu
                MEDIUM: '#2563eb',     // azul cobalto
                MEETING: '#1d4ed8',    // azul royal
                ALL_HANDS: '#0284c7'   // azul oceano
            };
        } else {
            return {
                LIGHT: '#4caf50',      // verde
                MEDIUM: '#ff9800',     // laranja
                MEETING: '#f44336',    // vermelho
                ALL_HANDS: '#ff7b00'   // laranja Wildtech
            };
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                this.keys.left = true;
                e.preventDefault();
            }
            if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                this.keys.right = true;
                e.preventDefault();
            }
            if (e.code === 'Space') {
                this.togglePause();
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                this.keys.left = false;
            }
            if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                this.keys.right = false;
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isRunning && !this.isPaused) {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const scaleX = this.canvas.width / rect.width;
                this.paddle.x = (mouseX * scaleX) - (this.paddle.width / 2);
                
                this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.paddle.x));
            }
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            if (this.isRunning && !this.isPaused) {
                e.preventDefault();
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                const touchX = touch.clientX - rect.left;
                const scaleX = this.canvas.width / rect.width;
                this.paddle.x = (touchX * scaleX) - (this.paddle.width / 2);
                
                this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.paddle.x));
            }
        });
    }
    
    resize() {
        // Keep canvas internal dimensions fixed at 800x600
        // Only adjust CSS styling for responsive display
        const maxWidth = Math.min(window.innerWidth - 40, 800);
        const aspectRatio = 600 / 800;
        const maxHeight = maxWidth * aspectRatio;
        
        this.canvas.style.width = maxWidth + 'px';
        this.canvas.style.height = maxHeight + 'px';
        
        if (!this.isRunning) {
            this.initializePositions();
        }
    }
    
    initializePositions() {
        const canvasWidth = 800;
        const canvasHeight = 600;
        
        this.paddle.x = (canvasWidth - this.paddle.width) / 2;
        this.paddle.y = canvasHeight - this.paddle.height - 20;
        
        this.ball.x = canvasWidth / 2;
        this.ball.y = this.paddle.y - this.ball.radius - 5;
    }
    
    createBlocks() {
        this.blocks = [];
        const canvasWidth = 800;
        const cols = 7;
        const rows = 6;
        const blockWidth = (canvasWidth - 40) / cols;
        const blockHeight = 30;
        const padding = 5;
        
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let type;
                const random = Math.random();
                
                if (random < 0.05) {
                    type = 'ALL_HANDS';
                } else if (random < 0.2) {
                    type = 'MEETING';
                } else if (random < 0.5) {
                    type = 'MEDIUM';
                } else {
                    type = 'LIGHT';
                }
                
                const block = {
                    x: col * (blockWidth + padding) + 20,
                    y: row * (blockHeight + padding) + 80,
                    width: blockWidth - padding,
                    height: blockHeight,
                    type: type,
                    hits: this.blockTypes[type].hits,
                    maxHits: this.blockTypes[type].hits,
                    day: days[col],
                    destroyed: false
                };
                
                this.blocks.push(block);
            }
        }
    }
    
    start() {
        this.isRunning = true;
        this.isPaused = false;
        this.score = 0;
        this.lives = 3;
        this.blocksDestroyed = 0;
        
        this.initializePositions();
        this.createBlocks();
        this.updateUI();
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.isRunning) {
            return;
        }
        
        if (!this.isPaused) {
            this.update();
        }
        
        try {
            this.render();
        } catch (error) {
            console.error('Error in render:', error);
            return;
        }
        
        this.animationFrame = requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        this.updatePaddle();
        this.updateBall();
        this.checkCollisions();
        this.checkWinLose();
    }
    
    updatePaddle() {
        const canvasWidth = 800;
        
        if (this.keys.left && this.paddle.x > 0) {
            this.paddle.x -= this.paddle.speed;
        }
        if (this.keys.right && this.paddle.x < canvasWidth - this.paddle.width) {
            this.paddle.x += this.paddle.speed;
        }
        
        this.paddle.x = Math.max(0, Math.min(canvasWidth - this.paddle.width, this.paddle.x));
    }
    
    updateBall() {
        const canvasWidth = 800;
        const canvasHeight = 600;
        
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        if (this.ball.x <= this.ball.radius || this.ball.x >= canvasWidth - this.ball.radius) {
            this.ball.dx = -this.ball.dx;
        }
        
        if (this.ball.y <= this.ball.radius) {
            this.ball.dy = -this.ball.dy;
        }
        
        if (this.ball.y >= canvasHeight - this.ball.radius) {
            this.lives--;
            this.updateUI();
            
            if (this.lives > 0) {
                this.resetBall();
            }
        }
    }
    
    checkCollisions() {
        if (this.ball.y + this.ball.radius >= this.paddle.y &&
            this.ball.y - this.ball.radius <= this.paddle.y + this.paddle.height &&
            this.ball.x >= this.paddle.x &&
            this.ball.x <= this.paddle.x + this.paddle.width) {
            
            this.ball.dy = -Math.abs(this.ball.dy);
            
            const hitPos = (this.ball.x - this.paddle.x) / this.paddle.width;
            const angle = (hitPos - 0.5) * Math.PI / 3;
            const speed = Math.sqrt(this.ball.dx * this.ball.dx + this.ball.dy * this.ball.dy);
            
            this.ball.dx = Math.sin(angle) * speed;
            this.ball.dy = -Math.abs(Math.cos(angle) * speed);
        }
        
        for (let block of this.blocks) {
            if (block.destroyed) continue;
            
            if (this.ball.x + this.ball.radius >= block.x &&
                this.ball.x - this.ball.radius <= block.x + block.width &&
                this.ball.y + this.ball.radius >= block.y &&
                this.ball.y - this.ball.radius <= block.y + block.height) {
                
                this.ball.dy = -this.ball.dy;
                
                if (block.type !== 'ALL_HANDS') {
                    block.hits--;
                    
                    if (block.hits <= 0) {
                        block.destroyed = true;
                        this.blocksDestroyed++;
                        this.score += this.blockTypes[block.type].points;
                        this.updateUI();
                    }
                }
                
                break;
            }
        }
    }
    
    checkWinLose() {
        if (this.lives <= 0) {
            this.gameOver();
            return;
        }
        
        const destructibleBlocks = this.blocks.filter(block => block.type !== 'ALL_HANDS');
        const destroyedBlocks = destructibleBlocks.filter(block => block.destroyed);
        
        if (destroyedBlocks.length === destructibleBlocks.length) {
            this.gameWon();
        }
    }
    
    resetBall() {
        this.ball.x = this.paddle.x + this.paddle.width / 2;
        this.ball.y = this.paddle.y - this.ball.radius - 5;
        this.ball.dx = (Math.random() - 0.5) * 6;
        this.ball.dy = -Math.abs(this.ball.dy);
    }
    
    render() {
        if (!this.canvas || !this.ctx) {
            console.error('Canvas or context not available');
            return;
        }
        
        const canvasWidth = 800;
        const canvasHeight = 600;
        
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        this.renderBlocks();
        this.renderPaddle();
        this.renderBall();
        this.renderDayLabels();
        
        if (this.isPaused) {
            this.renderPauseScreen();
        }
    }
    
    renderBlocks() {
        const colors = this.getBlockColors();
        
        this.blocks.forEach(block => {
            if (block.destroyed) return;
            
            let alpha = 1;
            
            if (block.type !== 'ALL_HANDS' && block.hits < block.maxHits) {
                alpha = 0.3 + (0.7 * block.hits / block.maxHits);
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            
            if (block.type === 'ALL_HANDS') {
                const isSeveranceMode = document.body.classList.contains('severance-mode');
                const gradient = this.ctx.createLinearGradient(
                    block.x, block.y, 
                    block.x + block.width, block.y + block.height
                );
                
                if (isSeveranceMode) {
                    gradient.addColorStop(0, '#0284c7');  // azul oceano
                    gradient.addColorStop(1, '#0369a1');  // azul profundo
                } else {
                    gradient.addColorStop(0, '#8b4513');  // marrom
                    gradient.addColorStop(1, '#ff7b00');  // laranja
                }
                this.ctx.fillStyle = gradient;
            } else {
                this.ctx.fillStyle = colors[block.type];
            }
            
            this.ctx.fillRect(block.x, block.y, block.width, block.height);
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(block.x, block.y, block.width, block.height);
            
            this.ctx.restore();
        });
    }
    
    renderPaddle() {
        const isSeveranceMode = document.body.classList.contains('severance-mode');
        
        if (isSeveranceMode) {
            this.ctx.fillStyle = '#00d4aa';  // ciano Severance
        } else {
            this.ctx.fillStyle = '#ff7b00';  // laranja Wildtech
        }
        
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    }
    
    renderBall() {
        const isSeveranceMode = document.body.classList.contains('severance-mode');
        
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        
        if (isSeveranceMode) {
            this.ctx.strokeStyle = '#00d4aa';  // ciano Severance
        } else {
            this.ctx.strokeStyle = '#ff7b00';  // laranja Wildtech
        }
        
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    renderDayLabels() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const canvasWidth = 800;
        const blockWidth = (canvasWidth - 40) / 7;
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        days.forEach((day, index) => {
            const x = index * (blockWidth + 5) + 20 + blockWidth / 2;
            const dayText = (typeof getText === 'function' ? getText(day) : null) || day.toUpperCase().slice(0, 3);
            this.ctx.fillText(dayText, x, 70);
        });
    }
    
    renderPauseScreen() {
        const canvasWidth = 800;
        const canvasHeight = 600;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSADO', canvasWidth / 2, canvasHeight / 2);
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Pressione ESPAÇO para continuar', canvasWidth / 2, canvasHeight / 2 + 40);
    }
    
    togglePause() {
        if (!this.isRunning) return;
        
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            const resumeText = (typeof getText === 'function' ? getText('resume') : null) || 'Retomar';
            const pauseText = (typeof getText === 'function' ? getText('pause') : null) || 'Pausar';
            pauseBtn.textContent = this.isPaused ? resumeText : pauseText;
        }
    }
    
    stop() {
        this.isRunning = false;
        this.isPaused = false;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    gameOver() {
        this.stop();
        saveRecord(this.playerName, this.score, this.blocksDestroyed);
        showGameOverScreen(this.score, this.blocksDestroyed);
    }
    
    gameWon() {
        this.stop();
        saveRecord(this.playerName, this.score, this.blocksDestroyed);
        showGameOverScreen(this.score, this.blocksDestroyed, true);
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
    }
    
    restart() {
        this.stop();
        this.start();
    }
}

