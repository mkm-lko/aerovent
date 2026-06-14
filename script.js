/**
 * AEROVENT — APPLICATION CONTROLLER CORE CORE WIREFRAME
 * High-performance, memory-optimized architecture.
 */

document.addEventListener('DOMContentLoaded', () => {
    const app = new AeroVentEngine();
    app.init();
});

class AeroVentEngine {
    constructor() {
        this.dom = {
            navbar: document.getElementById('navbar'),
            navLinks: document.querySelectorAll('.nav-item'),
            sections: document.querySelectorAll('main > section'),
            mobileToggle: document.getElementById('mobileToggle'),
            scrollProgress: document.getElementById('scrollProgress'),
            mouseGlow: document.getElementById('mouseGlow'),
            heroCanvas: document.getElementById('heroCanvas'),
            faqItems: document.querySelectorAll('.faq-item'),
            counters: document.querySelectorAll('.counter-num')
        };
        this.scrolled = false;
        this.mouseX = 0;
        this.mouseY = 0;
    }

    init() {
        this.setupNavigation();
        this.setupRevealSystem();
        this.setupMouseTracking();
        this.setupAccordion();
        this.setupCounterObserver();
        
        // Window Performance Listeners Setup
        window.addEventListener('scroll', () => this.handleScrollThrottle(), { passive: true });
        window.addEventListener('hashchange', () => this.handleRouteChange());
        this.handleRouteChange(true);
    }

    /**
     * Scroll Interface Operations Pipeline
     */
    handleScrollThrottle() {
        if (!this.scrolled) {
            window.requestAnimationFrame(() => {
                this.executeScrollCalculations();
                this.scrolled = false;
            });
            this.scrolled = true;
        }
    }

    executeScrollCalculations() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Progress Fill
        const scrollPercent = (scrollTop / docHeight) * 100;
        this.dom.scrollProgress.style.width = `${scrollPercent}%`;

        // Navbar Matrix Switch
        if (scrollTop > 50) {
            this.dom.navbar.classList.add('scrolled');
        } else {
            this.dom.navbar.classList.remove('scrolled');
        }

        // Active Link Node Resolver Tracking
        let currentSectionId = '';
        this.dom.sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (scrollTop >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            this.dom.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    /**
     * Interface Responsive Mobile Layout Navigation Overlay Actions
     */
    setupNavigation() {
        if (this.dom.mobileToggle) {
            this.dom.mobileToggle.addEventListener('click', () => {
                const expanded = this.dom.mobileToggle.getAttribute('aria-expanded') === 'true';
                this.dom.mobileToggle.setAttribute('aria-expanded', (!expanded).toString());
                this.dom.navbar.classList.toggle('nav-open');
            });
        }

        this.dom.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetSection = document.querySelector(href);
                if (!targetSection) return;

                if (this.dom.navbar.classList.contains('nav-open')) {
                    this.dom.navbar.classList.remove('nav-open');
                    if (this.dom.mobileToggle) {
                        this.dom.mobileToggle.setAttribute('aria-expanded', 'false');
                    }
                }

                window.location.hash = href;
                this.navigateToPage(targetSection);
            });
        });
    }

    handleRouteChange(initial = false) {
        const hash = window.location.hash || '#hero';
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            this.highlightNavLink(hash);
            if (!initial) {
                this.animatePageIncoming(targetSection);
            }
            const sectionTop = window.scrollY + targetSection.getBoundingClientRect().top - 90;
            window.scrollTo({ top: sectionTop, behavior: 'smooth' });
        }
    }

    navigateToPage(targetSection) {
        const targetId = targetSection.getAttribute('id');
        const hash = `#${targetId}`;

        this.highlightNavLink(hash);
        window.history.pushState(null, '', hash);
        this.animatePageIncoming(targetSection);

        const sectionTop = window.scrollY + targetSection.getBoundingClientRect().top - 90;
        window.scrollTo({ top: sectionTop, behavior: 'smooth' });
    }

    highlightNavLink(hash) {
        this.dom.navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === hash);
        });
    }

    animatePageIncoming(section) {
        section.classList.remove('page-slide-up');
        void section.offsetWidth;
        section.classList.add('page-slide-up');
        section.addEventListener('animationend', () => {
            section.classList.remove('page-slide-up');
        }, { once: true });
    }

    /**
     * Intersection Observer Micro-Engine for Scroll Revealing Mechanics
     */
    setupRevealSystem() {
        const revealOptions = {
            threshold: 0.12,
            rootMargin: '0px 0px -20px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Execution performance preservation
                }
            });
        }, revealOptions);

        document.querySelectorAll('[data-reveal]').forEach(element => {
            revealObserver.observe(element);
        });
    }

    /**
     * Premium Ambient Tracking Glow Vectors Pipelines
     */
    setupMouseTracking() {
        // Safe check preventing processing penalty spikes inside low tier mobile hardware viewports
        if (window.innerWidth < 768) return;

        document.addEventListener('mousemove', (e) => {
            // Smooth light tracking allocations
            this.dom.mouseGlow.style.opacity = '1';
            this.dom.mouseGlow.style.left = `${e.clientX}px`;
            this.dom.mouseGlow.style.top = `${e.clientY}px`;

            // Parallax Matrix updates directly applied onto Hero wireframes canvas
            if (this.dom.heroCanvas) {
                const transX = (e.clientX - window.innerWidth / 2) * 0.02;
                const transY = (e.clientY - window.innerHeight / 2) * 0.02;
                this.dom.heroCanvas.style.transform = `translate(${transX}px, calc(-45% + ${transY}px))`;
            }
        });

        document.addEventListener('mouseleave', () => {
            this.dom.mouseGlow.style.opacity = '0';
        });
    }

    /**
     * Native Accordion Layout Engine Modules
     */
    setupAccordion() {
        this.dom.faqItems.forEach(item => {
            const trigger = item.querySelector('.faq-trigger');
            const content = item.querySelector('.faq-content');

            trigger.addEventListener('click', () => {
                const isOpen = item.hasAttribute('open');

                // Enforce unified clean accordion logic
                this.dom.faqItems.forEach(i => {
                    i.removeAttribute('open');
                    i.querySelector('.faq-content').style.maxHeight = null;
                    i.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                });

                if (!isOpen) {
                    item.setAttribute('open', '');
                    trigger.setAttribute('aria-expanded', 'true');
                    content.style.maxHeight = `${content.scrollHeight + 30}px`;
                }
            });
        });
    }

    /**
     * High Performance Numerical Acceleration Counters
     */
    setupCounterObserver() {
        const counterOptions = { threshold: 0.5 };
        
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, counterOptions);

        this.dom.counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounters(counterElement) {
        const target = parseInt(counterElement.getAttribute('data-target'), 10);
        if (target === 0) {
            counterElement.innerText = '0';
            return;
        }
        
        let current = 0;
        const duration = 2000; // Total runtime allocation inside ms frames boundaries
        const increment = target / (duration / 16); // Map calculations accurately tracking 60 FPS iterations

        const updateCount = () => {
            current += increment;
            if (current < target) {
                counterElement.innerText = Math.floor(current);
                requestAnimationFrame(updateCount);
            } else {
                counterElement.innerText = target;
            }
        };

        requestAnimationFrame(updateCount);
    }
}