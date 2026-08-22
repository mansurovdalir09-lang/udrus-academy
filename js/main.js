/* ============================
   UDRUS ACADEMY — main.js
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================
  // 1. Custom Cursor
  // ============================
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');

  if (cursorDot && cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    }, { passive: true });

    const animateGlow = () => {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    };
    animateGlow();

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '70px';
        cursorGlow.style.height = '70px';
      });
      el.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '40px';
        cursorGlow.style.height = '40px';
      });
    });
  }

  // ============================
  // 2. Sticky Nav Scroll
  // ============================
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  // ============================
  // 3. Hamburger Menu
  // ============================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (isOpen) {
        const firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && hamburger.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }

      if (e.key === 'Tab' && hamburger.classList.contains('open')) {
        const menuLinks = Array.from(mobileMenu.querySelectorAll('a'));
        const lastLink = menuLinks[menuLinks.length - 1];
        if (e.shiftKey && document.activeElement === hamburger) {
          e.preventDefault();
          lastLink.focus();
        } else if (!e.shiftKey && document.activeElement === lastLink) {
          e.preventDefault();
          hamburger.focus();
        }
      }
    });
  }

  // ============================
  // 4. IntersectionObserver — Scroll Animations
  // ============================
  const animatedEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in');

  if (animatedEls.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animatedEls.forEach(el => observer.observe(el));
  }

  // ============================
  // 5. Kinetic Text (Hero)
  // ============================
  const kineticEl = document.getElementById('heroTitle');
  if (kineticEl) {
    const text = kineticEl.textContent;
    kineticEl.innerHTML = '';

    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char;
      span.style.animationDelay = (0.35 + i * 0.045) + 's';
      kineticEl.appendChild(span);
    });
  }

  // ============================
  // 6. Horizontal Scroll — Lessons
  // ============================
  const track = document.getElementById('lessonsTrack');
  const btnLeft = document.getElementById('lessonsLeft');
  const btnRight = document.getElementById('lessonsRight');

  if (track && btnLeft && btnRight) {
    const cardWidth = () => {
      const card = track.querySelector('.lesson-card');
      if (!card) return 344;
      return card.offsetWidth + 24;
    };

    btnRight.addEventListener('click', () => {
      track.scrollBy({ left: cardWidth(), behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    btnLeft.addEventListener('click', () => {
      track.scrollBy({ left: -cardWidth(), behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    let startX = 0;
    let scrollStart = 0;
    let isDragging = false;
    let hasDragged = false;

    track.addEventListener('mousedown', e => {
      isDragging = true;
      hasDragged = false;
      startX = e.pageX;
      scrollStart = track.scrollLeft;
      track.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 5) hasDragged = true;
      track.scrollLeft = scrollStart - dx;
    }, { passive: true });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      track.style.cursor = '';
    });

    track.addEventListener('click', e => {
      if (hasDragged) e.preventDefault();
    }, true);
  }

  // ============================
  // 7. Archive Filter Tabs
  // ============================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const archiveCards = document.querySelectorAll('.archive-full-card');

  if (filterTabs.length && archiveCards.length) {
    const cardTimers = new WeakMap();

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-pressed', 'true');

        const filter = tab.dataset.filter;

        let visibleCount = 0;
        archiveCards.forEach(card => {
          clearTimeout(cardTimers.get(card));
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
            const tid = setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
            cardTimers.set(card, tid);
            visibleCount++;
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            const tid = setTimeout(() => { card.style.display = 'none'; }, 300);
            cardTimers.set(card, tid);
          }
        });

        const liveRegion = document.getElementById('filterStatus');
        if (liveRegion) {
          const suffix = visibleCount === 1 ? 'курс' : (visibleCount >= 2 && visibleCount <= 4) ? 'курса' : 'курсов';
          liveRegion.textContent = `Показано ${visibleCount} ${suffix}`;
        }
      });
    });
  }

  // ============================
  // 8. Smooth Scroll for anchor links
  // ============================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('mainNav')?.offsetHeight || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // ============================
  // 9. Active nav link on scroll
  // ============================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"], .nav__mobile a[href^="#"]');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(section => sectionObserver.observe(section));
  }

  // ============================
  // 10. Scroll Progress Bar
  // ============================
  const scrollBar = document.getElementById('scrollProgress');
  if (scrollBar) {
    window.addEventListener('scroll', () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total > 0) scrollBar.style.width = (window.scrollY / total * 100) + '%';
    }, { passive: true });
  }

  // ============================
  // 11. Scroll-to-top Button
  // ============================
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
      scrollTopBtn.setAttribute('aria-hidden', window.scrollY <= 400 ? 'true' : 'false');
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  // ============================
  // 12. Magnetic Hover — desktop only
  // ============================
  if (window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
    document.querySelectorAll('.btn, .lesson-card, .teacher-card, .archive-full-card').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
        el.style.transition = 'transform 0.1s ease-out';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
      });
    });
  }

  // ============================
  // 13. Split Text Reveal
  // ============================
  if (!reducedMotion) {
    document.querySelectorAll('.split-reveal').forEach(el => {
      const words = el.textContent.trim().split(' ');
      el.innerHTML = words.map((word, i) =>
        `<span style="display:inline-block;opacity:0;transform:translateY(30px);transition:opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s,transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s">${word}</span>`
      ).join(' ');
    });

    const splitObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('span').forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          });
          splitObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.split-reveal').forEach(el => splitObserver.observe(el));
  }

});

document.addEventListener('DOMContentLoaded', function() {
  const banner = document.getElementById('cookieBanner');
  const btn = document.getElementById('cookieAccept');
  if (!banner || !btn) return;
  if (localStorage.getItem('cookieAccepted')) {
    banner.classList.add('hidden');
  }
  btn.addEventListener('click', function() {
    localStorage.setItem('cookieAccepted', '1');
    banner.classList.add('hidden');
  });
});

// LESSONS TABS FILTER (только главная страница)
if (document.querySelector('#lessons-preview')) {
  const lessonsTabs = document.querySelectorAll('.lessons-tab');
  const lessonCards = document.querySelectorAll('.lesson-preview-card');

  lessonsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      lessonsTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      lessonCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// LESSONS PAGE TABS
const lessonsPageTabs = document.querySelectorAll('#lessons-page-tabs .lessons-tab');
const lessonsPageCards = document.querySelectorAll('.lessons-page-grid .lesson-preview-card');

lessonsPageTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    lessonsPageTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    lessonsPageCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});
