// Fetch logged-in user email from cookies or set a default for testing
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return value;
    }
    return "guest@example.com"; // Default for testing
}

const userEmail = getCookie('userEmail');
document.getElementById('user-email').textContent = userEmail;

// Simulated localStorage data
const users = JSON.parse(localStorage.getItem('users')) || [];
const scores = JSON.parse(localStorage.getItem('usersScore')) || [];

// Filter and sort scores
const userScores = scores.filter(score => score.email === userEmail);
const sortedScores = userScores.sort((a, b) => b.score - a.score);

// Populate the table
const tableBody = document.querySelector('#score-table tbody');
sortedScores.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.email}</td>
        <td>${entry.game}</td>
        <td>${entry.score}</td>
    `;
    tableBody.appendChild(row);
});

// If no scores found, display a friendly message
if (!sortedScores.length) {
    const noDataRow = document.createElement('tr');
    noDataRow.innerHTML = `
        <td colspan="4">No scores available for this user.</td>
    `;
    tableBody.appendChild(noDataRow);
}
