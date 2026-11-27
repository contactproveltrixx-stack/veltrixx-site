/* Panneau admin avec les comptes (Supabase) : tu te connectes avec TON compte (contact@veltrixx.eu + ton mot de passe).
   Seuls les comptes de la table « admins » voient ce panneau : c'est vérifié par la base de données, pas par le site. */
(function () {
  var VX = window.VX, S = window.VXS;
  if (!VX || !VX.configured) return;
  var root = document.getElementById('admin');
  function esc(s) { return S.esc(s == null ? '' : s); }
  var reviews = [], stats = {}, filter = 'all', tab = /param/.test(location.hash) ? 'params' : 'avis', form = null, dirty = false;
  function tabs() {
    return '<div class="toggle adm-tabs" role="group" aria-label="Section">' +
      [['avis', 'Avis'], ['params', 'Paramètres du site']].map(function (x) { return '<button type="button" data-tab="' + x[0] + '" aria-pressed="' + (tab === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div>';
  }

  function gate() {
    if (!VX.user) { root.innerHTML = '<div class="panel acc-card"><p>Connecte-toi avec ton compte admin.</p><a class="btn btn-blue" href="compte.html?next=admin.html">Se connecter</a></div>'; return false; }
    if (!VX.isAdmin) { root.innerHTML = '<div class="panel acc-card"><p class="msg err">Accès réservé à Veltrixx.</p><a class="btn btn-ghost" href="index.html">Retour au site</a></div>'; return false; }
    return true;
  }
  function stars(n) { var h = ''; for (var i = 1; i <= 5; i++) h += '<span class="' + (i <= n ? 'on' : '') + '">★</span>'; return '<span class="stars">' + h + '</span>'; }
  function render() {
    if (!gate()) return;
    if (tab === 'params') return renderParams();
    var shown = reviews.filter(function (r) { return filter === 'all' || (filter === 'on' ? r.visible : !r.visible); });
    root.innerHTML = tabs() +
      '<div class="adm-bar"><div class="adm-kpis">' +
        '<div><b>' + (stats.members || 0) + '</b><span>membres</span></div>' +
        '<div><b>' + (stats.reviews || 0) + '</b><span>avis</span></div>' +
        '<div><b>' + (stats.hidden || 0) + '</b><span>masqués</span></div>' +
        '<div><b>' + (stats.avg ? String(stats.avg).replace('.', ',') : '–') + '</b><span>note moyenne</span></div>' +
        '<a class="adm-kpi-link" href="messages.html"><b>' + (stats.unread || 0) + '</b><span>messages non lus →</span></a>' +
      '</div><div class="adm-tools">' +
        '<div class="toggle" role="group" aria-label="Filtre">' +
          ['all|Tous', 'on|En ligne', 'off|Masqués'].map(function (x) { x = x.split('|'); return '<button type="button" data-f="' + x[0] + '" aria-pressed="' + (filter === x[0]) + '">' + x[1] + '</button>'; }).join('') +
        '</div><button class="btn btn-ghost btn-sm" type="button" data-refresh>Actualiser</button><a class="btn btn-blue btn-sm" href="messages.html">Messagerie</a>' +
      '</div></div>' +
      '<div class="adm-list">' + (shown.length ? shown.map(function (r) {
        var p = r.profiles || {};
        return '<article class="adm-rv' + (r.visible ? '' : ' off') + '" data-id="' + r.id + '">' +
          '<div class="adm-rv-top">' + stars(r.rating) + '<span class="adm-badge ' + (r.visible ? 'on' : 'off') + '">' + (r.visible ? 'En ligne' : 'Masqué') + '</span><time>' + new Date(r.created_at).toLocaleDateString('fr-FR') + '</time></div>' +
          '<p class="adm-text">' + esc(r.text) + '</p>' +
          '<div class="adm-who">' + VX.pp(p) + ' <b>' + esc(p.display_name || 'Membre') + '</b>' + (r.role ? ' · ' + esc(r.role) : '') +
          (/^https?:\/\//i.test(r.link || '') ? ' · <a href="' + esc(r.link) + '" target="_blank" rel="noopener nofollow">chaîne ↗</a>' : '') +
          ' · <a href="messages.html#' + r.user_id + '">lui écrire</a></div>' +
          '<div class="adm-actions"><button class="btn btn-ghost btn-sm" type="button" data-op="' + (r.visible ? 'hide' : 'show') + '">' + (r.visible ? 'Masquer' : 'Remettre en ligne') + '</button>' +
          '<button class="btn btn-sm adm-del" type="button" data-op="delete">Supprimer</button></div></article>';
      }).join('') : '<p class="rv-empty">Aucun avis ici pour l’instant.</p>') + '</div>';
  }
  /* ---------- Paramètres du site ---------- */
  function info(text, kind) { var p = document.getElementById('sfInfo'); if (p) { p.textContent = text; p.style.color = kind === 'err' ? 'var(--err)' : kind === 'ok' ? 'var(--ok)' : ''; } }
  function renderParams() {
    if (form) return;
    root.innerHTML = tabs() + '<div id="sfRoot"><p class="rv-empty">Chargement des paramètres…</p></div>' +
      '<div class="sf-save"><p id="sfInfo">Les modifications sont enregistrées dans ta base, puis le robot GitHub met le site à jour (environ 10 minutes).</p><button class="btn btn-gold btn-sm" type="button" data-sf-save disabled>Enregistrer</button></div>';
    var base = window.SITE_DATA ? JSON.parse(JSON.stringify(window.SITE_DATA)) : null;
    VX.sb.from('site_settings').select('data, updated_at').eq('id', 1).maybeSingle().then(function (r) {
      var time = function (t) { return Date.parse(String(t || '').replace(/(\.\d{3})\d+/, '$1')) || 0; };
      var row = r.data, pending = row && base && time(row.updated_at) > time(base._maj);
      if (!base && !row) { document.getElementById('sfRoot').innerHTML = '<p class="msg err">Paramètres introuvables (assets/data.js).</p>'; return; }
      var start = pending || !base ? row.data : base;
      form = window.SiteForm.mount(document.getElementById('sfRoot'), start, {
        onChange: function () { dirty = true; var b = root.querySelector('[data-sf-save]'); if (b) b.disabled = false; info('Modifications non enregistrées.'); },
        notify: function (m) { S.say(m); }
      });
      if (r.error && /site_settings/.test(r.error.message || '')) info('La table site_settings n’existe pas encore : lance supabase/schema.sql dans Supabase.', 'err');
      else if (pending) info('Des modifications enregistrées le ' + new Date(row.updated_at).toLocaleString('fr-FR') + ' attendent la mise à jour du site (robot GitHub).');
    });
  }
  function saveParams(b) {
    if (!form) return;
    var data = form.data; b.disabled = true; info('Enregistrement…');
    VX.sb.from('site_settings').upsert({ id: 1, data: data }).select('updated_at').single().then(function (r) {
      if (r.error) { b.disabled = false; info(/site_settings|relation/.test(r.error.message) ? 'La table site_settings n’existe pas encore : lance supabase/schema.sql dans Supabase.' : 'Erreur : ' + r.error.message, 'err'); return; }
      dirty = false; form.set(data);
      info('Enregistré. Le site se met à jour tout seul d’ici 10 minutes environ.', 'ok');
    });
  }
  window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  function load() {
    if (!gate()) return Promise.resolve();
    if (tab === 'params' && form) return Promise.resolve();
    return Promise.all([
      VX.sb.rpc('admin_stats'),
      VX.sb.from('reviews').select('id, user_id, rating, text, role, link, visible, created_at, profiles(display_name, avatar_url)').order('created_at', { ascending: false })
    ]).then(function (r) { stats = r[0].data || {}; reviews = r[1].data || []; render(); });
  }
  root.addEventListener('click', function (e) {
    var tb = e.target.closest('[data-tab]');
    if (tb) {
      if (tb.dataset.tab === tab) return;
      if (tab === 'params' && dirty && !confirm('Quitter sans enregistrer les paramètres ?')) return;
      tab = tb.dataset.tab; form = null; dirty = false; history.replaceState(null, '', tab === 'params' ? '#parametres' : location.pathname);
      if (tab === 'avis') load(); else render();
      return;
    }
    var sv = e.target.closest('[data-sf-save]'); if (sv) { saveParams(sv); return; }
    if (e.target.closest('.sf')) return;
    var f = e.target.closest('[data-f]'); if (f) { filter = f.dataset.f; render(); return; }
    if (e.target.closest('[data-refresh]')) { load().then(function () { S.say('À jour.'); }); return; }
    var b = e.target.closest('[data-op]'); if (!b) return;
    var id = b.closest('[data-id]').dataset.id, op = b.dataset.op;
    if (op === 'delete' && !b.classList.contains('sure')) { b.classList.add('sure'); b.textContent = 'Confirmer la suppression ?'; return; }
    b.disabled = true;
    var q = op === 'delete' ? VX.sb.from('reviews').delete().eq('id', id) : VX.sb.from('reviews').update({ visible: op === 'show' }).eq('id', id);
    q.then(function (r) { if (r.error) { S.say('Erreur : ' + r.error.message); b.disabled = false; return; } S.say(op === 'delete' ? 'Avis supprimé.' : op === 'hide' ? 'Avis masqué.' : 'Avis remis en ligne.'); load(); });
  });
  root.innerHTML = '<p class="rv-empty">Chargement…</p>';
  VX.ready.then(load);
  VX.onChange(load);
})();
