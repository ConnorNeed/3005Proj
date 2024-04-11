function hashPassword() {
    const passwordInput = document.getElementById('password');
    const hashedPassword = sha256(passwordInput.value);
    passwordInput.value = hashedPassword;
}

function submit(formId) {
    hashPassword();
    document.getElementById(formId).submit();
}