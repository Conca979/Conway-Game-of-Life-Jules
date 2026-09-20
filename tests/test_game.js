const assert = require('assert');
const { GameOfLife } = require('../game.js');

function runTests() {
    console.log("Starting Conway's Game of Life tests...");

    // Test 1: Initialization
    let game = new GameOfLife(10, 10);
    assert.strictEqual(game.rows, 10, "Rows should be 10");
    assert.strictEqual(game.cols, 10, "Cols should be 10");
    assert.strictEqual(game.generation, 0, "Initial generation should be 0");
    assert.strictEqual(game.aliveCount, 0, "Initial alive count should be 0");

    // Test 2: Basic cell toggling and state
    game.toggleCell(0, 0);
    assert.strictEqual(game.grid[0][0], 1, "Cell (0,0) should be alive");
    assert.strictEqual(game.aliveCount, 1, "Alive count should be 1");
    game.toggleCell(0, 0);
    assert.strictEqual(game.grid[0][0], 0, "Cell (0,0) should be dead");

    // Test 3: Conway's Rules - Underpopulation (Dies with < 2 neighbors)
    game.clear();
    game.setCell(5, 5, 1);
    game.setCell(5, 6, 1);
    game.nextGeneration();
    assert.strictEqual(game.grid[5][5], 0, "Cell should die from underpopulation");
    assert.strictEqual(game.grid[5][6], 0, "Cell should die from underpopulation");

    // Test 4: Conway's Rules - Survival (Lives with 2 or 3 neighbors) & Overpopulation (Dies with > 3)
    // Block pattern (Stable)
    game.clear();
    game.setCell(1, 1, 1);
    game.setCell(1, 2, 1);
    game.setCell(2, 1, 1);
    game.setCell(2, 2, 1);
    game.nextGeneration();
    assert.strictEqual(game.aliveCount, 4, "Block pattern should remain stable");

    // Test 5: Conway's Rules - Reproduction (Born with exactly 3 neighbors)
    game.clear();
    game.setCell(0, 1, 1);
    game.setCell(1, 0, 1);
    game.setCell(1, 1, 1); // neighbors: 0,1 and 1,0 and itself (so empty 0,0 has 3 neighbors)
    // specifically, cell 0,0 has 3 neighbors: 0,1; 1,0; 1,1
    game.nextGeneration();
    assert.strictEqual(game.grid[0][0], 1, "Cell (0,0) should reproduce");

    // Test 6: Toroidal Boundaries (Wrapping)
    game.clear();
    // Place a glider at the top-left edge heading up-left (which means it wraps around)
    // Actually, let's just test simple neighbor counting across boundaries
    game.setCell(0, 0, 1);
    game.setCell(0, 9, 1);
    game.setCell(9, 0, 1);

    // Cell 0,0 has neighbors 0,9 (left wrap) and 9,0 (top wrap)
    assert.strictEqual(game.countLiveNeighbors(0, 0), 2, "Cell (0,0) should have 2 neighbors via toroidal wrapping");

    // Test 7: Resizing
    game.resize(15, 20);
    assert.strictEqual(game.rows, 15, "Rows should be updated to 15");
    assert.strictEqual(game.cols, 20, "Cols should be updated to 20");
    assert.strictEqual(game.grid[0][0], 1, "Cell state should be preserved after resize");
    assert.strictEqual(game.grid[0][9], 1, "Cell state should be preserved after resize");

    console.log("All tests passed successfully!");
}

try {
    runTests();
} catch (error) {
    console.error("Test failed:", error.message);
    process.exit(1);
}
