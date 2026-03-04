

//1.Indetifique que es esto?
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
mouseX = e.clientX;
mouseY = e.clientY;
cursor.style.left = mouseX + 'px';
cursor.style.top = mouseY + 'px';
});

function animateCursor() {
  // BUG 1: El factor LERP este bus porque se da?
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}

animateCursor();

//2.Identifique que es esto?
const progressBar = document.getElementById('progress-bar');

function updateProgress() {
  const scrollTop = window.scrollY;
  // BUG 2: Falta restar window.innerHeight al calcular docHeight,como lo corregimos?
  const docHeight = document.documentElement.scrollHeight-window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';
}


// 3. NAV: que hace esto?
const nav = document.getElementById('nav');

function updateNav() {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}


// 4. PARALLAX en que?
const parallaxCards = document.querySelectorAll('[data-parallax]');

function updateParallax() {
  parallaxCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const speed = parseFloat(card.dataset.parallax);
    const center = (rect.top + rect.height / 2) - (window.innerHeight / 2);
    const offset = center * speed;
    card.style.transform = `translateY(${offset}px)`;
  });
}


// 5. esto es un scroll?
const hSection = document.getElementById('horizontal-section');
const hScroll = document.getElementById('hscroll');

function updateHorizontalScroll() {
  const rect = hSection.getBoundingClientRect();
  // BUG 3: Se divide por window.innerWidth en lugar de?
  const progress = 1 - (rect.top / window.innerHeight);
  const clamped = Math.max(0, Math.min(1, progress));
  const maxShift = hScroll.scrollWidth - window.innerWidth + 120;
  hScroll.style.transform = `translateX(-${clamped * maxShift}px)`;
}


// 6. STICKY SECTION animación por progreso
const stickySection = document.getElementById('sticky-section');
const stickyLines = [
  document.getElementById('sline1'),
  document.getElementById('sline2'),
  document.getElementById('sline3'),
];
const stickyCircle = document.getElementById('sticky-circle');

function updateSticky() {
  const rect = stickySection.getBoundingClientRect();
  const totalScroll = stickySection.offsetHeight - window.innerHeight;
  const scrolled = -rect.top;
  const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

  stickyLines.forEach((line, i) => {
    if (progress > i * 0.08 + 0.05) {
      line.classList.add('in');
    } else {
      line.classList.remove('in');
    }
  });

  if (progress > 0.02) {
    stickyCircle.classList.add('grow');
  } else {
    stickyCircle.classList.remove('grow');
  }
}


// 7. WORD REVEAL

const revealContainer = document.getElementById('reveal-text');
const words = "JavaScript tiene acceso completo al DOM y puede transformar cualquier scroll en una experiencia visual poderosa sin ninguna librería externa".split(' ');
const highlightWords = ['JavaScript', 'DOM', 'scroll', 'poderosa'];

words.forEach((word, i) => {
  const span = document.createElement('span');
  span.textContent = word + ' ';
  span.className = 'reveal-word' + (highlightWords.includes(word) ? ' highlight-candidate' : '');
  span.dataset.index = i;
  revealContainer.appendChild(span);
});

function updateWordReveal() {
  const spans = revealContainer.querySelectorAll('.reveal-word');
  spans.forEach(span => {
    const rect = span.getBoundingClientRect();
    const threshold = window.innerHeight * 0.65;
    if (rect.top < threshold) {
      span.classList.add('lit');
      if (span.classList.contains('highlight-candidate')) {
        span.classList.add('highlight');
      }
    } else {
      span.classList.remove('lit');
    }
  });
}


// 8. INTERSECTION OBSERVER — Contadores

function animateCounter(el, target, suffix) {
  const start = performance.now();
  const duration = 1800;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function update(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutExpo(t) * target);
    el.textContent = value + suffix;
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// BUG 4: threshold este es el bug mas complejo, que le falta?
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const item = entry.target;
      const target = parseInt(item.dataset.target);
      const suffix = item.dataset.suffix;
      const numEl = item.querySelector('.counter-num');
      item.classList.add('visible');
      animateCounter(numEl, target, suffix);
      counterObserver.unobserve(item);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.counter-item').forEach(item => {
  counterObserver.observe(item);
});


// 9. HERO PARALLAX

const heroTitle = document.querySelector('.hero-title');

function updateHeroParallax() {
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    // BUG 5: El factor de parallax es..? y que le falta a la función?
    heroTitle.style.transform = `translateY(${scrollY * 0.4}px)`;
  }
}

// este evento que es? y que importancia tiene?

function onScroll() {
  updateProgress();
  updateNav();
  updateParallax();
  updateHorizontalScroll();
  updateSticky();
  updateWordReveal();
  updateHeroParallax();
}

window.addEventListener('scroll', onScroll, { passive: true });

onScroll();