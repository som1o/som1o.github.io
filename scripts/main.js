/* ============================================================
   GLASSMORPHISM PORTFOLIO — main.js
   Navigation · Theme Toggle · copyEmail() · GSAP Animations
   ============================================================ */

/* global gsap, ScrollTrigger */

const CONTACT_EMAIL = 'somiomuktadir@gmail.com';

// --- GLOBAL: copyEmail() ---
window.copyEmail = async function (event) {
    const btn = event ? event.target.closest('.copy-btn') || event.target : document.querySelector('.copy-btn');

    try {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Copied ✓';
            btn.classList.add('copied');
            btn.style.transform = 'scale(1.1)';
            setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('copied');
            }, 2500);
        }
    } catch (err) {
        console.error('Failed to copy email: ', err);
        if (btn) {
            btn.textContent = 'Error';
            setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        }
    }
};

// --- MAIN IIFE ---
(() => {
    'use strict';

    const CONFIG = {
        email: CONTACT_EMAIL,
        github: 'https://github.com/som1o',
    };

    let isMenuOpen = false;
    let isAnimating = false;

    // --- UTILS ---
    const resolveLinkPrefix = () => window.location.pathname.includes('/posts/') ? '../' : '';

    const getCurrentPage = () => {
        const path = window.location.pathname;
        if (path.endsWith('blog.html') || path.includes('/posts/')) return 'writings';
        if (path.endsWith('projects.html')) return 'projects';
        return 'home';
    };

    // --- SVG ICONS (bigger, more immersive) ---
    const ICONS = {
        sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>`,
        moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>`
    };

    // --- THEME MANAGEMENT ---
    const getTheme = () => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    };

    const toggleTheme = () => {
        const current = getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    };

    const updateThemeIcon = (theme) => {
        const btn = document.querySelector('.theme-toggle');
        if (btn) {
            btn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
            btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        }
    };

    // --- NAVIGATION: Separated Glassmorphic Buttons ---
    const createNavBar = () => {
        const prefix = resolveLinkPrefix();
        const currentPage = getCurrentPage();

        // Container for the nav pill buttons (centered)
        const nav = document.createElement('nav');
        nav.className = 'site-nav';
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Main navigation');

        const links = [
            { href: `${prefix}index.html`, text: 'Home', id: 'home' },
            { href: `${prefix}blog.html`, text: 'Writings', id: 'writings' },
            { href: `${prefix}projects.html`, text: 'Projects', id: 'projects' },
        ];

        // Desktop: each link is a separate glassmorphic pill
        let desktopLinksHTML = links.map(l =>
            `<a href="${l.href}" class="nav-link ${currentPage === l.id ? 'active' : ''}">${l.text}</a>`
        ).join('');

        nav.innerHTML = `
            <div class="nav-links-desktop">${desktopLinksHTML}</div>
            <button class="menu-toggle" aria-label="Open menu">
                <div class="menu-icon"><span></span><span></span></div>
            </button>
        `;

        return nav;
    };

    // Theme toggle — separate element, fixed to right corner
    const createThemeToggle = () => {
        const btn = document.createElement('button');
        btn.className = 'theme-toggle';
        btn.setAttribute('aria-label', 'Toggle theme');
        btn.innerHTML = ICONS.sun;
        return btn;
    };

    const createOverlay = () => {
        const prefix = resolveLinkPrefix();
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.innerHTML = `
            <div class="nav-content">
                <nav class="overlay-menu">
                    <a href="${prefix}index.html" class="menu-link">
                        <span class="link-idx">01</span>Home
                    </a>
                    <a href="${prefix}blog.html" class="menu-link">
                        <span class="link-idx">02</span>Writings
                    </a>
                    <a href="${prefix}projects.html" class="menu-link">
                        <span class="link-idx">03</span>Projects
                    </a>
                </nav>
                <div class="overlay-footer">
                    <div class="socials">
                        <a href="${CONFIG.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
                    </div>
                    <div class="email-container">
                        <span>${CONFIG.email}</span>
                        <button class="text-btn" onclick="copyEmail(event)">Copy</button>
                    </div>
                </div>
            </div>
        `;
        return overlay;
    };

    // --- MENU TOGGLE ---
    const toggleMenu = () => {
        if (isAnimating) return;
        isAnimating = true;
        isMenuOpen = !isMenuOpen;

        const toggle = document.querySelector('.menu-toggle');
        const overlay = document.querySelector('.nav-overlay');

        toggle.classList.toggle('active', isMenuOpen);
        toggle.setAttribute('aria-label', isMenuOpen ? 'Close menu' : 'Open menu');
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';

        if (typeof gsap === 'undefined') {
            overlay.style.visibility = isMenuOpen ? 'visible' : 'hidden';
            overlay.style.opacity = isMenuOpen ? '1' : '0';
            isAnimating = false;
            return;
        }

        const tl = gsap.timeline({ onComplete: () => { isAnimating = false; } });

        if (isMenuOpen) {
            overlay.style.visibility = 'visible';
            tl.to(overlay, { opacity: 1, duration: 0.5, ease: 'power3.inOut' })
                .fromTo('.menu-link', {
                    y: 80, opacity: 0, skewY: 4
                }, {
                    y: 0, opacity: 1, skewY: 0,
                    stagger: 0.1, duration: 0.8, ease: 'power4.out'
                }, '-=0.25')
                .fromTo('.overlay-footer', {
                    y: 20, opacity: 0
                }, {
                    y: 0, opacity: 1, duration: 0.7, ease: 'power3.out'
                }, '-=0.5');
        } else {
            tl.to(overlay, {
                opacity: 0, duration: 0.35, ease: 'power2.inOut',
                onComplete: () => { overlay.style.visibility = 'hidden'; }
            });
        }
    };

    // --- INIT NAVIGATION ---
    const initNavigation = () => {
        const oldNav = document.getElementById('nav-root');
        if (oldNav) oldNav.remove();

        const navBar = createNavBar();
        const themeToggle = createThemeToggle();
        const overlay = createOverlay();

        document.body.appendChild(navBar);
        document.body.appendChild(themeToggle);
        document.body.appendChild(overlay);

        // Events
        navBar.querySelector('.menu-toggle').addEventListener('click', toggleMenu);
        themeToggle.addEventListener('click', toggleTheme);

        // Overlay link interactions
        const links = overlay.querySelectorAll('.menu-link');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(link, { x: 15, duration: 0.3, ease: 'power2.out' });
                    links.forEach(other => {
                        if (other !== link) gsap.to(other, { opacity: 0.25, duration: 0.3 });
                    });
                }
            });
            link.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(link, { x: 0, duration: 0.3, ease: 'power2.out' });
                    links.forEach(other => {
                        if (other !== link) gsap.to(other, { opacity: 1, duration: 0.3 });
                    });
                }
            });
            link.addEventListener('click', () => {
                if (isMenuOpen) toggleMenu();
            });
        });
    };

    // --- CURSOR (Desktop only) ---
    const initCursor = () => {
        const isFine = window.matchMedia('(pointer: fine)').matches;
        const isLargeScreen = window.matchMedia('(min-width: 1200px)').matches;
        if (!isFine || !isLargeScreen) return;

        let cursor = document.getElementById('cursor');
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.id = 'cursor';
            cursor.className = 'cursor';
            document.body.appendChild(cursor);
        }
        cursor.style.display = 'block';

        let mx = 0, my = 0, cx = 0, cy = 0;
        window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

        const animate = () => {
            cx += (mx - cx) * 0.12;
            cy += (my - cy) * 0.12;
            cursor.style.transform = `translate(${cx}px, ${cy}px)`;
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        const addHover = () => cursor.classList.add('is-hover');
        const removeHover = () => cursor.classList.remove('is-hover');

        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .menu-toggle, .theme-toggle, .glass-card')) addHover();
            else removeHover();
        });
    };

    // --- GSAP ANIMATIONS ---
    const initAnimations = () => {
        if (typeof gsap === 'undefined') return;

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Loading line
        const loadingLine = document.getElementById('loading-line');
        if (loadingLine) {
            gsap.to(loadingLine, {
                width: '100%', duration: 1.0, ease: 'power4.inOut',
                onComplete: () => {
                    gsap.to(loadingLine, { opacity: 0, duration: 0.4, delay: 0.1 });
                }
            });
        }

        // Page reveal
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            const sections = mainContent.querySelectorAll('.section, .hero, .back-link-container, .site-footer');
            gsap.fromTo(sections,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out', delay: 0.2 }
            );
        }

        // Scroll-triggered card reveals
        if (typeof ScrollTrigger !== 'undefined') {
            const cards = document.querySelectorAll('.glass-card, .archive-item');
            cards.forEach((card) => {
                gsap.fromTo(card,
                    { opacity: 0, y: 35 },
                    {
                        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                            once: true
                        }
                    }
                );
            });
        }
    };

    // --- BOOTSTRAP ---
    document.addEventListener('DOMContentLoaded', () => {
        applyTheme(getTheme());
        initNavigation();
        initCursor();
        requestAnimationFrame(() => { initAnimations(); });
    });

})();
