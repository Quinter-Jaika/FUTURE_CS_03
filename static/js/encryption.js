// Encryption-related JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Password strength checker
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', checkPasswordStrength);
    });
    
    // Password toggle functionality
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? 
                '<i class="fas fa-eye"></i>' : 
                '<i class="fas fa-eye-slash"></i>';
        });
    });
    
    // Encryption toggle
    const encryptToggle = document.getElementById('encryptToggle');
    if (encryptToggle) {
        encryptToggle.addEventListener('change', function() {
            const passwordSection = document.getElementById('passwordSection');
            if (this.checked) {
                passwordSection.style.display = 'block';
            } else {
                passwordSection.style.display = 'none';
            }
        });
    }
    
    // Show/hide encrypted files toggle
    const showEncryptedToggle = document.getElementById('showEncryptedToggle');
    if (showEncryptedToggle) {
        showEncryptedToggle.addEventListener('change', function() {
            const fileCards = document.querySelectorAll('.file-card');
            fileCards.forEach(card => {
                if (!this.checked && card.classList.contains('encrypted')) {
                    card.style.display = 'none';
                } else {
                    card.style.display = 'flex';
                }
            });
        });
    }
});

function checkPasswordStrength() {
    const password = this.value;
    const strengthBar = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const requirements = {
        length: document.getElementById('reqLength'),
        upper: document.getElementById('reqUpper'),
        lower: document.getElementById('reqLower'),
        number: document.getElementById('reqNumber'),
        special: document.getElementById('reqSpecial')
    };
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    let messages = [];
    
    // Check length
    if (password.length >= 8) {
        strength += 20;
        requirements.length.classList.add('valid');
        requirements.length.innerHTML = '<i class="fas fa-check"></i> At least 8 characters';
    } else {
        requirements.length.classList.remove('valid');
        requirements.length.innerHTML = '<i class="fas fa-times"></i> At least 8 characters';
    }
    
    // Check uppercase
    if (/[A-Z]/.test(password)) {
        strength += 20;
        requirements.upper.classList.add('valid');
        requirements.upper.innerHTML = '<i class="fas fa-check"></i> Uppercase letter';
    } else {
        requirements.upper.classList.remove('valid');
        requirements.upper.innerHTML = '<i class="fas fa-times"></i> Uppercase letter';
    }
    
    // Check lowercase
    if (/[a-z]/.test(password)) {
        strength += 20;
        requirements.lower.classList.add('valid');
        requirements.lower.innerHTML = '<i class="fas fa-check"></i> Lowercase letter';
    } else {
        requirements.lower.classList.remove('valid');
        requirements.lower.innerHTML = '<i class="fas fa-times"></i> Lowercase letter';
    }
    
    // Check numbers
    if (/[0-9]/.test(password)) {
        strength += 20;
        requirements.number.classList.add('valid');
        requirements.number.innerHTML = '<i class="fas fa-check"></i> Number';
    } else {
        requirements.number.classList.remove('valid');
        requirements.number.innerHTML = '<i class="fas fa-times"></i> Number';
    }
    
    // Check special characters
    if (/[^A-Za-z0-9]/.test(password)) {
        strength += 20;
        requirements.special.classList.add('valid');
        requirements.special.innerHTML = '<i class="fas fa-check"></i> Special character';
    } else {
        requirements.special.classList.remove('valid');
        requirements.special.innerHTML = '<i class="fas fa-times"></i> Special character';
    }
    
    // Update strength bar
    strengthBar.style.width = strength + '%';
    
    // Update color and text based on strength
    if (strength < 40) {
        strengthBar.style.backgroundColor = '#ff6b6b';
        strengthText.textContent = 'Very Weak';
        strengthText.style.color = '#ff6b6b';
    } else if (strength < 60) {
        strengthBar.style.backgroundColor = '#ffa726';
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#ffa726';
    } else if (strength < 80) {
        strengthBar.style.backgroundColor = '#ffd54f';
        strengthText.textContent = 'Fair';
        strengthText.style.color = '#ffd54f';
    } else if (strength < 100) {
        strengthBar.style.backgroundColor = '#a2d2ff';
        strengthText.textContent = 'Good';
        strengthText.style.color = '#a2d2ff';
    } else {
        strengthBar.style.backgroundColor = '#4CAF50';
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#4CAF50';
    }
}

// API functions for encryption/decryption
async function encryptFile(file, password) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    
    try {
        const response = await fetch('/api/encrypt', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Encryption error:', error);
        return { error: 'Network error' };
    }
}

async function decryptFile(file, password) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    
    try {
        const response = await fetch('/api/decrypt', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Decryption error:', error);
        return { error: 'Network error' };
    }
}

// File encryption utility
function downloadEncryptedFile(data, filename) {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}