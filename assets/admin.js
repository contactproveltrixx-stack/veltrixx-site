/* Panneau admin des avis (admin.html). Le mot de passe est vérifié par le script Google, jamais stocké dans le site.
   Il reste en mémoire seulement pendant que l'onglet est ouvert. */
(function () {
  if (window.VX && VX.configured) return; // les comptes sont actifs : c'est admin-comptes.js qui gère
  var API = (typeof ME !== 'undefined' && ME.reviewsApi) || '';
  var $ = function (id) { return document.getElementById(id); };
  var login = $('admLogin'), board = $('admBoard'), pass = '', data = [], filter = 'all';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function msg(el, type, text) { el.className = 'msg ' + type; el.textContent = text; el.hidden = !text; }
  var ERR = {
    password: 'Mot de passe incorrect.', nopass: 'Choisis d’abord ton mot de passe : script Google > Paramètres du projet > Propriétés du script > ADMIN_PASSWORD.',
    locked: 'Trop d’essais : réessaie dans 15 minutes.', notfound: 'Cet avis n’existe plus (actualise).', net: 'Connexion au script Google impossible.'
  };
  try { pass = sessionStorage.getItem('vx-admin') || ''; } catch (e) {}

  if (!API) {
    login.innerHTML = '<p class="msg err">Le site n’est pas encore relié à la feuille Google des avis (ME.reviewsApi vide dans assets/data.js).</p>';
    return;
  }
  function call(body) {
    return fetch(API, { method: 'POST', body: JSON.stringify(Object.assign({ action: 'admin', password: pass }, body)) })
      .then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, error: 'net' }; });
  }
  function enter(res) {
    data = res.reviews || [];
    login.hidden = true; board.hidden = false;
    if (res.sheet) { $('admSheet').href = res.sheet; $('admSheet').hidden = false; }
    render();
  }
  login.addEventListener('submit', function (e) {
    e.preventDefault();
    pass = $('adm-pass').value;
    var b = login.querySelector('button'); b.disabled = true; b.textContent = 'Connexion…';
    call({ op: 'list' }).then(function (res) {
      b.disabled = false; b.textContent = 'Se connecter';
      if (!res.ok) { msg($('admLoginMsg'), 'err', ERR[res.error] || 'Erreur.'); return; }
      try { sessionStorage.setItem('vx-admin', pass); } catch (er) {}
      enter(res);
    });
  });
  if (pass) call({ op: 'list' }).then(function (res) { if (res.ok) enter(res); else pass = ''; });

  function stars(n) { var h = ''; for (var i = 1; i <= 5; i++) h += '<span class="' + (i <= n ? 'on' : '') + '">★</span>'; return '<span class="stars">' + h + '</span>'; }
  function render() {
    var on = data.filter(function (r) { return r.visible; });
    var avg = on.length ? on.reduce(function (a, r) { return a + r.rating; }, 0) / on.length : 0;
    $('admKpis').innerHTML =
      '<div><b>' + data.length + '</b><span>avis au total</span></div>' +
      '<div><b>' + on.length + '</b><span>en ligne</span></div>' +
      '<div><b>' + (data.length - on.length) + '</b><span>masqués</span></div>' +
      '<div><b>' + (on.length ? avg.toFixed(1).replace('.', ',') : '–') + '</b><span>note moyenne</span></div>';
    var list = data.filter(function (r) { return filter === 'all' || (filter === 'on' ? r.visible : !r.visible); })
      .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    $('admList').innerHTML = list.length ? list.map(function (r) {
      return '<article class="adm-rv' + (r.visible ? '' : ' off') + '" data-id="' + esc(r.id) + '">' +
        '<div class="adm-rv-top">' + stars(r.rating) + '<span class="adm-badge ' + (r.visible ? 'on' : 'off') + '">' + (r.visible ? 'En ligne' : 'Masqué') + '</span><time>' + esc(r.date) + '</time></div>' +
        '<p class="adm-text">' + esc(r.text) + '</p>' +
        '<div class="adm-who"><b>' + esc(r.name) + '</b>' + (r.role ? ' · ' + esc(r.role) : '') +
        (/^https?:\/\//i.test(r.link) ? ' · <a href="' + esc(r.link) + '" target="_blank" rel="noopener nofollow">chaîne ↗</a>' : '') +
        (r.email ? ' · <a href="mailto:' + esc(r.email) + '">' + esc(r.email) + '</a>' : '') + '</div>' +
        '<div class="adm-actions">' +
        '<button class="btn btn-ghost btn-sm" type="button" data-op="' + (r.visible ? 'hide' : 'show') + '">' + (r.visible ? 'Masquer' : 'Remettre en ligne') + '</button>' +
        '<button class="btn btn-sm adm-del" type="button" data-op="delete">Supprimer</button></div></article>';
    }).join('') : '<p class="rv-empty">Aucun avis ici pour l’instant.</p>';
  }
  $('admList').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-op]'); if (!b) return;
    var op = b.dataset.op, id = b.closest('[data-id]').dataset.id;
    if (op === 'delete' && !b.classList.contains('sure')) { b.classList.add('sure'); b.textContent = 'Confirmer la suppression ?'; setTimeout(function () { if (b.isConnected) { b.classList.remove('sure'); b.textContent = 'Supprimer'; } }, 4000); return; }
    b.disabled = true; b.textContent = '…';
    call({ op: op, id: id }).then(function (res) {
      if (!res.ok) { msg($('admMsg'), 'err', ERR[res.error] || 'Erreur.'); b.disabled = false; return; }
      msg($('admMsg'), 'ok', op === 'delete' ? 'Avis supprimé.' : op === 'hide' ? 'Avis masqué : il n’apparaît plus sur le site.' : 'Avis remis en ligne.');
      enter(res);
    });
  });
  $('admFilter').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-f]'); if (!b) return;
    filter = b.dataset.f;
    this.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    render();
  });
  $('admRefresh').addEventListener('click', function () { call({ op: 'list' }).then(function (res) { if (res.ok) { enter(res); msg($('admMsg'), 'ok', 'À jour.'); } else msg($('admMsg'), 'err', ERR[res.error] || 'Erreur.'); }); });
  $('admLogout').addEventListener('click', function () { pass = ''; try { sessionStorage.removeItem('vx-admin'); } catch (e) {} location.reload(); });
})();
