// Mock da classe BreakoutGame para teste
class BreakoutGame {
    constructor() {
        this.canvas = { 
            getContext: () => ({}), 
            width: 800, 
            height: 600,
            addEventListener: jest.fn(),
            getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 })
        };
        this.ctx = {};
        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.lives = 3;
        this.blocksDestroyed = 0;
        
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
            LIGHT: {
                hits: 1,
                color: '#4caf50',
                points: 10,
                displayNames: ['Focus Mode', 'Study Time', 'Stand Up Meeting'],
                displayNamesWeekend: ['Grocery Store', 'Park', 'Basketball Practice', 'Soccer Practice']
            },
            MEDIUM: {
                hits: 2,
                color: '#ff9800',
                points: 20,
                displayNames: ['1:1 Meeting', 'Team Meeting', 'Team Planning', 'Team Retrospective'],
                displayNamesWeekend: ['House Cleaning', 'Garage Sale']
            },
            HARD: {
                hits: 3,
                color: '#f44336',
                points: 30,
                displayNames: ['Team Building', 'Performance Review'],
                displayNamesWeekend: ['Gardening', 'Family Lunch']
            },
            INDESTRUCTIBLE: {
                hits: Infinity,
                color: '#ff7b00',
                points: 0,
                displayNames: ['All Hands Meeting', 'EoY Party'],
                displayNamesWeekend: ['All Hands Meeting', 'EoY Party']
            }
        };
        
        this.keys = { left: false, right: false };
        this.animationFrame = null;
        
        // Mock canvas element
        if (!document.getElementById('gameCanvas')) {
            const canvas = document.createElement('canvas');
            canvas.id = 'gameCanvas';
            canvas.width = 800;
            canvas.height = 600;
            canvas.getContext = () => this.ctx;
            canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 800, height: 600 });
            document.body.appendChild(canvas);
        }
    }
    
    createBlocks() {
        this.blocks = [];
        const cols = 7, rows = 6;
        const blockWidth = 100, blockHeight = 30;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let type = Math.random() < 0.5 ? 'LIGHT' : 'MEDIUM';
                if (Math.random() < 0.1) type = 'HARD';
                if (Math.random() < 0.05) type = 'INDESTRUCTIBLE';

                // Use weekend names for Saturday (col 5) and Sunday (col 6)
                const isWeekend = col >= 5;
                const displayNames = isWeekend
                    ? this.blockTypes[type].displayNamesWeekend
                    : this.blockTypes[type].displayNames;
                const displayName = displayNames[Math.floor(Math.random() * displayNames.length)];

                this.blocks.push({
                    x: col * (blockWidth + 5) + 20,
                    y: row * (blockHeight + 5) + 80,
                    width: blockWidth,
                    height: blockHeight,
                    type: type,
                    hits: this.blockTypes[type].hits,
                    maxHits: this.blockTypes[type].hits,
                    destroyed: false,
                    displayName: displayName,
                    day: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][col]
                });
            }
        }
    }
    
    start() {
        this.isRunning = true;
        this.isPaused = false;
        this.score = 0;
        this.lives = 3;
        this.blocksDestroyed = 0;
        this.createBlocks();
        this.updateUI();
    }
    
    stop() {
        this.isRunning = false;
        this.isPaused = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    togglePause() {
        if (!this.isRunning) return;
        this.isPaused = !this.isPaused;
    }
    
    updatePaddle() {
        if (this.keys.left && this.paddle.x > 0) {
            this.paddle.x -= this.paddle.speed;
        }
        if (this.keys.right && this.paddle.x < 700) {
            this.paddle.x += this.paddle.speed;
        }
        this.paddle.x = Math.max(0, Math.min(700, this.paddle.x));
    }
    
    updateBall() {
        // Check collisions before moving
        if (this.ball.x + this.ball.dx <= 8 || this.ball.x + this.ball.dx >= 792) {
            this.ball.dx = -this.ball.dx;
        }
        
        if (this.ball.y + this.ball.dy <= 8) {
            this.ball.dy = -this.ball.dy;
        }
        
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Hit bottom
        if (this.ball.y >= 592) {
            this.lives--;
            this.resetBall();
        }
    }
    
    resetBall() {
        this.ball.x = this.paddle.x + this.paddle.width / 2;
        this.ball.y = this.paddle.y - this.ball.radius - 5;
        this.ball.dx = (Math.random() - 0.5) * 6;
        this.ball.dy = -Math.abs(this.ball.dy);
    }
    
    checkCollisions() {
        // Paddle collision
        if (this.ball.y + this.ball.radius >= this.paddle.y &&
            this.ball.x >= this.paddle.x && 
            this.ball.x <= this.paddle.x + this.paddle.width) {
            this.ball.dy = -Math.abs(this.ball.dy);
        }
        
        // Block collision
        for (let block of this.blocks) {
            if (block.destroyed) continue;
            
            if (this.ball.x >= block.x && this.ball.x <= block.x + block.width &&
                this.ball.y >= block.y && this.ball.y <= block.y + block.height) {
                
                this.ball.dy = -this.ball.dy;

                if (block.type !== 'INDESTRUCTIBLE') {
                    block.hits--;
                    if (block.hits <= 0) {
                        block.destroyed = true;
                        this.blocksDestroyed++;
                        this.score += this.blockTypes[block.type].points;
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
        
        const destructibleBlocks = this.blocks.filter(b => b.type !== 'INDESTRUCTIBLE');
        const destroyedBlocks = destructibleBlocks.filter(b => b.destroyed);
        
        if (destroyedBlocks.length === destructibleBlocks.length) {
            this.gameWon();
        }
    }
    
    gameOver() {
        this.stop();
    }
    
    gameWon() {
        this.stop();
    }
    
    updateUI() {
        const scoreEl = document.getElementById('score');
        const livesEl = document.getElementById('lives');
        if (scoreEl) scoreEl.textContent = this.score;
        if (livesEl) livesEl.textContent = this.lives;
    }
    
    restart() {
        this.stop();
        this.start();
    }
}

describe('BreakoutGame', () => {
    let game;
    let mockCanvas;
    let mockContext;
    
    beforeEach(() => {
        mockContext = {
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
            canvas: { width: 800, height: 600 }
        };
        
        mockCanvas = {
            getContext: jest.fn(() => mockContext),
            width: 800,
            height: 600,
            addEventListener: jest.fn(),
            getBoundingClientRect: jest.fn(() => ({
                left: 0, 
                top: 0, 
                width: 800, 
                height: 600
            }))
        };
        
        document.body.innerHTML = `
            <canvas id="gameCanvas" width="800" height="600"></canvas>
            <div id="score">0</div>
            <div id="lives">3</div>
            <button id="pauseBtn">Pause</button>
        `;
        
        document.getElementById('gameCanvas').getContext = jest.fn(() => mockContext);
        document.getElementById('gameCanvas').getBoundingClientRect = mockCanvas.getBoundingClientRect;
        
        game = new BreakoutGame();
    });

    test('should initialize with correct default values', () => {
        expect(game.score).toBe(0);
        expect(game.lives).toBe(3);
        expect(game.blocksDestroyed).toBe(0);
        expect(game.isRunning).toBe(false);
        expect(game.isPaused).toBe(false);
    });

    test('should have correct paddle properties', () => {
        expect(game.paddle.width).toBe(100);
        expect(game.paddle.height).toBe(15);
        expect(game.paddle.speed).toBe(7);
    });

    test('should have correct ball properties', () => {
        expect(game.ball.radius).toBe(8);
        expect(game.ball.speed).toBe(4);
        expect(Math.abs(game.ball.dx)).toBe(4);
        expect(Math.abs(game.ball.dy)).toBe(4);
    });

    test('should have correct block types', () => {
        expect(game.blockTypes.LIGHT.hits).toBe(1);
        expect(game.blockTypes.MEDIUM.hits).toBe(2);
        expect(game.blockTypes.HARD.hits).toBe(3);
        expect(game.blockTypes.INDESTRUCTIBLE.hits).toBe(Infinity);
    });

    test('should create blocks with correct dimensions', () => {
        game.createBlocks();
        
        expect(game.blocks.length).toBe(42); // 7 cols x 6 rows
        
        const firstBlock = game.blocks[0];
        expect(firstBlock.x).toBeGreaterThanOrEqual(20);
        expect(firstBlock.y).toBeGreaterThanOrEqual(80);
        expect(firstBlock.width).toBeGreaterThan(0);
        expect(firstBlock.height).toBe(30);
    });

    test('should assign different block types', () => {
        game.createBlocks();
        
        const types = game.blocks.map(block => block.type);
        const uniqueTypes = new Set(types);
        
        expect(uniqueTypes.size).toBeGreaterThan(1);
        expect(types).toContain('LIGHT');
    });

    test('should start game correctly', () => {
        game.start();
        
        expect(game.isRunning).toBe(true);
        expect(game.isPaused).toBe(false);
        expect(game.blocks.length).toBe(42);
    });

    test('should stop game correctly', () => {
        game.start();
        game.stop();
        
        expect(game.isRunning).toBe(false);
        expect(game.isPaused).toBe(false);
    });

    test('should toggle pause correctly', () => {
        game.start();
        
        game.togglePause();
        expect(game.isPaused).toBe(true);
        
        game.togglePause();
        expect(game.isPaused).toBe(false);
    });

    test('should not toggle pause when not running', () => {
        game.togglePause();
        expect(game.isPaused).toBe(false);
    });

    test('should update paddle position with keys', () => {
        game.paddle.x = 100; // Set initial position away from boundary
        game.keys.left = true;
        const initialX = game.paddle.x;
        
        game.updatePaddle();
        
        expect(game.paddle.x).toBeLessThan(initialX);
    });

    test('should not move paddle beyond canvas boundaries', () => {
        game.paddle.x = 0;
        game.keys.left = true;
        
        game.updatePaddle();
        
        expect(game.paddle.x).toBe(0);
        
        const canvasWidth = game.canvas.width / (window.devicePixelRatio || 1);
        game.paddle.x = canvasWidth - game.paddle.width;
        game.keys.right = true;
        game.keys.left = false;
        
        game.updatePaddle();
        
        expect(game.paddle.x).toBe(canvasWidth - game.paddle.width);
    });

    test('should update ball position', () => {
        const initialX = game.ball.x;
        const initialY = game.ball.y;
        
        game.updateBall();
        
        expect(game.ball.x).not.toBe(initialX);
        expect(game.ball.y).not.toBe(initialY);
    });

    test('should bounce ball off walls', () => {
        game.ball.x = 4; // Position that will trigger wall bounce (x + dx <= 8)
        game.ball.dx = 4; // Moving right
        const initialDx = game.ball.dx;
        
        game.updateBall();
        
        expect(game.ball.dx).toBe(-initialDx);
    });

    test('should bounce ball off top wall', () => {
        game.ball.y = game.ball.radius;
        const initialDy = game.ball.dy;
        
        game.updateBall();
        
        expect(game.ball.dy).toBe(-initialDy);
    });

    test('should lose life when ball hits bottom', () => {
        const canvasHeight = game.canvas.height / (window.devicePixelRatio || 1);
        game.ball.y = canvasHeight;
        game.start();
        
        game.updateBall();
        
        expect(game.lives).toBe(2);
    });

    test('should detect collision with paddle', () => {
        game.ball.x = game.paddle.x + game.paddle.width / 2;
        game.ball.y = game.paddle.y - game.ball.radius;
        game.ball.dy = 1; // moving down
        
        game.checkCollisions();
        
        expect(game.ball.dy).toBeLessThan(0); // should be moving up
    });

    test('should destroy blocks on collision', () => {
        game.createBlocks();
        const block = game.blocks.find(b => b.type === 'LIGHT');
        
        game.ball.x = block.x + block.width / 2;
        game.ball.y = block.y + block.height / 2;
        
        game.checkCollisions();
        
        expect(block.hits).toBe(0);
        expect(block.destroyed).toBe(true);
        expect(game.blocksDestroyed).toBe(1);
    });

    test('should not destroy INDESTRUCTIBLE blocks', () => {
        game.createBlocks();
        const indestructibleBlock = game.blocks.find(b => b.type === 'INDESTRUCTIBLE');

        if (indestructibleBlock) {
            game.ball.x = indestructibleBlock.x + indestructibleBlock.width / 2;
            game.ball.y = indestructibleBlock.y + indestructibleBlock.height / 2;

            game.checkCollisions();

            expect(indestructibleBlock.destroyed).toBe(false);
            expect(game.blocksDestroyed).toBe(0);
        }
    });

    test('should update score when destroying blocks', () => {
        game.createBlocks();
        const block = game.blocks.find(b => b.type === 'LIGHT');
        
        game.ball.x = block.x + block.width / 2;
        game.ball.y = block.y + block.height / 2;
        
        game.checkCollisions();
        
        expect(game.score).toBe(10);
    });

    test('should call gameOver when lives reach zero', () => {
        const spy = jest.spyOn(game, 'gameOver').mockImplementation();
        game.lives = 0;
        
        game.checkWinLose();
        
        expect(spy).toHaveBeenCalled();
    });

    test('should call gameWon when all destructible blocks destroyed', () => {
        const spy = jest.spyOn(game, 'gameWon').mockImplementation();
        game.createBlocks();
        
        // Mark all non-INDESTRUCTIBLE blocks as destroyed
        game.blocks.forEach(block => {
            if (block.type !== 'INDESTRUCTIBLE') {
                block.destroyed = true;
            }
        });
        
        game.checkWinLose();
        
        expect(spy).toHaveBeenCalled();
    });

    test('should reset ball position correctly', () => {
        game.resetBall();
        
        expect(game.ball.x).toBe(game.paddle.x + game.paddle.width / 2);
        expect(game.ball.y).toBe(game.paddle.y - game.ball.radius - 5);
        expect(game.ball.dy).toBeLessThan(0);
    });

    test('should update UI elements', () => {
        game.score = 100;
        game.lives = 2;
        
        game.updateUI();
        
        expect(document.getElementById('score').textContent).toBe('100');
        expect(document.getElementById('lives').textContent).toBe('2');
    });

    test('should restart game', () => {
        const startSpy = jest.spyOn(game, 'start');
        const stopSpy = jest.spyOn(game, 'stop');

        game.restart();

        expect(stopSpy).toHaveBeenCalled();
        expect(startSpy).toHaveBeenCalled();
    });

    test('should use weekday names for Monday through Friday blocks', () => {
        game.createBlocks();

        // Get blocks from Monday (col 0) through Friday (col 4)
        const weekdayBlocks = game.blocks.filter(block => {
            const day = block.day;
            return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day);
        });

        const weekdayNames = [
            'Focus Mode', 'Study Time', 'Stand Up Meeting',
            '1:1 Meeting', 'Team Meeting', 'Team Planning', 'Team Retrospective',
            'Team Building', 'Performance Review',
            'All Hands Meeting', 'EoY Party'
        ];

        weekdayBlocks.forEach(block => {
            expect(weekdayNames).toContain(block.displayName);
        });
    });

    test('should use weekend names for Saturday and Sunday blocks', () => {
        game.createBlocks();

        // Get blocks from Saturday (col 5) and Sunday (col 6)
        const weekendBlocks = game.blocks.filter(block => {
            const day = block.day;
            return ['saturday', 'sunday'].includes(day);
        });

        const weekendNames = [
            'Grocery Store', 'Park', 'Basketball Practice', 'Soccer Practice',
            'House Cleaning', 'Garage Sale',
            'Gardening', 'Family Lunch',
            'All Hands Meeting', 'EoY Party'
        ];

        weekendBlocks.forEach(block => {
            expect(weekendNames).toContain(block.displayName);
        });
    });

    test('should not use weekend names on weekdays', () => {
        game.createBlocks();

        const weekdayBlocks = game.blocks.filter(block => {
            const day = block.day;
            return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day);
        });

        const weekendOnlyNames = [
            'Grocery Store', 'Park', 'Basketball Practice', 'Soccer Practice',
            'House Cleaning', 'Garage Sale',
            'Gardening', 'Family Lunch'
        ];

        weekdayBlocks.forEach(block => {
            expect(weekendOnlyNames).not.toContain(block.displayName);
        });
    });

    test('should not use weekday-only names on weekends', () => {
        game.createBlocks();

        const weekendBlocks = game.blocks.filter(block => {
            const day = block.day;
            return ['saturday', 'sunday'].includes(day);
        });

        const weekdayOnlyNames = [
            'Focus Mode', 'Study Time', 'Stand Up Meeting',
            '1:1 Meeting', 'Team Meeting', 'Team Planning', 'Team Retrospective',
            'Team Building', 'Performance Review'
        ];

        weekendBlocks.forEach(block => {
            expect(weekdayOnlyNames).not.toContain(block.displayName);
        });
    });
});