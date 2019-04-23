const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const email = document.getElementById("email");
const errorText = document.getElementById("errorText");

function hideErrorText() {
    errorText.style.display = 'none';
}

const checkInputs = () => {
    if (username.value === "" || password.value === "" || confirmPassword.value === "" || email.value === "") {
        errorText.innerHTML = 'Fields cannot be empty.'
        errorText.style.display = 'initial';
        return false;
    }
    if (password.value !== confirmPassword.value) {
        errorText.innerHTML = 'Passwords must match.'
        errorText.style.display = 'initial';
        return false;
    }
    return true;
}

function init() {
    username.addEventListener("input", hideErrorText);
    password.addEventListener("input", hideErrorText);
    confirmPassword.addEventListener("input", hideErrorText);
    email.addEventListener("input", hideErrorText);
}

init();