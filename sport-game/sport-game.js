const gameArea = document.getElementById('gameArea');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const liftsElement = document.getElementById('lifts');
const startButton = document.getElementById('startButton');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

let score = 0;
let lifts = 0;
let timeLeft = 60;
let gameActive = false;
let dumbbellInterval;
let timerInterval;

function startGame() {
  score = 0;
  lifts = 0;
  timeLeft = 60;
  gameActive = true;

  scoreElement.textContent = score;
  liftsElement.textContent = lifts;
  timerElement.textContent = timeLeft;
  timerElement.classList.remove('warning');
  gameOverScreen.style.display = 'none';
  startButton.disabled = true;

  dumbbellInterval = setInterval(createDumbbell, 1000);
  timerInterval = setInterval(updateTimer, 1000);
}

function createDumbbell() {
  if (!gameActive) return;

  const dumbbell = document.createElement('div');
  dumbbell.className = 'dumbbell';

  const weights = ['light', 'medium', 'heavy'];
  const weightClass = weights[Math.floor(Math.random() * weights.length)];
  dumbbell.classList.add(weightClass);

  const maxLeft = gameArea.offsetWidth - 120;
  const maxTop = gameArea.offsetHeight - 100;

  const left = Math.floor(Math.random() * maxLeft);
  const top = Math.floor(Math.random() * maxTop);

  dumbbell.style.left = `${left}px`;
  dumbbell.style.top = `${top}px`;

  dumbbell.innerHTML = `
    <div class="dumbbell-plate">${getWeightValue(weightClass)}кг</div>
    <div class="dumbbell-bar"></div>
    <div class="dumbbell-plate">${getWeightValue(weightClass)}кг</div>
  `;

  dumbbell.addEventListener('click', () => {
    const points = weightClass === 'light' ? 5 :
      weightClass === 'medium' ? 10 : 15;

    score += points;
    lifts++;
    scoreElement.textContent = score;
    liftsElement.textContent = lifts;

    dumbbell.classList.add('lifted');

    setTimeout(() => {
      if (dumbbell.parentNode) {
        dumbbell.remove();
      }
    }, 600);
  });

  gameArea.appendChild(dumbbell);

  setTimeout(() => {
    if (dumbbell.parentNode && !dumbbell.classList.contains('lifted')) {
      dumbbell.remove();
    }
  }, 3000);
}

function getWeightValue(weightClass) {
  switch (weightClass) {
    case 'light': return '2';
    case 'medium': return '5';
    case 'heavy': return '10';
    default: return '5';
  }
}

function updateTimer() {
  timeLeft--;
  timerElement.textContent = timeLeft;

  if (timeLeft <= 10) {
    timerElement.classList.add('warning');
  }

  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  gameActive = false;

  clearInterval(dumbbellInterval);
  clearInterval(timerInterval);

  finalScoreElement.textContent = score;
  gameOverScreen.style.display = 'block';
  startButton.disabled = false;
}

function restartGame() {
  endGame();
  startGame();
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);


function adjustGameDifficulty() {
  const width = window.innerWidth;
  clearInterval(dumbbellInterval);

  if (width < 600) {
    dumbbellInterval = setInterval(createDumbbell, 1500);
  } else {
    dumbbellInterval = setInterval(createDumbbell, 1000);
  }
}

window.addEventListener('resize', adjustGameDifficulty);

window.addEventListener('load', () => {
  adjustGameDifficulty();
});

document.body.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});