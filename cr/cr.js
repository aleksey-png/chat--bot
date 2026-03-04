const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const redHealthElement = document.getElementById('red-health');
const blueHealthElement = document.getElementById('blue-health');
const elixirElement = document.getElementById('elixir');

let redHealth = 100;
let blueHealth = 100;
let elixir = 0;
let maxElixir = 10;
let units = [];
let selectedCard = null;


let redEnemyTimer = 0;
let blueEnemyTimer = 0;
const ENEMY_SPAWN_INTERVAL = 400;

const unitTypes = {
  red: { color: '#e94560', damage: 10, health: 30, speed: 0.5 }, 
  blue: { color: '#4397ff', damage: 15, health: 25, speed: 0.75 },
  tank: { color: '#ff9800', damage: 5, health: 50, speed: 0.25 }, 
  enemy: { color: '#8B0000', damage: 8, health: 40, speed: 0.4 } 
};

class Unit {
  constructor(x, y, type, team) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.team = team;
    this.color = unitTypes[type].color;
    this.damage = unitTypes[type].damage;
    this.health = unitTypes[type].health;
    this.maxHealth = unitTypes[type].health;
    this.speed = unitTypes[type].speed;
    this.width = 30;
    this.height = 30;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(Math.floor(this.health), this.x + this.width/2, this.y - 5);
  }

  move() {
    if (this.team === 'red') {
      this.x += this.speed;
      if (this.x > canvas.width - 50) {
        this.x = canvas.width - 50;
      }
    } else if (this.team === 'blue') {
      this.x -= this.speed;
      if (this.x < 50) {
        this.x = 50;
      }
    } else if (this.team === 'enemy') {
      this.x -= this.speed;
      if (this.x < 50) {
        this.x = 50;
      }
    }
  }

  attack(target) {
    target.health -= this.damage;
    if (target.health <= 0) {
      target.health = 0;
      return true;
    }
    return false;
  }
}

function spawnUnit(type, team, x = null, y = null) {
  if (team !== 'enemy') {
    const cost = parseInt(document.querySelector(`.card[data-type="${type}"]`).getAttribute('data-cost'));
    if (elixir < cost) return false;
    elixir -= cost;
    elixirElement.textContent = Math.floor(elixir);
  }

  if (!x) {
    if (team === 'red') {
      x = 50;
      y = Math.random() * (canvas.height - 30);
    } else if (team === 'blue') {
      x = canvas.width - 80;
      y = Math.random() * (canvas.height - 30);
    } else if (team === 'enemy') {
      x = Math.random() * 100 + canvas.width - 150;
      y = Math.random() * (canvas.height - 30);
    }
  }

  units.push(new Unit(x, y, type, team));
  return true;
}

function spawnEnemies() {
  redEnemyTimer++;
  blueEnemyTimer++;

  if (redEnemyTimer >= ENEMY_SPAWN_INTERVAL) {
    spawnUnit('enemy', 'enemy');
    redEnemyTimer = 0;
  }

  if (blueEnemyTimer >= ENEMY_SPAWN_INTERVAL * 1.5) {
    spawnUnit('enemy', 'enemy');
    blueEnemyTimer = 0;
  }
}

function drawDivider() {
  ctx.strokeStyle = '#ffffff40';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  ctx.fillRect(20, canvas.height / 2 - 25, 10, 50); 

  ctx.fillStyle = '#4397ff';
  ctx.fillRect(canvas.width - 30, canvas.height / 2 - 25, 10, 50);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  drawDivider();

  if (elixir < maxElixir) {
    elixir += 0.05; 
    elixirElement.textContent = Math.floor(elixir);
  }

  spawnEnemies();

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    unit.move();

    for (let j = 0; j < units.length; j++) {
      if (i !== j && units[j].team !== unit.team) {
        const target = units[j];
        if (Math.abs(unit.x - target.x) < 40 && Math.abs(unit.y - target.y) < 40) {
          if (unit.attack(target)) {
            units.splice(j, 1);
            j--;
          }
        }
      }
    }

    if (unit.team === 'red' && unit.x >= canvas.width - 50) {
      blueHealth -= unit.damage;
      blueHealthElement.textContent = blueHealth;
      units.splice(i, 1);
      i--;
    } else if (unit.team === 'blue' && unit.x <= 50) {
      redHealth -= unit.damage;
      redHealthElement.textContent = redHealth;
      units.splice(i, 1);
      i--;
    } else if (unit.team === 'enemy' && unit.x <= 50) {
      redHealth -= unit.damage;
      redHealthElement.textContent = redHealth;
      units.splice(i, 1);
      i--;
    }
  }

  units.forEach(unit => unit.draw());

  if (redHealth <= 0) {
    alert('Синие победили!');
    resetGame();
  } else if (blueHealth <= 0) {
    alert('Красные победили!');
    resetGame();
  }

  requestAnimationFrame(gameLoop);
}


document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    if (selectedCard === card) {
      selectedCard = null;
      card.style.borderColor = 'white';
    } else {
      if (selectedCard) {
        selectedCard.style.borderColor = 'white';
      }
      selectedCard = card;
      card.style.borderColor = '#ffd700';
    }
  });
});

canvas.addEventListener('click', (e) => {
  if (!selectedCard) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;


  const team = x < canvas.width / 2 ? 'red' : 'blue';

  if ((team === 'red' && x < canvas.width / 2) ||
      (team === 'blue' && x > canvas.width / 2)) {
    const unitType = selectedCard.getAttribute('data-type');
    if (spawnUnit(unitType, team)) {
      selectedCard.style.borderColor = 'white';
      selectedCard = null;
    }
  }
});

function resetGame() {
  redHealth = 100;
  blueHealth = 100;
  elixir = 0;
  units = [];
  redEnemyTimer = 0;
  blueEnemyTimer = 0;

  redHealthElement.textContent = redHealth;
  blueHealthElement.textContent = blueHealth;
  elixirElement.textContent = elixir;
}

window.addEventListener('load', () => {
  gameLoop();
});
