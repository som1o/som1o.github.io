/* global gsap */
(() => {
    'use strict';

    // --- CONFIG ---
    const CONFIG = {
        email: 'somiomuktadir@gmail.com',
        github: 'https://github.com/som1o',
        twitter: 'https://twitter.com/MukS0m',
        copyDelay: 2000
    };

    // --- STATE ---
    let isMenuOpen = false;
    let isAnimating = false;

    // --- DOM ELEMENTS (Dynamically created) ---
    let menuToggle, menuOverlay;

    // --- UTILS ---
    const resolveLinkPrefix = () => window.location.pathname.includes('/posts/') ? '../' : '';

    // --- COMPONENT: MENU TOGGLE ---
    const createMenuToggle = () => {
        const btn = document.createElement('button');
        btn.className = 'menu-toggle';
        btn.id = 'menu-toggle';
        btn.ariaLabel = 'Open Menu';
        btn.innerHTML = `
            <span class="menu-text">MENU</span>
            <div class="menu-icon">
                <span></span>
                <span></span>
            </div>
        `;
        return btn;
    };

    // --- COMPONENT: OVERLAY NAV ---
    const createOverlay = () => {
        const prefix = resolveLinkPrefix();
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.innerHTML = `
            <div class="nav-content">
                <nav class="overlay-menu">
                    <a href="${prefix}index.html" class="menu-link" data-text="HOME">
                        <span class="link-idx">01</span>HOME
                    </a>
                    <a href="${prefix}blog.html" class="menu-link" data-text="WRITINGS">
                        <span class="link-idx">02</span>WRITINGS
                    </a>
                    <a href="${prefix}projects.html" class="menu-link" data-text="PROJECTS">
                        <span class="link-idx">03</span>PROJECTS
                    </a>
                </nav>
                <div class="overlay-footer">
                    <div class="socials">
                        <a href="${CONFIG.twitter}" target="_blank">X (TWITTER)</a>
                        <a href="${CONFIG.github}" target="_blank">GITHUB</a>
                    </div>
                    <div class="email-container">
                        <span id="overlay-email">${CONFIG.email}</span>
                        <button id="overlay-copy" class="text-btn">COPY</button>
                    </div>
                </div>
            </div>
        `;
        return overlay;
    };

    // --- ANIMATIONS ---
    const toggleMenu = () => {
        if (isAnimating) return;
        isAnimating = true;

        isMenuOpen = !isMenuOpen;
        const toggleBtn = document.getElementById('menu-toggle');
        const overlay = document.querySelector('.nav-overlay');

        toggleBtn.classList.toggle('active', isMenuOpen);
        toggleBtn.querySelector('.menu-text').textContent = isMenuOpen ? 'CLOSE' : 'MENU';
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';

        const tl = gsap.timeline({
            onComplete: () => { isAnimating = false; }
        });

        if (isMenuOpen) {
            overlay.style.visibility = 'visible';
            tl.to(overlay, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.inOut'
            })
                .fromTo('.menu-link', {
                    y: 100,
                    opacity: 0,
                    skewY: 10
                }, {
                    y: 0,
                    opacity: 1,
                    skewY: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power4.out'
                }, '-=0.3')
                .fromTo('.overlay-footer', {
                    y: 20,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out'
                }, '-=0.6');
        } else {
            tl.to(overlay, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    overlay.style.visibility = 'hidden';
                    isAnimating = false;
                }
            });
        }
    };

    // --- INIT ---
    const initNavigation = () => {
        // Remove old nav if exists
        const oldNav = document.getElementById('nav-root');
        if (oldNav) oldNav.remove();

        // Inject new components
        menuToggle = createMenuToggle();
        menuOverlay = createOverlay();
        document.body.appendChild(menuToggle);
        document.body.appendChild(menuOverlay);

        // Event Listeners
        menuToggle.addEventListener('click', toggleMenu);

        // Copy Email Logic
        const copyBtn = document.getElementById('overlay-copy');
        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                await navigator.clipboard.writeText(CONFIG.email);
                copyBtn.textContent = 'COPIED';
                setTimeout(() => copyBtn.textContent = 'COPY', CONFIG.copyDelay);
            });
        }

        // Hover Effects for Links
        const links = document.querySelectorAll('.menu-link');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, { x: 20, scale: 1.05, duration: 0.3, ease: 'power2.out' });
                links.forEach(other => {
                    if (other !== link) gsap.to(other, { opacity: 0.3, duration: 0.3 });
                });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(link, { x: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
                links.forEach(other => {
                    if (other !== link) gsap.to(other, { opacity: 1, duration: 0.3 });
                });
            });
            link.addEventListener('click', () => toggleMenu());
        });
    };

    // --- CURSOR (Simplified for performance) ---
    const initCursor = () => {
        const isFine = window.matchMedia('(pointer: fine)').matches;
        if (!isFine) return;

        let cursor = document.getElementById('cursor');
        // Ensure cursor exists if stripped from HTML
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.id = 'cursor';
            cursor.className = 'cursor';
            document.body.appendChild(cursor);
        }

        let mx = 0, my = 0;
        let cx = 0, cy = 0;

        window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

        const animate = () => {
            cx += (mx - cx) * 0.15;
            cy += (my - cy) * 0.15;
            cursor.style.transform = `translate(${cx}px, ${cy}px)`;
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        // Add hover triggers
        const addHover = () => cursor.classList.add('is-hover');
        const removeHover = () => cursor.classList.remove('is-hover');

        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .menu-toggle')) addHover();
            else removeHover();
        });
    };

    // --- PAGE REVEAL ---
    const revealPage = () => {
        const tl = gsap.timeline();
        tl.from('main', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' });
    };

    // --- BOOTSTRAP ---
    document.addEventListener('DOMContentLoaded', () => {
        initNavigation();
        initCursor();
        revealPage();

        // Theme init
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    });

})();
