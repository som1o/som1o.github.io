/* global gsap */
(() => {
    const EMAIL_ADDRESS = 'somiomuktadir@gmail.com';
    const X_URL = 'https://x.com/som1o'; // Assuming X URL
    const GITHUB_URL = 'https://github.com/som1o';
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

    const initTheme = () => {
        const theme = localStorage.getItem('theme');
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const isDark = currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        const newTheme = isDark ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon();
    };

    const updateThemeIcon = () => {
        const themeBtn = document.querySelector('.theme-toggle');
        if (!themeBtn) return;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
            (!document.documentElement.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

        themeBtn.innerHTML = isDark
            ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
            : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    };

    const copyEmail = async (element) => {
        // Support both button with data-email and direct usage
        const email = element?.dataset?.email || EMAIL_ADDRESS;

        const originalContent = element.innerHTML;
        const reset = () => {
            element.classList.remove('copied-success');
            element.innerHTML = originalContent;
        };

        const finalize = () => {
            element.classList.add('copied-success');
            if (element.tagName === 'BUTTON' && (element.id === 'copy-email-btn' || element.classList.contains('copy-email'))) {
                element.innerHTML = 'COPIED';
            }
            window.clearTimeout(element.dataset.resetId);
            const timeoutId = window.setTimeout(reset, COPY_RESET_DELAY);
            element.dataset.resetId = String(timeoutId);
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
            <button class="mobile-menu-btn" aria-label="Toggle Menu">
                <span></span><span></span><span></span>
            </button>
            <nav class="sidebar">
                <a href="${prefix}index.html" class="nav-brand">MUKTADIR SOMIO</a>
                <div class="nav-links">
                    <a href="${prefix}index.html" data-path="index.html">Home</a>
                    <a href="${prefix}blog.html" data-path="blog.html">Writings</a>
                    <a href="${prefix}projects.html" data-path="projects.html">Projects</a>
                </div>
                <div class="nav-footer">
                    <div class="footer-socials">
                        <a href="${X_URL}" target="_blank" class="social-link" aria-label="X (Twitter)">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                        <a href="${GITHUB_URL}" target="_blank" class="social-link" aria-label="GitHub">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        </a>
                    </div>
                    <button class="theme-toggle" aria-label="Toggle theme"></button>
                </div>
            </nav>
        `;

        const sidebar = navRoot.querySelector('.sidebar');
        if (!sidebar) {
            return null;
        }

        setActiveNavLink(sidebar);
        initCopyEmail(sidebar);
        initMobileMenu(navRoot);
        initThemeToggle(sidebar);
        return sidebar;
    };

    const initThemeToggle = (sidebar) => {
        const themeBtn = sidebar.querySelector('.theme-toggle');
        if (themeBtn) {
            updateThemeIcon();
            themeBtn.addEventListener('click', toggleTheme);
        }
    };

    const initMobileMenu = (navRoot) => {
        const menuBtn = navRoot.querySelector('.mobile-menu-btn');
        const sidebar = navRoot.querySelector('.sidebar');
        if (!menuBtn || !sidebar) return;

        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            sidebar.classList.toggle('mobile-active');
            document.body.style.overflow = sidebar.classList.contains('mobile-active') ? 'hidden' : '';
        });

        // Close menu when clicking links
        sidebar.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                sidebar.classList.remove('mobile-active');
                document.body.style.overflow = '';
            });
        });
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
        initTheme();
        const sidebar = renderSidebar();
        if (sidebar) {
            initCursor(sidebar);
        }
        initAnimations();
    });

    // Expose copyEmail to global scope for static HTML onclick handlers
    window.copyEmail = () => {
        const btn = document.getElementById('copy-email-btn');
        if (btn) copyEmail(btn);
    };
})();
