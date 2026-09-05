# Tetris Clone - Enhanced Edition

A fully-featured Tetris clone built with vanilla HTML5, CSS3, Three.js, and JavaScript. Features Three.js 3D animated background with bloom effects, responsive canvas sizing, multi-layer procedural music system, particle effects, screen shake, and complete game mechanics.

## Features

### Core Gameplay
- **7 Standard Tetrominoes** (I, O, T, S, Z, J, L) with distinct colors and gradient shading
- **Complete Game Mechanics**: rotation with wall kick, soft drop, hard drop, hold piece
- **Scoring System**: Points for each line cleared, combo bonuses for Tetris (4 lines)
- **Level Progression**: Speed increases every 10 lines (10 levels, 100ms minimum interval)
- **High Score**: Persisted to localStorage

### Visual Effects
- **Three.js 3D Background**: Rotating wireframe cube grid with dynamic orbiting point lights
- **Unreal Bloom Pass**: Post-processing glow effects on 3D scene
- **Particle System**: Burst particles on line clears and hard drops
- **Matrix Rain**: Floating character overlay for atmosphere
- **Screen Shake**: Camera shake on hard drops
- **Glow Effects**: Emissive glow on current piece, animated flash on line clears
- **Gradient Shading**: Each block has 3D-like gradient with highlight and shadow
- **Responsive Canvas**: Automatically resizes to fit browser window

### Audio
- **Web Audio API**: All sound effects generated procedurally (no external files)
- **Multi-Layer BGM**: Different ambient tracks per level with:
  - Bass drone layer (sine wave at root frequency)
  - Arpeggio layer (square/sine wave playing chord progressions)
  - High arpeggio (octave-up melody)
  - Percussion layer (noise-based drum hits)
  - LFO modulation for evolving texture
- **10 Level-Specific Tracks**: Different tempos (80-140 BPM) and keys (C, D, E, F, G, A, A#, C, D, E)
- **Sound Effects**: Move, rotate, drop, line clear, Tetris fanfare, level up, game over, hold
- **Music Mute Toggle**: Button in top-right corner

### File Structure
```
tetris/
├── index.html          # Main game file (single HTML page with Three.js)
├── engine.js           # Core game logic module (for testing)
├── test-runner.js      # Node.js unit test runner
├── tests.html          # Browser-based unit test page
├── three.min.js        # Three.js library (UMD build)
├── three.module.js     # Three.js library (ES module build)
├── OrbitControls.js    # Three.js camera controls
├── UnrealBloomPass.js  # Three.js bloom post-processing
├── RenderPass.js       # Three.js render pass
├── CopyShader.js       # Three.js copy shader
├── LuminosityHighPassShader.js  # Three.js luminosity shader
├── ShaderPass.js       # Three.js shader pass
├── GammaCorrectionShader.js     # Three.js gamma correction
├── EffectComposer.js   # Three.js effect composer
├── OutputPass.js       # Three.js output pass
├── README.md           # This file
└── .gitignore          # Git ignore rules
```

## Quick Start

1. Open `index.html` in any modern web browser
2. Click **START GAME** or wait 2 seconds for auto-start
3. Use **Arrow Keys** or **WASD** to control the piece
4. Press **Space** for hard drop, **C** for hold, **P** for pause, **M** for mute

## Controls

| Key | Action |
|-----|--------|
| Left Arrow / A | Move left |
| Right Arrow / D | Move right |
| Down Arrow / S | Soft drop |
| Up Arrow / W | Rotate |
| Space | Hard drop (with screen shake + particles) |
| C | Hold piece |
| P | Pause/Resume |
| M | Toggle music mute |

## Running Tests

### Node.js Test Runner (automated)
```bash
node test-runner.js
```
168 automated tests covering all game logic, music system, 3D library integration, and visual effects.

### Browser Test Page
Open `tests.html` in a browser to see the test results with pass/fail indicators.

## Architecture

### 3D Background (Three.js)
- **Wireframe Grid**: 20 floating wireframe cubes rotating slowly
- **Octahedron**: Central rotating wireframe octahedron with pulsating position
- **Particle System**: 500 colored points floating in 3D space
- **Dynamic Lighting**: 3 orbiting point lights with different colors
- **Ground Grid**: Wireframe plane beneath the scene
- **Bloom Pass**: UnrealBloomPass for glow effects
- **Fog**: Exponential fog for depth

### Audio Engine
- **initAudio()**: Creates AudioContext on first user gesture
- **playSound(type)**: Oscillator-based sound effects for all game events
- **startBGM(level)** / **stopBGM()**: Multi-layer procedural background music
- **toggleMute()**: Mutes/unmutes all audio
- **LEVEL_TEMPOS**: 10 tempos from 80-140 BPM
- **LEVEL_KEYS**: 10 musical keys with chord progressions

### Game Engine (`engine.js`)
- `createPiece(type)` - Create a tetromino piece
- `isValidPosition(piece, board, offsetX, offsetY)` - Collision detection
- `rotateMatrix(matrix)` - 90-degree clockwise rotation
- `moveLeft/MoveRight/MoveDown(piece, board)` - Movement with collision
- `checkLines(board)` - Line clearing and board compaction
- `spawnPiece(board, nextPiece)` - Piece spawning with game-over detection
- `simulateTick(piece, board, ...)` - Game loop tick simulation
- `calculateBlockSize(viewportWidth, viewportHeight, ...)` - Responsive sizing

### Rendering
- `draw()` - Full board redraw each frame with glow effects
- `drawBlock(x, y, color, flash)` - Individual block rendering with gradient
- `drawNext()` - Next piece preview rendering
- `drawMatrix()` - Matrix rain character overlay
- `animateParticles()` - Particle burst animation
- `animate3D()` - Three.js 3D scene animation loop

### Responsive Sizing
- `resizeCanvas()` - Calculates BLOCK size based on viewport dimensions
- Block size clamped between 16px and 36px
- Automatically called on window resize and page load
- Also resizes Three.js canvas and particle canvas

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Initial | Complete Tetris clone with responsive sizing and background music |
| 2.0 | Enhanced | Three.js 3D background with bloom, multi-layer BGM, particle effects, matrix rain, screen shake, 168 unit tests |

## Known Issues

- AudioContext requires user gesture before initializing
- LocalStorage may not work in private browsing mode (gracefully handled)
- Three.js effects may vary by GPU and browser
- Touch controls are basic (tap/swipe) and may need refinement
- EffectComposer.js may require manual import path adjustment

## Technologies

- **Three.js** v0.160.0 - 3D rendering (UMD + module builds)
- **Web Audio API** - Procedural sound generation
- **HTML5 Canvas 2D** - Game rendering
- **Vanilla JavaScript** - Game logic
- **CSS3** - Styling with backdrop-filter blur

## License

This project is private.
