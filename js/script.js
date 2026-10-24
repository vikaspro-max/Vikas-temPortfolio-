/* ==========================================================
   Vikas Kumar Portfolio - script.js
   Theme, nav, scroll effects, liquid-glass light, ripple + confetti,
   card tilt, long-press pick-up and drag, skill filter, typing text,
   fireworks, contact form, chat assistant, auto lite mode.
   ========================================================== */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;
  var root = document.documentElement;
  var lite = false;

  /* ---------- lite mode: drop heavy effects when the device cannot keep up ---------- */
  function goLite() { lite = true; root.classList.add('lite'); }
  if (navigator.connection && navigator.connection.saveData) goLite();
  setTimeout(function () {
    var n = 0, last = performance.now(), sum = 0;
    (function sample(t) {
      var dt = t - last; last = t; n++;
      if (n > 6) sum += dt;
      if (n < 80) requestAnimationFrame(sample);
      else if (sum / (n - 6) > 25) goLite();
    })(performance.now());
  }, 1800);

  /* ---------- toast ---------- */
  var toastEl = $('toast'), toastT = $('toast-t'), toastTimer;
  function toast(msg) {
    toastT.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  /* ---------- theme ---------- */
  $('theme').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('vk-theme', next); } catch (e) {}
    toast(next === 'light' ? 'Light theme on' : 'Dark theme on');
  });

  /* ---------- nav ---------- */
  var burger = $('burger'), menu = $('menu');
  function closeMenu() { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('click', function (e) { if (!e.target.closest('header')) closeMenu(); });

  /* ---------- scroll: progress bar, back-to-top (one frame at a time, no layout reads) ---------- */
  var bar = $('bar'), topBtn = $('top-btn'), maxScroll = 1, ticking = false, topShown = false;
  function measure() { maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
  function paintScroll() {
    ticking = false;
    var y = window.scrollY;
    bar.style.transform = 'scaleX(' + Math.min(1, y / maxScroll).toFixed(4) + ')';
    var show = y > 600;
    if (show !== topShown) { topShown = show; topBtn.classList.toggle('show', show); }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(paintScroll); } }, { passive: true });
  window.addEventListener('resize', function () { measure(); paintScroll(); });
  window.addEventListener('load', function () { measure(); paintScroll(); });
  measure(); paintScroll();
  topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  var navLinks = $$('.menu a:not(.btn)');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['services', 'skills', 'projects', 'about', 'contact'].forEach(function (id) { var s = $(id); if (s) spy.observe(s); });

    var reveal = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add('in');
        reveal.unobserve(el);
        setTimeout(function () { el.classList.remove('rv', 'in'); el.style.transitionDelay = ''; }, 1000);
      });
    }, { threshold: 0.12 });
    $$('.rv').forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 80 + 'ms'; reveal.observe(el); });

    var counted = false;
    var cnt = new IntersectionObserver(function (es) {
      if (counted || !es[0].isIntersecting) return;
      counted = true;
      $$('[data-count]').forEach(function (el) {
        var to = +el.getAttribute('data-count'), n = 0;
        if (reduce) { el.textContent = to; return; }
        el.textContent = '0';
        var t = setInterval(function () { n++; el.textContent = n; if (n >= to) clearInterval(t); }, 220);
      });
    });
    var st = document.querySelector('.stats'); if (st) cnt.observe(st);
  } else {
    $$('.rv').forEach(function (el) { el.classList.remove('rv'); });
  }

  /* ---------- pointer effects (mouse only, one update per frame) ---------- */
  var glow = $('glow'), mouse = null, glassEl = null, mqueued = false;
  function paintMouse() {
    mqueued = false;
    if (!mouse) return;
    glow.style.opacity = 1;
    glow.style.transform = 'translate3d(' + mouse.x + 'px,' + mouse.y + 'px,0)';
    if (glassEl) {
      var r = glassEl.getBoundingClientRect();
      glassEl.style.setProperty('--mx', ((mouse.x - r.left) / r.width * 100).toFixed(1) + '%');
      glassEl.style.setProperty('--my', ((mouse.y - r.top) / r.height * 100).toFixed(1) + '%');
    }
  }
  if (canHover && !reduce) {
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || lite) return;
      mouse = { x: e.clientX, y: e.clientY };
      glassEl = e.target.closest ? e.target.closest('.glass') : null;
      if (!mqueued) { mqueued = true; requestAnimationFrame(paintMouse); }
    }, { passive: true });

    $$('.tilt').forEach(function (c) {
      var tq = false, te = null;
      c.addEventListener('pointermove', function (e) {
        if (lite || c.classList.contains('lifted') || e.pointerType !== 'mouse') return;
        te = e;
        if (tq) return;
        tq = true;
        requestAnimationFrame(function () {
          tq = false;
          var r = c.getBoundingClientRect();
          var x = (te.clientX - r.left) / r.width - 0.5, y = (te.clientY - r.top) / r.height - 0.5;
          c.style.transform = 'perspective(800px) rotateX(' + (-y * 7).toFixed(2) + 'deg) rotateY(' + (x * 9).toFixed(2) + 'deg) translateY(-4px)';
        });
      });
      c.addEventListener('pointerleave', function () { c.style.transform = ''; });
    });
    $$('.btn').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        if (lite || b.classList.contains('lifted') || e.pointerType !== 'mouse') return;
        var r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - r.left - r.width / 2) * 0.12).toFixed(1) + 'px ' + ((e.clientY - r.top - r.height / 2) * 0.2).toFixed(1) + 'px';
      });
      b.addEventListener('pointerleave', function () { if (!b.classList.contains('lifted')) b.style.translate = ''; });
    });
  }

  /* ---------- click ripple ---------- */
  document.addEventListener('pointerdown', function (e) {
    var b = e.target.closest && e.target.closest('.btn, .round, #top-btn, .cf button, .qr button, .copy, .filters button');
    if (!b || reduce) return;
    var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
    var s = document.createElement('span');
    s.className = 'rip';
    s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
    if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
    b.appendChild(s);
    s.addEventListener('animationend', function () { s.remove(); });
  }, { passive: true });

  /* ---------- confetti ---------- */
  var cc = $('confetti'), cx = cc.getContext('2d'), bits = [], running = false;
  function sizeConf() { cc.width = window.innerWidth; cc.height = window.innerHeight; }
  sizeConf(); window.addEventListener('resize', sizeConf);
  var palette = ['#ec4899', '#8b5cf6', '#3b82f6', '#22c55e', '#facc15', '#ffffff'];
  function confetti(x, y) {
    if (reduce) return;
    var n = lite ? 22 : 40;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 7;
      bits.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, w: 5 + Math.random() * 6, h: 3 + Math.random() * 4, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: palette[i % palette.length], l: 1 });
    }
    if (!running) { running = true; requestAnimationFrame(stepConf); }
  }
  function stepConf() {
    cx.clearRect(0, 0, cc.width, cc.height);
    for (var i = bits.length - 1; i >= 0; i--) {
      var p = bits[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.28; p.vx *= 0.985; p.r += p.vr; p.l -= 0.014;
      if (p.l <= 0 || p.y > cc.height + 20) { bits.splice(i, 1); continue; }
      cx.save(); cx.globalAlpha = Math.min(1, p.l * 1.6); cx.translate(p.x, p.y); cx.rotate(p.r);
      cx.fillStyle = p.c; cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cx.restore();
    }
    if (bits.length) requestAnimationFrame(stepConf); else { running = false; cx.clearRect(0, 0, cc.width, cc.height); }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.confetti');
    if (b) confetti(e.clientX, e.clientY);
  });

  /* ---------- long press: pick an element up, drag it, let it spring back ---------- */
  var HOLD = 380, SLOP = 10;
  var DRAG_SEL = '.card, .portrait, .stat, .link, .chip, .card-me, .tags span, .status, .btn, .faq details, form.msg, .term';
  $$(DRAG_SEL).forEach(function (el) { if (!el.closest('header')) el.classList.add('dg'); });
  var drag = null, suppressClick = false;

  document.addEventListener('pointerdown', function (e) {
    if (drag || (e.pointerType === 'mouse' && e.button !== 0)) return;
    var el = e.target.closest && e.target.closest('.dg');
    if (!el || e.target.closest('input, textarea, select')) return;
    var btn = e.target.closest('button');
    if (btn && btn !== el) return;
    var d = drag = { el: el, id: e.pointerId, sx: e.clientX, sy: e.clientY, x: 0, y: 0, lifted: false, anim: null, raf: 0, orig: getComputedStyle(el).rotate };
    if (!reduce && el.animate) d.anim = el.animate([{ scale: '1' }, { scale: '0.965' }], { duration: HOLD, easing: 'ease-out', fill: 'forwards' });
    d.timer = setTimeout(function () { lift(d); }, HOLD);
  });

  function lift(d) {
    d.lifted = true;
    if (d.anim) d.anim.cancel();
    var el = d.el;
    d.zone = el.closest('section, .hero-wrap, footer');
    el.classList.add('lifted');
    if (d.zone) d.zone.classList.add('has-lift');
    document.body.classList.add('dragging');
    suppressClick = true;
    var sel = window.getSelection && window.getSelection(); if (sel) sel.removeAllRanges();
    try { el.setPointerCapture(d.id); } catch (err) {}
    if (navigator.vibrate) { try { navigator.vibrate(18); } catch (err) {} }
    if (!reduce && el.animate) el.animate([{ scale: '0.97' }, { scale: '1.13' }, { scale: '1.06' }], { duration: 380, easing: 'cubic-bezier(.34,1.56,.64,1)' });
  }
  function paintDrag(d) {
    d.raf = 0;
    d.el.style.translate = d.x + 'px ' + d.y + 'px';
    d.el.style.rotate = Math.max(-7, Math.min(7, d.x / 22)).toFixed(2) + 'deg';
  }
  document.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!drag.lifted) { if (Math.hypot(dx, dy) > SLOP) cancelHold(); return; }
    drag.x = dx; drag.y = dy;
    if (!drag.raf) { var d = drag; drag.raf = requestAnimationFrame(function () { paintDrag(d); }); }
  });
  function cancelHold() {
    if (!drag) return;
    clearTimeout(drag.timer);
    if (drag.anim) { drag.anim.cancel(); }
    drag = null;
  }
  function drop() {
    var d = drag; drag = null;
    clearTimeout(d.timer);
    if (d.raf) cancelAnimationFrame(d.raf);
    var el = d.el, rot = Math.max(-7, Math.min(7, d.x / 22));
    el.classList.remove('lifted');
    el.classList.add('dropping');
    el.style.translate = ''; el.style.rotate = '';
    document.body.classList.remove('dragging');
    var finish = function () { el.classList.remove('dropping'); if (d.zone) d.zone.classList.remove('has-lift'); suppressClick = false; };
    if (reduce || !el.animate) { finish(); return; }
    var a = el.animate(
      [{ translate: d.x + 'px ' + d.y + 'px', rotate: rot + 'deg', scale: '1.06' }, { translate: '0px 0px', rotate: d.orig === 'none' ? '0deg' : d.orig, scale: '1' }],
      { duration: 700, easing: 'cubic-bezier(.34,1.56,.64,1)' }
    );
    a.onfinish = finish; a.oncancel = finish;
    setTimeout(function () { suppressClick = false; }, 80);
  }
  function endPress(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.lifted) drop(); else cancelHold();
  }
  document.addEventListener('pointerup', endPress);
  document.addEventListener('pointercancel', endPress);
  document.addEventListener('touchmove', function (e) { if (drag && drag.lifted) e.preventDefault(); }, { passive: false });
  document.addEventListener('contextmenu', function (e) { if (drag) e.preventDefault(); });
  document.addEventListener('click', function (e) { if (suppressClick) { e.preventDefault(); e.stopPropagation(); } }, true);
  setTimeout(function () { toast('Tip: press and hold any card to pick it up'); }, 6500);

  /* ---------- skill filter ---------- */
  var fbtns = $$('.filters button');
  fbtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f');
      fbtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $$('.skills .card').forEach(function (c) {
        var show = f === 'all' || c.getAttribute('data-cat') === f;
        c.hidden = !show;
        if (show) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
      });
    });
  });

  /* ---------- copy email, share ---------- */
  var copyBtn = $('copy'), copyT = $('copyt');
  copyBtn.addEventListener('click', function (e) {
    function done() { copyT.textContent = 'Copied!'; toast('Email copied'); confetti(e.clientX, e.clientY); setTimeout(function () { copyT.textContent = 'Copy'; }, 1600); }
    function fallback() {
      var r = document.createRange(); r.selectNodeContents(document.querySelector('.mail-text'));
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      copyT.textContent = 'Selected'; toast('Email selected, press copy'); setTimeout(function () { copyT.textContent = 'Copy'; }, 1600);
    }
    try { navigator.clipboard.writeText('vikas7pro@gmail.com').then(done, fallback); } catch (err) { fallback(); }
  });
  $('share').addEventListener('click', function () {
    var url = location.href.split('#')[0];
    function copy() {
      try { navigator.clipboard.writeText(url).then(function () { toast('Link copied'); }, function () { toast('Copy the link from the address bar'); }); }
      catch (err) { toast('Copy the link from the address bar'); }
    }
    if (navigator.share) { navigator.share({ title: 'Vikas Kumar Portfolio', url: url }).catch(function (err) { if (!err || err.name !== 'AbortError') copy(); }); }
    else copy();
  });

  /* ---------- contact form (opens the visitor's email app) ---------- */
  var form = $('msgform');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('f-name').value.trim(), m = $('f-mail').value.trim(), t = $('f-msg').value.trim();
    var hint = $('f-hint');
    if (!n || !t || !/^\S+@\S+\.\S+$/.test(m)) {
      hint.textContent = 'Please fill in your name, a valid email and a message.';
      toast('Please check the form');
      return;
    }
    var body = t + '\n\n- ' + n + ' (' + m + ')';
    var url = 'mailto:vikas7pro@gmail.com?subject=' + encodeURIComponent('Portfolio message from ' + n) + '&body=' + encodeURIComponent(body);
    var r = form.querySelector('button[type=submit]').getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height / 2);
    hint.textContent = 'If your email app did not open, write to vikas7pro@gmail.com directly.';
    toast('Opening your email app');
    window.location.href = url;
  });

  /* ---------- typing roles ---------- */
  var roles = ['BCA Student', 'Aspiring Web Developer', 'Creative Designer'];
  var typed = $('typed');
  if (!reduce) {
    var ri = 0, ci = roles[0].length, del = true;
    (function tick() {
      var w = roles[ri];
      ci += del ? -1 : 1;
      typed.textContent = w.slice(0, ci);
      var d = del ? 45 : 85;
      if (!del && ci === w.length) { del = true; d = 1500; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; d = 350; }
      setTimeout(tick, d);
    })();
  }

  /* ---------- fireworks: only while the hero is on screen ---------- */
  var cv = $('fx');
  if (cv && !reduce && 'IntersectionObserver' in window) {
    var ctx = cv.getContext('2d'), W = 0, H = 0, sp = [], inView = true, loop = false, burstTimer = 0;
    var cols = ['#22ff6a', '#8b5cf6', '#ec4899', '#3b82f6'];
    var size = function () {
      var r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 1.5);
      W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    var burst = function (x, y) {
      if (lite || !inView || document.hidden) return;
      x = x == null ? W * (0.1 + Math.random() * 0.8) : x;
      y = y == null ? H * (0.1 + Math.random() * 0.55) : y;
      var c = cols[Math.floor(Math.random() * cols.length)], n = 28;
      for (var i = 0; i < n; i++) {
        var a = (i / n) * Math.PI * 2 + Math.random() * 0.2, v = 1.2 + Math.random() * 2.6;
        sp.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, c: c });
      }
      if (!loop) { loop = true; requestAnimationFrame(frame); }
    };
    var frame = function () {
      ctx.clearRect(0, 0, W, H); ctx.lineWidth = 1.6; ctx.lineCap = 'round';
      for (var i = sp.length - 1; i >= 0; i--) {
        var s = sp[i], px = s.x, py = s.y;
        s.x += s.vx; s.y += s.vy; s.vx *= 0.975; s.vy = s.vy * 0.975 + 0.03; s.l -= 0.016;
        if (s.l <= 0) { sp.splice(i, 1); continue; }
        ctx.globalAlpha = s.l * 0.8; ctx.strokeStyle = s.c;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(s.x, s.y); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (sp.length && !lite) requestAnimationFrame(frame); else { loop = false; ctx.clearRect(0, 0, W, H); }
    };
    size(); window.addEventListener('resize', size);
    new IntersectionObserver(function (es) { inView = es[0].isIntersecting; }).observe(cv.parentNode);
    burst(); burstTimer = setInterval(burst, 2600);
    cv.parentNode.addEventListener('click', function (e) {
      if (e.target.closest('a, button, .dg, .glass')) return;
      var r = cv.getBoundingClientRect(); burst(e.clientX - r.left, e.clientY - r.top);
    });
  }

  /* ---------- chat assistant ---------- */
  var fab = $('fab'), chat = $('chat'), msgs = $('msgs'), cf = $('cf'), input = $('ci'), bubble = $('bubble'), qr = $('qr');
  var history = [], busy = false, started = false, aiSample = null;

  function toggleChat(open) {
    chat.classList.toggle('open', open);
    fab.setAttribute('aria-expanded', open ? 'true' : 'false');
    bubble.style.display = 'none';
    if (open) {
      if (!started) {
        started = true;
        botSay("Hi! I'm Vikas's assistant. Ask me about his skills, projects, background or how to contact him.\n\nHinglish mein bhi puch sakte ho 🙂");
      }
      setTimeout(function () { input.focus(); }, 60);
    }
  }
  fab.addEventListener('click', function () { toggleChat(!chat.classList.contains('open')); });
  $('closechat').addEventListener('click', function () { toggleChat(false); fab.focus(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (chat.classList.contains('open')) toggleChat(false);
    closeMenu();
  });
  setTimeout(function () { bubble.style.display = 'none'; }, 12000);

  function add(cls, text) {
    var d = document.createElement('div');
    d.className = 'm ' + cls; d.textContent = text;
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d;
  }
  function botSay(t) { history.push({ r: 'assistant', t: t }); return add('bot', t); }

  var F = {
    mail: 'vikas7pro@gmail.com',
    ig: 'https://www.instagram.com/_vikas.creation_/',
    li: 'https://www.linkedin.com/in/vikas-tem',
    gh: 'https://github.com/vikaspro-max'
  };
  var SK = 'HTML, C Programming, Java, Python, MS Office, Graphic Design, Photo & Video Editing';
  function isHi(q) { return /\b(kya|hai|hain|kaise|kaun|batao|bata|mujhe|aap|tum|kahan|kitna|nahi|haan|karo|kar|ke|ka|ki|mein|me|se|ko|hum|mera|apna|kaam)\b/i.test(q); }
  function rule(q) {
    var s = q.toLowerCase(), hi = isHi(s);
    var t = function (en, h) { return hi ? h : en; };
    if (/^(hi|hello|hey|hii+|namaste|yo)\b/.test(s)) return t('Hello! 👋 What would you like to know about Vikas?', 'Namaste! 👋 Vikas ke baare mein kya jaanna chahte ho?');
    if (/project|portfolio|made|built|banaya/.test(s)) return t("This portfolio is Vikas's first live project (HTML, CSS, JavaScript). More projects are coming soon. Follow his GitHub: " + F.gh, 'Ye portfolio Vikas ka pehla live project hai (HTML, CSS, JavaScript). Aur projects jaldi aa rahe hain. GitHub: ' + F.gh);
    if (/skill|tech|tool|know|can he|aata|language|stack|html|\bc\b|java|python|office|design|edit/.test(s)) return t("Vikas's skills:\n• HTML\n• C Programming\n• Java\n• Python\n• MS Office\n• Graphic Design\n• Photo & Video Editing", 'Vikas ke skills:\n• HTML\n• C Programming\n• Java\n• Python\n• MS Office\n• Graphic Design\n• Photo & Video Editing');
    if (/hire|work|job|freelance|intern|opportunit|kaam/.test(s)) return t('Vikas is open to learning projects, design work and new opportunities. Email: ' + F.mail + ' or LinkedIn: ' + F.li, 'Vikas learning projects, design work aur nayi opportunities ke liye available hai. Email: ' + F.mail + ' ya LinkedIn: ' + F.li);
    if (/mail|email|gmail/.test(s)) return 'Email: ' + F.mail;
    if (/insta|reel/.test(s)) return 'Instagram: ' + F.ig;
    if (/linked/.test(s)) return 'LinkedIn: ' + F.li;
    if (/git/.test(s)) return 'GitHub: ' + F.gh;
    if (/contact|reach|connect|social|sampark|milna/.test(s)) return t('Reach Vikas here:\n• Email: ' + F.mail + '\n• Instagram: ' + F.ig + '\n• LinkedIn: ' + F.li + '\n• GitHub: ' + F.gh, 'Vikas se yahan contact karo:\n• Email: ' + F.mail + '\n• Instagram: ' + F.ig + '\n• LinkedIn: ' + F.li + '\n• GitHub: ' + F.gh);
    if (/who|about|vikas|yourself|kaun|study|bca|student|education|padh/.test(s)) return t('Vikas Kumar is a BCA student and aspiring web developer who also loves creative design. He is learning to build websites and digital experiences through web development, graphic design and photo/video editing.', 'Vikas Kumar BCA ka student hai, aspiring web developer aur creative designer. Wo web development, graphic design aur photo/video editing ke through websites aur digital experiences banana seekh raha hai.');
    if (/thank|thanks|shukriya|dhanyavad/.test(s)) return t("You're welcome! 😊", 'Koi baat nahi! 😊');
    return t('I can help with Vikas\'s skills, projects, background and contact details. Try one of the buttons below!', 'Main Vikas ke skills, projects, background aur contact details bata sakta hoon. Neeche ke buttons try karo!');
  }

  function aiPrompt() {
    var p = 'You are the friendly assistant on the portfolio website of Vikas Kumar. Answer only using these facts, in 1-3 short sentences. If the visitor writes Hinglish (Hindi in Roman letters), reply in Hinglish. If asked something not covered, say you do not know and suggest emailing him.\n\n' +
      'FACTS: Vikas Kumar is a BCA student, aspiring web developer and creative designer. He is learning to build websites and digital experiences through web development, graphic design and photo/video editing. Skills: ' + SK + '. He enjoys learning new tools and turning ideas into practical digital projects. This portfolio (HTML, CSS, JavaScript) is his first live project; more projects are coming soon. Email: ' + F.mail + '. Instagram: ' + F.ig + ' LinkedIn: ' + F.li + ' GitHub: ' + F.gh + '\n\nCONVERSATION:\n';
    history.slice(-8).forEach(function (m) { p += (m.r === 'user' ? 'Visitor: ' : 'Assistant: ') + m.t + '\n'; });
    return p + 'Assistant:';
  }

  function ask(q) {
    if (busy) return;
    busy = true; qr.style.display = 'none';
    add('me', q); history.push({ r: 'user', t: q });
    var ty = document.createElement('div');
    ty.className = 'm bot typing'; ty.innerHTML = '<i></i><i></i><i></i>';
    msgs.appendChild(ty); msgs.scrollTop = msgs.scrollHeight;
    var local = function () { return new Promise(function (res) { setTimeout(function () { res(rule(q)); }, 600 + Math.random() * 500); }); };
    var p = aiSample
      ? aiSample(aiPrompt(), { cache: false }).then(function (r) { return (r && r.text ? r.text.trim() : '') || rule(q); }).catch(function () { aiSample = null; return rule(q); })
      : local();
    p.then(function (ans) { ty.remove(); botSay(ans); busy = false; });
  }
  cf.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = ''; ask(q);
  });
  var quick = { 'Skills': 'What are his skills?', 'About Vikas': 'Who is Vikas?', 'Projects': 'What projects has he made?', 'Contact': 'How can I contact him?', 'Hire': 'Can I hire him?' };
  $$('button', qr).forEach(function (b) { b.addEventListener('click', function () { ask(quick[b.textContent] || b.textContent); }); });

  /* inside claude.ai the assistant can use real AI; everywhere else it uses the built-in answers above */
  try {
    if (window.claude && window.claude.use) {
      window.claude.use('sample').then(function (s) { if (typeof s === 'function') aiSample = s; }).catch(function () {});
    }
  } catch (err) {}
})();
