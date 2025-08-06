// Dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadUserData();
    initializeEventListeners();
});

// Initialize dashboard
function initializeDashboard() {
    // Check if user is logged in
    const isLoggedIn = checkAuthStatus();
    if (!isLoggedIn) {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize components
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
    
    // Load dashboard data
    loadDashboardData();
}

// Check authentication status
function checkAuthStatus() {
    // In a real app, this would check with your backend
    // For demo purposes, we'll check localStorage
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Load user data
function loadUserData() {
    const userEmail = localStorage.getItem('userEmail') || 'demo@example.com';
    const userName = localStorage.getItem('userName') || 'Demo User';
    
    document.getElementById('userEmail').textContent = userEmail;
    document.getElementById('userName').textContent = userName;
}

// Event listeners
function initializeEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Quick action buttons
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', handleQuickAction);
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Notification button
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', showNotifications);
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', handleOutsideClick);
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
}

// Sidebar functionality
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.querySelector('.sidebar-overlay') || createSidebarOverlay();
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    
    // Update main content margin on desktop
    if (window.innerWidth > 1024) {
        mainContent.classList.toggle('sidebar-collapsed');
    }
}

function createSidebarOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.addEventListener('click', closeSidebar);
    document.body.appendChild(overlay);
    return overlay;
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    sidebar.classList.remove('open');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Handle outside clicks
function handleOutsideClick(event) {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    
    if (window.innerWidth <= 1024 && 
        sidebar.classList.contains('open') && 
        !sidebar.contains(event.target) && 
        !sidebarToggle.contains(event.target)) {
        closeSidebar();
    }
}

// Handle window resize
function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (window.innerWidth > 1024) {
        // Desktop view
        sidebar.classList.remove('open');
        if (overlay) {
            overlay.classList.remove('active');
        }
    } else {
        // Mobile view
        mainContent.classList.remove('sidebar-collapsed');
    }
}

// Navigation handling
function handleNavigation(event) {
    event.preventDefault();
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    event.currentTarget.closest('.nav-item').classList.add('active');
    
    // Get the navigation target
    const navText = event.currentTarget.querySelector('span').textContent;
    
    // Show notification for demo purposes
    showNotification(`Navigating to ${navText}...`, 'info');
    
    // In a real app, you would handle routing here
    console.log(`Navigating to: ${navText}`);
}

// Quick actions
function handleQuickAction(event) {
    const actionText = event.currentTarget.querySelector('span').textContent;
    
    // Show loading state
    const originalContent = event.currentTarget.innerHTML;
    event.currentTarget.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading...</span>';
    event.currentTarget.disabled = true;
    
    // Simulate action
    setTimeout(() => {
        showNotification(`${actionText} feature would be implemented here.`, 'info');
        
        // Reset button
        event.currentTarget.innerHTML = originalContent;
        event.currentTarget.disabled = false;
    }, 1500);
}

// Search functionality
function handleSearch(event) {
    const query = event.target.value.trim();
    
    if (query.length > 2) {
        // Simulate search with debounce
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            console.log(`Searching for: ${query}`);
            // In a real app, you would perform the search here
            showNotification(`Searching for "${query}"...`, 'info');
        }, 300);
    }
}

// Notifications
function showNotifications() {
    const notifications = [
        { message: 'New project assigned to you', time: '5 min ago', type: 'info' },
        { message: 'Meeting reminder: Team standup at 10 AM', time: '1 hour ago', type: 'warning' },
        { message: 'Task completed successfully', time: '2 hours ago', type: 'success' }
    ];
    
    // Create notification dropdown
    let dropdown = document.querySelector('.notification-dropdown');
    if (dropdown) {
        dropdown.remove();
    }
    
    dropdown = document.createElement('div');
    dropdown.className = 'notification-dropdown';
    dropdown.innerHTML = `
        <div class="notification-header">
            <h4>Notifications</h4>
            <button class="mark-all-read">Mark all as read</button>
        </div>
        <div class="notification-list">
            ${notifications.map(notif => `
                <div class="notification-item">
                    <div class="notification-content">
                        <p>${notif.message}</p>
                        <span class="notification-time">${notif.time}</span>
                    </div>
                    <div class="notification-indicator ${notif.type}"></div>
                </div>
            `).join('')}
        </div>
        <div class="notification-footer">
            <a href="#" class="view-all-notifications">View all notifications</a>
        </div>
    `;
    
    // Position dropdown
    const notificationBtn = document.querySelector('.notification-btn');
    const rect = notificationBtn.getBoundingClientRect();
    dropdown.style.cssText = `
        position: fixed;
        top: ${rect.bottom + 10}px;
        right: ${window.innerWidth - rect.right}px;
        width: 320px;
        max-height: 400px;
        background: white;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 1000;
        animation: fadeInDown 0.3s ease;
    `;
    
    document.body.appendChild(dropdown);
    
    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeNotifications(e) {
            if (!dropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeNotifications);
            }
        });
    }, 100);
}

// Logout functionality
function handleLogout() {
    // Show confirmation
    if (confirm('Are you sure you want to logout?')) {
        // Clear authentication data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('rememberedEmail');
        
        // Show logout message
        showNotification('Logging out...', 'info');
        
        // Redirect to login after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    // You can add a date/time display element if needed
    console.log('Current time:', now.toLocaleDateString('en-US', options));
}

// Load dashboard data
function loadDashboardData() {
    // Simulate loading dashboard data
    setTimeout(() => {
        animateCounters();
        loadRecentActivity();
    }, 500);
}

// Animate stat counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 50; // Animation duration control
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Load recent activity
function loadRecentActivity() {
    // In a real app, this would fetch from an API
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.5s ease';
            
            requestAnimationFrame(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        }, index * 100);
    });
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

// Add notification dropdown styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-dropdown {
        overflow: hidden;
    }
    
    .notification-header {
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .notification-header h4 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .mark-all-read {
        background: none;
        border: none;
        color: var(--primary-green);
        cursor: pointer;
        font-size: 0.75rem;
        font-weight: 500;
    }
    
    .notification-list {
        max-height: 250px;
        overflow-y: auto;
    }
    
    .notification-item {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transition: background-color 0.2s;
    }
    
    .notification-item:hover {
        background: var(--gray-100);
    }
    
    .notification-item:last-child {
        border-bottom: none;
    }
    
    .notification-content {
        flex: 1;
    }
    
    .notification-content p {
        margin: 0 0 0.25rem 0;
        font-size: 0.875rem;
        color: var(--text-primary);
    }
    
    .notification-time {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }
    
    .notification-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
    
    .notification-indicator.info { background: #3b82f6; }
    .notification-indicator.warning { background: #f59e0b; }
    .notification-indicator.success { background: #10b981; }
    
    .notification-footer {
        padding: 0.75rem 1rem;
        border-top: 1px solid var(--border-color);
        text-align: center;
    }
    
    .view-all-notifications {
        color: var(--primary-green);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .view-all-notifications:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(notificationStyles);

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + K for search focus
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close sidebar on mobile
    if (event.key === 'Escape') {
        closeSidebar();
        
        // Close notifications
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.remove();
        }
        
        const dropdown = document.querySelector('.notification-dropdown');
        if (dropdown) {
            dropdown.remove();
        }
    }
});

// Set authentication flag for demo
localStorage.setItem('isLoggedIn', 'true');