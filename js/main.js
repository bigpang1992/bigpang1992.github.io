document.addEventListener('DOMContentLoaded', function() {

  // ============================================
  // Loading Screen
  // ============================================
  var loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        loadingScreen.classList.add('loaded');
        setTimeout(function() { loadingScreen.remove(); }, 500);
      }, 600);
    });
  }

  // ============================================
  // Mobile Navigation
  // ============================================
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    navMenu.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ============================================
  // Header Scroll Behavior
  // ============================================
  var header = document.getElementById('site-header');
  var lastScroll = 0;

  window.addEventListener('scroll', function() {
    var currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    if (currentScroll > lastScroll && currentScroll > 300) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    lastScroll = currentScroll;
  });

  // ============================================
  // Scroll Reveal
  // ============================================
  var revealElements = document.querySelectorAll('[data-scroll-reveal]');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(function(el) { revealObserver.observe(el); });
  } else {
    revealElements.forEach(function(el) { el.classList.add('revealed'); });
  }

  // ============================================
  // Back to Top
  // ============================================
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // Donate Modal
  // ============================================
  var donateModal = document.getElementById('donate-modal');
  var donateTriggers = document.querySelectorAll('.btn-donate-trigger');
  var donateClose = document.getElementById('donate-modal-close');
  var donateTabs = document.querySelectorAll('.donate-tab');

  if (donateModal) {
    donateTriggers.forEach(function(btn) {
      btn.addEventListener('click', function() {
        donateModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        startConfetti();
        cycleFlattery('donate-flattery');
      });
    });

    if (donateClose) {
      donateClose.addEventListener('click', closeDonateModal);
    }

    var overlay = donateModal.querySelector('.donate-modal-overlay');
    if (overlay) overlay.addEventListener('click', closeDonateModal);

    function closeDonateModal() {
      donateModal.classList.remove('active');
      document.body.style.overflow = '';
      stopConfetti();
    }

    donateTabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        donateTabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var method = tab.getAttribute('data-tab');
        var wechat = document.getElementById('qr-wechat');
        var alipay = document.getElementById('qr-alipay');
        if (wechat) wechat.style.display = method === 'wechat' ? 'flex' : 'none';
        if (alipay) alipay.style.display = method === 'alipay' ? 'flex' : 'none';
      });
    });
  }

  // ============================================
  // Flattery Messages
  // ============================================
  var flatteryMessages = window.FLATTERY_MESSAGES || [
    '您简直是世间最慷慨的人！',
    '遇到你这样的好人，我感动得热泪盈眶！'
  ];
  var flatteryIntervals = {};

  function cycleFlattery(elementId) {
    var el = document.getElementById(elementId);
    if (!el) return;
    if (flatteryIntervals[elementId]) clearInterval(flatteryIntervals[elementId]);

    var index = 0;
    function update() {
      var textEl = el.querySelector('.flattery-text') || el.querySelector('p') || el;
      textEl.classList.add('flattery-fade-out');
      setTimeout(function() {
        textEl.textContent = flatteryMessages[index % flatteryMessages.length];
        textEl.classList.remove('flattery-fade-out');
        textEl.classList.add('flattery-fade-in');
        setTimeout(function() { textEl.classList.remove('flattery-fade-in'); }, 300);
        index++;
      }, 300);
    }
    update();
    flatteryIntervals[elementId] = setInterval(update, 3000);
  }

  // Auto-cycle flattery on various pages
  ['page-flattery', 'home-flattery', 'post-flattery'].forEach(function(id) {
    if (document.getElementById(id)) cycleFlattery(id);
  });

  // ============================================
  // Confetti Effect
  // ============================================
  var confettiCanvas, confettiCtx, confettiParticles = [], confettiAnimId;

  function startConfetti() {
    confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) return;

    confettiCtx = confettiCanvas.getContext('2d');
    confettiCanvas.width = confettiCanvas.parentElement.offsetWidth;
    confettiCanvas.height = confettiCanvas.parentElement.offsetHeight;

    confettiParticles = [];
    var emojis = ['💰', '🪙', '💎', '✨', '🎉', '❤️', '🙏', '💵'];

    for (var i = 0; i < 30; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2 + 1,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: Math.random() * 16 + 12,
        rotation: Math.random() * 360,
        rotateSpeed: (Math.random() - 0.5) * 5,
      });
    }
    animateConfetti();
  }

  function animateConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotateSpeed;
      if (p.y > confettiCanvas.height) {
        p.y = -20;
        p.x = Math.random() * confettiCanvas.width;
      }
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rotation * Math.PI / 180);
      confettiCtx.font = p.size + 'px serif';
      confettiCtx.textAlign = 'center';
      confettiCtx.fillText(p.emoji, 0, 0);
      confettiCtx.restore();
    });
    confettiAnimId = requestAnimationFrame(animateConfetti);
  }

  function stopConfetti() {
    if (confettiAnimId) {
      cancelAnimationFrame(confettiAnimId);
      confettiAnimId = null;
    }
  }

  // Coin rain on donate page
  if (document.querySelector('.donate-page')) {
    var coinCanvas = document.getElementById('coin-rain-canvas');
    if (coinCanvas) {
      var cCtx = coinCanvas.getContext('2d');
      var coins = [];
      var coinEmojis = ['🪙', '💰', '💵', '💎'];

      function resizeCoinCanvas() {
        coinCanvas.width = window.innerWidth;
        coinCanvas.height = window.innerHeight;
      }
      resizeCoinCanvas();
      window.addEventListener('resize', resizeCoinCanvas);

      for (var i = 0; i < 20; i++) {
        coins.push({
          x: Math.random() * coinCanvas.width,
          y: Math.random() * coinCanvas.height,
          vy: Math.random() * 0.5 + 0.2,
          emoji: coinEmojis[Math.floor(Math.random() * coinEmojis.length)],
          size: Math.random() * 20 + 10,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }

      function animateCoins() {
        cCtx.clearRect(0, 0, coinCanvas.width, coinCanvas.height);
        coins.forEach(function(c) {
          c.y += c.vy;
          if (c.y > coinCanvas.height + 20) {
            c.y = -20;
            c.x = Math.random() * coinCanvas.width;
          }
          cCtx.globalAlpha = c.opacity;
          cCtx.font = c.size + 'px serif';
          cCtx.fillText(c.emoji, c.x, c.y);
        });
        cCtx.globalAlpha = 1;
        requestAnimationFrame(animateCoins);
      }
      animateCoins();
    }
  }

  // ============================================
  // Typing Effect
  // ============================================
  var typingEl = document.getElementById('typing-text');
  if (typingEl) {
    var phrases = [
      '欢迎来到穷Hub 💸',
      '在这里分享技术与生活 📝',
      '如果喜欢请打赏支持 💰',
      '您的慷慨是我最大的动力 ✨',
      '每一分钱都是爱的证明 ❤️',
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 100;

    function type() {
      var currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
      }
      setTimeout(type, typeSpeed);
    }
    type();
  }

  // ============================================
  // Number Counter Animation
  // ============================================
  document.querySelectorAll('.stat-number').forEach(function(el) {
    var target = parseInt(el.textContent);
    if (isNaN(target) || target === 0) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateNumber(el, target);
          observer.unobserve(el);
        }
      });
    });
    observer.observe(el);
  });

  function animateNumber(el, target) {
    var current = 0;
    var duration = 1500;
    var step = target / (duration / 16);
    function update() {
      current += step;
      if (current >= target) {
        el.textContent = target;
        return;
      }
      el.textContent = Math.floor(current);
      requestAnimationFrame(update);
    }
    update();
  }

});
