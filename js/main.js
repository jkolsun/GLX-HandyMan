/* ============================================================
   GLX HANDYMAN — main.js
   ============================================================ */

(function() {
  'use strict';

  /* ── Page Load ──────────────────────────────────────────── */
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  /* ── Custom Cursor ──────────────────────────────────────── */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (dot && ring && window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let raf;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      raf = requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width  = '56px';
        ring.style.height = '56px';
        dot.style.transform = 'translate(-50%, -50%) scale(0)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width  = '32px';
        ring.style.height = '32px';
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    });
  }

  /* ── Navigation ─────────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── Mobile Menu ─────────────────────────────────────────── */
  const toggle   = document.querySelector('.nav-mobile-toggle');
  const mobileMenu = document.querySelector('.nav-mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll Reveal (all reveal types) ───────────────────── */
  const reveals = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
  if (reveals.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  /* ── Counter Animation ───────────────────────────────────── */
  function animateCounter(el, target, suffix, duration = 1800) {
    const start = performance.now();
    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(ease * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ── Before/After Slider ─────────────────────────────────── */
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const after  = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    let dragging = false;

    function setPosition(x) {
      const rect = slider.getBoundingClientRect();
      const pct  = Math.min(Math.max((x - rect.left) / rect.width, 0.02), 0.98);
      const pctStr = `${pct * 100}%`;
      after.style.clipPath   = `inset(0 ${100 - pct * 100}% 0 0)`;
      handle.style.left      = pctStr;
    }

    slider.addEventListener('mousedown', e => { dragging = true; setPosition(e.clientX); });
    window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
    window.addEventListener('mouseup', () => { dragging = false; });

    slider.addEventListener('touchstart', e => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchmove', e => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', () => { dragging = false; });

    // Set initial position
    setPosition(slider.getBoundingClientRect().left + slider.offsetWidth * 0.5);
  });

  /* ── Hero Text Scramble (optional effect on headlines) ────── */
  function scramble(el) {
    const original = el.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let iterations = 0;
    const interval = setInterval(() => {
      el.textContent = original.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < iterations) return original[i];
        return chars[Math.floor(Math.random() * 26)];
      }).join('');
      if (iterations >= original.length) clearInterval(interval);
      iterations += 0.4;
    }, 28);
  }

  const scrambleEls = document.querySelectorAll('[data-scramble]');
  scrambleEls.forEach(el => {
    // Delay so it runs after page load
    setTimeout(() => scramble(el), 600);
  });

  /* ── Ticker Clone (items inside track, single row) ───────── */
  document.querySelectorAll('.ticker-track').forEach(track => {
    const items = track.innerHTML;
    track.innerHTML = items + items;
  });

  /* ── Testimonial Carousel Clone ─────────────────────────── */
  const testiTrack = document.getElementById('testiTrack');
  if (testiTrack) {
    const cards = testiTrack.innerHTML;
    testiTrack.innerHTML = cards + cards;
  }

  /* ── Form Handling ───────────────────────────────────────── */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>Message Sent</span> <span class="btn-icon"></span>';
      btn.style.background = '#2a7a3b';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        form.reset();
      }, 3500);
    });
  }

  /* ── Active Nav Link ─────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Parallax Hero + Gradient Orbs ───────────────────────── */
  const heroVisual = document.querySelector('.hero-visual');
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const orbs = document.querySelectorAll('.gradient-orb');

  if (!isMobile) {
    if (heroVisual) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        heroVisual.style.transform = `translateY(${y * 0.3}px)`;
      }, { passive: true });
    }

    // Parallax orbs at different speeds
    if (orbs.length) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        orbs.forEach((orb, i) => {
          const speed = 0.02 + (i * 0.015);
          const dir = i % 2 === 0 ? 1 : -1;
          orb.style.transform = `translateY(${y * speed * dir}px)`;
        });
      }, { passive: true });
    }
  }

  /* ── Scroll Progress Bar ───────────────────────────────── */
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY / docHeight;
      scrollProgress.style.transform = `scaleX(${scrolled})`;
    }, { passive: true });
  }

  /* ── Tilt Effect on Bento Cards ────────────────────────── */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale(1)';
    });
  });

  /* ── Magnetic Button Effect ────────────────────────────── */
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ── Mobile Scroll Hint — hide on scroll ────────────────── */
  const scrollHint = document.querySelector('.mobile-scroll-hint');
  if (scrollHint) {
    let hintHidden = false;
    window.addEventListener('scroll', () => {
      if (!hintHidden && window.scrollY > 50) {
        scrollHint.style.opacity = '0';
        scrollHint.style.transition = 'opacity 0.4s ease';
        hintHidden = true;
      }
    }, { passive: true });
  }

  /* ── Service Item Hover Detail + Click ──────────────────── */
  document.querySelectorAll('.service-item').forEach(item => {
    const desc = item.querySelector('.service-desc');
    if (desc) {
      item.addEventListener('mouseenter', () => {
        desc.style.maxHeight = desc.scrollHeight + 'px';
        desc.style.opacity   = '1';
      });
      item.addEventListener('mouseleave', () => {
        desc.style.maxHeight = '0';
        desc.style.opacity   = '0';
      });
    }
    item.addEventListener('click', () => {
      window.location.href = item.dataset.href || 'services.html';
    });
  });

  /* ── Chatbot Widget ────────────────────────────────────────── */
  const chatToggle = document.querySelector('.chatbot-toggle');
  const chatWindow = document.querySelector('.chatbot-window');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatQuickReplies = document.getElementById('chatQuickReplies');

  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
      chatToggle.classList.toggle('open');
      chatWindow.classList.toggle('open');
    });

    const botResponses = {
      'I need a quote': 'We\'d love to help! You can <a href="contact.html" style="color:var(--accent);text-decoration:underline;">fill out our quote form</a> or call us directly at <a href="tel:+14847847239" style="color:var(--accent);text-decoration:underline;">(484) 784-7239</a>. We respond the same day!',
      'What services do you offer?': 'We handle drywall & patching, carpentry, painting, plumbing repairs, tile & flooring, doors & windows, and general maintenance. Check out our full <a href="services.html" style="color:var(--accent);text-decoration:underline;">services page</a> for details!',
      'What are your hours?': 'We\'re available Monday–Friday from 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 4:00 PM. We\'re closed on Sundays.',
      'How do I contact you?': 'You can reach us at:<br>Phone: <a href="tel:+14847847239" style="color:var(--accent);text-decoration:underline;">(484) 784-7239</a><br>Email: <a href="mailto:info@glxhandyman.com" style="color:var(--accent);text-decoration:underline;">info@glxhandyman.com</a><br>Or use our <a href="contact.html" style="color:var(--accent);text-decoration:underline;">contact form</a>.'
    };

    function addMessage(text, type) {
      const msg = document.createElement('div');
      msg.className = 'chat-msg ' + type;
      msg.innerHTML = text;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleUserMessage(text) {
      addMessage(text, 'user');

      if (chatQuickReplies) chatQuickReplies.style.display = 'none';

      setTimeout(() => {
        let response = botResponses[text];
        if (!response) {
          const lower = text.toLowerCase();
          if (lower.includes('quote') || lower.includes('price') || lower.includes('cost') || lower.includes('estimate')) {
            response = botResponses['I need a quote'];
          } else if (lower.includes('service') || lower.includes('do you') || lower.includes('offer') || lower.includes('fix')) {
            response = botResponses['What services do you offer?'];
          } else if (lower.includes('hour') || lower.includes('open') || lower.includes('time') || lower.includes('available')) {
            response = botResponses['What are your hours?'];
          } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('call') || lower.includes('reach')) {
            response = botResponses['How do I contact you?'];
          } else {
            response = 'Thanks for reaching out! For the best assistance, call us at <a href="tel:+14847847239" style="color:var(--accent);text-decoration:underline;">(484) 784-7239</a> or <a href="contact.html" style="color:var(--accent);text-decoration:underline;">send us a message</a>. We\'ll get back to you the same day!';
          }
        }
        addMessage(response, 'bot');
      }, 600);
    }

    if (chatQuickReplies) {
      chatQuickReplies.querySelectorAll('.chatbot-quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          handleUserMessage(btn.dataset.msg);
        });
      });
    }

    if (chatSend) {
      chatSend.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if (text) {
          handleUserMessage(text);
          chatInput.value = '';
        }
      });
    }

    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const text = chatInput.value.trim();
          if (text) {
            handleUserMessage(text);
            chatInput.value = '';
          }
        }
      });
    }
  }

})();
