// game.js

let player;
let gameContainer;
let scoreDisplay;
let startButton;
let restartButton;
let score = 0;
let playerPosition;
let gameSpeed = 2;
let isGameOver = false;
let obstacleInterval;
let obstacles = [];
let hearts = 5;
let heartDisplay;
let gameMusic;

document.addEventListener('DOMContentLoaded', () => {
    player = document.getElementById('player');
    gameContainer = document.getElementById('game-container');
    scoreDisplay = document.getElementById('score');
    startButton = document.getElementById('start-button');
    restartButton = document.getElementById('restart-button');
    heartDisplay = document.querySelectorAll('.heart');
    gameMusic = document.getElementById('game-music');

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);

    document.addEventListener('keydown', movePlayer);

    updateHearts();
});

function startGame() {
    // Reset game state
    isGameOver = false;
    score = 0;
    hearts = 5;
    gameSpeed = 2;

    // Update UI elements
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');

    // Set initial player position
    playerPosition = gameContainer.offsetWidth / 2 - player.offsetWidth / 2;
    player.style.left = `${playerPosition}px`;

    // Reset and update game state
    updateHearts();
    scoreDisplay.textContent = `Score: ${score}`;
    obstacles.forEach(obstacle => gameContainer.removeChild(obstacle));
    obstacles = [];

    // Start game logic
    if (obstacleInterval) {
        clearInterval(obstacleInterval);
    }
    obstacleInterval = setInterval(createObstacle, 800); // Spawn obstacles every 800ms

    // Play background music
    gameMusic.currentTime = 0;
    gameMusic.play();
}

function movePlayer(e) {
    if (isGameOver) return;

    const playerWidth = player.offsetWidth;
    const containerWidth = gameContainer.offsetWidth;
    const movementStep = 15;

    if (e.key === 'ArrowLeft' && playerPosition > 0) {
        playerPosition -= movementStep;
        if (playerPosition < 0) playerPosition = 0;
    } else if (e.key === 'ArrowRight' && playerPosition < containerWidth - playerWidth) {
        playerPosition += movementStep;
        if (playerPosition > containerWidth - playerWidth) playerPosition = containerWidth - playerWidth;
    }
    player.style.left = `${playerPosition}px`;
}

function createObstacle() {
    if (isGameOver) return;

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    const type = Math.random();

    if (type < 0.1) {
        obstacle.classList.add('black'); // 10% chance, instant death
        obstacle.style.backgroundColor = '#000';
        obstacle.style.width = '40px';
        obstacle.style.height = '40px'; // Big size
    } else if (type < 0.3) {
        obstacle.classList.add('gold'); // 20% chance, half hearts
        obstacle.style.backgroundColor = '#ffd700';
        obstacle.style.width = '30px';
        obstacle.style.height = '30px'; // Medium size
    } else {
        obstacle.classList.add('red'); // 70% chance, normal hit
        obstacle.style.backgroundColor = '#f00';
        obstacle.style.width = '20px';
        obstacle.style.height = '20px'; // Original size
    }

    obstacle.style.left = `${Math.random() * (gameContainer.offsetWidth - parseInt(obstacle.style.width))}px`;
    obstacle.position = 0;
    obstacle.speed = gameSpeed + Math.random() * 2;
    obstacles.push(obstacle);
    gameContainer.appendChild(obstacle);

    requestAnimationFrame(() => moveObstacle(obstacle));
}

function moveObstacle(obstacle) {
    if (isGameOver) return;

    obstacle.position += obstacle.speed;
    obstacle.style.top = `${obstacle.position}px`;

    if (obstacle.position > gameContainer.offsetHeight) {
        gameContainer.removeChild(obstacle);
        obstacles = obstacles.filter(obs => obs !== obstacle);
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
    } else if (
        obstacle.position > gameContainer.offsetHeight - player.offsetHeight - 10 &&
        Math.abs(playerPosition - obstacle.offsetLeft) < player.offsetWidth
    ) {
        handleCollision(obstacle);
    } else {
        requestAnimationFrame(() => moveObstacle(obstacle));
    }
}

function handleCollision(obstacle) {
    if (obstacle.classList.contains('black')) {
        hearts = 0; // Instant death
    } else if (obstacle.classList.contains('gold')) {
        hearts -= 2; // Half hearts
    } else {
        hearts -= 1; // Normal hit
    }

    updateHearts();

    if (hearts <= 0) {
        gameOver();
    }
}

function updateHearts() {
    heartDisplay.forEach((heart, index) => {
        heart.style.visibility = index < hearts ? 'visible' : 'hidden';
    });
}

function gameOver() {
    isGameOver = true;
    clearInterval(obstacleInterval);
    obstacles.forEach(obstacle => gameContainer.removeChild(obstacle));
    obstacles = [];
    document.getElementById('final-score').textContent = `Final Score: ${score}`;
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('game-container').classList.add('hidden');
    gameMusic.pause();
}
