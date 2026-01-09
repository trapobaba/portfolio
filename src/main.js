/* ============================================
   КСЕНИЯ TRAPOBABA — Portfolio Animations
   GSAP + ScrollTrigger + ScrollSmoother
   ============================================ */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText, TextPlugin, CustomEase);

// Create custom easing curves
CustomEase.create("smoothOut", "M0,0 C0.25,0.1 0.25,1 1,1");
CustomEase.create("smoothInOut", "M0,0 C0.65,0 0.35,1 1,1");
CustomEase.create("elastic", "M0,0 C0.5,0 0.5,1.5 1,1");
CustomEase.create("bounce", "M0,0 C0.2,0 0.4,1.28 0.6,1.02 C0.8,0.76 1,1 1,1");

// Base URL for assets (works with Vite base config)
const BASE_URL = import.meta.env.BASE_URL || '/';

// Portfolio images data
const portfolioData = {
  1: {
    title: 'Антисвора',
    category: 'Дизайн презентаций',
    images: [
      'imgs/case-1/img-1.png',
      'imgs/case-1/img-2.png',
      'imgs/case-1/img-3.png',
      'imgs/case-1/img-4.png',
      'imgs/case-1/img-5.png',
      'imgs/case-1/img-6.png',
      'imgs/case-1/img-7.png',
    ]
  },
  2: {
    title: 'Жилой комплекс',
    category: 'Дизайн презентаций',
    images: [
      'imgs/case-2/img-1.png',
      'imgs/case-2/img-2.png',
      'imgs/case-2/img-3.png',
      'imgs/case-2/img-4.png',
      'imgs/case-2/img-5.png',
      'imgs/case-2/img-6.png',
      'imgs/case-2/img-7.png',
      'imgs/case-2/img-8.png',
      'imgs/case-2/img-9.png',
    ]
  },
  3: {
    title: 'Waffles Almaty',
    category: 'Дизайн презентаций',
    images: [
      'imgs/case-3/img-1.png',
      'imgs/case-3/img-2.png',
      'imgs/case-3/img-3.png',
      'imgs/case-3/img-4.png',
      'imgs/case-3/img-5.png',
      'imgs/case-3/img-6.png',
      'imgs/case-3/img-7.png',
      'imgs/case-3/img-8.png',
      'imgs/case-3/img-9.png',
    ]
  }
};

// Global variables
let smoother;
let cursor;
let cursorFollower;

// -------------------- Initialize App --------------------
document.addEventListener('DOMContentLoaded', () => {
  // Initialize smooth scroll first to prevent layout jump
  initSmoothScroll();
  // Lock scroll during preloader
  document.body.style.overflow = 'hidden';
  // Start preloader
  initPreloader();
});

// -------------------- Preloader --------------------
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.querySelector('.preloader__progress-bar');
  const counter = document.querySelector('.preloader__number');
  const letters = document.querySelectorAll('.preloader__letter');
  const shapes = document.querySelectorAll('.preloader__shape');
  
  if (!preloader) {
    document.body.style.overflow = '';
    initApp();
    return;
  }

  // Create preloader timeline
  const tl = gsap.timeline();
  
  // Animate shapes entrance
  tl.fromTo(shapes, 
    { scale: 0, opacity: 0 },
    { 
      scale: 1, 
      opacity: 0.4, 
      duration: 1.2, 
      stagger: 0.15,
      ease: "power2.out"
    }
  );
  
  // Animate letters entrance with 3D effect
  tl.to(letters, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    duration: 0.6,
    stagger: 0.05,
    ease: "back.out(1.5)"
  }, "-=0.8");
  
  // Counter animation
  let progress = { value: 0 };
  
  tl.to(progress, {
    value: 100,
    duration: 2,
    ease: "power2.inOut",
    onUpdate: () => {
      const val = Math.round(progress.value);
      counter.textContent = val;
      progressBar.style.width = val + '%';
    }
  }, "-=0.3");
  
  // After loading complete - exit animation
  tl.add(() => {
    completePreloader();
  });
  
  function completePreloader() {
    const exitTl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = 'none';
        document.body.style.overflow = '';
        // Small delay before starting app animations
        setTimeout(() => {
          initApp();
        }, 100);
      }
    });
    
    // Letters fly up and out
    exitTl.to(letters, {
      y: -60,
      opacity: 0,
      rotateX: 90,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.in"
    });
    
    // Counter fades
    exitTl.to([counter.parentElement, progressBar.parentElement], {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "power2.in"
    }, "-=0.2");
    
    // Shapes expand and fade
    exitTl.to(shapes, {
      scale: 2,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.in"
    }, "-=0.3");
    
    // Background slides up (curtain reveal)
    exitTl.to('.preloader__bg', {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.inOut"
    }, "-=0.4");
  }
}

// Initialize all app features (after preloader)
function initApp() {
  initAnimatedNoise();
  createCustomCursor();
  initHeader();
  initMobileMenu();
  initHeroAnimations();
  initScrollAnimations();
  initCounters();
  initLightbox();
  initContactForm();
  initNavLinks();
  initMagneticElements();
  initTextRevealEffects();
  
  // Show noise
  const noise = document.querySelector('.page-noise');
  if (noise) {
    setTimeout(() => {
      noise.classList.add('page-noise--visible');
    }, 500);
  }
}

// -------------------- Animated Noise --------------------
function initAnimatedNoise() {
  const noise = document.querySelector('.page-noise');
  if (!noise || window.innerWidth < 480) return;
  
  // Animate noise position
  setInterval(() => {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    noise.style.backgroundPosition = `${x}% ${y}%`;
  }, 80);
  
  // Set app height for mobile
  function setAppHeight() {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
  }
  setAppHeight();
  window.addEventListener('resize', setAppHeight);
}

// -------------------- Custom Cursor --------------------
function createCustomCursor() {
  // Create cursor elements
  cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  
  cursorFollower = document.createElement('div');
  cursorFollower.className = 'custom-cursor-follower';
  
  document.body.appendChild(cursor);
  document.body.appendChild(cursorFollower);
  
  // Mouse move handler
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Smooth cursor animation
  gsap.ticker.add(() => {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    gsap.set(cursor, { x: cursorX, y: cursorY });
    gsap.set(cursorFollower, { x: followerX, y: followerY });
  });
  
  // Hover effects on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .work-card, .service-card, .social-link, input, textarea');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      cursorFollower.classList.add('cursor-hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      cursorFollower.classList.remove('cursor-hover');
    });
  });
  
  // Hide cursor on mobile
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
  }
}

// -------------------- Smooth Scroll --------------------
function initSmoothScroll() {
  smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.2,
    effects: true,
    smoothTouch: 0.1,
  });
}

// -------------------- Header Scroll Effect --------------------
function initHeader() {
  const header = document.querySelector('.header');
  
  // Scroll effect only - animation handled separately
  ScrollTrigger.create({
    trigger: 'body',
    start: 'top -100px',
    onEnter: () => header.classList.add('scrolled'),
    onLeaveBack: () => header.classList.remove('scrolled'),
  });
}

function animateHeader() {
  const header = document.querySelector('.header');
  const logo = header.querySelector('.logo');
  const navLinks = header.querySelectorAll('.nav-link');
  const ctaBtn = header.querySelector('.nav-cta');
  
  const headerTl = gsap.timeline();
  
  headerTl
    .fromTo(header, 
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
    .fromTo(logo, 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 
      '-=0.4'
    )
    .fromTo(navLinks, 
      { opacity: 0, y: -15 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, 
      '-=0.3'
    )
    .fromTo(ctaBtn, 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }, 
      '-=0.2'
    );
  
  return headerTl;
}

// -------------------- Mobile Menu --------------------
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  
  if (!menuToggle || !mobileMenu) return;
  
  menuToggle.addEventListener('click', () => {
    const isActive = menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
    
    // Animate menu items
    if (isActive) {
      gsap.fromTo(mobileLinks, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'smoothOut', delay: 0.2 }
      );
    }
  });
  
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// -------------------- Hero Animations --------------------
function initHeroAnimations() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const greeting = hero.querySelector('.hero__greeting');
  const name = hero.querySelector('.hero__name');
  const surname = hero.querySelector('.hero__surname');
  const role = hero.querySelector('.hero__role');
  const tagline = hero.querySelector('.hero__tagline');
  const cta = hero.querySelector('.hero__cta');
  const scrollHint = hero.querySelector('.hero__scroll-hint');
  
  // Create split text instances
  const splitGreeting = new SplitText(greeting, { type: 'chars, words' });
  const splitName = new SplitText(name, { type: 'chars' });
  const splitSurname = new SplitText(surname, { type: 'chars' });
  const splitRole = new SplitText(role, { type: 'words' });
  
  // Set containers visible (children will be animated)
  gsap.set([greeting, name, surname, role, tagline, cta, scrollHint], { opacity: 1 });
  
  // Show content
  document.getElementById('smooth-content').style.visibility = 'visible';
  
  // Master timeline with fromTo animations
  const heroTl = gsap.timeline({
    defaults: { ease: 'smoothOut' }
  });
  
  // Animate header (uses fromTo internally)
  animateHeader();
  
  // Hero animations - all using fromTo
  heroTl
    .fromTo(splitGreeting.chars, 
      { opacity: 0, y: 30, rotationX: -90 },
      { opacity: 1, y: 0, rotationX: 0, duration: 0.6, stagger: 0.03 }
    )
    .fromTo(splitName.chars, 
      { opacity: 0, y: 80, rotationX: -90, scale: 0.8 },
      { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 0.8, stagger: 0.04, ease: 'elastic' },
      '-=0.3'
    )
    .fromTo(splitSurname.chars, 
      { opacity: 0, y: 80, rotationX: -90, scale: 0.8 },
      { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 0.8, stagger: 0.04, ease: 'elastic' },
      '-=0.6'
    )
    .fromTo(splitRole.words, 
      { opacity: 0, y: 40, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.12 },
      '-=0.4'
    )
    .fromTo(tagline, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.3'
    )
    .fromTo(cta.children, 
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.15, ease: 'bounce' },
      '-=0.4'
    )
    .fromTo(scrollHint, 
      { opacity: 0, y: 20 },
      { opacity: 1,
      y: 0,
      duration: 1,
    }, '-=0.3');
  
  // Parallax on shapes
  const shapes = hero.querySelectorAll('.hero__shape');
  shapes.forEach((shape, index) => {
    gsap.to(shape, {
      y: () => -150 * (index + 1),
      rotation: () => 10 * (index + 1),
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
  });
}

// -------------------- Text Reveal Effects --------------------
function initTextRevealEffects() {
  // Animated underlines on hover
  const links = document.querySelectorAll('.nav-link:not(.nav-link--cta)');
  
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        '--underline-width': '100%',
        duration: 0.3,
        ease: 'smoothOut'
      });
    });
    
    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        '--underline-width': '0%',
        duration: 0.3,
        ease: 'smoothOut'
      });
    });
  });
}

// -------------------- Scroll Animations --------------------
function initScrollAnimations() {
  // About section
  const aboutSection = document.querySelector('.about');
  if (aboutSection) {
    const aboutHeader = aboutSection.querySelector('.section-header');
    const aboutLead = aboutSection.querySelector('.about__lead');
    const aboutParagraphs = aboutSection.querySelectorAll('.about__paragraph');
    const stats = aboutSection.querySelectorAll('.stat');
    
    if (aboutHeader) {
      gsap.fromTo(aboutHeader.children, 
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'smoothOut',
          scrollTrigger: {
            trigger: aboutHeader,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
    
    if (aboutLead) {
      const splitLead = new SplitText(aboutLead, { type: 'lines', linesClass: 'split-line' });
      
      gsap.fromTo(splitLead.lines, 
        { y: 50, opacity: 0, filter: 'blur(5px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.12,
          ease: 'smoothOut',
          scrollTrigger: {
            trigger: aboutLead,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
    
    if (aboutParagraphs.length) {
      gsap.fromTo(aboutParagraphs, 
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'smoothOut',
          scrollTrigger: {
            trigger: aboutParagraphs[0],
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
    
    if (stats.length) {
      gsap.fromTo(stats, 
        { y: 80, opacity: 0, scale: 0.85, rotationY: -15 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: 'smoothOut',
          scrollTrigger: {
            trigger: stats[0],
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
  }
  
  // Portfolio section
  const portfolioSection = document.querySelector('.portfolio');
  if (portfolioSection) {
    const portfolioHeader = portfolioSection.querySelector('.portfolio__header');
    const workCards = portfolioSection.querySelectorAll('.work-card');
    
    if (portfolioHeader) {
      gsap.fromTo(portfolioHeader.querySelectorAll('.portfolio__label, .portfolio__title'), 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'smoothOut',
          scrollTrigger: {
            trigger: portfolioHeader,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
    
    if (workCards.length) {
      workCards.forEach((card, index) => {
        gsap.fromTo(card, 
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'smoothOut',
            scrollTrigger: {
              trigger: portfolioSection,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });
    }
  }
  
  // Services section
  const servicesSection = document.querySelector('.services');
  if (servicesSection) {
    const servicesHeader = servicesSection.querySelector('.section-header');
    const serviceCards = servicesSection.querySelectorAll('.service-card');
    
    if (servicesHeader) {
      gsap.fromTo(servicesHeader.children, 
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'smoothOut',
          scrollTrigger: {
            trigger: servicesHeader,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
    
    if (serviceCards.length) {
      serviceCards.forEach((card, index) => {
        gsap.fromTo(card, 
          { y: 80, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            delay: index * 0.12,
            ease: 'smoothOut',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });
    }
  }
  
  // Contact section
  const contactSection = document.querySelector('.contact');
  if (contactSection) {
    const contactHeader = contactSection.querySelector('.section-header');
    const contactInfo = contactSection.querySelector('.contact__info');
    const contactForm = contactSection.querySelector('.contact-form');
    
    if (contactHeader) {
      gsap.fromTo(contactHeader.children, 
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'smoothOut',
          scrollTrigger: {
            trigger: contactHeader,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
    
    if (contactInfo) {
      gsap.fromTo(contactInfo, 
        { x: -80, opacity: 0, rotationY: 10 },
        {
          x: 0,
          opacity: 1,
          rotationY: 0,
          duration: 1,
          ease: 'smoothOut',
          scrollTrigger: {
            trigger: contactInfo,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
    
    if (contactForm) {
      gsap.fromTo(contactForm, 
        { x: 80, opacity: 0, rotationY: -10 },
        {
          x: 0,
          opacity: 1,
          rotationY: 0,
          duration: 1,
          ease: 'smoothOut',
          scrollTrigger: {
            trigger: contactForm,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
  }
  
  // Footer
  const footer = document.querySelector('.footer');
  if (footer) {
    const footerContent = footer.querySelector('.footer__content');
    if (footerContent) {
      gsap.fromTo(footerContent, 
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'smoothOut',
          scrollTrigger: {
            trigger: footer,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
  }
}

// -------------------- Counter Animation --------------------
function initCounters() {
  const counters = document.querySelectorAll('.stat__number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'), 10);
    
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      onEnter: () => {
        gsap.fromTo(counter, 
          { textContent: 0 },
          {
            textContent: target,
            duration: 2.5,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function() {
              counter.textContent = Math.round(this.targets()[0].textContent);
            }
          }
        );
      },
      once: true
    });
  });
}

// -------------------- Lightbox --------------------
function initLightbox() {
  const cards = document.querySelectorAll('.work-card');
  const lightbox = document.getElementById('lightbox');
  
  if (!lightbox) return;
  
  const lightboxImage = lightbox.querySelector('.lightbox__image');
  const lightboxClose = lightbox.querySelector('.lightbox__close');
  const lightboxPrev = lightbox.querySelector('.lightbox__nav--prev');
  const lightboxNext = lightbox.querySelector('.lightbox__nav--next');
  const lightboxCurrent = lightbox.querySelector('.lightbox__current');
  const lightboxTotal = lightbox.querySelector('.lightbox__total');
  
  let currentImages = [];
  let currentIndex = 0;
  
  // Click on cards to open lightbox
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const caseId = card.getAttribute('data-case');
      openLightbox(caseId);
    });
  });
  
  // Open lightbox
  function openLightbox(caseId) {
    const caseData = portfolioData[caseId];
    if (!caseData) return;
    
    currentImages = caseData.images;
    currentIndex = 0;
    
    updateLightboxImage();
    lightboxTotal.textContent = currentImages.length;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(lightboxImage, 
      { scale: 0.9, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.4, delay: 0.1 }
    );
  }
  
  // Close lightbox
  function closeLightbox() {
    gsap.to(lightbox, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Update image
  function updateLightboxImage() {
    gsap.to(lightboxImage, {
      opacity: 0,
      scale: 0.95,
      duration: 0.15,
      onComplete: () => {
        lightboxImage.src = BASE_URL + currentImages[currentIndex];
        lightboxCurrent.textContent = currentIndex + 1;
        
        gsap.to(lightboxImage, {
          opacity: 1,
          scale: 1,
          duration: 0.2
        });
      }
    });
  }
  
  // Navigation
  function showPrev() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : currentImages.length - 1;
    updateLightboxImage();
  }
  
  function showNext() {
    currentIndex = currentIndex < currentImages.length - 1 ? currentIndex + 1 : 0;
    updateLightboxImage();
  }
  
  // Event listeners
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);
  
  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox__content')) {
      closeLightbox();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
  
  // Drag scroll for portfolio slider
  const track = document.querySelector('.portfolio__track');
  if (track) {
    let isDown = false;
    let startX;
    let scrollLeft;
    
    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    
    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.style.cursor = 'grab';
    });
    
    track.addEventListener('mouseup', () => {
      isDown = false;
      track.style.cursor = 'grab';
    });
    
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 2;
      track.scrollLeft = scrollLeft - walk;
    });
  }
}

// -------------------- Navigation Smooth Scroll --------------------
function initNavLinks() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target && smoother) {
        smoother.scrollTo(target, true, 'top 80px');
      }
    });
  });
}

// -------------------- Magnetic Elements --------------------
function initMagneticElements() {
  const magneticElements = document.querySelectorAll('.btn--primary, .social-link, .nav-link--cta');
  
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
    
    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      });
    });
  });
  
  // Service cards tilt effect
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      gsap.to(card, {
        rotationY: x * 10,
        rotationX: -y * 10,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.6,
        ease: 'smoothOut',
      });
    });
  });
}

// -------------------- Contact Form --------------------
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  const inputs = form.querySelectorAll('.form-input');
  
  // Input animations
  inputs.forEach(input => {
    const label = input.previousElementSibling;
    
    input.addEventListener('focus', () => {
      gsap.to(input, {
        scale: 1.02,
        duration: 0.3,
        ease: 'smoothOut',
      });
      
      if (label) {
        gsap.to(label, {
          color: '#3b82f6',
          y: -2,
          duration: 0.3,
        });
      }
    });
    
    input.addEventListener('blur', () => {
      gsap.to(input, {
        scale: 1,
        duration: 0.3,
        ease: 'smoothOut',
      });
      
      if (label && !input.value) {
        gsap.to(label, {
          color: '#475569',
          y: 0,
          duration: 0.3,
        });
      }
    });
  });
  
  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = form.querySelector('.btn');
    const btnText = btn.querySelector('.btn__text');
    const btnIcon = btn.querySelector('.btn__icon');
    const originalText = btnText.textContent;
    
    // Button animation
    gsap.timeline()
      .to(btn, { scale: 0.95, duration: 0.1 })
      .to(btn, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' })
      .to(btnIcon, { rotation: 360, duration: 0.5 }, '-=0.3');
    
    // Change button text
    btnText.textContent = 'Отправлено! ✓';
    btn.style.pointerEvents = 'none';
    
    // Success animation on form
    gsap.to(form, {
      boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
      duration: 0.3,
      yoyo: true,
      repeat: 1,
    });
    
    // Reset
    setTimeout(() => {
      form.reset();
      btnText.textContent = originalText;
      btn.style.pointerEvents = '';
      gsap.set(btnIcon, { rotation: 0 });
    }, 3000);
  });
}

// -------------------- Page Load --------------------
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  ScrollTrigger.refresh();
});

// -------------------- Resize Handler --------------------
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});

// -------------------- Console Greeting --------------------
console.log(
  '%c✨ Портфолио Ксении Trapobaba ✨',
  'background: linear-gradient(135deg, #667eea 0%, #3b82f6 100%); color: white; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: bold;'
);
console.log(
  '%cСоздано с любовью и GSAP анимациями',
  'color: #64748b; font-size: 12px;'
);
