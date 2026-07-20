/* ==========================================================
   script.js
   Steuert:
   1) Das mobile Burger-Menü (ein-/ausklappen)
   2) Das "Angebote"-Dropdown im Hauptmenü
   3) Parallax-Effekt im Hero-Bereich (Schrift scrollt weg, Bild bleibt)
   4) Scroll-Reveal-Animation im Abschnitt "Was Sie erwartet"
========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1) Mobiles Menü ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ---------- 2) "Angebote"-Dropdown ---------- */
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (dropdownToggle && dropdownMenu) {

    dropdownToggle.addEventListener('click', function (event) {
      event.stopPropagation(); // verhindert, dass der globale Klick-Listener sofort wieder schließt
      const isOpen = dropdownMenu.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', isOpen);
    });

    // Klick außerhalb des Dropdowns schließt es wieder
    document.addEventListener('click', function (event) {
      if (!dropdownMenu.contains(event.target) && !dropdownToggle.contains(event.target)) {
        dropdownMenu.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Escape-Taste schließt das Dropdown (Barrierefreiheit)
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        dropdownMenu.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 3) Hero-Parallax ----------
     Der Hero-Hintergrund steht per CSS fest (background-attachment: fixed).
     Zusätzlich lassen wir den Text beim Runterscrollen etwas schneller nach
     oben wegwandern und ausblenden, damit der Effekt "Text scrollt über das
     Bild weg" noch deutlicher wirkt. */
  const heroInner = document.querySelector('.hero-inner');
  const hero = document.querySelector('.hero');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroInner && hero && !prefersReducedMotion) {
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      const heroHeight = hero.offsetHeight;
      if (scrolled <= heroHeight) {
        heroInner.style.transform = 'translateY(' + (scrolled * 0.4) + 'px)';
        heroInner.style.opacity = Math.max(0, 1 - (scrolled / heroHeight) * 1.4);
      }
    }, { passive: true });
  }

  /* ---------- 4) Scroll-Reveal für "Was Sie erwartet" ----------
     Jede Zeile fliegt erst beim Sichtbarwerden von der Seite rein
     (von links bzw. rechts, siehe CSS-Klasse ".reverse"). */
  const vorteileRows = document.querySelectorAll('.vorteile-row');

  if (vorteileRows.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    vorteileRows.forEach(function (row) { observer.observe(row); });
  } else {
    // Fallback ohne IntersectionObserver-Unterstützung: einfach sofort zeigen
    vorteileRows.forEach(function (row) { row.classList.add('in-view'); });
  }

});
