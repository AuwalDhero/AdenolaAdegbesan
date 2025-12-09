/* -------------------------------------------------
   ✅ MOBILE NAVIGATION — GUARANTEED NAVIGATION FIX
------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

    const hamburger = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');

    if (!hamburger || !mobileMenu || !overlay) return;

    function openMenu() {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // Hamburger toggle (NO preventDefault)
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.contains('active') ? closeMenu() : openMenu();
    });

    // Overlay closes menu
    overlay.addEventListener('click', closeMenu);

    // Prevent menu background from closing it
    mobileMenu.addEventListener('click', (e) => e.stopPropagation());

    // Close menu ONLY after navigation (for anchor links)
    document.querySelectorAll('#mobileMenu a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // No e.preventDefault() – let browser handle href
            setTimeout(closeMenu, 100);  // Slight delay for scroll animation
        });
    });

    // For external links (if any)
    document.querySelectorAll('#mobileMenu a:not([href^="#"])').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ESC closes menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

});


/* -------------------------------------------------
   MULTI-STEP FORM
------------------------------------------------- */
function nextStep() {
    const currentStep = document.querySelector('.form-step.active');
    const inputs = currentStep.querySelectorAll('input[required], select[required]');

    let valid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            input.style.borderColor = 'red';
            input.focus();
        } else {
            input.style.borderColor = '';
        }
    });

    if (!valid) return;

    const nextStepElement = currentStep.nextElementSibling;
    if (nextStepElement && nextStepElement.classList.contains('form-step')) {
        currentStep.classList.remove('active');
        nextStepElement.classList.add('active');

        const stepNumber = parseInt(nextStepElement.getAttribute('data-step'));
        updateProgressBar(stepNumber);
    }
}

function updateProgressBar(step) {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = (step / 3 * 100) + '%';
    }
}

function scrollToForm() {
    const heroForm = document.querySelector('.hero-form');
    const headerHeight = document.querySelector('.main-header').offsetHeight;

    if (heroForm) {
        const offset = heroForm.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    }
}


/* -------------------------------------------------
   QUIZ LOGIC
------------------------------------------------- */
function startFullAssessment() {
    const selected = document.querySelector('.quiz-option.selected');
    if (!selected) {
        alert('Please select your current AI integration stage first.');
        return;
    }
    const score = selected.dataset.score;
    alert(`Your AI readiness score: ${score}/4\n\nRedirecting to full assessment...`);
}

document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
    });
});


/* -------------------------------------------------
   FORM SUBMISSIONS
------------------------------------------------- */
document.getElementById('leadForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    setTimeout(() => {
        document.querySelector('.form-step.active')?.classList.remove('active');
        document.querySelector('.form-step[data-step="3"]')?.classList.add('active');
        updateProgressBar(3);
    }, 1000);
});

document.getElementById('downloadForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    setTimeout(() => {
        alert('Your Strategic AI Clarity Report has been downloaded!');
    }, 600);
});

document.getElementById('newsletterForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Thank you for subscribing to AI Maverick Insights!');
});


/* -------------------------------------------------
   TYPED TEXT
------------------------------------------------- */
if (typeof Typed !== 'undefined') {
    new Typed('#typed-text', {
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
        cursorChar: '|'
    });
}


/* -------------------------------------------------
   SPLIDE SLIDER
------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Splide !== "undefined") {
        new Splide('#testimonial-slider', {
            type: 'loop',
            autoplay: true,
            interval: 5000,
            arrows: false,
            pagination: true,
            speed: 800,
        }).mount();
    }
});


/* -------------------------------------------------
   ANIMATIONS
------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.problem-item').forEach(el => revealObserver.observe(el));


/* -------------------------------------------------
   STAT COUNTERS
------------------------------------------------- */
const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const final = parseInt(el.getAttribute('data-count'));
        let current = 0;
        const increment = final / 50;

        const counter = setInterval(() => {
            current += increment;
            if (current >= final) {
                el.textContent = final;
                clearInterval(counter);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 50);

        statObserver.unobserve(el);
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));
