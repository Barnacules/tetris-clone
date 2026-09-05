# Tetris Clone

A fully-featured Tetris clone built with vanilla HTML5, CSS3, and JavaScript. Features responsive canvas sizing, Web Audio API sound effects, background music, and complete game mechanics.

## Features

- **7 Standard Tetrominoes** (I, O, T, S, Z, J, L) with distinct colors and gradient shading
- **Complete Game Mechanics**: rotation with wall kick, soft drop, hard drop, hold piece
- **Scoring System**: Points for each line cleared, combo bonuses for Tetris (4 lines)
- **Level Progression**: Speed increases every 10 lines (10 levels, 100ms minimum interval)
- **Responsive Canvas**: Automatically resizes to fit browser window
- **Background Music**: Ambient 5-chord melody loop, toggleable via mute button
- **Sound Effects**: Move, rotate, drop, line clear, Tetris fanfare, level up, game over, hold
- **Game Flow**: Start screen, pause (P key), game over with final stats and restart
- **High Score**: Persisted to localStorage
- **Touch Controls**: Swipe gestures for mobile devices
- **Unit Tests**: 116 automated tests covering all game logic

## Quick Start

1. Open `index.html` in any modern web browser
2. Click **START GAME** or wait 2 seconds for auto-start
3. Use **Arrow Keys** or **WASD** to control the piece
4. Press **Space** for hard drop, **C** for hold, **P** for pause

## Controls

| Key | Action |
|-----|--------|
| Left Arrow / A | Move left |
| Right Arrow / D | Move right |
| Down Arrow / S | Soft drop |
| Up Arrow / W | Rotate |
| Space | Hard drop |
| C | Hold piece |
| P | Pause/Resume |

## File Structure

```
tetris/
├── index.html          # Main game file (single HTML page)
├── engine.js           # Core game logic module (for testing)
├── test-runner.js      # Node.js unit test runner
├── tests.html          # Browser-based unit test page
├── README.md           # This file
└── .gitignore          # Git ignore rules
```

## Running Tests

### Node.js Test Runner (automated)
```bash
node test-runner.js
```

### Browser Test Page
Open `tests.html` in a browser to see the test results with pass/fail indicators.

## Architecture

### Game Engine (`engine.js`)
The core game logic is extracted into a CommonJS module for testing:
- `createPiece(type)` - Create a tetromino piece
- `isValidPosition(piece, board, offsetX, offsetY)` - Collision detection
- `rotateMatrix(matrix)` - 90-degree clockwise rotation
- `moveLeft/MoveRight/MoveDown(piece, board)` - Movement with collision
- `checkLines(board)` - Line clearing and board compaction
- `spawnPiece(board, nextPiece)` - Piece spawning with game-over detection
- `simulateTick(piece, board, ...)` - Game loop tick simulation

### Rendering (`index.html`)
- Canvas-based rendering with gradient shading and lighting effects
- `draw()` - Full board redraw each frame
- `drawNext()` - Next piece preview rendering
- `drawBlock(x, y, color, flash)` - Individual block rendering with gradient

### Audio (`index.html`)
- Web Audio API for all sound generation (no external audio files)
- `playSound(type)` - Oscillator-based sound effects for all game events
- `startBGM()` / `stopBGM()` - Ambient background music loop
- Mute toggle button for background music

### Responsive Sizing
- `resizeCanvas()` - Calculates BLOCK size based on viewport dimensions
- Canvas size = COLS × BLOCK × ROWS × BLOCK
- Block size clamped between 16px and 36px
- Automatically called on window resize and page load

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Initial | Complete Tetris clone with responsive sizing and background music |

## Known Issues

- AudioContext requires user gesture before initializing
- LocalStorage may not work in private browsing mode (gracefully handled)
- Touch controls are basic (tap/swipe) and may need refinement for all devices

## License

This project is private.
