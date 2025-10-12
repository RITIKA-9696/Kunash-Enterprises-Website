// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

mobileMenuButton.addEventListener('click', () => {
    if (menuOpen) {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
    } else {
        mobileMenu.classList.remove('hidden');
        mobileMenuButton.innerHTML = '<i class="fas fa-times text-xl"></i>';
    }
    menuOpen = !menuOpen;
});

// Scroll Progress Bar
window.onscroll = function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector('.progress-bar').style.width = scrolled + '%';
    
    // Show/hide back to top button
    const backToTop = document.getElementById('backToTop');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTop.classList.remove('opacity-0');
        backToTop.classList.add('opacity-100');
    } else {
        backToTop.classList.remove('opacity-100');
        backToTop.classList.add('opacity-0');
    }
};

// Back to top functionality
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
let darkMode = localStorage.getItem('darkMode') === 'true';

// Apply dark mode if previously enabled
if (darkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun text-yellow-400"></i>';
}

darkModeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun text-yellow-400"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-moon text-gray-700"></i>';
    }
});

// Countdown Timer for Special Offers
function updateCountdown() {
    const countDownDate = new Date();
    countDownDate.setDate(countDownDate.getDate() + 7); // Set to 7 days from now
    
    const now = new Date().getTime();
    const distance = countDownDate - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
    document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Loading Spinner
function showLoadingSpinner() {
    document.body.classList.add('overflow-hidden');
    const spinner = document.createElement('div');
    spinner.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    spinner.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(spinner);
}

function hideLoadingSpinner() {
    document.body.classList.remove('overflow-hidden');
    const spinner = document.querySelector('.fixed.inset-0.bg-black');
    if (spinner) {
        spinner.remove();
    }
}

// Simulate page loading
window.addEventListener('load', () => {
    hideLoadingSpinner();
});

// Show spinner when navigating between pages
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (link.href && !link.href.startsWith('javascript:') && !link.href.startsWith('#')) {
            link.addEventListener('click', (e) => {
                if (link.target !== '_blank' && link.href !== window.location.href) {
                    showLoadingSpinner();
                }
            });
        }
    });
});

// Product image gallery functionality for product detail page
function changeImage(src) {
    document.getElementById('mainImage').src = src;
}

// Form validation for contact form
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('form');
    if (contactForm && window.location.pathname.includes('contact.html')) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('Please fill in all required fields');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate form submission
            showLoadingSpinner();
            setTimeout(() => {
                hideLoadingSpinner();
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            }, 1500);
        });
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to all pages
    document.body.classList.add('fade-in');
    
    // Initialize any other functionality here
});

