const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart');

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill('');

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedCellIndex] !== '' || !gameActive || currentPlayer !== 'X') return;

  gameState[clickedCellIndex] = 'X';
  clickedCell.textContent = 'X';


  if (checkResult()) {
    return;
  }

  currentPlayer = 'O'; 
  updateStatus();
  setTimeout(botMove, 500);
}

function checkResult() {
  let roundWon = false;
  let winner = null;

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      roundWon = true;
      winner = gameState[a];
      break;
    }
  }

  if (roundWon) {
    if (winner === 'X') {
      status.textContent = 'Вы победили!';
    } else {
      status.textContent = 'Бот победил!';
    }
    gameActive = false;
    return true;
  }

  if (!gameState.includes('')) {
    status.textContent = 'Ничья!';
    gameActive = false;
    return true;
  }

  return false;
}

function updateStatus() {
  if (currentPlayer === 'X') {
    status.textContent = 'Ваш ход (X)';
  } else {
    status.textContent = 'Ход бота (O)';
  }
}

function botMove() {
  if (!gameActive) return;

  const winningMove = findWinningMove('O');
  if (winningMove !== -1) {
    makeMove(winningMove);
    return;
  }

  const blockingMove = findWinningMove('X');
  if (blockingMove !== -1) {
    makeMove(blockingMove);
    return;
  }

  if (gameState[4] === '') {
    makeMove(4);
    return;
  }

  const availableMoves = gameState
    .map((cell, index) => (cell === '' ? index : null))
    .filter(index => index !== null);

  const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  makeMove(randomMove);
}

function findWinningMove(player) {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (
      gameState[a] === player &&
      gameState[b] === player &&
      gameState[c] === ''
    ) return c;
    if (
      gameState[a] === player &&
      gameState[c] === player &&
      gameState[b] === ''
    ) return b;
    if (
      gameState[b] === player &&
      gameState[c] === player &&
      gameState[a] === ''
    ) return a;
  }
  return -1;
}

function makeMove(index) {
  gameState[index] = 'O';
  cells[index].textContent = 'O';

  if (checkResult()) {
    return;
  }

  currentPlayer = 'X';
  updateStatus();
}

function restartGame() {
  gameActive = true;
  currentPlayer = 'X';
  gameState = Array(9).fill('');
  status.textContent = 'Ваш ход (X)'; // Сбрасываем статус

  cells.forEach(cell => {
    cell.textContent = '';
  });
}


cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);