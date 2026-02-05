document.addEventListener('DOMContentLoaded', () => {
    // 1. ETHEREAL CURSOR
    const cursor = document.getElementById('cursor');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.2, // Slightly slower for softness
            ease: "power2.out"
        });
    });

    // 2. ENTRANCE ANIMATIONS (Ethereal Style)
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.from('.sidebar', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        clearProps: "all"
    })
        .from('.hero-title', {
            y: 40,
            opacity: 0,
            duration: 2,
            ease: "power4.out"
        }, "-=1")
        .from('.hero-meta', {
            y: 20,
            opacity: 0,
            duration: 1,
        }, "-=1.2")
        .from('.grid-section', {
            y: 40,
            opacity: 0,
            stagger: 0.2,
            duration: 1.2,
            ease: "power3.out"
        }, "-=0.8");

    // 3. SCROLL REVEAL (Soft Floating)
    const sections = document.querySelectorAll('.grid-section');
    sections.forEach(section => {
        gsap.from(section.querySelectorAll('.ethereal-card'), {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
            },
            y: 30,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out"
        });
    });

    // 4. FLOATING MAGNETIC SIDEBAR
    const sidebar = document.querySelector('.sidebar');
    const links = document.querySelectorAll('.nav-links a, .nav-brand');

    links.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 2, background: "rgba(0,122,255,0.05)", duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, background: "rgba(0,122,255,0.2)", duration: 0.3 });
        });
    });
});
