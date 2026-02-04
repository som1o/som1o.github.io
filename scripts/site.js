/* global gsap */
(() => {
  const body = document.body;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  const initCursor = () => {
    if (!cursor || !follower) {
      return;
    }
    if (prefersReducedMotion || isCoarsePointer) {
      body.classList.add('cursor-hidden');
      return;
    }

    document.addEventListener('mousemove', (event) => {
      if (typeof gsap === 'undefined') {
        return;
      }
      gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.1 });
      gsap.to(follower, { x: event.clientX, y: event.clientY, duration: 0.4 });
    });

    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (typeof gsap === 'undefined') {
          return;
        }
        gsap.to(follower, { scale: 1.5, opacity: 0.1, duration: 0.3 });
      });
      el.addEventListener('mouseleave', () => {
        if (typeof gsap === 'undefined') {
          return;
        }
        gsap.to(follower, { scale: 1, opacity: 0.2, duration: 0.3 });
      });
    });
  };

  const initMagneticButtons = () => {
    if (prefersReducedMotion || typeof gsap === 'undefined') {
      return;
    }

    document.querySelectorAll('.nav-item').forEach((item) => {
      item.addEventListener('mousemove', (event) => {
        const { left, top, width, height } = item.getBoundingClientRect();
        const x = (event.clientX - left - width / 2) * 0.5;
        const y = (event.clientY - top - height / 2) * 0.5;

        gsap.to(item, {
          x,
          y,
          duration: 0.4,
          ease: 'power3.out'
        });
      });

      item.addEventListener('mouseenter', () => {
        gsap.to(item, { scale: 1.08, duration: 0.3, ease: 'power2.out' });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });
  };

  const revealHero = () => {
    if (prefersReducedMotion || typeof gsap === 'undefined') {
      document.querySelectorAll('.hero-line, .watermark').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      const navbar = document.getElementById('navbar');
      if (navbar) {
        navbar.style.opacity = '1';
        navbar.style.transform = 'none';
      }
      return;
    }

    const tl = gsap.timeline();
    tl.to('#navbar', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0);
    tl.to('.hero-line', { y: 0, opacity: 1, duration: 1.4, stagger: 0.2, ease: 'power4.out' }, 0.2);
    tl.to('.watermark', { opacity: 0.18, scale: 1, duration: 2, ease: 'power2.out' }, 0.5);
  };

  const revealContent = () => {
    if (prefersReducedMotion || typeof gsap === 'undefined') {
      document.querySelectorAll('.animate-up').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      const navbar = document.getElementById('navbar');
      if (navbar) {
        navbar.style.opacity = '1';
        navbar.style.transform = 'none';
      }
      return;
    }

    gsap.to('#navbar', { opacity: 1, duration: 0.8 });
    gsap.to('.animate-up', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });
  };

  const handlePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) {
      return;
    }

    const pageType = body.dataset.page;
    const finish = () => {
      if (prefersReducedMotion || typeof gsap === 'undefined') {
        preloader.style.display = 'none';
        if (pageType === 'home') {
          revealHero();
        } else {
          revealContent();
        }
        return;
      }

      gsap.to(preloader, {
        yPercent: -100,
        ease: 'power4.inOut',
        duration: 1,
        onComplete: () => {
          preloader.style.display = 'none';
          if (pageType === 'home') {
            revealHero();
          } else {
            revealContent();
          }
        }
      });
    };

    window.addEventListener('load', () => {
      setTimeout(finish, 800);
    });
  };

  const initMobileMenu = () => {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener('click', () => {
      const isOpen = body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
  };

  const initPage = () => {
    initCursor();
    initMagneticButtons();
    initMobileMenu();

    if (body.dataset.page === 'home') {
      handlePreloader();
    } else if (document.getElementById('preloader')) {
      handlePreloader();
    } else {
      revealContent();
    }
  };

  initPage();
})();
