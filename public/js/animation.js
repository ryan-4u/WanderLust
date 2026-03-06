// ── Animation.js — GSAP Animations ──

gsap.registerPlugin(ScrollTrigger);

// ── Landing Page — Hero Carousel ──
const heroCarousel = document.getElementById('heroCarousel');
if (heroCarousel) {

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const total = slides.length;
  let current = 0;
  let animating = false;
  const wrapEl = document.querySelector('.hero-carousel-wrap');

  const ACTIVE_W = 440, ACTIVE_H = 280;
  const SMALL_W  = 260, SMALL_H  = 130;
  const GAP = 20;

  function getConfig() {
    const wrapH = 520; // fixed height matching .hero-carousel-wrap in CSS
    const centerY = wrapH / 2;
    return {
      active: { y: centerY - ACTIVE_H / 2,                  width: ACTIVE_W, height: ACTIVE_H, opacity: 1,    scale: 1,   filter: 'brightness(1)',    zIndex: 3 },
      prev:   { y: centerY - ACTIVE_H / 2 - GAP - SMALL_H,  width: SMALL_W,  height: SMALL_H,  opacity: 0.55, scale: 0.9, filter: 'brightness(0.72)', zIndex: 2 },
      next:   { y: centerY + ACTIVE_H / 2 + GAP,            width: SMALL_W,  height: SMALL_H,  opacity: 0.55, scale: 0.9, filter: 'brightness(0.72)', zIndex: 2 },
      hidden: { y: wrapH + 60,                               width: SMALL_W,  height: SMALL_H,  opacity: 0,    scale: 0.7, filter: 'brightness(0.72)', zIndex: 1 },
    };
  }

  function place(slide, pos, duration = 0) {
    const cfg = getConfig()[pos];
    gsap.to(slide, { ...cfg, duration, ease: "power3.inOut", overwrite: "auto" });
  }

  function initSlides() {
    const cfg = getConfig();
    slides.forEach((slide) => {
      gsap.set(slide, {
        position: 'absolute',
        top: 0,
        left: '50%',
        xPercent: -50,
        borderRadius: '16px',
        overflow: 'hidden',
        ...cfg.hidden,
      });
    });
    const prev = (current + 1) % total;
    const next = (current - 1 + total) % total;
    gsap.set(slides[current], { ...cfg.active });
    gsap.set(slides[prev],    { ...cfg.prev });
    gsap.set(slides[next],    { ...cfg.next });
  }

  function nextSlide() {
    if (animating) return;
    animating = true;
    current = (current + 1) % total;
    const newPrev = (current + 1) % total;
    const newNext = (current - 1 + total) % total;
    slides.forEach((slide, i) => {
      if (i === current)       place(slide, 'active', 1.1);
      else if (i === newPrev)  place(slide, 'prev',   1.1);
      else if (i === newNext)  place(slide, 'next',   1.1);
      else                     place(slide, 'hidden', 1.1);
    });
    setTimeout(() => { animating = false; }, 1150);
  }

  // Call directly — DOM is ready when external script runs
  initSlides();
  setTimeout(() => {
    nextSlide();
    setInterval(nextSlide, 2500);
  }, 100);

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from("#heroBadge",   { opacity: 0, y: 24, duration: 0.8 })
    .from("#heroTitle",   { opacity: 0, y: 32, duration: 0.9 }, "-=0.4")
    .from("#heroDesc",    { opacity: 0, y: 20, duration: 0.8 }, "-=0.5")
    .from("#heroActions", { opacity: 0, y: 20, duration: 0.8 }, "-=0.5")
    .from("#heroStats",   { opacity: 0, y: 20, duration: 0.8 }, "-=0.4")
    
}

// ── Navbar — slide down on load ──
const navbar = document.querySelector('.navbar');
if (navbar) {
  gsap.from(navbar, {
    y: -60,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
  });
}

// ── Auth Pages — card entrance ──
const authCard = document.querySelector('.auth-card');
if (authCard) {
  gsap.from(authCard, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.3,
  });
}

// ── Index — filter bar slides in ──
const filterBar = document.getElementById('filter-bar');
if (filterBar) {
  gsap.from(filterBar, {
    y: -20,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out",
    delay: 0.3,
  });
}

// ── Index — cards from bottom on scroll ──
const listingCards = document.querySelectorAll('.listing-card');
if (listingCards.length) {
  listingCards.forEach((card) => {
    gsap.from(card, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 92%",
        toggleActions: "play none none none",
      },
    });
  });
}

// ── Show — hero image reveal ──
const showHeroImg = document.querySelector('.show-hero-img');
if (showHeroImg) {
  gsap.from(showHeroImg, {
    scale: 1.06,
    opacity: 0,
    duration: 1.1,
    ease: "power3.out",
  });
}

// ── Show — content fade in sections ──
const showSections = document.querySelectorAll('.show-owner-row, .show-desc, .show-chips, .show-map-section, .show-review-form-wrap, .show-review-grid, .show-booking-card');
if (showSections.length) {
  showSections.forEach((section) => {
    gsap.from(section, {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 92%",
        toggleActions: "play none none none",
      },
    });
  });
}

// ── Forms — fields stagger in ──
const formPage = document.querySelector('.form-page');
if (formPage) {
  const formEls = Array.from(formPage.querySelectorAll(
    '.form-page-header, .form-group, .form-row-3, .form-row-file-loc, .form-row-img-desc'
  ));

  // animate rows and header
  gsap.from(formEls, {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: "power3.out",
    stagger: 0.1,
    delay: 0.2,
  });

  // animate button separately — guaranteed visible
  const submitBtn = formPage.closest('div')
    ? document.querySelector('.form-page ~ form .form-submit-btn, .form-page .form-submit-btn, form .form-submit-btn')
    : null;

  const btn = document.querySelector('.form-submit-btn');
  if (btn) {
    gsap.fromTo(btn,
      { y: 20, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.2 + formEls.length * 0.1 }
    );
  }
}

// ── Flash Toasts — auto dismiss ──
document.querySelectorAll('.flash-toast').forEach((toast) => {
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
});