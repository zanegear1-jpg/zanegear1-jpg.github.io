/* Kiwi Life Guides: tiny progressive enhancements (no dependencies) */
(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');

  // Reading progress fallback for browsers without scroll-driven animations
  var bar = d.querySelector('.progress span');
  if (bar && !(window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()'))) {
    var upd = function () {
      var h = root.scrollHeight - root.clientHeight;
      bar.style.setProperty('--p', h > 0 ? (root.scrollTop || d.body.scrollTop) / h : 0);
    };
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  // Sticky "get the pack" bar: show once the reader is past the hero, hide near the final CTA
  var sticky = d.querySelector('.sticky-bar'), hero = d.querySelector('.article-hero'), endCta = d.querySelector('.cta-end');
  if (sticky && hero && 'IntersectionObserver' in window) {
    var heroVisible = true, endVisible = false;
    var set = function () { sticky.classList.toggle('is-hidden', heroVisible || endVisible); };
    sticky.classList.add('is-hidden');
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; set(); }).observe(hero);
    if (endCta) new IntersectionObserver(function (e) { endVisible = e[0].isIntersecting; set(); }).observe(endCta);
  }

  // Checklists: remember ticks on this device, plus print / reset buttons
  d.querySelectorAll('.freebie').forEach(function (box, bi) {
    var key = 'klg:' + location.pathname + ':' + bi;
    var boxes = box.querySelectorAll('input[type=checkbox]');
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
    boxes.forEach(function (c, i) {
      if (saved[i]) c.checked = true;
      c.addEventListener('change', function () {
        saved[i] = c.checked;
        try { localStorage.setItem(key, JSON.stringify(saved)); } catch (e) {}
        count();
      });
    });
    var tools = d.createElement('div'); tools.className = 'freebie-tools';
    var status = d.createElement('span'); status.setAttribute('aria-live', 'polite');
    var pr = d.createElement('button'); pr.type = 'button'; pr.textContent = 'Print checklist';
    pr.onclick = function () { window.print(); };
    var rs = d.createElement('button'); rs.type = 'button'; rs.textContent = 'Reset';
    rs.onclick = function () { boxes.forEach(function (c) { c.checked = false; }); saved = {}; try { localStorage.removeItem(key); } catch (e) {} count(); };
    function count() { var n = 0; boxes.forEach(function (c) { if (c.checked) n++; }); status.textContent = n + ' of ' + boxes.length + ' ticked (saved on this device)'; }
    tools.appendChild(pr); tools.appendChild(rs); tools.appendChild(status); box.appendChild(tools); count();
  });
})();
