/* ========================================
   HEADER – scroll state
   ======================================== */
const header = document.getElementById('header');

const onScroll = () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run on load

/* ========================================
   MOBILE MENU
   ======================================== */
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));

  // Animate hamburger → X
  const spans = menuToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close menu when a link is clicked
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ========================================
   SCROLL REVEAL
   ======================================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Add a small stagger delay based on position among siblings
        const siblings = [...entry.target.parentElement.children];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.07}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Animate only once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ========================================
   ACTIVE NAV LINK on scroll
   ======================================== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.fontWeight = '';
        });
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) {
          activeLink.style.color = 'var(--color-text-primary)';
        }
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(section => sectionObserver.observe(section));


/* ========================================
   DESIGN GALLERY — MODAL + CAROUSEL
   ======================================== */
const modal = document.getElementById('design-modal');
const modalTitle = document.getElementById('modal-title-text');
const modalCaption = document.getElementById('modal-caption-text');
const carouselTrack = document.getElementById('carousel-track');
const dotsContainer = document.getElementById('modal-dots');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const closeBtn = document.getElementById('modal-close-btn');

let currentIndex = 0;
let totalSlides = 0;

function buildCarousel(images) {
  carouselTrack.innerHTML = '';
  dotsContainer.innerHTML = '';
  totalSlides = images.length;

  images.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    // Use a placeholder div if the path isn't a real image yet
    if (src.startsWith('images/')) {
      const ph = document.createElement('div');
      ph.className = 'carousel-slide-placeholder design-thumb--placeholder';
      ph.style.setProperty('--thumb-hue', '270');
      ph.textContent = 'Add your image here';
      slide.appendChild(ph);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Slide ${i + 1}`;
      slide.appendChild(img);
    }

    carouselTrack.appendChild(slide);

    // Dot
    const dot = document.createElement('button');
    dot.className = 'modal-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to image ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });
}

function goTo(index) {
  currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
  carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Update dots
  dotsContainer.querySelectorAll('.modal-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentIndex);
  });

  // Update arrow state
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === totalSlides - 1;
}

function openModal(card) {
  const images = JSON.parse(card.dataset.images);
  const title = card.dataset.title || '';
  const caption = card.dataset.caption || '';

  modalTitle.textContent = title;
  modalCaption.textContent = caption;

  buildCarousel(images);
  goTo(0);

  modal.removeAttribute('hidden');
  // Small timeout so the CSS transition fires after display:flex kicks in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => modal.classList.add('modal-open'));
  });
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function closeModal() {
  modal.classList.remove('modal-open');
  modal.addEventListener('transitionend', () => {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    carouselTrack.innerHTML = '';
    dotsContainer.innerHTML = '';
  }, { once: true });
}

// Open on card click
document.querySelectorAll('.design-card').forEach(card => {
  card.addEventListener('click', () => openModal(card));
});

// Prev / Next
prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

// Close button
closeBtn.addEventListener('click', closeModal);

// Click backdrop to close
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Keyboard: Escape to close, arrows to navigate
document.addEventListener('keydown', (e) => {
  if (modal.hasAttribute('hidden')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
  if (e.key === 'ArrowRight') goTo(currentIndex + 1);
});




