/* ==========================================================================
   CANVAS — motion layer

   Principles this file enforces:
     · Slow. 600–1100ms. Luxury reads as unhurried.
     · Reveal, never bounce. Mask wipes and opacity, no spring physics.
     · The product never moves — camera and light do.
     · Scrubbing is a DESKTOP enhancement. Mid-range Android stutters on
       scroll-linked animation, and stutter reads as broken, not luxurious.
       Touch devices get discrete IntersectionObserver reveals instead.
     · Everything degrades: no JS, reduced motion, and save-data all leave a
       complete, shoppable page.
   ========================================================================== */

(function () {
  'use strict';

  var reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch   = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var isNarrow  = window.matchMedia('(max-width: 900px)').matches;
  var conn      = navigator.connection || {};
  var saveData  = conn.saveData === true;
  var slowNet   = /(^|-)2g$/.test(conn.effectiveType || '');
  var lightMode = saveData || slowNet;

  var hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ----------------------------------------------------------------------
     Video — never autoload. Attach sources only when near the viewport,
     and never at all on save-data or 2G (the poster carries the section).
     ---------------------------------------------------------------------- */
  function initVideo() {
    var vids = document.querySelectorAll('video[data-src-mp4]');
    if (lightMode) return;   // posters only

    var load = function (v) {
      if (v.dataset.loaded) return;
      v.dataset.loaded = '1';
      var webm = v.getAttribute('data-src-webm');
      var mp4  = v.getAttribute('data-src-mp4');
      if (webm) { var s1 = document.createElement('source'); s1.src = webm; s1.type = 'video/webm'; v.appendChild(s1); }
      if (mp4)  { var s2 = document.createElement('source'); s2.src = mp4;  s2.type = 'video/mp4';  v.appendChild(s2); }
      v.load();
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* autoplay refused — poster stands */ });
    };

    if (!('IntersectionObserver' in window)) { vids.forEach(load); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { load(e.target); }
        else if (e.target.dataset.loaded && !e.target.paused) { e.target.pause(); }
      });
    }, { rootMargin: '200px 0px' });

    vids.forEach(function (v) { io.observe(v); });
  }

  /* ----------------------------------------------------------------------
     Reveals — the universal entrance. Works on every device.
     ---------------------------------------------------------------------- */
  function initReveals() {
    var els = document.querySelectorAll('.reveal');
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------------------
     Nav — solidifies once you leave the hero.
     ---------------------------------------------------------------------- */
  function initNav() {
    var nav = document.querySelector('[data-nav]');
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var toggle = document.querySelector('[data-menu-toggle]');
    var links  = document.querySelector('.nav__links');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        links.style.display = open ? '' : 'flex';
insertMobileMenuStyles(links, !open);
      });
    }
  }

  function insertMobileMenuStyles(links, open) {
    if (!open) { links.removeAttribute('style'); return; }
    links.style.position = 'absolute';
    links.style.top = '100%';
    links.style.left = '0';
    links.style.right = '0';
    links.style.flexDirection = 'column';
    links.style.gap = 'var(--s-4)';
    links.style.padding = 'var(--s-5) var(--gutter)';
    links.style.background = 'var(--bg)';
    links.style.borderBottom = '1px dashed var(--line)';
    links.style.margin = '0';
  }

  /* ----------------------------------------------------------------------
     Scroll progress — the crescent fill.
     ---------------------------------------------------------------------- */
  function initProgress() {
    var bar = document.querySelector('[data-progress]');
    if (!bar || reduced) return;
    var tick = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? window.scrollY / h : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
  }

  /* ----------------------------------------------------------------------
     1 · Hero — the arch opens, then expands to full bleed.
     One idea, executed slowly. ~2.5s, once, on load.
     ---------------------------------------------------------------------- */
  function initHero() {
    var media = document.querySelector('[data-hero-media]');
    if (!media) return;

    if (reduced) { media.style.clipPath = 'none'; return; }

    // The settled state keeps the arch on desktop (the frame IS the motif) and
    // goes near-full-bleed on mobile, where the vertical video fills the screen.
    var settled = isNarrow
      ? 'inset(0% 0% 0% 0% round 0% 0% 0px 0px / 0% 0% 0px 0px)'
      : 'inset(0% 0% 0% 0% round 50% 50% 4px 4px / 42% 42% 4px 4px)';
    var start = isNarrow
      ? 'inset(10% 18% 12% 18% round 46% 46% 4px 4px / 24% 24% 4px 4px)'
      : 'inset(6% 14% 6% 14% round 46% 46% 4px 4px / 26% 26% 4px 4px)';

    if (!hasGSAP) {
      media.style.transition = 'clip-path 1800ms cubic-bezier(0.22,1,0.36,1)';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { media.style.clipPath = settled; });
      });
      return;
    }

    var tl = gsap.timeline({ delay: 0.25 });
    tl.fromTo(media, { clipPath: start },
      { clipPath: settled, duration: 2.1, ease: 'power3.inOut' });
    tl.from('.hero__eyebrow', { opacity: 0, y: 14, duration: 0.9, ease: 'power2.out' }, 0.6);
    tl.from('.hero__title',   { opacity: 0, y: 22, duration: 1.1, ease: 'power3.out' }, 0.8);
    tl.from('.hero__sub',     { opacity: 0, y: 18, duration: 1.0, ease: 'power2.out' }, 1.05);
    tl.from('.hero__cta',     { opacity: 0, y: 16, duration: 0.9, ease: 'power2.out' }, 1.25);
    tl.from('.hero__cue',     { opacity: 0, duration: 0.8 }, 1.6);

    // Parallax — desktop only. Skipped on touch to protect scroll performance.
    if (!isTouch) {
      gsap.to(media, {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
      });
    }
  }

  /* ----------------------------------------------------------------------
     2 · Vocabulary — hover cross-fades a still into the arch.
     Desktop only; on touch the thumbnail sits inline in the row instead.
     ---------------------------------------------------------------------- */
  function initVocab() {
    if (isNarrow || isTouch) return;
    var links  = document.querySelectorAll('.vocab__link[data-img]');
    var viewer = document.querySelector('[data-vocab-viewer]');
    if (!links.length || !viewer) return;

    var show = function (key) {
      viewer.querySelectorAll('.vocab__img').forEach(function (img) {
        img.classList.toggle('is-on', img.getAttribute('data-key') === key);
      });
    };
    links.forEach(function (a) {
      var key = a.getAttribute('data-img');
      a.addEventListener('mouseenter', function () { show(key); });
      a.addEventListener('focus',      function () { show(key); });
    });
  }

  /* ----------------------------------------------------------------------
     3 · Penciled Precious — sketch dissolves into the finished object.

     Desktop: scroll-scrubbed, so the reader controls the transformation.
     Touch:   a single cross-fade on enter. Same story, one step, no jank.
     ---------------------------------------------------------------------- */
  function initPencil() {
    var stage = document.querySelector('[data-pencil]');
    var obj   = document.querySelector('[data-pencil-object]');
    if (!stage || !obj) return;

    if (reduced) { obj.style.opacity = 1; return; }

    if (isTouch || isNarrow || !hasGSAP) {
      if (!('IntersectionObserver' in window)) { obj.style.opacity = 1; return; }
      obj.style.transition = 'opacity 1200ms cubic-bezier(0.22,1,0.36,1)';
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          setTimeout(function () { obj.style.opacity = 1; }, 700);
          io.unobserve(e.target);
        });
      }, { threshold: 0.45 });
      io.observe(stage);
      return;
    }

    gsap.fromTo(obj, { opacity: 0 }, {
      opacity: 1, ease: 'none',
      scrollTrigger: { trigger: stage, start: 'top 62%', end: 'bottom 78%', scrub: 0.8 }
    });
  }

  /* ----------------------------------------------------------------------
     4 · Collections — horizontal scroll-linked band on desktop.
     On mobile the CSS already stacks it vertically with scroll-snap.
     ---------------------------------------------------------------------- */
  function initCollections() {
    var track = document.querySelector('[data-collections]');
    if (!track || isTouch || isNarrow || reduced || !hasGSAP) return;

    var overflow = track.scrollWidth - track.clientWidth;
    if (overflow <= 0) return;

    gsap.to(track, {
      x: -overflow, ease: 'none',
      scrollTrigger: {
        trigger: track.closest('section'),
        start: 'top 20%',
        end: function () { return '+=' + overflow; },
        scrub: 0.7,
        pin: true,
        invalidateOnRefresh: true
      }
    });
  }

  /* ----------------------------------------------------------------------
     Lenis — smooth scroll. Desktop only, and never under reduced motion.
     On touch, native scrolling is smoother than anything we can synthesise.
     ---------------------------------------------------------------------- */
  function initLenis() {
    if (reduced || isTouch || typeof window.Lenis === 'undefined') return;
    var lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.9 });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------------------------------------------------------------------- */
  function init() {
    initNav();
    initProgress();
    initReveals();
    initVideo();
    initHero();
    initVocab();
    initPencil();
    initCollections();
    initLenis();
    if (hasGSAP) window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
