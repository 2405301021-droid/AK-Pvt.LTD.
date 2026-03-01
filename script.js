/* ============================================================
   AK Pvt. Ltd. — script.js
   All interactivity: menu, scroll, counters, modal, form
   ============================================================ */

(function () {
  'use strict';

  // ── DOM References ─────────────────────────────────────────
  const header      = document.getElementById('header');
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const scrollTopBtn = document.getElementById('scrollTop');
  const contactForm = document.getElementById('contactForm');
  const formStatus  = document.getElementById('formStatus');
  const modalOverlay = document.getElementById('projectModal');
  const modalClose  = document.getElementById('modalClose');
  const modalImg    = document.getElementById('modalImg');
  const modalTitle  = document.getElementById('modalTitle');
  const modalTag    = document.getElementById('modalTag');
  const modalDesc   = document.getElementById('modalDesc');

  // ── 1. STICKY HEADER ──────────────────────────────────────
  function handleScroll() {
    // Header background on scroll
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll-to-top button visibility
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Active nav link based on scroll position
    updateActiveNav();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ── 2. MOBILE HAMBURGER MENU ──────────────────────────────
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ── 3. SMOOTH SCROLL ──────────────────────────────────────
  // All anchor links with # get smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        var offset = 80; // header height
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // Scroll-to-top button
  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── 4. ACTIVE NAV LINK ON SCROLL ──────────────────────────
  function updateActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.querySelectorAll('a').forEach(function (a) {
          a.classList.remove('active');
        });
        var activeLink = navLinks.querySelector('a[href="#' + id + '"]');
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  // ── 5. REVEAL ON SCROLL (Intersection Observer) ───────────
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealElements.forEach(function (el) {
      el.classList.add('active');
    });
  }

  // ── 6. ANIMATED COUNTERS ──────────────────────────────────
  var counters = document.querySelectorAll('.count');
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-target'), 10);
      var duration = 2000; // ms
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);

        // Ease out quad
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // Add + sign for certain counters
          counter.textContent = target + '+';
        }
      }

      requestAnimationFrame(step);
    });

    countersAnimated = true;
  }

  // Observe counter section
  if ('IntersectionObserver' in window && counters.length > 0) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    var countersSection = document.querySelector('.counters');
    if (countersSection) counterObserver.observe(countersSection);
  }

  // ── 7. PROJECT MODAL ──────────────────────────────────────
  var projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var title = this.getAttribute('data-title');
      var tag   = this.getAttribute('data-tag');
      var desc  = this.getAttribute('data-desc');
      var img   = this.getAttribute('data-img');

      modalTitle.textContent = title;
      modalTag.textContent   = tag;
      modalDesc.textContent  = desc;
      modalImg.src           = img;
      modalImg.alt           = title;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // ── 8. CONTACT FORM VALIDATION ────────────────────────────
  var nameInput    = document.getElementById('name');
  var emailInput   = document.getElementById('email');
  var phoneInput   = document.getElementById('phone');
  var messageInput = document.getElementById('message');

  var nameError    = document.getElementById('nameError');
  var emailError   = document.getElementById('emailError');
  var phoneError   = document.getElementById('phoneError');
  var messageError = document.getElementById('messageError');

  // Clear errors on input
  [nameInput, emailInput, phoneInput, messageInput].forEach(function (input) {
    input.addEventListener('input', function () {
      this.classList.remove('error');
      var errorEl = document.getElementById(this.id + 'Error');
      if (errorEl) errorEl.textContent = '';
      formStatus.className = 'form-status';
      formStatus.textContent = '';
    });
  });

  function validateField(input, errorEl, rules) {
    var value = input.value.trim();
    for (var i = 0; i < rules.length; i++) {
      if (!rules[i].test(value)) {
        input.classList.add('error');
        errorEl.textContent = rules[i].message;
        return false;
      }
    }
    input.classList.remove('error');
    errorEl.textContent = '';
    return true;
  }

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var isValid = true;

    // Name validation
    if (!validateField(nameInput, nameError, [
      { test: function (v) { return v.length > 0; }, message: 'Name is required.' },
      { test: function (v) { return v.length >= 2; }, message: 'Name must be at least 2 characters.' }
    ])) isValid = false;

    // Email validation
    if (!validateField(emailInput, emailError, [
      { test: function (v) { return v.length > 0; }, message: 'Email is required.' },
      { test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, message: 'Please enter a valid email.' }
    ])) isValid = false;

    // Phone validation
    if (!validateField(phoneInput, phoneError, [
      { test: function (v) { return v.length > 0; }, message: 'Phone number is required.' },
      { test: function (v) { return /^[+]?[\d\s\-()]{7,15}$/.test(v); }, message: 'Please enter a valid phone number.' }
    ])) isValid = false;

    // Message validation
    if (!validateField(messageInput, messageError, [
      { test: function (v) { return v.length > 0; }, message: 'Message is required.' },
      { test: function (v) { return v.length >= 10; }, message: 'Message must be at least 10 characters.' }
    ])) isValid = false;

    if (isValid) {
      // Simulated form submission
      var submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(function () {
        formStatus.className = 'form-status success';
        formStatus.textContent = '✓ Message sent successfully! We\'ll get back to you within 24 hours.';
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message &#8594;';

        // Auto-hide success after 5s
        setTimeout(function () {
          formStatus.className = 'form-status';
          formStatus.textContent = '';
        }, 5000);
      }, 1500);
    } else {
      formStatus.className = 'form-status error-status';
      formStatus.textContent = 'Please fix the errors above before submitting.';
    }
  });

  // ── Initial call ──────────────────────────────────────────
  handleScroll();

})();
