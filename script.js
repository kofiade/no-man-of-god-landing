/* ========================================
   NO MAN OF GOD - JavaScript
   Interactivity & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initNewsletterForm();
    initVideoCards();
    initCastTabs();
    
    // Add loaded class for animations
    document.body.classList.add('loaded');
});

/**
 * Navbar scroll effect
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class when scrolling down
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add fade-in class and observe elements (exclude cast-card — handled by tab logic)
    const animateElements = document.querySelectorAll(
        '.story-content, .video-card, .newsletter-content, .section-title, .section-label, .structure-card, .theme-card, .event-detail, .composer-spotlight, .tier-card, .about-grid, .concert-description, .sponsorship-block'
    );
    
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // For cast cards in the active tab, fade them in with stagger
    const activeCastCards = document.querySelectorAll('.cast-tab-content.active .cast-card');
    activeCastCards.forEach((card, index) => {
        card.classList.add('fade-in');
        setTimeout(() => {
            card.classList.add('visible');
        }, 200 + index * 100);
    });
}

/**
 * Cast & Crew tabs
 */
function initCastTabs() {
    const tabs = document.querySelectorAll('.cast-tab');
    const contents = document.querySelectorAll('.cast-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            
            // Remove active from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked tab and target content
            tab.classList.add('active');
            const targetContent = document.getElementById(target);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Re-trigger fade-in animations for newly visible cards
                const cards = targetContent.querySelectorAll('.cast-card');
                cards.forEach((card, index) => {
                    card.classList.remove('visible');
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    });
}

/**
 * Newsletter form handling
 */
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('email-input');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (validateEmail(email)) {
            // Simulate form submission
            showNotification('Thank you! You\'ve joined the Inner Circle.', 'success');
            emailInput.value = '';
            
            // In a real implementation, you would send this to your backend
            console.log('Newsletter signup:', email);
        } else {
            showNotification('Please enter a valid email address.', 'error');
        }
    });
}

/**
 * Email validation helper
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Show notification
 */
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'rgba(201, 169, 98, 0.95)' : 'rgba(220, 53, 69, 0.95)'};
        color: ${type === 'success' ? '#0a0a0a' : '#fff'};
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 9999;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        animation: slideInRight 0.4s ease;
    `;
    
    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        line-height: 1;
        opacity: 0.7;
    `;
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease reverse forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Video card interactions
 */
function initVideoCards() {
    const playButtons = document.querySelectorAll('.play-button');
    
    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoCard = button.closest('.video-card');
            const videoTitle = videoCard.querySelector('.video-info h3').textContent;
            const videoUrl = videoCard.getAttribute('data-url');
            
            if (videoUrl) {
                // Open the actual video URL
                window.open(videoUrl, '_blank');
            } else {
                // Placeholder for videos without a URL yet
                showNotification(`${videoTitle} — Coming Soon`, 'success');
            }
        });
    });
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Parallax effect for hero section (subtle)
 */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-background');
    if (hero && window.pageYOffset < window.innerHeight) {
        hero.style.transform = `translateY(${window.pageYOffset * 0.3}px)`;
    }
});
