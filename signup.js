// Signup form JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSignupForm();
});

// Initialize signup form
function initializeSignupForm() {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const emailInput = document.getElementById('email');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const termsCheckbox = document.getElementById('terms');
    
    // Form submission
    signupForm.addEventListener('submit', handleSignup);
    
    // Real-time validation
    passwordInput.addEventListener('input', checkPasswordStrength);
    passwordInput.addEventListener('blur', validatePassword);
    confirmPasswordInput.addEventListener('blur', validatePasswordMatch);
    emailInput.addEventListener('blur', validateEmail);
    firstNameInput.addEventListener('blur', validateName);
    lastNameInput.addEventListener('blur', validateName);
    
    // Clear validation states on input
    [passwordInput, confirmPasswordInput, emailInput, firstNameInput, lastNameInput].forEach(input => {
        input.addEventListener('input', () => clearValidationState(input));
    });
    
    // Social signup buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', handleSocialSignup);
    });
    
    // Terms link handlers
    document.querySelectorAll('.terms-link').forEach(link => {
        link.addEventListener('click', handleTermsClick);
    });
}

// Password visibility toggle
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const toggleBtn = passwordField.parentElement.querySelector('.toggle-password i');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Password strength checker
function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    let strength = 0;
    let strengthLabel = 'Weak';
    let strengthColor = '#ef4444';
    
    // Check password criteria
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
    
    // Determine strength level
    switch (strength) {
        case 0:
        case 1:
            strengthLabel = 'Very Weak';
            strengthColor = '#ef4444';
            break;
        case 2:
            strengthLabel = 'Weak';
            strengthColor = '#f97316';
            break;
        case 3:
            strengthLabel = 'Fair';
            strengthColor = '#eab308';
            break;
        case 4:
            strengthLabel = 'Good';
            strengthColor = '#22c55e';
            break;
        case 5:
            strengthLabel = 'Strong';
            strengthColor = '#16a34a';
            break;
    }
    
    // Update UI
    const percentage = (strength / 5) * 100;
    strengthBar.style.width = `${percentage}%`;
    strengthBar.style.backgroundColor = strengthColor;
    strengthText.textContent = password.length > 0 ? strengthLabel : 'Password strength';
    strengthText.style.color = strengthColor;
    
    return strength;
}

// Validation functions
function validateName(event) {
    const name = event.target.value.trim();
    
    if (!name) {
        setInputState(event.target, 'error');
        return false;
    } else if (name.length < 2) {
        setInputState(event.target, 'error');
        return false;
    } else {
        setInputState(event.target, 'success');
        return true;
    }
}

function validateEmail() {
    const email = document.getElementById('email').value.trim();
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        setInputState(emailInput, 'error');
        return false;
    } else if (!emailRegex.test(email)) {
        setInputState(emailInput, 'error');
        return false;
    } else {
        setInputState(emailInput, 'success');
        return true;
    }
}

function validatePassword() {
    const password = document.getElementById('password').value;
    const passwordInput = document.getElementById('password');
    const strength = checkPasswordStrength();
    
    if (!password) {
        setInputState(passwordInput, 'error');
        return false;
    } else if (strength < 3) {
        setInputState(passwordInput, 'error');
        return false;
    } else {
        setInputState(passwordInput, 'success');
        return true;
    }
}

function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (!confirmPassword) {
        setInputState(confirmPasswordInput, 'error');
        return false;
    } else if (password !== confirmPassword) {
        setInputState(confirmPasswordInput, 'error');
        return false;
    } else {
        setInputState(confirmPasswordInput, 'success');
        return true;
    }
}

function setInputState(input, state) {
    input.classList.remove('success', 'error');
    if (state) {
        input.classList.add(state);
    }
}

function clearValidationState(input) {
    setInputState(input, null);
}

// Form submission handler
async function handleSignup(event) {
    event.preventDefault();
    
    // Validate all fields
    const isFirstNameValid = validateName({ target: document.getElementById('firstName') });
    const isLastNameValid = validateName({ target: document.getElementById('lastName') });
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isPasswordMatchValid = validatePasswordMatch();
    const isTermsAccepted = document.getElementById('terms').checked;
    
    if (!isFirstNameValid || !isLastNameValid || !isEmailValid || 
        !isPasswordValid || !isPasswordMatchValid) {
        showNotification('Please fill in all fields correctly.', 'error');
        return;
    }
    
    if (!isTermsAccepted) {
        showNotification('Please accept the Terms of Service to continue.', 'error');
        return;
    }
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        newsletter: document.getElementById('newsletter').checked
    };
    
    // Show loading state
    const signupBtn = document.querySelector('.login-btn');
    const originalText = signupBtn.textContent;
    signupBtn.textContent = 'Creating Account...';
    signupBtn.disabled = true;
    
    try {
        // Simulate API call
        await simulateSignup(formData);
        
        // Handle successful signup
        showNotification('Account created successfully! Redirecting to login...', 'success');
        
        // Store user data for potential auto-fill on login
        localStorage.setItem('signupEmail', formData.email);
        localStorage.setItem('signupName', `${formData.firstName} ${formData.lastName}`);
        
        // Redirect to login after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    } catch (error) {
        // Handle signup error
        showNotification(error.message || 'Signup failed. Please try again.', 'error');
        
        // Reset button
        signupBtn.textContent = originalText;
        signupBtn.disabled = false;
    }
}

// Simulate signup API call
function simulateSignup(userData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Check if email already exists (demo)
            const existingEmails = ['admin@example.com', 'test@example.com'];
            
            if (existingEmails.includes(userData.email)) {
                reject(new Error('An account with this email already exists'));
            } else {
                resolve({ 
                    success: true, 
                    user: { 
                        id: Date.now(),
                        email: userData.email,
                        name: `${userData.firstName} ${userData.lastName}`
                    } 
                });
            }
        }, 2000); // 2 second delay to simulate network request
    });
}

// Social signup handlers
function handleSocialSignup(event) {
    event.preventDefault();
    const provider = event.currentTarget.classList.contains('google-btn') ? 'Google' : 'Apple';
    
    // Show loading state
    const originalContent = event.currentTarget.innerHTML;
    event.currentTarget.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting...`;
    event.currentTarget.disabled = true;
    
    // Simulate social signup
    setTimeout(() => {
        showNotification(`${provider} signup is not implemented in this demo.`, 'info');
        
        // Reset button
        event.currentTarget.innerHTML = originalContent;
        event.currentTarget.disabled = false;
    }, 1500);
}

// Terms and privacy policy handlers
function handleTermsClick(event) {
    event.preventDefault();
    const linkText = event.target.textContent;
    showNotification(`${linkText} would open in a new window.`, 'info');
}

// Notification system (reuse from login page)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Set colors based on type
    const colors = {
        success: { bg: '#10b981', text: '#ffffff' },
        error: { bg: '#ef4444', text: '#ffffff' },
        info: { bg: '#3b82f6', text: '#ffffff' },
        warning: { bg: '#f59e0b', text: '#ffffff' }
    };
    
    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    return icons[type] || icons.info;
}

// Add password strength styles
const signupStyles = document.createElement('style');
signupStyles.textContent = `
    .password-strength {
        margin-top: 0.5rem;
    }
    
    .strength-bar {
        height: 4px;
        background: var(--border-color);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 0.25rem;
    }
    
    .strength-fill {
        height: 100%;
        width: 0%;
        background: #ef4444;
        transition: all 0.3s ease;
    }
    
    .strength-text {
        font-size: 0.75rem;
        color: var(--text-secondary);
        font-weight: 500;
    }
    
    .terms-link {
        color: var(--primary-green);
        text-decoration: none;
        font-weight: 500;
    }
    
    .terms-link:hover {
        color: var(--dark-green);
        text-decoration: underline;
    }
    
    .checkbox-group .checkbox-label {
        line-height: 1.4;
    }
    
    /* Additional form styles for signup */
    .form-group:nth-child(1),
    .form-group:nth-child(2) {
        display: inline-block;
        width: calc(50% - 0.5rem);
    }
    
    .form-group:nth-child(1) {
        margin-right: 1rem;
    }
    
    @media (max-width: 640px) {
        .form-group:nth-child(1),
        .form-group:nth-child(2) {
            display: block;
            width: 100%;
            margin-right: 0;
        }
    }
`;
document.head.appendChild(signupStyles);

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Enter key to submit form
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
        event.preventDefault();
        document.getElementById('signupForm').dispatchEvent(new Event('submit'));
    }
    
    // Escape key to close notifications
    if (event.key === 'Escape') {
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.remove();
        }
    }
});

// Auto-focus first field
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.getElementById('firstName').focus();
    }, 100);
});

// Form auto-save (draft functionality)
function saveSignupDraft() {
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        newsletter: document.getElementById('newsletter').checked
    };
    sessionStorage.setItem('signupFormDraft', JSON.stringify(formData));
}

function loadSignupDraft() {
    const draft = sessionStorage.getItem('signupFormDraft');
    if (draft) {
        const data = JSON.parse(draft);
        if (data.firstName) document.getElementById('firstName').value = data.firstName;
        if (data.lastName) document.getElementById('lastName').value = data.lastName;
        if (data.email) document.getElementById('email').value = data.email;
        if (data.newsletter) document.getElementById('newsletter').checked = data.newsletter;
    }
}

// Auto-save form data
const debouncedSave = debounce(saveSignupDraft, 500);
['firstName', 'lastName', 'email'].forEach(id => {
    document.getElementById(id).addEventListener('input', debouncedSave);
});
document.getElementById('newsletter').addEventListener('change', debouncedSave);

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Load draft on page load
document.addEventListener('DOMContentLoaded', loadSignupDraft);