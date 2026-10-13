/**
 * Conway's Game of Life
 * Core logic and UI interactions
 */

class GameOfLife {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = this.createEmptyGrid();
        this.generation = 0;
        this.aliveCount = 0;
        this.isRunning = false;

        // Toroidal offsets (includes wrap-around)
        this.neighborsOffsets = [
            [-1, -1], [-1, 0], [-1, 1],
            [ 0, -1],          [ 0, 1],
            [ 1, -1], [ 1, 0], [ 1, 1]
        ];
    }

    createEmptyGrid() {
        return Array.from({ length: this.rows }, () => new Array(this.cols).fill(0));
    }

    resize(newRows, newCols) {
        const newGrid = Array.from({ length: newRows }, () => new Array(newCols).fill(0));

        // Copy existing state where it fits
        const minRows = Math.min(this.rows, newRows);
        const minCols = Math.min(this.cols, newCols);

        for (let r = 0; r < minRows; r++) {
            for (let c = 0; c < minCols; c++) {
                newGrid[r][c] = this.grid[r][c];
            }
        }

        this.rows = newRows;
        this.cols = newCols;
        this.grid = newGrid;
        this.updateAliveCount();
    }

    clear() {
        this.grid = this.createEmptyGrid();
        this.generation = 0;
        this.aliveCount = 0;
    }

    randomize() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.grid[r][c] = Math.random() > 0.85 ? 1 : 0;
            }
        }
        this.generation = 0;
        this.updateAliveCount();
    }

    toggleCell(r, c) {
        if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
            this.grid[r][c] = this.grid[r][c] ? 0 : 1;
            this.updateAliveCount();
        }
    }

    setCell(r, c, value) {
         if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
            this.grid[r][c] = value;
            this.updateAliveCount();
        }
    }

    updateAliveCount() {
        let count = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c]) count++;
            }
        }
        this.aliveCount = count;
    }

    countLiveNeighbors(row, col) {
        let count = 0;
        for (let [dr, dc] of this.neighborsOffsets) {
            // Toroidal boundary handling
            const r = (row + dr + this.rows) % this.rows;
            const c = (col + dc + this.cols) % this.cols;
            count += this.grid[r][c];
        }
        return count;
    }

    nextGeneration() {
        const nextGrid = this.createEmptyGrid();
        let newAliveCount = 0;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const liveNeighbors = this.countLiveNeighbors(r, c);
                const isAlive = this.grid[r][c] === 1;

                if (isAlive && (liveNeighbors === 2 || liveNeighbors === 3)) {
                    nextGrid[r][c] = 1;
                    newAliveCount++;
                } else if (!isAlive && liveNeighbors === 3) {
                    nextGrid[r][c] = 1;
                    newAliveCount++;
                } else {
                    nextGrid[r][c] = 0;
                }
            }
        }

        this.grid = nextGrid;
        this.aliveCount = newAliveCount;
        this.generation++;
    }

    applyPreset(presetName) {
        this.clear();

        const centerR = Math.floor(this.rows / 2);
        const centerC = Math.floor(this.cols / 2);

        let pattern = [];

        switch (presetName) {
            case 'glider':
                pattern = [
                    [0, 1], [1, 2], [2, 0], [2, 1], [2, 2]
                ];
                break;
            case 'beacon':
                pattern = [
                    [-1, -2], [-1, -1], [0, -2], [0, -1],
                    [1, 0], [1, 1], [2, 0], [2, 1]
                ];
                break;
            case 'pulsar':
                const pulsarCoords = [
                    [-2, -1], [-3, -1], [-4, -1], [-1, -2], [-1, -3], [-1, -4],
                    [-2, 1], [-3, 1], [-4, 1], [-1, 2], [-1, 3], [-1, 4],
                    [2, -1], [3, -1], [4, -1], [1, -2], [1, -3], [1, -4],
                    [2, 1], [3, 1], [4, 1], [1, 2], [1, 3], [1, 4]
                ];
                pattern = [];
                for (let [r, c] of pulsarCoords) {
                    pattern.push([r, c]);
                    pattern.push([-r, c]);
                    pattern.push([r, -c]);
                    pattern.push([-r, -c]);
                }
                // deduplicate
                const seen = new Set();
                pattern = pattern.filter(p => {
                    const key = `${p[0]},${p[1]}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });
                break;
            case 'gosperGliderGun':
                pattern = [
                    [0,0], [0,1], [1,0], [1,1],
                    [0,10], [1,10], [2,10], [-1,11], [3,11], [-2,12], [4,12], [-2,13], [4,13], [1,14], [-1,15], [3,15], [0,16], [1,16], [2,16], [1,17],
                    [0,20], [-1,20], [-2,20], [0,21], [-1,21], [-2,21], [1,22], [-3,22], [1,24], [2,24], [-3,24], [-4,24],
                    [-1,34], [-2,34], [-1,35], [-2,35]
                ];
                break;
        }

        for (let [dr, dc] of pattern) {
            let r = centerR + dr;
            let c = centerC + dc;
            // Handle Gosper Glider Gun offset to fit better
            if (presetName === 'gosperGliderGun') {
                r = Math.floor(this.rows / 4) + dr;
                c = Math.floor(this.cols / 4) + dc;
            }
            if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                this.grid[r][c] = 1;
            }
        }
        this.updateAliveCount();
    }
}

// Ensure it runs only in the browser context
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const game = new GameOfLife(50, 50);

        // UI Elements
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const canvasContainer = document.getElementById('canvasContainer');

        const startPauseBtn = document.getElementById('startPauseBtn');
        const stepBtn = document.getElementById('stepBtn');
        const clearBtn = document.getElementById('clearBtn');
        const randomizeBtn = document.getElementById('randomizeBtn');

        const rowsInput = document.getElementById('rowsInput');
        const colsInput = document.getElementById('colsInput');
        const applySizeBtn = document.getElementById('applySizeBtn');

        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');

        const presetsSelect = document.getElementById('presetsSelect');
        const applyPresetBtn = document.getElementById('applyPresetBtn');

        const genCountEl = document.getElementById('genCount');
        const aliveCountEl = document.getElementById('aliveCount');

        let cellSize = 10;
        let lastTime = 0;
        let tickInterval = 1000 / parseInt(speedSlider.value);
        let animationId = null;
        let isDrawing = false;
        let drawValue = 1;

        // Resize Canvas to fit container while maintaining grid aspect ratio
        function resizeCanvas() {
            const containerWidth = canvasContainer.clientWidth - 40; // padding
            const containerHeight = canvasContainer.clientHeight - 40;

            const cellWidth = Math.floor(containerWidth / game.cols);
            const cellHeight = Math.floor(containerHeight / game.rows);

            cellSize = Math.min(cellWidth, cellHeight);
            if (cellSize < 2) cellSize = 2; // minimum size

            canvas.width = cellSize * game.cols;
            canvas.height = cellSize * game.rows;
            draw();
        }

        window.addEventListener('resize', resizeCanvas);

        // Render the grid
        function draw() {
            // Background
            ctx.fillStyle = '#1e1e1e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw cells
            ctx.fillStyle = '#4caf50'; // var(--cell-alive)
            for (let r = 0; r < game.rows; r++) {
                for (let c = 0; c < game.cols; c++) {
                    if (game.grid[r][c]) {
                        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                    }
                }
            }

            // Draw grid lines
            if (cellSize >= 5) {
                ctx.strokeStyle = '#2c2c2c'; // var(--grid-line)
                ctx.lineWidth = 1;

                ctx.beginPath();
                for (let r = 0; r <= game.rows; r++) {
                    ctx.moveTo(0, r * cellSize);
                    ctx.lineTo(canvas.width, r * cellSize);
                }
                for (let c = 0; c <= game.cols; c++) {
                    ctx.moveTo(c * cellSize, 0);
                    ctx.lineTo(c * cellSize, canvas.height);
                }
                ctx.stroke();
            }

            // Update stats
            genCountEl.textContent = game.generation;
            aliveCountEl.textContent = game.aliveCount;
        }

        // Animation Loop
        function loop(timestamp) {
            if (!game.isRunning) return;

            if (timestamp - lastTime >= tickInterval) {
                game.nextGeneration();
                draw();
                lastTime = timestamp;
            }

            animationId = requestAnimationFrame(loop);
        }

        function toggleSimulation() {
            game.isRunning = !game.isRunning;
            startPauseBtn.textContent = game.isRunning ? 'Pause' : 'Start';
            if (game.isRunning) {
                lastTime = performance.now();
                animationId = requestAnimationFrame(loop);
            } else if (animationId) {
                cancelAnimationFrame(animationId);
            }
        }

        // Mouse Drawing interactions
        function getGridCoordinates(e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            const c = Math.floor(x / cellSize);
            const r = Math.floor(y / cellSize);

            return { r, c };
        }

        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const { r, c } = getGridCoordinates(e);
            if (r >= 0 && r < game.rows && c >= 0 && c < game.cols) {
                // Determine whether we are drawing or erasing based on the first clicked cell
                drawValue = game.grid[r][c] ? 0 : 1;
                game.setCell(r, c, drawValue);
                draw();
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            const { r, c } = getGridCoordinates(e);
            game.setCell(r, c, drawValue);
            draw();
        });

        window.addEventListener('mouseup', () => {
            isDrawing = false;
        });

        // Event Listeners
        startPauseBtn.addEventListener('click', toggleSimulation);

        stepBtn.addEventListener('click', () => {
            if (game.isRunning) toggleSimulation();
            game.nextGeneration();
            draw();
        });

        clearBtn.addEventListener('click', () => {
            if (game.isRunning) toggleSimulation();
            game.clear();
            draw();
        });

        randomizeBtn.addEventListener('click', () => {
            game.randomize();
            draw();
        });

        applySizeBtn.addEventListener('click', () => {
            let r = parseInt(rowsInput.value);
            let c = parseInt(colsInput.value);

            r = Math.max(10, Math.min(200, r));
            c = Math.max(10, Math.min(200, c));

            rowsInput.value = r;
            colsInput.value = c;

            game.resize(r, c);
            resizeCanvas();
        });

        speedSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            speedValue.textContent = val;
            tickInterval = 1000 / parseInt(val);
        });

        applyPresetBtn.addEventListener('click', () => {
            const preset = presetsSelect.value;
            if (preset !== 'none') {
                game.applyPreset(preset);
                draw();
            }
        });

        // Initialize
        resizeCanvas();
        game.randomize();
        draw();
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameOfLife };
}
