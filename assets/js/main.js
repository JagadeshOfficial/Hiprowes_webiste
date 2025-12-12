document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu'); // Target the menu directly
    const body = document.body;

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navContainer.classList.toggle('active');
            navMenu.classList.toggle('active'); // Toggle class on menu for CSS transform
            const icon = menuToggle.querySelector('i');

            if (navContainer.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                body.style.overflow = 'hidden'; // Prevent background scrolling
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                body.style.overflow = '';
            }
        });
    }

    // Sticky Header Effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Accordion Logic
    if (window.innerWidth < 1024) {
        const dropdownToggles = document.querySelectorAll('.nav-item.dropdown > .nav-link');

        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault(); // Stop link navigation
                e.stopPropagation(); // Stop bubbling

                const parent = toggle.parentElement;
                const wasActive = parent.classList.contains('active');

                // Close all other dropdowns first (Accordion behavior)
                document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                    item.classList.remove('active');
                });

                // Toggle the clicked one
                if (!wasActive) {
                    parent.classList.add('active');
                }
            });
        });
    }

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.card, .section-title, .hero-content, .footer-col');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add CSS class for animation via JS to keep it encapsulated if needed, 
    // but usually cleaner to have in CSS. We'll inject it here to be safe.
    const style = document.createElement('style');
    style.innerHTML = `
        .animate-up {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Stats Counter Animation
    const statsSection = document.querySelector('.stats-section');
    const counters = document.querySelectorAll('.stat-number');
    let started = false;

    if (statsSection && counters.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000;
                    const step = target / (duration / 16);

                    let current = 0;
                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target + (target > 50 ? '+' : '%');
                        }
                    };
                    updateCounter();
                });
                started = true;
            }
        });
        statsObserver.observe(statsSection);
    }

    // DNA Tabs Logic
    const dnaTabs = document.querySelectorAll('.dna-tab');
    const dnaContents = document.querySelectorAll('.dna-content');

    dnaTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            dnaTabs.forEach(t => t.classList.remove('active'));
            dnaContents.forEach(c => c.classList.remove('active'));

            // Add active class to current
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Vanilla 3D Tilt Effect
    const tiltElement = document.querySelector('[data-tilt]');
    if (tiltElement) {
        tiltElement.addEventListener('mousemove', (e) => {
            const rect = tiltElement.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xCenter = rect.width / 2;
            const yCenter = rect.height / 2;

            // Multiplier for intensity
            const rotateX = ((y - yCenter) / yCenter) * -5; // Max 5 deg
            const rotateY = ((x - xCenter) / xCenter) * 5;

            tiltElement.children[0].style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        tiltElement.addEventListener('mouseleave', () => {
            tiltElement.children[0].style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }

    // Services Page ScrollSpy
    const serviceSections = document.querySelectorAll('.service-section');
    const serviceLinks = document.querySelectorAll('.service-link');

    if (serviceSections.length > 0 && serviceLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';

            serviceSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            serviceLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        });
    }
});
