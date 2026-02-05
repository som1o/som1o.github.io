/* global gsap */
(() => {
    const cursor = document.getElementById('cursor');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!cursor || prefersReducedMotion || typeof gsap === 'undefined') {
        return;
    }

    let rafId = null;
    let targetX = 0;
    let targetY = 0;

    const animateCursor = () => {
        gsap.to(cursor, {
            x: targetX,
            y: targetY,
            duration: 0.2,
            ease: 'power2.out'
        });
        rafId = null;
    };

    document.addEventListener('mousemove', (event) => {
        targetX = event.clientX;
        targetY = event.clientY;

        if (!rafId) {
            rafId = window.requestAnimationFrame(animateCursor);
        }
    });

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.from('.sidebar', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        clearProps: 'all'
    })
        .from('.hero-title', {
            y: 40,
            opacity: 0,
            duration: 2,
            ease: 'power4.out'
        }, '-=1')
        .from('.hero-meta', {
            y: 20,
            opacity: 0,
            duration: 1
        }, '-=1.2')
        .from('.grid-section', {
            y: 40,
            opacity: 0,
            stagger: 0.2,
            duration: 1.2,
            ease: 'power3.out'
        }, '-=0.8');

    const sections = document.querySelectorAll('.grid-section');
    sections.forEach((section) => {
        const cards = section.querySelectorAll('.ethereal-card');
        if (!cards.length) {
            return;
        }

        gsap.from(cards, {
            scrollTrigger: {
                trigger: section,
                start: 'top 85%'
            },
            y: 30,
            opacity: 0,
            duration: 1.5,
            ease: 'power2.out'
        });
    });

    const links = document.querySelectorAll('.nav-links a, .nav-brand');
    links.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 2, background: 'rgba(0,122,255,0.05)', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, background: 'rgba(0,122,255,0.2)', duration: 0.3 });
        });
    });
})();
