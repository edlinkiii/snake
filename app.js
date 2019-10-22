const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const ARENA = { x: 500, y: 400, color: "blue" };
const TILE = { x: 20, y: 20 };

const NORTH = { x: 0, y: -1 };
const SOUTH = { x: 0, y: 1 };
const EAST = { x: 1, y: 0 };
const WEST = { x: -1, y: 0 };

const INIT = {
  apple: { x: 18, y: 9, color: "red" },
  snake: { x: 6, y: 9, color: "white", apples: 0, direction: EAST, tail: []}
};

let snake = {};
let apple = {};
let timer = null;

drawArena();
resetGame();
playerInput();

// playGame();

function playGame() {
  timer = setInterval(() => {
    drawArena();
    drawApple();
    drawSnake();
    moveSnake();
    detectBorder();
    eatApple();
  }, 150);
}

function drawArena() {
  ctx.fillStyle = ARENA.color;
  ctx.fillRect(0, 0, ARENA.x, ARENA.y);
}

function resetGame() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  drawArena();
  for(let key in INIT.snake) {
    snake[key] = INIT.snake[key];
  }
  snake.tail = [];
  drawSnake();
  for(let key in INIT.apple) {
    apple[key] = INIT.apple[key];
  }
  drawApple();
}

function drawSnake() {
  ctx.fillStyle = snake.color;
  ctx.fillRect(snake.x * TILE.x, snake.y * TILE.y, TILE.x, TILE.y);
  if(snake.tail.length > 0) {
    snake.tail.forEach((t) => {
      ctx.fillRect(t.x * TILE.x, t.y * TILE.y, TILE.x, TILE.y);
    });
  }
}

function drawApple() {
  ctx.fillStyle = apple.color;
  ctx.fillRect(apple.x * TILE.x, apple.y * TILE.y, TILE.x, TILE.y);
}

function moveSnake() {
  snake.tail.push({ x: snake.x, y: snake.y });
  snake.x += snake.direction.x;
  snake.y += snake.direction.y;
  if(snake.tail.length > snake.apples) snake.tail.shift();
  detectCollision();
}

function playerInput() {
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") {
      snake.direction = snake.direction !== SOUTH ? NORTH : snake.direction;
    }
    if (e.key === "ArrowDown") {
      snake.direction = snake.direction !== NORTH ? SOUTH : snake.direction;
    }
    if (e.key === "ArrowRight") {
      snake.direction = snake.direction !== WEST ? EAST : snake.direction;
    }
    if (e.key === "ArrowLeft") {
      snake.direction = snake.direction !== EAST ? WEST : snake.direction;
    }
    if (e.code === "Space") {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      else playGame();
    }
  });
}

function detectBorder() {
  if (snake.y < 0) {
    snake.y = (ARENA.y / TILE.y) - 1;
  }
  if (snake.y > (ARENA.y / TILE.y) - 1) {
    snake.y = 0;
  }
  if (snake.x > (ARENA.x / TILE.x) - 1) {
    snake.x = 0;
  }
  if (snake.x < 0) {
    snake.x = (ARENA.x / TILE.x) - 1;
  }
}

function detectCollision() {
  let dead = false;
  snake.tail.forEach(t => {
    if(t.x === snake.x && t.y === snake.y) {
      dead = true;
    }
  });
  if(dead) resetGame();
}

function eatApple() {
  if (snake.y === apple.y && snake.x === apple.x) {
    snake.apples += 1;
    // set new apple coordinates
    apple.x = Math.floor(Math.random() * (ARENA.x / TILE.x)); // rand
    apple.y = Math.floor(Math.random() * (ARENA.y / TILE.y)); //rand
  }
}
