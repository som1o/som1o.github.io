/* global gsap */
(() => {
    const EMAIL_ADDRESS = 'somiomuktadir@gmail.com';
    const COPY_RESET_DELAY = 1600;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const canAnimate = !prefersReducedMotion && typeof gsap !== 'undefined';

    const normalizePath = (pathname) => {
        if (pathname.endsWith('/')) {
            return `${pathname}index.html`;
        }
        return pathname;
    };

    const resolveLinkPrefix = () => {
        const segments = window.location.pathname.split('/').filter(Boolean);
        return segments.includes('posts') ? '../' : '';
    };

    const setActiveNavLink = (sidebar) => {
        const currentPath = normalizePath(window.location.pathname);
        const isPostPage = currentPath.includes('/posts/');

        sidebar.querySelectorAll('[data-path]').forEach((link) => {
            const targetPath = link.dataset.path;
            const isMatch = currentPath.endsWith(`/${targetPath}`) || currentPath.endsWith(targetPath);
            if (isMatch || (isPostPage && targetPath === 'blog.html')) {
                link.classList.add('active');
            }
        });
    };

    const copyEmail = async (button) => {
        const email = button.dataset.email;
        if (!email) {
            return;
        }

        const reset = () => {
            button.classList.remove('copied-success');
        };

        const finalize = () => {
            button.classList.add('copied-success');
            window.clearTimeout(button.dataset.resetId);
            const timeoutId = window.setTimeout(reset, COPY_RESET_DELAY);
            button.dataset.resetId = String(timeoutId);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(email);
                finalize();
                return;
            } catch (error) {
                console.warn('Clipboard write failed', error);
            }
        }

        const tempInput = document.createElement('input');
        tempInput.value = email;
        tempInput.setAttribute('readonly', '');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        finalize();
    };

    const initCopyEmail = (sidebar) => {
        const button = sidebar.querySelector('[data-copy-email]');
        if (!button) {
            return;
        }

        button.addEventListener('click', () => {
            copyEmail(button);
        });
    };

    const renderSidebar = () => {
        const navRoot = document.getElementById('nav-root');
        if (!navRoot) {
            return null;
        }

        const prefix = resolveLinkPrefix();

        navRoot.innerHTML = `
            <nav class="sidebar">
                <a class="skip-to-content" href="#main-content">Skip to content</a>
                <a href="${prefix}index.html" class="nav-brand">MUKTADIR SOMIO</a>
                <div class="nav-links">
                    <a href="${prefix}index.html" data-path="index.html">Home</a>
                    <a href="${prefix}blog.html" data-path="blog.html">Writings</a>
                    <a href="https://github.com/som1o" target="_blank" rel="noopener">Projects</a>
                    <a href="mailto:${EMAIL_ADDRESS}">Contact</a>
                </div>
                <div class="nav-footer">
                    <button class="copy-email" type="button" data-copy-email data-email="${EMAIL_ADDRESS}">
                        <span class="copy-label">Copy Email</span>
                        <span class="copy-success">Copied</span>
                    </button>
                    <span
                        style="writing-mode: vertical-rl; transform: rotate(180deg); opacity: 0.1; font-size: 0.6rem; letter-spacing: 0.3em;">2026</span>
                </div>
            </nav>
        `;

        const sidebar = navRoot.querySelector('.sidebar');
        if (!sidebar) {
            return null;
        }

        setActiveNavLink(sidebar);
        initCopyEmail(sidebar);
        return sidebar;
    };

    const initCursor = (sidebar) => {
        const cursor = document.getElementById('cursor');
        if (!cursor || !canAnimate || !isFinePointer) {
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

        const links = sidebar.querySelectorAll('.nav-links a, .nav-brand');
        links.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 2, background: 'rgba(0,122,255,0.05)', duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, background: 'rgba(0,122,255,0.2)', duration: 0.3 });
            });
        });
    };

    const initAnimations = () => {
        if (!canAnimate) {
            return;
        }

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
    };

    window.addEventListener('DOMContentLoaded', () => {
        const sidebar = renderSidebar();
        if (sidebar) {
            initCursor(sidebar);
        }
        initAnimations();
    });
})();
