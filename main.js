/* Vikas Kumar portfolio: vanilla JS, no dependencies. */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function icon(name, cls) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'icon' + (cls ? ' ' + cls : ''));
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS(ns, 'use');
    use.setAttribute('href', '#i-' + name);
    svg.appendChild(use);
    return svg;
  }
  function isHttps(u) { return typeof u === 'string' && /^https?:\/\//i.test(u.trim()); }
  function isEmail(u) { return typeof u === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.trim()); }
  function prettyUrl(u) { return u.replace(/^https?:\/\/(www\.)?/i, '').replace(/[?#].*$/, '').replace(/\/$/, ''); }

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- resume button (only when a file is configured) ---------- */
  var slot = document.getElementById('resume-slot');
  if (slot && typeof CFG.resume === 'string' && CFG.resume.trim()) {
    var r = el('a', 'btn btn-ghost');
    r.href = CFG.resume.trim();
    r.setAttribute('download', '');
    r.appendChild(document.createTextNode('Download Resume'));
    r.appendChild(icon('download'));
    slot.replaceWith(r);
  } else if (slot) {
    slot.remove();
  }

  /* ---------- contact links ---------- */
  var contactList = document.getElementById('contact-list');
  if (contactList) {
    var channels = [
      { key: 'email',     label: 'Email',     icon: 'mail',      empty: 'Add your email' },
      { key: 'instagram', label: 'Instagram', icon: 'instagram', empty: 'Add your profile link' },
      { key: 'linkedin',  label: 'LinkedIn',  icon: 'linkedin',  empty: 'Add your profile link' },
      { key: 'github',    label: 'GitHub',    icon: 'github',    empty: 'Add your profile link' }
    ];
    channels.forEach(function (c, i) {
      var val = (CFG[c.key] || '').trim();
      var ok = c.key === 'email' ? isEmail(val) : isHttps(val);
      var li = el('li');
      li.style.setProperty('--d', (i * 60) + 'ms');
      var node;
      if (ok) {
        node = el('a', 'contact-link');
        if (c.key === 'email') {
          node.href = 'mailto:' + val;
        } else {
          node.href = val;
          node.target = '_blank';
          node.rel = 'noopener noreferrer';
        }
      } else {
        /* only links with a missing URL get this handler */
        node = el('button', 'contact-link is-empty');
        node.type = 'button';
        node.setAttribute('data-placeholder-link', c.key);
      }
      var lead = el('span', 'contact-icon');
      lead.appendChild(icon(c.icon));
      var txt = el('span', 'contact-text');
      txt.appendChild(el('strong', null, c.label));
      txt.appendChild(el('span', null, ok ? (c.key === 'email' ? val : prettyUrl(val)) : c.empty));
      node.appendChild(lead);
      node.appendChild(txt);
      if (ok) {
        node.appendChild(icon(c.key === 'email' ? 'arrow-right' : 'external', 'contact-go'));
        node.setAttribute('aria-label', c.label + (c.key === 'email' ? ': ' + val : ' (opens in a new tab)'));
      } else {
        node.appendChild(el('span', 'tag tag-placeholder', 'Not added yet'));
      }
      li.appendChild(node);
      contactList.appendChild(li);
    });

    contactList.addEventListener('click', function (e) {
      var b = e.target.closest('[data-placeholder-link]');
      if (b) toast('The ' + b.getAttribute('data-placeholder-link') + ' link isn\'t added yet.');
    });
  }

  /* ---------- project cards ---------- */
  var grid = document.getElementById('projects-grid');
  if (grid && Array.isArray(CFG.projects)) {
    CFG.projects.forEach(function (p, i) {
      var hasLink = isHttps(p.link);
      var card = el('article', 'project reveal' + (hasLink ? ' has-link' : ''));
      card.style.setProperty('--d', ((i % 2) * 80) + 'ms');

      var thumb = el('div', 'project-thumb');
      if (p.image) {
        var img = el('img');
        var useFallback = function () {
          if (img.parentNode) img.remove();
          if (!thumb.classList.contains('is-fallback')) {
            thumb.classList.add('is-fallback');
            thumb.insertBefore(icon(p.icon || 'image', 'thumb-icon'), thumb.firstChild);
          }
        };
        img.addEventListener('error', useFallback);
        img.alt = p.title + ' thumbnail';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = p.image;
        thumb.appendChild(img);
      } else {
        thumb.classList.add('is-fallback');
        thumb.appendChild(icon(p.icon || 'image', 'thumb-icon'));
      }
      if (p.placeholder) thumb.appendChild(el('span', 'tag tag-placeholder thumb-badge', 'Placeholder'));
      card.appendChild(thumb);

      var body = el('div', 'project-body');
      var h = el('h3');
      if (hasLink) {
        var a = el('a', 'project-link', p.title);
        a.href = p.link.trim();
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.appendChild(icon('external'));
        a.setAttribute('aria-label', p.title + ' (opens in a new tab)');
        h.appendChild(a);
      } else {
        h.textContent = p.title;
      }
      body.appendChild(h);
      body.appendChild(el('p', null, p.description || ''));
      if (Array.isArray(p.tags) && p.tags.length) {
        var ul = el('ul', 'chips');
        p.tags.forEach(function (t) { ul.appendChild(el('li', null, t)); });
        body.appendChild(ul);
      }
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  /* ---------- small toast (used by placeholder links) ---------- */
  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = el('div', 'toast');
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  /* ---------- typed role line ---------- */
  var typedEl = document.getElementById('typed-word');
  if (typedEl && !reduceMotion) {
    var words = ['Graphic Designer', 'Photo Editor', 'Video Editing Learner', 'Web Dev in the making'];
    var wi = 0, ci = words[0].length, deleting = true;
    (function tick() {
      var w = words[wi];
      if (deleting) { ci--; } else { ci++; }
      typedEl.textContent = w.slice(0, ci);
      var delay = deleting ? 38 : 80;
      if (!deleting && ci === w.length) { delay = 1700; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 350; }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- scroll progress bar ---------- */
  var bar = document.querySelector('.progress');
  var ticking = false;
  function updateBar() {
    ticking = false;
    if (!bar) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(updateBar); } }, { passive: true });
  updateBar();

  /* ---------- mobile menu ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    if (!toggle || !header) return;
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('no-scroll', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) {
      if (m.matches) setMenu(false);
    });
  }

  /* ---------- header shadow on scroll ---------- */
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- active section highlight ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var targets = links
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (l) {
      var on = l.getAttribute('href') === '#' + id;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window && targets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    targets.forEach(function (t) { spy.observe(t); });
  }
  setActive('home');

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach(function (n) { n.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(function (n) { io.observe(n); });
  }
})();
