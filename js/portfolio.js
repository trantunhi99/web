/* ============================================================
   Portfolio interactions
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ----------------------------------------------------------
     1. Starfield + drifting particle canvas (parallax-aware)
     ---------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, stars = [], parts = [];
    const palette = ['#b08d57', '#cdb389', '#ece3d2', '#c8a06a', '#ffffff'];
    let scrollY = 0, mx = 0, my = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      buildStars();
    }
    function buildStars() {
      stars = [];
      const count = Math.min(220, Math.floor((innerWidth * innerHeight) / 7000));
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * 0.8 + 0.2,        // depth → parallax + size
          r: Math.random() < 0.15 ? 1.6 : 0.8,
          c: palette[Math.floor(Math.random() * palette.length)],
          o: 0.15 + Math.random() * 0.5,
          tw: Math.random() * Math.PI * 2
        });
      }
      parts = [];
      const pc = Math.min(34, Math.floor(innerWidth / 42));
      for (let i = 0; i < pc; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.12 * dpr,
          vy: (Math.random() - 0.5) * 0.12 * dpr,
          r: (Math.random() * 1.6 + 0.6) * dpr,
          c: palette[Math.floor(Math.random() * 4)],
          o: 0.2 + Math.random() * 0.35
        });
      }
    }

    let t = 0;
    function draw() {
      t += 0.012;
      ctx.clearRect(0, 0, w, h);
      const offY = scrollY * 0.18 * dpr;
      const pmx = (mx - innerWidth / 2) * 0.012 * dpr;
      const pmy = (my - innerHeight / 2) * 0.012 * dpr;

      // stars
      for (const s of stars) {
        const px = s.x + pmx * s.z * 4;
        let py = s.y - offY * s.z + pmy * s.z * 4;
        py = ((py % h) + h) % h;
        const tw = 0.5 + 0.5 * Math.sin(t * 1.6 + s.tw);
        ctx.globalAlpha = s.o * (0.45 + 0.55 * tw);
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(px, py, s.r * dpr * s.z, 0, Math.PI * 2);
        ctx.fill();
      }

      // drifting particles + faint links
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const py = p.y - offY * 0.5;
        ctx.globalAlpha = p.o;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x + pmx * 6, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // connection lines
      ctx.lineWidth = dpr;
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i], b = parts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150 * dpr) {
            ctx.globalAlpha = (1 - dist / (150 * dpr)) * 0.12;
            ctx.strokeStyle = '#cdb389';
            ctx.beginPath();
            ctx.moveTo(a.x + pmx * 6, a.y - offY * 0.5);
            ctx.lineTo(b.x + pmx * 6, b.y - offY * 0.5);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    addEventListener('resize', resize);
    addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    resize();
    if (!reduceMotion) draw();
    else { // single static frame
      requestAnimationFrame(() => { draw(); });
    }
    // expose scroll setter
    window.__setBgScroll = (y) => { scrollY = y; };
  }

  /* ----------------------------------------------------------
     2. Preloader
     ---------------------------------------------------------- */
  const loader = document.getElementById('loader');
  const countEl = document.querySelector('.loader-count');
  const barEl = document.querySelector('.loader-bar i');
  function finishLoad() {
    if (loader) loader.classList.add('done');
    document.body.classList.add('loaded');
    // trigger hero reveal
    document.querySelectorAll('.hero [data-hero]').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 120 + i * 110);
    });
  }
  if (loader && countEl && !reduceMotion) {
    let n = 0;
    const tick = () => {
      n += Math.random() * 9 + 3;
      if (n >= 100) n = 100;
      countEl.textContent = Math.floor(n);
      if (barEl) barEl.style.width = n + '%';
      if (n < 100) setTimeout(tick, 90 + Math.random() * 90);
      else setTimeout(finishLoad, 380);
    };
    setTimeout(tick, 200);
  } else {
    if (countEl) countEl.textContent = '100';
    if (barEl) barEl.style.width = '100%';
    setTimeout(finishLoad, 200);
  }

  /* ----------------------------------------------------------
     3. Custom cursor
     ---------------------------------------------------------- */
  if (finePointer) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (dot && ring) {
      document.body.classList.add('cursor-ready');
      let dx = innerWidth / 2, dy = innerHeight / 2, rx = dx, ry = dy;
      addEventListener('mousemove', (e) => { dx = e.clientX; dy = e.clientY; });
      (function loop() {
        rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
        dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
      })();
      const hoverSel = 'a, button, .magnetic, .proj-card, .skill-cat, .tl-item';
      document.querySelectorAll(hoverSel).forEach((el) => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
      });
      addEventListener('mousedown', () => ring.classList.add('hover-text'));
      addEventListener('mouseup', () => ring.classList.remove('hover-text'));
    }
  }

  /* ----------------------------------------------------------
     4. Smooth scroll (lerp transform) + velocity skew + depth parallax
     ---------------------------------------------------------- */
  const nebulaEls = [...document.querySelectorAll('.nebula span')];
  const progressBar = document.querySelector('.scroll-progress i');

  // Relative, viewport-aware parallax: effect is centred when the element
  // crosses the middle of the screen, so it works the whole page down.
  let parallaxItems = [];
  function cacheParallax(y) {
    const prev = wrapper ? wrapper.style.transform : '';
    if (wrapper) wrapper.style.transform = 'none';
    const wrapRect = wrapper ? wrapper.getBoundingClientRect() : null;
    parallaxItems = [...document.querySelectorAll('[data-speed]')].map((el) => {
      const saved = el.style.transform;
      el.style.transform = '';
      const r = el.getBoundingClientRect();
      el.style.transform = saved;
      return {
        el,
        speed: parseFloat(el.dataset.speed),
        axis: (el.dataset.axis || 'y'),
        base: contentTop(r, wrapRect) + r.height / 2
      };
    });
    if (wrapper) wrapper.style.transform = prev;
  }

  function applyParallax(y) {
    const vc = y + innerHeight / 2;
    for (const it of parallaxItems) {
      const d = (vc - it.base) * it.speed;
      it.el.style.transform = it.axis === 'x'
        ? `translate3d(${d}px, 0, 0)`
        : `translate3d(0, ${d}px, 0)`;
    }
    nebulaEls.forEach((n, i) => {
      n.style.transform = `translate3d(0, ${y * (0.05 + i * 0.035)}px, 0)`;
    });
  }

  const wrapper = document.getElementById('smooth-wrapper');
  let smooth = false; // native scroll — the fixed-wrapper system conflicts with the story 3D layer
  let current = 0, target = 0, velocity = 0;

  function setBodyHeight() {
    if (wrapper) document.body.style.height = wrapper.offsetHeight + 'px';
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function setProgress(y) {
    if (!progressBar) return;
    const max = (document.body.offsetHeight - innerHeight) || 1;
    progressBar.style.transform = `scaleX(${clamp(y / max, 0, 1)})`;
  }

  /* --- Scroll-scrubbed, multi-directional element animation --- */
  const animOn = !reduceMotion;
  if (animOn) document.body.classList.add('anim-on');
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  // Offset of a rect from the top of the scrolling content, independent of current
  // scroll. Correct whether #smooth-wrapper is fixed (smooth mode) or static
  // (native scroll) — adding scrollY unconditionally double-counts it when fixed.
  function contentTop(r, wrapRect) {
    return wrapRect ? r.top - wrapRect.top : r.top + (window.scrollY || 0);
  }
  let animItems = [];
  function cacheAnim(y) {
    const prevW = wrapper ? wrapper.style.transform : '';
    if (wrapper) wrapper.style.transform = 'none';
    const wrapRect = wrapper ? wrapper.getBoundingClientRect() : null;
    animItems = [...document.querySelectorAll('[data-anim]')].map((el) => {
      const st = el.style.transform, sc = el.style.clipPath;
      el.style.transform = ''; el.style.clipPath = '';
      const r = el.getBoundingClientRect();
      el.style.transform = st; el.style.clipPath = sc;
      return { el, type: el.dataset.anim, top: contentTop(r, wrapRect) };
    });
    if (wrapper) wrapper.style.transform = prevW;
  }
  function applyAnim(y) {
    if (!animOn) return;
    const start = innerHeight * 0.96, end = innerHeight * 0.5;
    for (const it of animItems) {
      const screenTop = it.top - y;
      const e = easeOut(clamp((start - screenTop) / (start - end), 0, 1));
      const el = it.el;
      switch (it.type) {
        case 'left':  el.style.transform = `translate3d(${(1 - e) * -130}px,0,0)`; el.style.opacity = e; break;
        case 'right': el.style.transform = `translate3d(${(1 - e) * 130}px,0,0)`;  el.style.opacity = e; break;
        case 'up':    el.style.transform = `translate3d(0,${(1 - e) * 90}px,0)`;     el.style.opacity = e; break;
        case 'scale': el.style.transform = `scale(${0.86 + e * 0.14})`;             el.style.opacity = e; break;
        case 'mask':
          el.style.clipPath = `inset(${(1 - e) * 100}% 0 0 0)`;
          el.style.transform = `translate3d(0,${(1 - e) * 50}px,0)`;
          el.style.opacity = Math.min(1, e * 1.5);
          break;
      }
    }
  }

  /* --- Pinned horizontal Projects gallery (scroll-scrubbed) --- */
  const hsec = document.getElementById('projects');
  const hpin = hsec && hsec.querySelector('.hpin');
  const htrack = hsec && hsec.querySelector('.htrack');
  const hhead = hsec && hsec.querySelector('.hpin-head');
  const hbar = hsec && hsec.querySelector('.hbar i');
  let hLen = 0, hTop = 0, hActive = false;

  function measureH() {
    if (!hsec || !hpin || !htrack) return;
    const disabled = reduceMotion || window.matchMedia('(max-width: 760px)').matches;
    hActive = !disabled;
    if (disabled) {
      hsec.classList.add('h-static');
      hsec.style.height = '';
      hpin.style.transform = ''; htrack.style.transform = '';
      if (hhead) hhead.style.transform = '';
      return;
    }
    hsec.classList.remove('h-static');
    hpin.style.transform = ''; htrack.style.transform = '';
    const padRight = parseFloat(getComputedStyle(htrack).paddingRight) || 0;
    hLen = Math.max(0, htrack.scrollWidth - innerWidth + padRight);
    hsec.style.height = (innerHeight + hLen) + 'px';
    hTop = hsec.offsetTop;
  }

  function updateH(y) {
    if (!hActive || !hpin) return;
    const p = clamp((y - hTop) / (hLen || 1), 0, 1);
    hpin.style.transform = `translate3d(0, ${clamp(y - hTop, 0, hLen)}px, 0)`;
    htrack.style.transform = `translate3d(${-p * hLen}px, 0, 0)`;
    if (hhead) hhead.style.transform = `translate3d(${p * 64}px, 0, 0)`; // counter-direction
    if (hbar) hbar.style.transform = `scaleX(${p})`;
  }

  if (smooth) {
    measureH();
    setBodyHeight();
    cacheParallax(window.scrollY || 0);
    cacheAnim(window.scrollY || 0);
    // body height can change as content/fonts/media settle — keep it synced cheaply
    const ro = new ResizeObserver(() => setBodyHeight());
    ro.observe(wrapper);
    // re-measure scenes/parallax only on real layout-defining events (avoids transform flicker)
    const recompute = () => { measureH(); setBodyHeight(); cacheParallax(current); cacheAnim(current); };
    addEventListener('load', recompute);
    addEventListener('resize', recompute);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(recompute);

    target = current = window.scrollY || 0;
    (function render() {
      target = window.scrollY || window.pageYOffset;
      const prev = current;
      current += (target - current) * 0.075;          // floaty inertia
      if (Math.abs(target - current) < 0.04) current = target;
      velocity += ((current - prev) - velocity) * 0.25; // smoothed velocity
      const skew = clamp(velocity * 0.035, -5, 5);     // the warp

      // pivot the skew around the visible centre so the tall page doesn't shear
      wrapper.style.transformOrigin = `center ${current + innerHeight / 2}px`;
      wrapper.style.transform = `translate3d(0, ${-current}px, 0) skewY(${skew}deg)`;

      if (window.__setBgScroll) window.__setBgScroll(current);
      applyParallax(current);
      applyAnim(current);
      updateH(current);
      setProgress(current);
      requestAnimationFrame(render);
    })();
  } else {
    document.body.classList.add('no-smooth');
    measureH();
    cacheParallax(window.scrollY || 0);
    cacheAnim(window.scrollY || 0);
    applyAnim(window.scrollY || 0);
    updateH(window.scrollY || 0);
    addEventListener('resize', () => { measureH(); cacheParallax(window.scrollY || 0); cacheAnim(window.scrollY || 0); updateH(window.scrollY || 0); applyAnim(window.scrollY || 0); });
    addEventListener('scroll', () => {
      const y = window.scrollY;
      if (window.__setBgScroll) window.__setBgScroll(y);
      applyParallax(y);
      applyAnim(y);
      updateH(y);
      setProgress(y);
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     6. Scroll reveal
     ---------------------------------------------------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ----------------------------------------------------------
     7. Magnetic buttons
     ---------------------------------------------------------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.magnetic').forEach((el) => {
      const strength = parseFloat(el.dataset.mag || '0.4');
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ----------------------------------------------------------
     8. Card mouse-glow tracking
     ---------------------------------------------------------- */
  document.querySelectorAll('.proj-card, .tl-item').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ----------------------------------------------------------
     9. Navigation: scrolled state, hide-on-down, anchors, mobile
     ---------------------------------------------------------- */
  const nav = document.querySelector('.navbar');
  const navLinks = document.querySelector('.nav-links');
  const toggle = document.querySelector('.menu-toggle');
  let lastY = 0;
  function navState() {
    const y = smooth ? current : window.scrollY;
    if (nav) {
      nav.classList.toggle('scrolled', y > 40);
      if (y > lastY && y > 400 && !navLinks.classList.contains('open')) nav.classList.add('hidden');
      else nav.classList.remove('hidden');
    }
    lastY = y;
    requestAnimationFrame(navState);
  }
  requestAnimationFrame(navState);

  function closeMenu() {
    navLinks && navLinks.classList.remove('open');
    toggle && toggle.classList.remove('active');
  }
  if (toggle) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const tgt = document.querySelector(id);
      if (!tgt) return;
      e.preventDefault();
      closeMenu();
      const top = tgt.getBoundingClientRect().top + (smooth ? current : window.scrollY) - 70;
      window.scrollTo({ top, behavior: smooth ? 'auto' : 'smooth' });
      if (smooth) target = top;
    });
  });

  /* ----------------------------------------------------------
     10. Loki demo video: fallback + lightbox
     ---------------------------------------------------------- */
  const demoVideo = document.querySelector('.browser-img video');
  const fallback = document.querySelector('.video-fallback');
  if (demoVideo && fallback) {
    const hideFallback = () => { fallback.style.display = 'none'; };
    if (demoVideo.readyState >= 2) hideFallback();
    demoVideo.addEventListener('loadeddata', hideFallback);
    demoVideo.addEventListener('canplay', hideFallback);
    demoVideo.addEventListener('error', () => { fallback.style.display = 'flex'; });
  }
  const demo = document.getElementById('loki-demo');
  const modal = document.getElementById('video-modal');
  const modalVideo = document.getElementById('modal-video');
  const modalClose = document.getElementById('video-close');
  function openModal() {
    if (!modal) return;
    modal.classList.add('open');
    if (modalVideo) { try { modalVideo.currentTime = 0; modalVideo.play(); } catch (e) {} }
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    if (modalVideo) modalVideo.pause();
  }
  if (demo) demo.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

})();
