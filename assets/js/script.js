    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('nav');

    if (navToggle && nav) {
      navToggle.addEventListener('click', () => {
        const aberto = nav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', aberto);
      });
    }