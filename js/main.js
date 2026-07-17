document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Set current year in footer ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- 2. Initialize Lenis (Smooth Scroll) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- 3. Scroll Progress Bar ---
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTotal = document.documentElement.scrollTop;
            const heightTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPosition = (scrollTotal / heightTotal) * 100;
            progressBar.style.width = scrollPosition + '%';
        });
    }

    // --- 4. Custom Cursor Glow ---
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for smoother cursor following
            requestAnimationFrame(() => {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            });
        });

        // Hide cursor glow when leaving the window
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorGlow.style.opacity = '1';
        });
    }

    // --- 5. Navbar Scrolled Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 6. Initialize VanillaTilt (3D Hover Effect) ---
    // Make sure the element exists before initializing
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
        });
    }

    // --- 7. GSAP Animations ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Reveal
        gsap.fromTo(".gsap-reveal", 
            { y: 50, opacity: 0, filter: "blur(10px)" },
            { 
                y: 0, 
                opacity: 1, 
                filter: "blur(0px)",
                duration: 1.2, 
                stagger: 0.15, 
                ease: "power3.out",
                delay: 0.2 
            }
        );

        // General Fade in for sections
        const fadeElements = document.querySelectorAll('.gsap-fade');
        fadeElements.forEach((el) => {
            const delay = el.style.getPropertyValue('--delay') || '0s';
            gsap.fromTo(el,
                { y: 40, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%", // Trigger when top of element is 85% down viewport
                        toggleActions: "play none none reverse"
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: parseFloat(delay),
                    ease: "power3.out"
                }
            );
        });

        // Background Particles Parallax effect
        gsap.to(".bg-particles", {
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            },
            y: 200,
            ease: "none"
        });
    }

    // --- 8. Smooth scrolling for internal anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target);
            }
        });
    });
});
