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

  /* ---------- 2) "Angebote"-Dropdowns (Header UND Footer) ----------
     Es kann mehrere Dropdowns auf einer Seite geben (Header + Footer),
     deshalb alle einsammeln statt nur das erste. */
  const dropdownPairs = [];
  document.querySelectorAll('.has-dropdown').forEach(function (wrapper) {
    const toggle = wrapper.querySelector('.dropdown-toggle');
    const menu = wrapper.querySelector('.dropdown-menu');
    if (toggle && menu) {
      dropdownPairs.push({ toggle: toggle, menu: menu });

      toggle.addEventListener('click', function (event) {
        event.stopPropagation(); // verhindert, dass der globale Klick-Listener sofort wieder schließt
        const isOpen = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
      });
    }
  });

  function closeAllDropdowns() {
    dropdownPairs.forEach(function (pair) {
      pair.menu.classList.remove('open');
      pair.toggle.setAttribute('aria-expanded', 'false');
    });
  }

  if (dropdownPairs.length) {
    // Klick außerhalb eines Dropdowns schließt nur dieses wieder
    document.addEventListener('click', function (event) {
      dropdownPairs.forEach(function (pair) {
        if (!pair.menu.contains(event.target) && !pair.toggle.contains(event.target)) {
          pair.menu.classList.remove('open');
          pair.toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Escape-Taste schließt alle Dropdowns (Barrierefreiheit)
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeAllDropdowns();
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
