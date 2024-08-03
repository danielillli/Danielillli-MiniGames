// game.js

let canvas, ctx;
let ballRadius = 10;
let x, y, dx, dy;
let paddleHeight = 10, paddleWidth = 75;
let paddleX;
let rightPressed = false, leftPressed = false;
let score = 0;
let isPaused = false;
let gameInterval;
let timeElapsed = 0;
let startTime;
let speedIncreaseInterval = 5000; // Speed up every 5 seconds
let initialSpeed = 2;

// Sound effects
const beepSound = new Audio('beep.mp3');
const goSound = new Audio('go.mp3');
const gameOverSound = new Audio('gameover.mp3'); // Game over sound effect

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById("pongCanvas");
    ctx = canvas.getContext("2d");

    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const pauseButton = document.getElementById('pause-button');
    const resetButton = document.getElementById('reset-button');

    startButton.addEventListener('click', startCountdown);
    restartButton.addEventListener('click', startCountdown);
    pauseButton.addEventListener('click', togglePause);
    resetButton.addEventListener('click', resetGame);

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
});

function startCountdown() {
    let countdownNumber = 5;
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('countdown-screen').classList.remove('hidden');

    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = countdownNumber;

    const countdownInterval = setInterval(() => {
        if (countdownNumber > 1) {
            beepSound.play(); // Play beep sound for 5 to 2
        } else if (countdownNumber === 1) {
            goSound.play(); // Play go sound on 1
        }

        countdownNumber--;
        countdownElement.textContent = countdownNumber;

        if (countdownNumber <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown-screen').classList.add('hidden');
            document.getElementById('game-container').classList.remove('hidden');
            startGame();
        }
    }, 1000);
}

function startGame() {
    score = 0;
    timeElapsed = 0;
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = (Math.random() < 0.5 ? -1 : 1) * initialSpeed;
    dy = (Math.random() < 0.5 ? -1 : 1) * initialSpeed;
    paddleX = (canvas.width - paddleWidth) / 2;

    const gameMusic = document.getElementById('game-music');
    gameMusic.currentTime = 0;
    gameMusic.play();

    startTime = Date.now();
    gameInterval = setInterval(draw, 10);
    setTimeout(increaseSpeed, speedIncreaseInterval);
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameInterval);
        document.getElementById('game-music').pause();
    } else {
        startTime = Date.now() - timeElapsed;
        gameInterval = setInterval(draw, 10);
        document.getElementById('game-music').play();
    }
}

function resetGame() {
    clearInterval(gameInterval);
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            score++;
        } else {
            gameOver();
            return;
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;

    timeElapsed = Date.now() - startTime;
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('time').textContent = `Time: ${Math.floor(timeElapsed / 1000)}s`;
}

function increaseSpeed() {
    if (!isPaused) {
        dx *= 1.1;
        dy *= 1.1;
        setTimeout(increaseSpeed, speedIncreaseInterval);
    }
}

function gameOver() {
    clearInterval(gameInterval);
    gameOverSound.play(); // Play game over sound
    document.getElementById('final-score').textContent = `Final Score: ${score}`;
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('game-music').pause();
}
