/* ================================================================
   NÉBULA — LANDING PAGE SCRIPTS
   Organized as small, focused modules initialized on DOMContentLoaded.
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initScrollProgress();
  initCursorGlow();
  initStickyNavbar();
  initActiveNavigation();
  initMobileMenu();
  initSmoothAnchorScroll();
  initScrollReveal();
  initAnimatedCounters();
  initParticleBackground();
  initMouseParallax();
  initCardTilt();
  initRippleButtons();
  initTestimonialCarousel();
  initFaqAccordion();
  initBackToTop();
  initWatchDemoButton();
});

/* ================================
   PAGE LOADER
   ================================ */
function initPageLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
    }, 400);
  });
}

/* ================================
   SCROLL PROGRESS BAR
   ================================ */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  let ticking = false;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
}

/* ================================
   CURSOR GLOW (desktop only)
   ================================ */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  // Skip on touch devices for performance
  if (window.matchMedia('(hover: none)').matches) {
    glow.style.display = 'none';
    return;
  }

  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  }, { passive: true });
}

/* ================================
   STICKY / DYNAMIC NAVBAR
   ================================ */
function initStickyNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ================================
   ACTIVE NAVIGATION (Scroll Spy)
   ================================ */
function initActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('[data-nav]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach((section) => observer.observe(section));
}

/* ================================
   MOBILE MENU
   ================================ */
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }

  function openMenu() {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  document.querySelectorAll('[data-nav-mobile]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ================================
   SMOOTH ANCHOR SCROLLING
   ================================ */
function initSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ================================
   SCROLL REVEAL (Intersection Observer)
   ================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-scale'
  );
  if (!revealElements.length) return;

  // Apply stagger delay from data-delay attribute
  revealElements.forEach((el) => {
    const delay = el.getAttribute('data-delay');
    if (delay !== null) {
      el.style.setProperty('--reveal-delay', delay);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach((el) => observer.observe(el));

  // Hero content reveals immediately on load (entrance animation)
  const heroEls = document.querySelectorAll('.hero-content.reveal-up, .hero-visual.reveal-scale');
  requestAnimationFrame(() => {
    setTimeout(() => {
      heroEls.forEach((el) => el.classList.add('in-view'));
    }, 150);
  });
}

/* ================================
   ANIMATED COUNTERS
   ================================ */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('pt-BR');

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString('pt-BR');
      }
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

/* ================================
   PARTICLE BACKGROUND (Hero Canvas)
   ================================ */
function initParticleBackground() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const heroSection = canvas.closest('.hero');
  let particles = [];
  let animationId = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas() {
    const rect = heroSection.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function createParticles() {
    const count = window.innerWidth < 768 ? 28 : 55;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.6,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.5 + 0.15
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(148, 163, 184, ${p.opacity})`;
      ctx.fill();
    });

    // Connect nearby particles with faint lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.12 * (1 - distance / 110)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(drawParticles);
  }

  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationId);
    resizeCanvas();
    createParticles();
    drawParticles();
  }, { passive: true });

  // Pause animation when hero is off-screen to save resources
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!animationId) drawParticles();
      } else {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });
  });
  visibilityObserver.observe(heroSection);
}

/* ================================
   MOUSE PARALLAX (Hero Visual Card)
   ================================ */
function initMouseParallax() {
  const heroVisual = document.getElementById('heroVisual');
  const card = heroVisual?.querySelector('.visual-card');
  if (!heroVisual || !card) return;

  if (window.matchMedia('(hover: none)').matches) return;

  let rafId = null;

  heroVisual.addEventListener('mousemove', (e) => {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(0)`;
      rafId = null;
    });
  });

  heroVisual.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

/* ================================
   CARD TILT EFFECT (Feature Cards)
   ================================ */
function initCardTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  if (window.matchMedia('(hover: none)').matches) return;

  cards.forEach((card) => {
    let rafId = null;

    card.addEventListener('mousemove', (e) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
        rafId = null;
      });
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)';
    });
  });
}

/* ================================
   RIPPLE EFFECT ON BUTTONS
   ================================ */
function initRippleButtons() {
  const rippleButtons = document.querySelectorAll('.ripple');
  if (!rippleButtons.length) return;

  rippleButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const circle = document.createElement('span');
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;

      this.appendChild(circle);

      circle.addEventListener('animationend', () => circle.remove());
    });
  });
}

/* ================================
   TESTIMONIAL CAROUSEL
   ================================ */
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = track.children;
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoplayInterval = null;

  // Build dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    updateCarousel();
    resetAutoplay();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 6000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Pause autoplay on hover
  const carousel = track.closest('.testimonial-carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  carousel.addEventListener('mouseleave', startAutoplay);

  // Touch swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
  }, { passive: true });

  updateCarousel();
  startAutoplay();
}

/* ================================
   FAQ ACCORDION
   ================================ */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove('open');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ================================
   BACK TO TOP BUTTON
   ================================ */
function initBackToTop() {
  const button = document.getElementById('backToTop');
  if (!button) return;

  function toggleVisibility() {
    button.classList.toggle('visible', window.scrollY > 600);
  }

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================================
   WATCH DEMO BUTTON (placeholder action)
   ================================ */
function initWatchDemoButton() {
  const button = document.getElementById('watchDemoBtn');
  if (!button) return;

  button.addEventListener('click', () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const targetPosition = featuresSection.getBoundingClientRect().top + window.scrollY - navbarHeight + 1;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
}
