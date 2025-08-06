// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');
const togglePasswordBtn = document.querySelector('.toggle-password');
const socialButtons = document.querySelectorAll('.social-btn');

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadRememberedCredentials();
});

// Event Listeners
function initializeEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Password toggle
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', togglePassword);
    }
    
    // Input validation
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    emailInput.addEventListener('input', clearValidationState);
    passwordInput.addEventListener('input', clearValidationState);
    
    // Social login buttons
    socialButtons.forEach(button => {
        button.addEventListener('click', handleSocialLogin);
    });
    
    // Remember me functionality
    rememberCheckbox.addEventListener('change', handleRememberMe);
    
    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }
}

// Password visibility toggle
function togglePassword() {
    const icon = togglePasswordBtn.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Form validation
function validateEmail() {
    const email = emailInput.value.trim();
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
    const password = passwordInput.value;
    
    if (!password) {
        setInputState(passwordInput, 'error');
        return false;
    } else if (password.length < 6) {
        setInputState(passwordInput, 'error');
        return false;
    } else {
        setInputState(passwordInput, 'success');
        return true;
    }
}

function setInputState(input, state) {
    input.classList.remove('success', 'error');
    if (state) {
        input.classList.add(state);
    }
}

function clearValidationState(event) {
    setInputState(event.target, null);
}

// Login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    // Validate inputs
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    if (!isEmailValid || !isPasswordValid) {
        showNotification('Please fill in all fields correctly.', 'error');
        return;
    }
    
    // Get form data
    const formData = {
        email: emailInput.value.trim(),
        password: passwordInput.value,
        remember: rememberCheckbox.checked
    };
    
    // Show loading state
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Signing in...';
    loginBtn.disabled = true;
    
    try {
        // Simulate API call (replace with actual authentication)
        await simulateLogin(formData);
        
        // Handle successful login
        showNotification('Login successful! Redirecting...', 'success');
        
        // Save credentials if remember me is checked
        if (formData.remember) {
            saveCredentials(formData.email);
        } else {
            clearSavedCredentials();
        }
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        // Handle login error
        showNotification(error.message || 'Login failed. Please try again.', 'error');
        
        // Reset button
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
    }
}

// Simulate login API call
function simulateLogin(credentials) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Demo credentials for testing
            if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
                resolve({ success: true, user: { email: credentials.email } });
            } else {
                reject(new Error('Invalid email or password'));
            }
        }, 2000); // 2 second delay to simulate network request
    });
}

// Social login handlers
function handleSocialLogin(event) {
    event.preventDefault();
    const provider = event.currentTarget.classList.contains('google-btn') ? 'Google' : 'Apple';
    
    // Show loading state
    const originalText = event.currentTarget.textContent;
    event.currentTarget.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting...`;
    event.currentTarget.disabled = true;
    
    // Simulate social login
    setTimeout(() => {
        showNotification(`${provider} login is not implemented in this demo.`, 'info');
        
        // Reset button
        event.currentTarget.innerHTML = originalText;
        event.currentTarget.disabled = false;
    }, 1500);
}

// Remember me functionality
function handleRememberMe() {
    if (!rememberCheckbox.checked) {
        clearSavedCredentials();
    }
}

function saveCredentials(email) {
    localStorage.setItem('rememberedEmail', email);
    localStorage.setItem('rememberMe', 'true');
}

function loadRememberedCredentials() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberMe && rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberCheckbox.checked = true;
        validateEmail();
    }
}

function clearSavedCredentials() {
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberMe');
}

// Forgot password handler
function handleForgotPassword(event) {
    event.preventDefault();
    showNotification('Password reset functionality would be implemented here.', 'info');
}

// Notification system
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

// Add notification animation styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(notificationStyles);

// Utility functions
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

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Enter key on form
    if (event.key === 'Enter' && (event.target === emailInput || event.target === passwordInput)) {
        event.preventDefault();
        handleLogin(event);
    }
    
    // Escape key to close notifications
    if (event.key === 'Escape') {
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.remove();
        }
    }
});

// Form auto-save (draft functionality)
let formData = {};

function saveFormDraft() {
    formData = {
        email: emailInput.value,
        remember: rememberCheckbox.checked
    };
    sessionStorage.setItem('loginFormDraft', JSON.stringify(formData));
}

function loadFormDraft() {
    const draft = sessionStorage.getItem('loginFormDraft');
    if (draft) {
        const data = JSON.parse(draft);
        if (data.email && !emailInput.value) {
            emailInput.value = data.email;
        }
        if (data.remember) {
            rememberCheckbox.checked = data.remember;
        }
    }
}

// Auto-save form data
const debouncedSave = debounce(saveFormDraft, 500);
emailInput.addEventListener('input', debouncedSave);
rememberCheckbox.addEventListener('change', debouncedSave);

// Load draft on page load
document.addEventListener('DOMContentLoaded', loadFormDraft);

// Clear draft on successful login
function clearFormDraft() {
    sessionStorage.removeItem('loginFormDraft');
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validatePassword,
        simulateLogin,
        showNotification
    };
}