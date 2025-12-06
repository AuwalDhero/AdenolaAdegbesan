// Main JavaScript functionality for Adenola Adegbesan website

document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeForm();
    initializeTestimonialSlider();
    initializeScrollEffects();
    initializeQuiz();
    initializeStickyCTA();
});

// Initialize animations
function initializeAnimations() {
    // Typewriter effect for hero title
    const typed = new Typed('#typed-text', {
        strings: [
            'Strategic AI Clarity',
            'Cross-Market Excellence',
            'Business Transformation',
            'AI Strategy That Works'
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });

    // Animate stat numbers
    animateStats();
    
    // Initialize scroll animations
    initializeScrollAnimations();
}

// Animate statistics counters
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.getAttribute('data-count'));
                let currentValue = 0;
                const increment = finalValue / 50;
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        target.textContent = finalValue;
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(currentValue);
                    }
                }, 50);
                
                observer.unobserve(target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Initialize form functionality
function initializeForm() {
    const leadForm = document.getElementById('leadForm');
    const downloadForm = document.getElementById('downloadForm');
    
    if (leadForm) {
        leadForm.addEventListener('submit', handleLeadFormSubmit);
    }
    
    if (downloadForm) {
        downloadForm.addEventListener('submit', handleDownloadFormSubmit);
    }
}

// Handle lead form submission
function handleLeadFormSubmit(e) {
    e.preventDefault();
    
    // Simulate form submission
    setTimeout(() => {
        showFormSuccess();
        // In a real implementation, you would send data to your backend
        console.log('Lead form submitted:', new FormData(e.target));
    }, 1000);
}

// Handle download form submission
function handleDownloadFormSubmit(e) {
    e.preventDefault();
    
    // Simulate form submission and download
    setTimeout(() => {
        // Trigger download
        const link = document.createElement('a');
        link.href = 'resources/strategic-ai-report.pdf'; // This would be your actual PDF
        link.download = 'Strategic-AI-Clarity-Report.pdf';
        link.click();
        
        // Show success message
        showDownloadSuccess();
        
        console.log('Download form submitted:', new FormData(e.target));
    }, 1000);
}

// Multi-step form navigation
function nextStep() {
    const currentStep = document.querySelector('.form-step.active');
    const nextStepElement = currentStep.nextElementSibling;
    
    if (nextStepElement && nextStepElement.classList.contains('form-step')) {
        currentStep.classList.remove('active');
        nextStepElement.classList.add('active');
        
        // Update progress bar
        const stepNumber = parseInt(nextStepElement.getAttribute('data-step'));
        updateProgressBar(stepNumber);
    }
}

function updateProgressBar(step) {
    const progressFill = document.getElementById('progressFill');
    const percentage = (step / 3) * 100;
    progressFill.style.width = percentage + '%';
}

function showFormSuccess() {
    const currentStep = document.querySelector('.form-step.active');
    const successStep = document.querySelector('.form-step[data-step="3"]');
    
    currentStep.classList.remove('active');
    successStep.classList.add('active');
    updateProgressBar(3);
}

function showDownloadSuccess() {
    alert('Your Strategic AI Clarity Report has been downloaded! Check your downloads folder.');
}

// Initialize testimonial slider
function initializeTestimonialSlider() {
    const slider = document.getElementById('testimonial-slider');
    
    if (slider) {
        new Splide(slider, {
            type: 'loop',
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            arrows: false,
            pagination: true,
            speed: 800,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).mount();
    }
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Scroll animations for fade-up elements
    const fadeUpElements = document.querySelectorAll('.fade-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeUpElements.forEach(element => observer.observe(element));
    
    // Problem items stagger animation
    const problemItems = document.querySelectorAll('.problem-item');
    
    const problemObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1
    });
    
    problemItems.forEach(item => {
        problemObserver.observe(item);
    });
}

// Initialize quiz functionality
function initializeQuiz() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            quizOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
}

// Start full assessment
function startFullAssessment() {
    const selectedOption = document.querySelector('.quiz-option.selected');
    
    if (selectedOption) {
        const score = selectedOption.getAttribute('data-score');
        
        // Redirect to full assessment or show results
        alert(`Your AI readiness score: ${score}/4\n\nRedirecting to full assessment...`);
        
        // In a real implementation, you might redirect to a full assessment page
        // window.location.href = `/assessment?score=${score}`;
    } else {
        alert('Please select your current AI integration stage first.');
    }
}

// Initialize sticky CTA
function initializeStickyCTA() {
    const stickyCta = document.getElementById('stickyCta');
    
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            
            if (scrollPosition > heroHeight) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }
}

// Smooth scroll to form
function scrollToForm() {
    const heroForm = document.querySelector('.hero-form');
    const headerHeight = document.querySelector('.main-header').offsetHeight;
    
    if (heroForm) {
        const formPosition = heroForm.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        
        window.scrollTo({
            top: formPosition,
            behavior: 'smooth'
        });
    }
}

// Scroll animations initialization
function initializeScrollAnimations() {
    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

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

// Enhanced form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(formData) {
    const errors = [];
    
    if (!formData.get('fullName') || formData.get('fullName').trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!validateEmail(formData.get('email'))) {
        errors.push('Please enter a valid email address');
    }
    
    if (!formData.get('country')) {
        errors.push('Please select your primary market');
    }
    
    if (!formData.get('businessStage')) {
        errors.push('Please select your AI integration stage');
    }
    
    return errors;
}

// Add loading states to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-light')) {
        const button = e.target;
        const originalText = button.textContent;
        
        button.textContent = 'Loading...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    }
});

// Add hover effects for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('.problem-item, .stat-item, .btn-primary, .btn-light');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Add click tracking for analytics (placeholder)
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    // In a real implementation, you would send this to your analytics service
}

// Track important user interactions
document.addEventListener('click', function(e) {
    if (e.target.textContent.includes('GET MY STRATEGIC AI REPORT')) {
        trackEvent('lead_form_submit');
    }
    
    if (e.target.textContent.includes('BOOK CONSULTATION')) {
        trackEvent('consultation_click');
    }
    
    if (e.target.classList.contains('quiz-option')) {
        trackEvent('quiz_interaction', {
            option: e.target.textContent
        });
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
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

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In a real implementation, you might send this to an error tracking service
});

// Add CSS for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--gold) !important;
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);