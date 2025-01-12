// Set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

// Get a cookie
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return value;
    }
    return null;
}

// Delete a cookie
function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

// Show notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} open`;
    setTimeout(() => {
        notification.className = `notification ${type} close`;
        setTimeout(() => {
            notification.style.display = 'none';
        }, 500);
    }, 3000);
}

// Check user login status and set cookies if not already set
document.addEventListener('DOMContentLoaded', () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let userLoggedIn = false;

    if(users) {
    users.forEach(user => {
            const emailCookie = getCookie('userEmail');
            const loggedCookie = getCookie('isLogged');
            
            if (emailCookie === user.email && loggedCookie === 'true') {
                userLoggedIn = true;
                console.log(`User logged in: ${user.email}`);
            } else {
                setCookie('userEmail', user.email, 1); // Set email cookie
                setCookie('isLogged', 'true', 1);    // Set logged-in cookie
            }
        });
    } else{
        // Redirect to login if no user data is found
        setTimeout(() => {
            window.location.href = '../login/signIn.html';
        }, 10000);
    return;
    }
});

// Logout button functionality
document.getElementById('logout-btn').addEventListener('click', () => {
    // Delete cookies
    deleteCookie('userEmail');
    deleteCookie('isLogged');
    // Redirect to login page with a query parameter to delete cookies there
    setTimeout(() => {
        showNotification('You Have Been Logged Out Successfully', 'info')
    }, 3000);
    window.location.href = '../login/signIn.html?logout=true';
});
