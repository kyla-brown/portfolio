/* ========================================
   HEADER SCROLL
   ======================================== */

const header = document.getElementById('header');

function handleHeaderScroll() {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleHeaderScroll);
handleHeaderScroll();


/* ========================================
   MOBILE MENU
   ======================================== */

const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

if (menuToggle && navMenu) {

  menuToggle.addEventListener('click', () => {

    const isOpen = navMenu.classList.toggle('nav-open');

    menuToggle.setAttribute(
      'aria-expanded',
      isOpen ? 'true' : 'false'
    );

  });


  navMenu.querySelectorAll('.nav-link').forEach(link => {

    link.addEventListener('click', () => {

      navMenu.classList.remove('nav-open');

      menuToggle.setAttribute(
        'aria-expanded',
        'false'
      );

    });

  });

}


/* ========================================
   REVEAL ON SCROLL
   ======================================== */

const revealElements =
  document.querySelectorAll('.reveal');

const revealObserver =
  new IntersectionObserver(
    (entries, observer) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add('revealed');

          observer.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.1
    }
  );


revealElements.forEach(element => {

  revealObserver.observe(element);

});


/* ========================================
   ACTIVE NAVIGATION
   ======================================== */

const sections =
  document.querySelectorAll('section[id]');

const navLinks =
  document.querySelectorAll('.nav-link');

const sectionObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          navLinks.forEach(link => {

            link.classList.remove('active');

          });

          const activeLink =
            document.querySelector(
              `.nav-link[href="#${entry.target.id}"]`
            );

          if (activeLink) {
            activeLink.classList.add('active');
          }

        }

      });

    },
    {
      rootMargin: '-30% 0px -60% 0px'
    }
  );


sections.forEach(section => {

  sectionObserver.observe(section);

});


/* ========================================
   DESIGN GALLERY MODAL
   ======================================== */

const designModal =
  document.getElementById('design-modal');

const modalTitle =
  document.getElementById('modal-title-text');

const modalCaption =
  document.getElementById('modal-caption-text');

const carouselTrack =
  document.getElementById('carousel-track');

const carouselPrev =
  document.getElementById('carousel-prev');

const carouselNext =
  document.getElementById('carousel-next');

const modalDots =
  document.getElementById('modal-dots');

const modalClose =
  document.getElementById('modal-close');


let currentImages = [];

let currentIndex = 0;

let activeCard = null;


/* ========================================
   BUILD CAROUSEL
   ======================================== */

function buildCarousel(images) {

  carouselTrack.innerHTML = '';

  modalDots.innerHTML = '';

  currentImages = images || [];

  currentIndex = 0;


  currentImages.forEach((src, index) => {

    const slide =
      document.createElement('div');

    slide.className =
      'carousel-slide';


    const image =
      document.createElement('img');

    image.src = src;

    image.alt =
      `Gallery image ${index + 1}`;


    slide.appendChild(image);

    carouselTrack.appendChild(slide);


    const dot =
      document.createElement('button');

    dot.className =
      'modal-dot';

    dot.type =
      'button';

    dot.setAttribute(
      'aria-label',
      `Go to image ${index + 1}`
    );


    dot.addEventListener('click', () => {

      goTo(index);

    });


    modalDots.appendChild(dot);

  });

}


/* ========================================
   GO TO IMAGE
   ======================================== */

function goTo(index) {

  if (!currentImages.length) {
    return;
  }


  currentIndex =
    Math.max(
      0,
      Math.min(
        index,
        currentImages.length - 1
      )
    );


  carouselTrack.style.transform =
    `translateX(-${currentIndex * 100}%)`;


  const dots =
    modalDots.querySelectorAll('.modal-dot');


  dots.forEach((dot, index) => {

    dot.classList.toggle(
      'active',
      index === currentIndex
    );

  });


  carouselPrev.disabled =
    currentIndex === 0;


  carouselNext.disabled =
    currentIndex ===
    currentImages.length - 1;

}


/* ========================================
   RESET MODAL CONTROLS
   ======================================== */

function resetCarouselControls() {

  carouselPrev.hidden =
    currentImages.length <= 1;

  carouselNext.hidden =
    currentImages.length <= 1;

  modalDots.hidden =
    currentImages.length <= 1;

}


/* ========================================
   OPEN MODAL
   ======================================== */

function openModal(card) {

  activeCard = card;


  const title =
    card.dataset.title || 'Design';


  const caption =
    card.dataset.caption || '';


  modalTitle.textContent =
    title;


  modalCaption.textContent =
    caption;


  const images =
    JSON.parse(
      card.dataset.images || '[]'
    );


  buildCarousel(images);

  resetCarouselControls();

  goTo(0);


  designModal.hidden = false;


  requestAnimationFrame(() => {

    designModal.classList.add(
      'modal-open'
    );

  });


  document.body.style.overflow =
    'hidden';


  modalClose.focus();

}


/* ========================================
   CLOSE MODAL
   ======================================== */

function closeModal() {

  designModal.classList.remove(
    'modal-open'
  );


  setTimeout(() => {

    designModal.hidden = true;

  }, 300);


  document.body.style.overflow =
    '';


  activeCard = null;

}


/* ========================================
   DESIGN CARD EVENTS
   ======================================== */

const designCards =
  document.querySelectorAll(
    '.design-card'
  );


designCards.forEach(card => {

  card.addEventListener(
    'click',
    () => {

      openModal(card);

    }
  );

});


/* ========================================
   MODAL BUTTONS
   ======================================== */

if (modalClose) {

  modalClose.addEventListener(
    'click',
    closeModal
  );

}


if (carouselPrev) {

  carouselPrev.addEventListener(
    'click',
    () => {

      goTo(currentIndex - 1);

    }
  );

}


if (carouselNext) {

  carouselNext.addEventListener(
    'click',
    () => {

      goTo(currentIndex + 1);

    }
  );

}


/* ========================================
   CLOSE WHEN CLICKING OUTSIDE MODAL
   ======================================== */

if (designModal) {

  designModal.addEventListener(
    'click',
    event => {

      if (
        event.target ===
        designModal
      ) {

        closeModal();

      }

    }
  );

}


/* ========================================
   KEYBOARD CONTROLS
   ======================================== */

document.addEventListener(
  'keydown',
  event => {

    if (
      designModal.hidden
    ) {
      return;
    }


    if (
      event.key === 'Escape'
    ) {

      closeModal();

      return;

    }


    if (
      event.key === 'ArrowLeft'
    ) {

      goTo(currentIndex - 1);

    }


    if (
      event.key === 'ArrowRight'
    ) {

      goTo(currentIndex + 1);

    }

  }
);


/* ========================================
   LOGO SMOOTH SCROLL
   ======================================== */

const logoLink =
  document.getElementById(
    'logo-link'
  );


if (logoLink) {

  logoLink.addEventListener(
    'click',
    event => {

      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }
  );

}
