/* ==========================================================================
   DAVID TAYLOR CONSTRUCTION - INTERACTION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. STICKY HEADER EFFECT ON SCROLL
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check in case page starts scrolled down

    // 2. MOBILE HAMBURGER MENU TOGGLE
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isOpen = navMenu.classList.contains('open');
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('open');
        hamburgerBtn.setAttribute('aria-expanded', !isOpen);
    };

    const closeMenu = () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    };

    hamburgerBtn.addEventListener('click', toggleMenu);
    
    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside of nav menu
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    // 3. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.12, // Trigger when 12% of element is visible
        rootMargin: '0px 0px -50px 0px' // Offset trigger point slightly
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 4. ACTIVE NAV LINK HIGHLIGHTING
    const sections = document.querySelectorAll('section[id]');
    
    const navObserverOptions = {
        threshold: 0.35, // Trigger when 35% of the section is visible
        rootMargin: '-10% 0px -40% 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                navLinks.forEach(link => link.classList.remove('active'));
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // 5. TESTIMONIAL SLIDER CAROUSEL
    const slider = document.getElementById('testimonial-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('slider-dots');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    let slideTimer;

    const updateSlider = (index) => {
        // Remove active class from current elements
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Wrap-around index checking
        if (index >= slideCount) currentSlide = 0;
        else if (index < 0) currentSlide = slideCount - 1;
        else currentSlide = index;

        // Add active classes
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
        
        // Smooth height adjustment for the carousel
        const activeSlide = slides[currentSlide];
        const slideHeight = activeSlide.offsetHeight;
        slider.style.height = `${slideHeight}px`;
    };

    const nextSlide = () => {
        updateSlider(currentSlide + 1);
        resetTimer();
    };

    const prevSlide = () => {
        updateSlider(currentSlide - 1);
        resetTimer();
    };

    // Auto Rotation Timer
    const startTimer = () => {
        slideTimer = setInterval(nextSlide, 6500); // Shift every 6.5s
    };

    const resetTimer = () => {
        clearInterval(slideTimer);
        startTimer();
    };

    // Event Listeners for controls
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            updateSlider(idx);
            resetTimer();
        });
    });

    // Touch Swipe Support for Testimonials (Mobile friendliness)
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const threshold = 50;
        if (touchStartX - touchEndX > threshold) {
            nextSlide(); // Swipe left -> Next
        } else if (touchEndX - touchStartX > threshold) {
            prevSlide(); // Swipe right -> Previous
        }
    };

    // Start timer and set initial height
    startTimer();
    setTimeout(() => {
        updateSlider(0);
    }, 300);

    // Recalculate slider height on window resize
    window.addEventListener('resize', () => {
        updateSlider(currentSlide);
    });

    // 6. BACK TO TOP BUTTON
    const backToTopBtn = document.getElementById('back-to-top-btn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 7. CONTACT FORM VALIDATION & MOCK SUBMISSION
    const form = document.getElementById('estimate-form');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');
    const submitBtn = document.getElementById('form-submit-btn');
    const btnText = submitBtn.querySelector('span');

    // Validation patterns
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // Basic phone validation (matches standard US styles)
    const phonePattern = /^(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;

    const validateField = (input, errorEl, validator) => {
        const formGroup = input.closest('.form-group');
        const isValid = validator(input.value.trim());
        
        if (isValid) {
            formGroup.classList.remove('invalid');
        } else {
            formGroup.classList.add('invalid');
        }
        return isValid;
    };

    // Inputs
    const nameInput = document.getElementById('form-name');
    const phoneInput = document.getElementById('form-phone');
    const emailInput = document.getElementById('form-email');
    const serviceSelect = document.getElementById('form-service');
    const detailsInput = document.getElementById('form-details');

    // Bind real-time input checks after initial validation attempt
    let validationAttempted = false;

    const runValidation = () => {
        let isFormValid = true;

        // Name Check
        if (!validateField(nameInput, null, val => val.length >= 2)) {
            isFormValid = false;
        }

        // Phone Check
        if (!validateField(phoneInput, null, val => phonePattern.test(val))) {
            isFormValid = false;
        }

        // Email Check
        if (!validateField(emailInput, null, val => emailPattern.test(val))) {
            isFormValid = false;
        }

        // Service Selection Check
        if (!validateField(serviceSelect, null, val => val !== '')) {
            isFormValid = false;
        }

        // Project Details Check
        if (!validateField(detailsInput, null, val => val.length >= 10)) {
            isFormValid = false;
        }

        return isFormValid;
    };

    const attachRealtimeValidation = () => {
        if (validationAttempted) return;
        validationAttempted = true;

        nameInput.addEventListener('input', () => validateField(nameInput, null, val => val.length >= 2));
        phoneInput.addEventListener('input', () => validateField(phoneInput, null, val => phonePattern.test(val)));
        emailInput.addEventListener('input', () => validateField(emailInput, null, val => emailPattern.test(val)));
        serviceSelect.addEventListener('change', () => validateField(serviceSelect, null, val => val !== ''));
        detailsInput.addEventListener('input', () => validateField(detailsInput, null, val => val.length >= 10));
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Run validations
        const isFormValid = runValidation();
        attachRealtimeValidation();

        if (!isFormValid) {
            errorMsg.style.display = 'flex';
            successMsg.style.display = 'none';
            // Scroll to form error block smoothly
            errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            return;
        }

        // Form is valid: redirect to WhatsApp
        errorMsg.style.display = 'none';

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();
        const service = serviceSelect.value;
        const details = detailsInput.value.trim();

        // Build pre-filled text with WhatsApp formatting (bold headings)
        const message = `Hello David Taylor Construction,\n\nI would like to request an estimate:\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n*Service:* ${service}\n*Project Details:* ${details}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/12058599006?text=${encodedMessage}`;

        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
        
        // Clear fields
        form.reset();
        validationAttempted = false;
        
        // Clear invalid classes
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => group.classList.remove('invalid'));

        // Show success alert indicating redirection
        successMsg.querySelector('strong').textContent = 'Opening WhatsApp...';
        successMsg.querySelector('span').textContent = 'Your request details have been prepared. Please send the message in WhatsApp.';
        successMsg.style.display = 'flex';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide success alert after 6 seconds
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 6000);
    });

    // 8. UPDATE FOOTER YEAR AUTOMATICALLY
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
