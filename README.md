# Conway's Game of Life

A performant, fully client-side implementation of Conway's Game of Life built with vanilla HTML5, CSS, and JavaScript.

## Features

- **Grid Sizing:** Dynamically adjust rows and columns (10 to 200+).
- **Interactive Canvas:** Draw or erase live cells using click-and-drag.
- **Toroidal Boundaries:** The grid wraps around the edges seamlessly.
- **Variable Speed:** Adjust the simulation speed (ticks per second) in real-time.
- **Presets:** Easily load classic patterns like the Glider, Gosper Glider Gun, Pulsar, and Beacon.
- **Dark Mode UI:** Modern, responsive dark-themed dashboard.

## Setup and Execution

Since this is a client-side application, no build tools or servers are strictly necessary to run the game itself.

1. **Run the Game:**
   Open `index.html` in any modern web browser to start using the application.

2. **Run the Tests:**
   The core game logic is tested using a Node.js script. Make sure you have Node.js installed.
   ```bash
   node tests/test_game.js
   ```

## Development

- `index.html`: Contains the structural layout and UI elements.
- `style.css`: Provides the styling, layout rules, and responsive design.
- `game.js`: Implements the `GameOfLife` class (the engine) and handles all DOM events and canvas rendering.
- `tests/test_game.js`: A suite of assertions verifying the grid logic and Conway's rules.
