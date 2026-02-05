document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loadingLine = document.getElementById('loading-line');
    if (loadingLine && !prefersReducedMotion) {
        gsap.to(loadingLine, {
            width: "100%",
            opacity: 1,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.to(loadingLine, {
                    opacity: 0,
                    duration: 0.4,
                    delay: 0.2
                })
            }
        })
    }
    if (prefersReducedMotion) return;
    const cursor = document.getElementById('cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.2,
                ease: "power2.out"
            })
        })
    }
    const tl = gsap.timeline({
        defaults: {
            ease: "expo.out"
        }
    });
    if (document.querySelector('.sidebar')) {
        tl.from('.sidebar', {
            y: 50,
            opacity: 0,
            duration: 1.5,
            clearProps: "all"
        })
    }
    if (document.querySelector('.hero-title')) {
        tl.from('.hero-title', {
            y: 40,
            opacity: 0,
            duration: 2,
            ease: "power4.out"
        }, "-=1")
    }
    if (document.querySelector('.hero-meta')) {
        tl.from('.hero-meta', {
            y: 20,
            opacity: 0,
            duration: 1
        }, "-=1.2")
    }
    if (document.querySelectorAll('.grid-section').length > 0) {
        tl.from('.grid-section', {
            y: 40,
            opacity: 0,
            stagger: 0.2,
            duration: 1.2
        }, "-=0.8")
    }
    document.querySelectorAll('.ethereal-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%"
            },
            y: 30,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out"
        })
    });
    const interactables = document.querySelectorAll('.nav-links a, .nav-brand, .ethereal-card, .sidebar');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) gsap.to(cursor, {
                scale: 1.8,
                background: "rgba(0,122,255,0.05)",
                duration: 0.3
            })
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) gsap.to(cursor, {
                scale: 1,
                background: "rgba(0,122,255,0.2)",
                duration: 0.3
            })
        })
    });
    document.querySelectorAll('.nav-links a').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const {
                left,
                top,
                width,
                height
            } = item.getBoundingClientRect();
            const x = (e.clientX - left - width / 2) * 0.3;
            const y = (e.clientY - top - height / 2) * 0.3;
            gsap.to(item, {
                x,
                y,
                duration: 0.4,
                ease: "power3.out"
            })
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            })
        })
    })

    // Copy to Clipboard
    window.copyEmail = function () {
        const email = 'somiomuktadir@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            const copyBtn = document.getElementById('copy-email-btn');
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'COPIED!';
            copyBtn.style.color = '#34C759'; // Success green
            setTimeout(() => {
                copyBtn.innerText = originalText;
                copyBtn.style.color = '';
            }, 2000);
        });
    }
});