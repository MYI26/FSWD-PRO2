const road = document.getElementById('road');
const car = document.getElementById('car');
const obstacle1 = document.getElementById('obstacle1');
const obstacle2 = document.getElementById('obstacle2');
const scoreDisplay = document.getElementById('score');

let carLeft = 135; // Starting position of the car
let obstacle1Top = -100; // Initial position of the first obstacle
let obstacle2Top = -300; // Initial position of the second obstacle
let score = 0;
let gameSpeed = 2;
let isGameOver = false;

// Move car with arrow keys
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    if (e.key === 'ArrowLeft' && carLeft > 0) {
        carLeft -= 30;
    } else if (e.key === 'ArrowRight' && carLeft < 270) {
        carLeft += 30;
    }
    car.style.left = carLeft + 'px';
});

// Update obstacles and score
function updateGame() {
    if (isGameOver) return;

    // Move obstacles
    obstacle1Top += gameSpeed;
    obstacle2Top += gameSpeed;

    if (obstacle1Top > 600) {
        obstacle1Top = -100;
        obstacle1.style.left = `${Math.floor(Math.random() * 3) * 90 + 45}px`;
        score++;
    }

    if (obstacle2Top > 600) {
        obstacle2Top = -100;
        obstacle2.style.left = `${Math.floor(Math.random() * 3) * 90 + 45}px`;
        score++;
    }

    obstacle1.style.top = obstacle1Top + 'px';
    obstacle2.style.top = obstacle2Top + 'px';

    // Check collision
    if (checkCollision(car, obstacle1) || checkCollision(car, obstacle2)) {
        gameOver();
    }

    // Update score
    scoreDisplay.textContent = score;

    // Increase game speed over time
    if (score % 10 === 0) {
        gameSpeed += 0.01;
    }

    requestAnimationFrame(updateGame);
}

// Collision detection
function checkCollision(car, obstacle) {
    const carRect = car.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    return !(
        carRect.top > obstacleRect.bottom ||
        carRect.bottom < obstacleRect.top ||
        carRect.left > obstacleRect.right ||
        carRect.right < obstacleRect.left
    );
}

// Game over
function gameOver() {
    isGameOver = true;

    // Create the modal dynamically
    const modal = document.createElement('div');
    modal.classList.add('game-over-modal');

    modal.innerHTML = `
        <div class="modal-content">
            <h1>Game Over!</h1>
            <p>Your Score: <span id="final-score">${score}</span></p>
            <button id="restart-btn">Restart</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listener to restart button
    document.getElementById('restart-btn').addEventListener('click', () => {
        location.reload();
    });
}

// Start the game
updateGame();
