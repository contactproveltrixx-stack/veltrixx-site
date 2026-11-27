/* Veltrixx — animations : le titre de l'accueil apparaît mot par mot.
   (Les apparitions au scroll, les chiffres qui défilent et les courbes qui se dessinent sont dans site.js.)
   Tout est coupé si le système demande moins d'animations. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Titre mot par mot ---------- */
  var h1 = !reduce && document.querySelector('.hero h1.h');
  if (h1) {
    var n = 0;
    var split = function (node, into) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { into.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span'); w.className = 'w';
            var s = document.createElement('span'); s.textContent = part; s.style.setProperty('--i', n++);
            w.appendChild(s); into.appendChild(w);
          });
        } else if (c.nodeType === 1 && c.tagName !== 'BR') {
          var copy = c.cloneNode(false); split(c, copy); into.appendChild(copy);
        } else into.appendChild(c.cloneNode(true));
      });
    };
    var frag = document.createDocumentFragment(); split(h1, frag);
    h1.innerHTML = ''; h1.appendChild(frag); h1.classList.add('words'); h1.classList.remove('rise');
  }
})();
