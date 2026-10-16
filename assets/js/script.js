document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  if (!navToggle || !nav) {
    return;
  }

  navToggle.addEventListener('click', () => {
    const aberto = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(aberto));
  });
});