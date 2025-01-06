var mainPage = '../main/dashboard.html'
var logInPage = './signIn.html'

const signInForm = document.getElementById('login-form')
const signUpForm = document.getElementById('registration-form')
const resetForm = document.getElementById('reset-form')

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

// Handle User Registration
signUpForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    const firstname = document.getElementById('firstname').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate that passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Save user data to localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        alert('Email is already registered!');
        return;
    }

    users.push({ firstname, lastname, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful! You can now log in.');
    // Redirect to the login page
    window.location.href = logInPage;
});


// Handle User Login
signInForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert(`Welcome back, ${user.firstname}!`);
            document.cookie = `isLoggedIn=true;path=/;max-age=${60 * 60 * 24}`;
            window.location.href = mainPage;
    } else {
        alert('Invalid email or password!');
    }
});

// Handle User Password Reset
resetForm?.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const newPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email);

    if(user) {
        // Validate that passwords match
        if (newPassword === confirmPassword) {
            user.password = newPassword;
            alert('New Password Has Been Set Successfully!');
        } else {
            alert('Passwords do not match!');
            return;
        }
    } else {
        alert("Email not found. Please enter the email associated with your account.");
    }
});

  // Simulate Logout
function logout() {
    deleteCookie('isLoggedIn');
    alert('You are logged out!');
}

if (getCookie('isLoggedIn')) {
    console.log('User is logged in');
} else {
    console.log('User is not logged in');
}