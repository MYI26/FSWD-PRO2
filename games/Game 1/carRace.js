const loginPage = "../../login/html/signIn.html"
const road = document.getElementById('road');
const car = document.getElementById('car');
const obstacle1 = document.getElementById('obstacle1');
const obstacle2 = document.getElementById('obstacle2');
const currentScoreDisplay = document.getElementById('current-score');
const highestScoreDisplay = document.getElementById('highest-score');

let carLeft = 135;
let obstacle1Top = -100;
let obstacle2Top = -300;
let score = 0;
let gameSpeed = 2;
let isGameOver = false;

// Retrieve the highest score from local storage and update the HTML
const userEmail = getCookie('userEmail');
const gameName = 'Car Racing';
let highestScore = getHighestScore(userEmail, gameName);
highestScoreDisplay.textContent = highestScore || 0;

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

// If the user is not log in, redirect him back to login page 
document.addEventListener('DOMContentLoaded', () => {
    const userEmail = getCookie('userEmail');
    if (!userEmail) {
        setTimeout(() => {
            window.location.href = loginPage;
        }, 500);
    }
});

// Update obstacles and score
function updateGame() {
    if (isGameOver) return;

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

    if (checkCollision(car, obstacle1) || checkCollision(car, obstacle2)) {
        gameOver();
    }

    currentScoreDisplay.textContent = score;

    if (score % 10 === 0) {
        gameSpeed += 0.01;
    }

    requestAnimationFrame(updateGame);
}

// Check collision
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

    // Update local storage with the new score
    updateLocalStorage(score);

    // Display Game Over modal
    const modal = document.querySelector('.game-over-modal');
    modal.style.display = 'flex';
    document.getElementById('final-score').textContent = score;

    // Add event listener for restart
    document.getElementById('restart-btn').addEventListener('click', () => {
        location.reload();
    });
}

// Update local storage with the score
function updateLocalStorage(currentScore) {
    let userScores = JSON.parse(localStorage.getItem('usersScore')) || [];

    const userIndex = userScores.findIndex((score) => score.email === userEmail && score.game === gameName);

    if (userIndex !== -1) {
        // Update score if current score is higher
        if (currentScore > userScores[userIndex].score) {
            userScores[userIndex].score = currentScore;
            highestScore = currentScore;
        }
    } else {
        // Add new user score
        userScores.push({ email: userEmail, game: gameName, score: currentScore });
        highestScore = currentScore;
    }

    // Save updated scores back to local storage
    localStorage.setItem('usersScore', JSON.stringify(userScores));

    // Update highest score in the HTML
    highestScoreDisplay.textContent = highestScore;
}

// Get the highest score for the current user
function getHighestScore(email, game) {
    const userScores = JSON.parse(localStorage.getItem('usersScore')) || [];
    const userScore = userScores.find(score => score.email === email && score.game === game);
    return userScore ? userScore.score : null;
}

// Get cookie value
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return value;
    }
    return null;
}

// Start game loop
updateGame();
