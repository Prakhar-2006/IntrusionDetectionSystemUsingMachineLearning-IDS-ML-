console.log("NexHire Website Loaded");

/**
 * Mobile-fast navigation (overlay) + disable smooth scroll on phones
 * ---------------------------------------------------------------
 * This improves perceived speed for multi-page navigation.
 */

const isMobile = window.matchMedia('(max-width: 768px)').matches;

// Create overlay element if it doesn't exist yet
const overlayId = 'page-transition-overlay';
let overlayEl = document.getElementById(overlayId);
if (!overlayEl) {
  overlayEl = document.createElement('div');
  overlayEl.id = overlayId;
  document.body.appendChild(overlayEl);
}

// Helper: show overlay quickly
let overlayTimer = null;
const activateOverlay = () => {
  if (!overlayEl) return;

  overlayEl.classList.add('is-active');

  // Remove after a short moment (prevents it getting stuck if navigation is blocked)
  if (overlayTimer) clearTimeout(overlayTimer);
  overlayTimer = setTimeout(() => {
    overlayEl.classList.remove('is-active');
  }, 450);
};

// Intercept internal link clicks on mobile for fast navigation overlay
document.addEventListener('click', (e) => {
  if (!isMobile) return;

  const link = e.target && e.target.closest ? e.target.closest('a') : null;
  if (!link) return;

  // Respect modifier keys / new tab behavior
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (link.target && link.target !== '_self') return;

  const href = link.getAttribute('href');
  if (!href) return;

  // Only for same-origin / relative links (e.g., about.html, services.html)
  const isInternal =
    href.startsWith('/') ||
    href.startsWith('./') ||
    href.startsWith('../') ||
    href.endsWith('.html') ||
    href.includes('.html#') ||
    href.startsWith('index.html');

  if (!isInternal) return;

  // Avoid breaking hash-only links; those should be handled by scroll code below
  if (href.startsWith('#')) return;

  e.preventDefault();
  activateOverlay();

  // Navigate almost immediately after overlay starts
  setTimeout(() => {
    window.location.href = href;
  }, 120);
});

// Smooth scroll for anchor links (disable smooth behavior on mobile)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: isMobile ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  });
});

// Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const submitBtn = this.querySelector('.submit-btn');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      
      // Show success message
      const formStatus = document.createElement('div');
      formStatus.className = 'form-status success';
      formStatus.textContent = 'Thank you! Your message has been sent successfully.';
      this.appendChild(formStatus);
      
      // Reset form
      this.reset();
      
      // Remove success message after 5 seconds
      setTimeout(() => {
        formStatus.remove();
      }, 5000);
    }, 1500);
  });
}

// Add scroll animation for elements
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe cards and sections for animation
document.querySelectorAll('.card, .service-card, .testimonial-card, .benefit-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Navbar scroll effect
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.style.background = 'rgba(0, 51, 102, 0.95)';
      nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
      nav.style.background = 'rgba(0, 51, 102, 0.15)';
      nav.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)';
    }
  });
}

/* =========================
LIGHTBOX (Image modal)
- used by testimonials avatar images
========================= */

(function setupImageLightbox() {
  const triggers = document.querySelectorAll('.lightbox-trigger');
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.image-lightbox__img') : null;

  if (!triggers.length || !lightbox || !lightboxImg) return;

  const openLightbox = (src, alt) => {
    if (!src) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Full image preview';

    lightbox.classList.add('is-active');
    lightbox.setAttribute('aria-hidden', 'false');

    // prevent background scroll
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // open when clicking triggers
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();

      const href = trigger.getAttribute('href');
      const img = trigger.querySelector('img');
      const src = img ? img.src : href;
      const alt = img ? img.alt : (trigger.getAttribute('aria-label') || 'Full image preview');

      openLightbox(src, alt);
    });
  });

  // close by backdrop click
  const backdrop = lightbox.querySelector('[data-close-lightbox]');
  if (backdrop) {
    backdrop.addEventListener('click', closeLightbox);
  }

  // close by close button
  const closeBtn = lightbox.querySelector('[data-close-lightbox].image-lightbox__close, [data-close-lightbox].image-lightbox__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  // close on Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
      closeLightbox();
    }
  });
})();

// Mobile menu toggle functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Toggle hamburger icon between bars and times
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  // Close mobile menu when clicking on a link
  const navLinksItems = navLinks.querySelectorAll('a');
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = hamburger.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      const icon = hamburger.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
}

// Ensure header background videos play (autoplay can be blocked until loaded)
document.querySelectorAll('.hero-video, .bg-video').forEach((video) => {
  video.muted = true;
  video.setAttribute('playsinline', '');

  const tryPlay = () => {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  };

  tryPlay();
  video.addEventListener('loadeddata', tryPlay);
  video.addEventListener('canplay', tryPlay);
});
