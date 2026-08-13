/* ==========================================================================
   BLACK SOCIAL TEAM FOUNDATION - MULTI-PAGE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Highlight Active Nav Link based on Current URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  function toggleMobileMenu(forceState) {
    if (!mobileToggle || !navMenu) return;
    const isOpen = forceState !== undefined ? forceState : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', isOpen);
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      if (isOpen) {
        icon.classList.replace('bi-list', 'bi-x-lg');
        document.body.style.overflow = 'hidden';
      } else {
        icon.classList.replace('bi-x-lg', 'bi-list');
        document.body.style.overflow = '';
      }
    }
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      toggleMobileMenu();
    });

    // Close menu when clicking any nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });
  }

  // 3. Donation Amount Selector (on donate.html and index.html if present)
  const amountButtons = document.querySelectorAll('.amount-btn');
  const customAmountInput = document.getElementById('customAmountInput');
  const finalAmountField = document.getElementById('finalAmountField');

  if (amountButtons.length && customAmountInput && finalAmountField) {
    amountButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        amountButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.getAttribute('data-val');
        customAmountInput.value = val;
        finalAmountField.value = val;
      });
    });

    customAmountInput.addEventListener('input', (e) => {
      const val = e.target.value;
      finalAmountField.value = val;
      amountButtons.forEach(b => {
        if (b.getAttribute('data-val') === val) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    });
  }

  // 4. Activity Filter Tabs (on activities.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const activityCards = document.querySelectorAll('.activity-card');

  if (filterBtns.length && activityCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        activityCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-cat') === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 5. Modal Lightbox Logic (for Medical & Education Case Proofs)
  const modal = document.getElementById('docModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalMeta = document.getElementById('modalMeta');
  const modalImagesContainer = document.getElementById('modalImagesContainer');

  window.openDocModal = function(name, condition, hospital, cost, images) {
    if (!modal) return;
    if (modalTitle) modalTitle.textContent = name;
    if (modalMeta) {
      modalMeta.innerHTML = `<i class="bi bi-hospital"></i> ${hospital} &nbsp;|&nbsp; <strong>Diagnosis / Grade:</strong> ${condition} &nbsp;|&nbsp; <strong>Cost:</strong> ${cost}`;
    }
    
    if (modalImagesContainer) {
      modalImagesContainer.innerHTML = '';
      if (images && images.length) {
        images.forEach((imgUrl, idx) => {
          const imgEl = document.createElement('img');
          imgEl.src = imgUrl;
          imgEl.alt = `${name} document proof ${idx + 1}`;
          imgEl.style.width = '100%';
          imgEl.style.borderRadius = '16px';
          imgEl.style.border = '2px solid #121212';
          imgEl.style.boxShadow = '3px 3px 0px #121212';
          imgEl.onerror = function() {
            this.style.display = 'none';
          };
          modalImagesContainer.appendChild(imgEl);
        });
      } else {
        modalImagesContainer.innerHTML = '<p style="font-family: var(--font-mono); color: #666;">Official hospital verified documents archived.</p>';
      }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  if (modalCloseBtn && modal) {
    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // 6. Generic Form Handlers (Mock Feedback)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your message has been sent to our team.');
      contactForm.reset();
    });
  }

  const volunteerForm = document.getElementById('volunteerForm');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Welcome to the team! We will reach out to you shortly.');
      volunteerForm.reset();
    });
  }
  // 7. Hero Arch Slideshow Controller (on index.html)
  const heroSlideshow = document.getElementById('heroSlideshow');
  if (heroSlideshow) {
    const slides = heroSlideshow.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('heroSliderDots');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');
    const badgeText1 = document.getElementById('heroBadgeText1');
    const badgeText2 = document.getElementById('heroBadgeText2');

    let currentSlide = 0;
    let slideInterval = null;
    const slideDuration = 3600; // 3.6s per slide

    // Create pagination dots
    if (dotsContainer && slides.length) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `hero-slider-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(idx);
          startAutoPlay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    function updateBadgeText(slide) {
      const tag1 = slide.getAttribute('data-tag1');
      const tag2 = slide.getAttribute('data-tag2');
      if (badgeText1 && tag1) badgeText1.textContent = tag1;
      if (badgeText2 && tag2) badgeText2.textContent = tag2;
    }

    function goToSlide(index) {
      if (index < 0) {
        currentSlide = slides.length - 1;
      } else if (index >= slides.length) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }

      slides.forEach((s, idx) => {
        s.classList.toggle('active', idx === currentSlide);
      });

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.hero-slider-dot');
        dots.forEach((d, idx) => {
          d.classList.toggle('active', idx === currentSlide);
        });
      }

      updateBadgeText(slides[currentSlide]);
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      slideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopAutoPlay() {
      if (slideInterval) clearInterval(slideInterval);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoPlay();
      });
    }

    heroSlideshow.addEventListener('mouseenter', stopAutoPlay);
    heroSlideshow.addEventListener('mouseleave', startAutoPlay);

    // Touch / Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    heroSlideshow.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    heroSlideshow.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        nextSlide();
      } else if (touchEndX - touchStartX > 40) {
        prevSlide();
      }
      startAutoPlay();
    }, { passive: true });

    // Initial setup
    if (slides.length) {
      updateBadgeText(slides[0]);
      startAutoPlay();
    }
  }

  // 8. Smooth Scroll with Sticky Header Offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const header = document.querySelector('.navbar-header');
        // Only navbar-header is sticky (top ribbon scrolls out of view)
        const headerHeight = header ? header.offsetHeight : 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

});

// Global Copy to Clipboard Function
function copyText(text, message) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(message || 'Copied to clipboard!');
  }).catch(() => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(message || 'Copied to clipboard!');
  });
}

function showToast(message) {
  const toast = document.getElementById('toastMsg');
  const toastText = document.getElementById('toastText');
  if (toast && toastText) {
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}
