const COLS = 10, ROWS = 20, BLOCK = 30;

const SHAPES = {
  I: { shape: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], color: '#00f0f0' },
  O: { shape: [[1,1],[1,1]], color: '#f0f000' },
  T: { shape: [[0,1,0],[1,1,1],[0,0,0]], color: '#a000f0' },
  S: { shape: [[0,1,1],[1,1,0],[0,0,0]], color: '#00f000' },
  Z: { shape: [[1,1,0],[0,1,1],[0,0,0]], color: '#f00000' },
  J: { shape: [[1,0,0],[1,1,1],[0,0,0]], color: '#0000f0' },
  L: { shape: [[0,0,1],[1,1,1],[0,0,0]], color: '#f0a000' }
};
const SHAPE_KEYS = Object.keys(SHAPES);

function deepCopy(arr) { return arr.map(row => [...row]); }

function rotateMatrix(matrix) {
  const N = matrix.length;
  const result = Array.from({ length: N }, () => Array(N).fill(0));
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++)
      result[c][N - 1 - r] = matrix[r][c];
  return result;
}

function isValidPosition(piece, boardState, offsetX = 0, offsetY = 0) {
  if (!piece || !piece.shape) return false;
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const newX = piece.x + c + offsetX;
      const newY = piece.y + r + offsetY;
      if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
      if (newY < 0) continue;
      if (!boardState[newY] || boardState[newY][newX]) return false;
    }
  }
  return true;
}

function createPiece(type) {
  const shapeDef = SHAPES[type];
  return {
    type, shape: deepCopy(shapeDef.shape), color: shapeDef.color,
    x: Math.floor((COLS - shapeDef.shape[0].length) / 2),
    y: type === 'I' ? -1 : 0
  };
}

function emptyBoard() { return Array.from({length: ROWS}, () => Array(COLS).fill(0)); }

function spawnPiece(board, nextPiece) {
  const type = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)];
  const piece = createPiece(type);
  if (!isValidPosition(piece, board)) return { gameOver: true, piece, nextPiece: nextPiece || createPiece(SHAPE_KEYS[0]) };
  return { gameOver: false, piece, nextPiece: nextPiece || createPiece(SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)]) };
}

function moveLeft(piece, board) {
  if (!piece) return { moved: false, result: false };
  if (isValidPosition(piece, board, -1, 0)) return { moved: true, newX: piece.x - 1, result: true };
  return { moved: false, result: false };
}

function moveRight(piece, board) {
  if (!piece) return { moved: false, result: false };
  if (isValidPosition(piece, board, 1, 0)) return { moved: true, newX: piece.x + 1, result: true };
  return { moved: false, result: false };
}

function moveDown(piece, board) {
  if (!piece) return { moved: false, result: false };
  if (isValidPosition(piece, board, 0, 1)) return { moved: true, newY: piece.y + 1, result: true };
  return { moved: false, result: false };
}

function checkLines(board) {
  let cleared = [];
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(cell => cell !== 0)) cleared.push(r);
  }
  if (cleared.length > 0) {
    cleared.forEach(r => { board.splice(r, 1); board.unshift(Array(COLS).fill(0)); });
  }
  return { cleared, count: cleared.length };
}

function getLevel(lines) { return Math.floor(lines / 10) + 1; }
function getDropInterval(level) { return Math.max(100, 1000 - (level - 1) * 80); }

function simulateTick(piece, board, dropCounter, dropInterval, lastTime, currentTime) {
  const delta = currentTime - lastTime;
  let newDropCounter = dropCounter + delta;
  let moved = false;
  let locked = false;
  if (newDropCounter >= dropInterval) {
    newDropCounter = 0;
    if (isValidPosition(piece, board, 0, 1)) {
      moved = true;
    } else {
      locked = true;
    }
  }
  return { moved, locked, newDropCounter };
}

module.exports = { COLS, ROWS, BLOCK, SHAPES, SHAPE_KEYS, deepCopy, rotateMatrix, isValidPosition, createPiece, emptyBoard, spawnPiece, moveLeft, moveRight, moveDown, checkLines, getLevel, getDropInterval, simulateTick };
