// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

// Mobile Navigation Toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Active Navigation Link
function updateActiveNavLink() {
    let current = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// Smooth Scrolling for Navigation Links
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').slice(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        closeMobileMenu();
    }
}

// Dark Mode Toggle
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update icons
    updateThemeIcons(newTheme);

    // Track theme change
    trackEvent('theme_toggle', { theme: newTheme });
}

// Update theme icons based on current theme
function updateThemeIcons(theme) {
    if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

// Initialize theme on page load
function initializeTheme() {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    document.body.setAttribute('data-theme', theme);
    updateThemeIcons(theme);
}

// Listen for system theme changes
function watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
        // Only change theme if user hasn't explicitly set one
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.body.setAttribute('data-theme', newTheme);
            updateThemeIcons(newTheme);
        }
    });
}

// Scroll Animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.project-card, .skills-grid, .about-content, .contact-content');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;

        // Add animation class when element is in viewport
        if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
            element.classList.add('animate-fade-in');
        }
    });
}

// Optimize scroll performance
let ticking = false;
function requestTick() {
    if (!ticking) {
        window.requestAnimationFrame(updateActiveNavLink);
        ticking = true;
        setTimeout(() => {
            ticking = false;
        }, 100);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // Scroll events
    window.addEventListener('scroll', function() {
        requestTick();
        handleScrollAnimations();
    });

    // Initial animations
    handleScrollAnimations();

    // Handle resize
    window.addEventListener('resize', function() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Handle escape key for mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});

// Add loading complete class to prevent flash of unstyled content
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Preload critical resources
function preloadResources() {
    // Preload any critical images or fonts if needed
    const criticalResources = [
        // Add any critical resources here
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' :
                  resource.endsWith('.js') ? 'script' : 'image';
        document.head.appendChild(link);
    });
}

// Performance optimization: Lazy load images when they come into viewport
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
if ('IntersectionObserver' in window) {
    setupLazyLoading();
}

// Utility function to debounce scroll events
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

// Debounced scroll handler for better performance
const debouncedScrollHandler = debounce(function() {
    // Add any scroll-based functionality here
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// Form validation (if contact form is added in the future)
function validateForm(formData) {
    const errors = [];

    if (!formData.email || !formData.email.includes('@')) {
        errors.push('Please enter a valid email address');
    }

    if (!formData.message || formData.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }

    return errors;
}

// Analytics tracking (placeholder for future implementation)
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics implementation
    console.log('Event tracked:', eventName, properties);
}

// Track navigation clicks
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('navigation_click', {
            destination: this.getAttribute('href').slice(1)
        });
    });
});

// Track project link clicks
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('project_link_click', {
            project: this.closest('.project-card').querySelector('.project-title').textContent,
            type: this.textContent.includes('GitHub') ? 'github' : 'demo'
        });
    });
});

// Error handling for broken images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Image failed to load:', this.src);
        });
    });
});

// Console welcome message
console.log('%c👋 Welcome to my portfolio!', 'font-size: 16px; color: #007acc; font-weight: bold;');
console.log('%cBuilt with HTML, CSS & JavaScript', 'font-size: 12px; color: #666;');