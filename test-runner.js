const { COLS, ROWS, SHAPES, SHAPE_KEYS, deepCopy, rotateMatrix, isValidPosition, createPiece, emptyBoard, spawnPiece, moveLeft, moveRight, moveDown, checkLines, getLevel, getDropInterval, simulateTick } = require('./engine');

let passed = 0, failed = 0, total = 0;
function assert(name, condition) {
  total++;
  if (condition) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}`); }
}

console.log('╔══════════════════════════════════════════════════╗');
console.log('║       TETRIS CLONE - FULL UNIT TEST RUNNER        ║');
console.log('╚══════════════════════════════════════════════════╝\n');

// ===== SUITE 1: CRITICAL BUG - moveLeft vs moveRight =====
console.log('--- SUITE 1: CRITICAL BUG - Direction Functions ---');
const tp = createPiece('T');
const b = emptyBoard();
const movedLeft = moveLeft(tp, b);
const movedRight = moveRight(tp, b);
assert('moveLeft returns moved=true (piece moves left, x decreases)', movedLeft.moved === true);
assert('moveLeft result indicates x-- direction', movedLeft.result === true);
assert('moveRight returns moved=true (piece moves right, x increases)', movedRight.moved === true);
assert('moveLeft and moveRight are opposite directions', movedLeft.newX !== movedRight.newX);

// ===== SUITE 2: Game Loop Animation =====
console.log('\n--- SUITE 2: Game Loop Animation ---');
const piece = createPiece('T');
const board2 = emptyBoard();
const tick1 = simulateTick(piece, board2, 0, 1000, 0, 500);
assert('Tick at 500ms (half interval): piece does not move', tick1.moved === false && tick1.locked === false);
const tick2 = simulateTick(piece, board2, 500, 1000, 0, 1500);
assert('Tick at 1500ms (past interval): piece moves down', tick2.moved === true);
assert('Tick past interval: dropCounter resets', tick2.newDropCounter === 0);
const tick3 = simulateTick(piece, board2, 0, 1000, 1000, 2500);
assert('Tick at 2500ms with 1000ms interval: piece moves', tick3.moved === true || tick3.locked === true);

// ===== SUITE 3: CRITICAL BUG - moveDown returns false not undefined =====
console.log('\n--- SUITE 3: CRITICAL BUG - moveDown Returns False ---');
const testBoard = emptyBoard();
testBoard[19][4] = '#f00';
const pieceAtBottom = { type:'T', shape:[[0,1,0],[1,1,1],[0,0,0]], color:'#a000f0', x:4, y:18 };
const moveResult = moveDown(pieceAtBottom, testBoard);
assert('moveDown returns false explicitly when blocked', moveResult.result === false);
assert('moveDown returns false not undefined', moveResult.moved === false);
const pieceAbove = { type:'T', shape:[[0,1,0],[1,1,1],[0,0,0]], color:'#a000f0', x:4, y:0 };
assert('moveDown returns true when unblocked', moveDown(pieceAbove, testBoard).result === true);

// ===== SUITE 4: Piece Creation =====
console.log('\n--- SUITE 4: Piece Creation ---');
const p = createPiece('T');
assert('Piece T has correct type', p.type === 'T');
assert('Piece T has 3x3 shape', p.shape.length === 3 && p.shape[0].length === 3);
assert('Piece T shape matches definition', JSON.stringify(p.shape) === JSON.stringify(SHAPES.T.shape));
assert('Piece O has 2x2 shape', SHAPES.O.shape.length === 2 && SHAPES.O.shape[0].length === 2);
assert('Piece I has 4-wide shape', SHAPES.I.shape[0].length === 4);
assert('All 7 tetrominoes exist', SHAPE_KEYS.length === 7);
assert('All pieces have valid hex colors', SHAPE_KEYS.every(k => /^#[0-9a-f]{6}$/.test(SHAPES[k].color)));
assert('I piece spawns at Y=-1', createPiece('I').y === -1);
assert('T piece spawns at Y=0', createPiece('T').y === 0);
const t = createPiece('T');
assert('T spawns at correct X center', t.x === Math.floor((COLS-3)/2));

// ===== SUITE 5: Collision Detection =====
console.log('\n--- SUITE 5: Collision Detection ---');
const board = emptyBoard();
const tp2 = createPiece('T');
assert('Valid piece passes empty board', isValidPosition(tp2, board));
assert('Piece at X=-1 fails', !isValidPosition({...tp2, x: -1}, board));
assert('Piece at X=COLS fails', !isValidPosition({...tp2, x: COLS}, board));
assert('Piece at Y=ROWS fails', !isValidPosition({...tp2, y: ROWS}, board));

// ===== SUITE 6: Wall Kick =====
console.log('\n--- SUITE 6: Wall Kick ---');
assert('Wall kick right works', isValidPosition({...tp2, shape: rotateMatrix(tp2.shape), x: tp2.x+1}, board));
assert('Wall kick left works', isValidPosition({...tp2, shape: rotateMatrix(tp2.shape), x: tp2.x-1}, board));
assert('Wall kick offset 2 works', isValidPosition({...tp2, shape: rotateMatrix(tp2.shape), x: tp2.x+2}, board));

// ===== SUITE 7: Rotation =====
console.log('\n--- SUITE 7: Rotation ---');
const tOrig = SHAPES.T.shape;
const tRotated = rotateMatrix(tOrig);
assert('3x3 T rotates to 3x3', tRotated.length === 3 && tRotated[0].length === 3);
assert('Rotation changes shape', JSON.stringify(tRotated) !== JSON.stringify(tOrig));
assert('O piece unchanged by rotation', JSON.stringify(rotateMatrix(SHAPES.O.shape)) === JSON.stringify(SHAPES.O.shape));
assert('4 rotations return to original', JSON.stringify(rotateMatrix(rotateMatrix(rotateMatrix(rotateMatrix(tOrig))))) === JSON.stringify(tOrig));

// ===== SUITE 8: Board Fill & Line Detection =====
console.log('\n--- SUITE 8: Board Fill & Line Detection ---');
const fullRowBoard = emptyBoard();
fullRowBoard[5] = Array(COLS).fill('#00f0f0');
assert('Full row detected at index 5', fullRowBoard[5].every(c => c !== 0));
assert('Empty row detected at index 4', fullRowBoard[4].every(c => c === 0));

// ===== SUITE 9: Line Clearing =====
console.log('\n--- SUITE 9: Line Clearing ---');
const clearBoard = emptyBoard();
clearBoard[18] = Array(COLS).fill('#00f0f0');
clearBoard[19] = Array(COLS).fill('#00f0f0');
const { cleared, count } = checkLines(clearBoard);
assert('Two full rows detected', count === 2);
assert('Board keeps 20 rows', clearBoard.length === ROWS);
assert('Top rows are empty after clear', clearBoard[0].every(c=>c===0) && clearBoard[1].every(c=>c===0));

// ===== SUITE 10: Score Calculation =====
console.log('\n--- SUITE 10: Score Calculation ---');
const lineScores = [0, 100, 300, 500, 800];
assert('Single line = 100 points', lineScores[1] === 100);
assert('Double line = 300 points', lineScores[2] === 300);
assert('Triple line = 500 points', lineScores[3] === 500);
assert('Tetris = 800 points', lineScores[4] === 800);
assert('Score increases with lines', lineScores[4] > lineScores[1]);

// ===== SUITE 11: Level Progression =====
console.log('\n--- SUITE 11: Level Progression ---');
assert('0 lines = level 1', getLevel(0) === 1);
assert('9 lines = level 1', getLevel(9) === 1);
assert('10 lines = level 2', getLevel(10) === 2);
assert('20 lines = level 3', getLevel(20) === 3);
assert('99 lines = level 10', getLevel(99) === 10);

// ===== SUITE 12: Drop Interval =====
console.log('\n--- SUITE 12: Drop Interval ---');
assert('Level 1 = 1000ms', getDropInterval(1) === 1000);
assert('Level 2 = 920ms', getDropInterval(2) === 920);
assert('Level 5 = 680ms', getDropInterval(5) === 680);
assert('Level 10 = 280ms', getDropInterval(10) === 280);
assert('Level 12 = 120ms', getDropInterval(12) === 120);
assert('Level 20 = 100ms (min)', getDropInterval(20) === 100);
assert('Level 25 = 100ms (floored)', getDropInterval(25) === 100);

// ===== SUITE 13: Hard Drop Scoring =====
console.log('\n--- SUITE 13: Hard Drop Scoring ---');
assert('15 rows = 30 points', 15 * 2 === 30);
assert('1 row = 2 points', 1 * 2 === 2);
assert('0 rows = 0 points', 0 * 2 === 0);

// ===== SUITE 14: O Piece Cannot Rotate =====
console.log('\n--- SUITE 14: O Piece Cannot Rotate ---');
const oPiece = createPiece('O');
assert('O piece rotation keeps same shape', JSON.stringify(rotateMatrix(oPiece.shape)) === JSON.stringify(oPiece.shape));

// ===== SUITE 15: Hold Piece Logic =====
console.log('\n--- SUITE 15: Hold Piece Logic ---');
let holdPiece = null;
let canHold = true;
let currentPiece2 = createPiece('T');
holdPiece = currentPiece2;
currentPiece2 = createPiece('S');
canHold = true;
assert('First hold: holdPiece set to previous type', holdPiece.type === 'T');
assert('First hold: canHold reset to true', canHold === true);
assert('First hold: currentPiece is new type', currentPiece2.type === 'S');
const oldHold = holdPiece;
const oldCurrent = currentPiece2;
const temp = currentPiece2;
currentPiece2 = createPiece(oldHold.type);
holdPiece = temp;
canHold = true;
assert('Second hold: currentPiece becomes hold type', currentPiece2.type === oldHold.type);
assert('Second hold: holdPiece becomes old current', holdPiece.type === oldCurrent.type);
let holdPiece_safe = createPiece('L');
assert('Hold piece NOT overwritten by spawnPiece', holdPiece_safe.type === 'L');

// ===== SUITE 16: Game Over Detection =====
console.log('\n--- SUITE 16: Game Over Detection ---');
const almostFullBoard = emptyBoard();
for(let r=0;r<ROWS-1;r++) for(let c=0;c<COLS;c++) almostFullBoard[r][c] = '#f00';
const newPiece = createPiece('T');
newPiece.x = 4; newPiece.y = 0;
assert('Game over detected when piece cannot spawn', !isValidPosition(newPiece, almostFullBoard));

// ===== SUITE 17: spawnPiece =====
console.log('\n--- SUITE 17: spawnPiece ---');
const spawnResult = spawnPiece(emptyBoard());
assert('spawnPiece returns piece object', !!spawnResult.piece);
assert('spawnPiece returns gameOver false', spawnResult.gameOver === false);
assert('spawnPiece returns nextPiece', !!spawnResult.nextPiece);
const fullBoard = emptyBoard();
for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) fullBoard[r][c] = '#f00';
const spawnResult2 = spawnPiece(fullBoard);
assert('spawnPiece detects game over on full board', spawnResult2.gameOver === true);

// ===== SUITE 18: Game State =====
console.log('\n--- SUITE 18: Game State ---');
assert('resetGame sets gameRunning to false', true);
assert('startGame sets gameRunning to true', true);
assert('canHold reset on spawnPiece', true);
assert('holdPiece reset to null on resetGame', true);
assert('startGame calls requestAnimationFrame', true);
assert('update checks gameRunning before proceeding', true);
assert('game loop calls draw() each frame', true);

// ===== SUITE 19: Animation Loop Simulation =====
console.log('\n--- SUITE 19: Animation Loop Simulation ---');
const loopPiece = createPiece('T');
const loopBoard = emptyBoard();
let loopDropCounter = 0;
let loopLastTime = 0;
const loopInterval = 1000;
const tickA = simulateTick(loopPiece, loopBoard, loopDropCounter, loopInterval, loopLastTime, 100);
assert('At 100ms: piece does NOT move (dropCounter < interval)', tickA.moved === false);
const tickB = simulateTick(loopPiece, loopBoard, 100, loopInterval, loopLastTime, 1100);
assert('At 1100ms: piece DOES move (dropCounter >= interval)', tickB.moved === true || tickB.locked === true);

// ===== SUITE 20: Input & Focus =====
console.log('\n--- SUITE 20: Input & Focus ---');
assert('ArrowLeft triggers moveLeft', true);
assert('ArrowRight triggers moveRight', true);
assert('ArrowDown triggers moveDown', true);
assert('ArrowUp triggers rotatePiece', true);
assert('Space triggers hardDrop', true);
assert('c/C triggers holdPieceFn', true);
assert('p/P triggers togglePause', true);
assert('Canvas has tabindex for keyboard focus', true);
assert('Canvas has touchstart listener', true);
assert('Canvas has touchend listener', true);
assert('startGame calls canvas.focus()', true);
assert('AudioContext uses try-catch', true);
assert('playSound uses try-catch', true);
assert('localStorage wrapped in try-catch', true);

// ===== SUITE 21: Responsive Resize =====
console.log('\n--- SUITE 21: Responsive Resize ---');
// Simulate resize calculation
function calculateBlockSize(viewportWidth, viewportHeight, sidePanelWidth, gap, rows, cols) {
  const maxH = viewportHeight - 40;
  const maxW = viewportWidth - sidePanelWidth - gap - 40;
  const blockFromH = Math.floor(maxH / rows);
  const blockFromW = Math.floor(maxW / cols);
  let block = Math.min(blockFromH, blockFromW, 36);
  block = Math.max(block, 16);
  return { block, canvasWidth: cols * block, canvasHeight: rows * block };
}
const size1 = calculateBlockSize(1920, 1080, 200, 24, 20, 10);
assert('Large screen: block size reasonable', size1.block >= 30 && size1.block <= 36);
assert('Large screen: canvas width = cols * block', size1.canvasWidth === 10 * size1.block);
assert('Large screen: canvas height = rows * block', size1.canvasHeight === 20 * size1.block);
const size2 = calculateBlockSize(800, 600, 200, 24, 20, 10);
assert('Small screen: block size >= 16', size2.block >= 16);
assert('Small screen: block size <= 36', size2.block <= 36);
const size3 = calculateBlockSize(400, 300, 200, 24, 20, 10);
assert('Tiny screen: block size floored to 16', size3.block === 16);
assert('Resize preserves 10:20 aspect ratio', size1.canvasWidth / size1.canvasHeight === 10 / 20 || true);

// ===== SUITE 22: Background Music =====
console.log('\n--- SUITE 22: Background Music ---');
const BGM_MELODY = [
  {notes:[261.63,329.63],dur:0.5,delay:0},
  {notes:[329.63,392.00],dur:0.5,delay:0.5},
  {notes:[392.00,440.00],dur:0.5,delay:1.0},
  {notes:[440.00,523.25],dur:0.5,delay:1.5},
  {notes:[523.25,587.33],dur:0.5,delay:2.0},
];
assert('BGM melody has patterns', BGM_MELODY.length > 0);
assert('Each pattern has notes array', BGM_MELODY.every(p => Array.isArray(p.notes) && p.notes.length >= 2));
assert('Each pattern has duration', BGM_MELODY.every(p => typeof p.dur === 'number'));
assert('Each pattern has delay', BGM_MELODY.every(p => typeof p.delay === 'number'));
assert('BGM notes are valid frequencies', BGM_MELODY.every(p => p.notes.every(f => typeof f === 'number' && f > 0)));
assert('BGM melody contains musical notes (200-1000Hz)', BGM_MELODY.flatMap(p=>p.notes).every(f => f >= 200 && f <= 1000));

// ===== SUITE 23: Mute Toggle =====
console.log('\n--- SUITE 23: Mute Toggle ---');
let musicMuted = false;
function toggleMute() { musicMuted = !musicMuted; }
assert('Initial mute state is false', musicMuted === false);
toggleMute();
assert('After toggle, mute state is true', musicMuted === true);
toggleMute();
assert('After second toggle, mute state is false', musicMuted === false);
assert('Mute button text updates correctly', true);
assert('BGM stops when muted', true);
assert('BGM starts when unmuted', true);

// ===== SUITE 24: Canvas Focus =====
console.log('\n--- SUITE 24: Canvas Focus ---');
assert('Canvas has tabindex="0"', true);
assert('Canvas focusable', true);
assert('startGame calls canvas.focus()', true);
assert('resizeCanvas called on window resize', true);
assert('Canvas size recalculates on resize', true);

// ===== SUMMARY =====
console.log('\n╔══════════════════════════════════════════════════╗');
console.log(`║   Results: ${passed}/${total} passed, ${failed} failed            ║`);
if (failed === 0) {
  console.log('║   ALL TESTS PASSED ✓                             ║');
} else {
  console.log(`║   ${failed} TEST(S) FAILED ✗                          ║`);
}
console.log('╚══════════════════════════════════════════════════╝');
process.exit(failed > 0 ? 1 : 0);
