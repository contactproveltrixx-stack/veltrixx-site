/* Page « Avis ».
   Avec les comptes (Supabase) : il faut être connecté, un avis par compte, modifiable et supprimable par son auteur.
   Sans les comptes : ancien système (feuille Google, ME.reviewsApi). Les avis écrits à la main dans REVIEWS (data.js) s'ajoutent. */
(function () {
  var S = window.VXS, VX = window.VX || { configured: false, ready: Promise.resolve() };
  var grid = document.getElementById('reviews'), sum = document.getElementById('rvSum');
  var T = {
    fr: { none: 'Pas encore d’avis : sois le premier à en laisser un !', count: '{n} avis', stars: '{n} sur 5', h: 'Laisser un <span class="b">avis</span>', hEdit: 'Modifier mon <span class="b">avis</span>',
      as: 'Publié en tant que', change: 'changer', live: 'Ton avis s’affiche directement sur le site.', rating: 'Ta note', name: 'Nom ou pseudo', role: 'Qui es-tu ? (facultatif)',
      phRole: 'Ex. Créateur YouTube, structure esport…', link: 'Ta chaîne (facultatif)', email: 'Ton email (facultatif, non publié)', text: 'Ton avis',
      phText: 'Comment s’est passée la collaboration ? Montage, délais, résultats…', send: 'Publier mon avis', update: 'Mettre à jour', cancel: 'Annuler', del: 'Supprimer mon avis', sure: 'Sûr ? Clique encore',
      need: 'Choisis une note et écris ton avis (5 caractères minimum).', needName: 'Choisis une note, ton nom et écris ton avis.', ok: 'Merci ! Ton avis est en ligne.', okUp: 'Avis mis à jour.', deleted: 'Avis supprimé.',
      wait: 'Trop d’avis en même temps : réessaie dans quelques secondes.', err: 'Ça n’a pas marché : ', hidden: 'Ton avis a été masqué par Veltrixx. Tu peux le modifier ou le supprimer.', mine: 'Ton avis', edit: 'Modifier', sending: 'Envoi…' },
    en: { none: 'No reviews yet: be the first to leave one!', count: '{n} reviews', stars: '{n} out of 5', h: 'Leave a <span class="b">review</span>', hEdit: 'Edit my <span class="b">review</span>',
      as: 'Posted as', change: 'change', live: 'Your review shows up on the site right away.', rating: 'Your rating', name: 'Name or handle', role: 'Who are you? (optional)',
      phRole: 'e.g. YouTube creator, esports team…', link: 'Your channel (optional)', email: 'Your email (optional, not published)', text: 'Your review',
      phText: 'How was working together? Editing, deadlines, results…', send: 'Post my review', update: 'Update', cancel: 'Cancel', del: 'Delete my review', sure: 'Sure? Click again',
      need: 'Pick a rating and write your review (5 characters minimum).', needName: 'Pick a rating, add your name and write your review.', ok: 'Thanks! Your review is live.', okUp: 'Review updated.', deleted: 'Review deleted.',
      wait: 'Too many reviews at once: try again in a few seconds.', err: 'That didn’t work: ', hidden: 'Your review was hidden by Veltrixx. You can edit or delete it.', mine: 'Your review', edit: 'Edit', sending: 'Sending…' }
  };
  function t(k) { return (T[S.lang()] || T.fr)[k]; }
  function esc(s) { return S.esc(s == null ? '' : s); }
  var LOCAL = (typeof REVIEWS !== 'undefined' && REVIEWS) || [];
  var API = (typeof ME !== 'undefined' && ME.reviewsApi) || '';
  var list = LOCAL.slice(), mine = null;
  function useAccounts() { return VX.configured; }

  /* ---------- Affichage ---------- */
  function starsHtml(n) { var h = ''; for (var i = 1; i <= 5; i++) h += '<span class="' + (i <= Math.round(n) ? 'on' : '') + '">★</span>'; return '<span class="stars" role="img" aria-label="' + t('stars').replace('{n}', n) + '">' + h + '</span>'; }
  function card(r, own) {
    var d = r.date ? new Date(r.date.length === 10 ? r.date + 'T12:00:00' : r.date).toLocaleDateString(S.loc(), { month: 'long', year: 'numeric' }) : '';
    var who = '<b>' + esc(r.name) + '</b>' + (r.role ? '<small>' + esc(r.role) + '</small>' : '');
    var av = '<span class="rv-av">' + esc(String(r.name || '?').charAt(0).toUpperCase()) + (r.avatar && /^https:\/\//.test(r.avatar) ? '<img src="' + esc(r.avatar) + '" alt="" referrerpolicy="no-referrer" onerror="this.remove()">' : '') + '</span>';
    return '<figure class="rv' + (own ? ' rv-own' : '') + '">' + (own ? '<span class="rv-tag">' + t('mine') + '</span>' : '') + starsHtml(r.rating) + '<blockquote>' + esc(r.text) + '</blockquote>' +
      '<figcaption>' + av + '<span class="rv-who">' + (/^https?:\/\//i.test(r.link || '') ? '<a href="' + esc(r.link) + '" target="_blank" rel="noopener nofollow">' + who + '</a>' : who) + '</span>' +
      (d ? '<time>' + esc(d) + '</time>' : '') + '</figcaption>' + (own ? '<button class="btn btn-ghost btn-sm js-review rv-edit" type="button">' + t('edit') + '</button>' : '') + '</figure>';
  }
  function render() {
    if (!grid) return;
    var all = list.slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    var ownId = mine && mine.id;
    if (!all.length && !mine) { grid.innerHTML = '<p class="rv-empty">' + t('none') + '</p>'; if (sum) sum.innerHTML = ''; return; }
    var vis = all.filter(function (r) { return !r.hidden; });
    if (sum) {
      if (vis.length) { var avg = vis.reduce(function (a, r) { return a + Number(r.rating || 0); }, 0) / vis.length;
        sum.innerHTML = '<b>' + avg.toFixed(1).replace('.', S.lang() === 'en' ? '.' : ',') + '</b>' + starsHtml(avg) + '<span>' + t('count').replace('{n}', vis.length) + '</span>'; }
      else sum.innerHTML = '';
    }
    var own = mine ? card(mine, true) + (mine.hidden ? '<p class="rv-note">' + t('hidden') + '</p>' : '') : '';
    grid.innerHTML = (own ? '<div class="rv-ownwrap">' + own + '</div>' : '') + vis.filter(function (r) { return r.id !== ownId; }).map(function (r) { return card(r, false); }).join('');
  }

  /* ---------- Chargement ---------- */
  function load() {
    if (useAccounts()) {
      return VX.sb.from('reviews').select('id, user_id, rating, text, role, link, visible, created_at, profiles(display_name, avatar_url)').order('created_at', { ascending: false }).limit(300)
        .then(function (r) {
          var rows = (r.data || []).map(function (x) {
            return { id: x.id, user_id: x.user_id, rating: x.rating, text: x.text, role: x.role, link: x.link, date: x.created_at, hidden: !x.visible,
              name: (x.profiles && x.profiles.display_name) || 'Membre', avatar: x.profiles && x.profiles.avatar_url };
          });
          mine = VX.user ? rows.filter(function (x) { return x.user_id === VX.user.id; })[0] || null : null;
          list = LOCAL.concat(rows.filter(function (x) { return !x.hidden; }));
          render();
        });
    }
    if (!API) { render(); return Promise.resolve(); }
    return fetch(API + (API.indexOf('?') < 0 ? '?' : '&') + 't=' + Date.now()).then(function (r) { return r.json(); }).then(function (rows) {
      if (Array.isArray(rows)) list = LOCAL.concat(rows.filter(function (r) { return r && r.rating && r.name && r.text; }));
      render();
    }).catch(render);
  }

  /* ---------- Fenêtre ---------- */
  var dlg = document.createElement('dialog'); dlg.className = 'rv-dlg'; dlg.setAttribute('aria-labelledby', 'rvT');
  document.body.appendChild(dlg);
  function field(id, label, input) { return '<div class="field"><label for="' + id + '">' + label + '</label>' + input + '</div>'; }
  function buildForm() {
    var acc = useAccounts(), m = mine || {};
    var rate = [5, 4, 3, 2, 1].map(function (n) { return '<input type="radio" name="rating" id="rv' + n + '" value="' + n + '"' + (m.rating === n ? ' checked' : '') + '><label for="rv' + n + '" title="' + n + '/5">★</label>'; }).join('');
    dlg.innerHTML = '<form class="rv-form" novalidate>' +
      '<div class="rv-top"><h2 class="h" id="rvT">' + (mine ? t('hEdit') : t('h')) + '</h2><button class="rv-x" type="button" data-close aria-label="' + t('cancel') + '">✕</button></div>' +
      (acc ? '<p class="rv-lead">' + t('as') + ' <b>' + esc(VX.profile && VX.profile.display_name) + '</b> · <a href="compte.html">' + t('change') + '</a></p>' : '<p class="rv-lead">' + t('live') + '</p>') +
      '<fieldset class="rv-rate"><legend>' + t('rating') + '</legend><div class="rv-pick">' + rate + '</div></fieldset>' +
      '<div class="form">' +
      (acc ? '' : field('rv-name', t('name'), '<input id="rv-name" name="name" maxlength="40" autocomplete="nickname">')) +
      field('rv-role', t('role'), '<input id="rv-role" name="role" maxlength="50" placeholder="' + t('phRole') + '" value="' + esc(m.role || '') + '">') +
      field('rv-link', t('link'), '<input id="rv-link" name="link" type="url" inputmode="url" placeholder="https://youtube.com/@…" value="' + esc(m.link || '') + '">') +
      (acc ? '' : field('rv-email', t('email'), '<input id="rv-email" name="email" type="email" autocomplete="email" placeholder="nom@exemple.com">')) +
      '<div class="field full"><label for="rv-text">' + t('text') + '</label><textarea id="rv-text" name="text" maxlength="600" placeholder="' + t('phText') + '">' + esc(m.text || '') + '</textarea></div>' +
      '<div class="hp" aria-hidden="true"><input name="_honey" tabindex="-1" autocomplete="off"></div>' +
      '<div class="form-end"><p class="msg" role="status" hidden></p><span style="display:flex;gap:10px;margin-left:auto;flex-wrap:wrap">' +
      (mine ? '<button class="btn btn-sm adm-del" type="button" data-delete>' + t('del') + '</button>' : '') +
      '<button class="btn btn-ghost" type="button" data-close>' + t('cancel') + '</button>' +
      '<button class="btn btn-gold" type="submit">' + (mine ? t('update') : t('send')) + ' ★</button></span></div>' +
      '</div></form>';
  }
  function open() {
    if (useAccounts() && !VX.user) { location.href = 'compte.html?next=' + encodeURIComponent('avis.html#laisser-un-avis'); return; }
    buildForm();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function msg(type, text) { var m = dlg.querySelector('.msg'); m.className = 'msg ' + type; m.textContent = text; m.hidden = false; }
  document.addEventListener('click', function (e) { if (e.target.closest('.js-review')) { e.preventDefault(); VX.ready.then(open); } });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target.closest('[data-close]')) { dlg.close(); return; }
    var d = e.target.closest('[data-delete]');
    if (d) {
      if (!d.classList.contains('sure')) { d.classList.add('sure'); d.textContent = t('sure'); return; }
      VX.sb.from('reviews').delete().eq('id', mine.id).then(function (r) {
        if (r.error) { msg('err', t('err') + r.error.message); return; }
        mine = null; dlg.close(); S.say(t('deleted')); load();
      });
    }
  });
  dlg.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, d = Object.fromEntries(new FormData(f).entries()), btn = f.querySelector('button[type=submit]');
    if (d._honey) return;
    var text = (d.text || '').trim(), role = (d.role || '').trim(), link = (d.link || '').trim();
    if (link && !/^https?:\/\/[^\s"<>]+$/i.test(link)) link = '';
    var label = btn.innerHTML; btn.disabled = true; btn.textContent = t('sending');
    function end() { btn.disabled = false; btn.innerHTML = label; }
    if (useAccounts()) {
      if (!d.rating || text.length < 5) { msg('err', t('need')); end(); return; }
      var row = { rating: Number(d.rating), text: text, role: role || null, link: link || null };
      var q = mine ? VX.sb.from('reviews').update(row).eq('id', mine.id) : VX.sb.from('reviews').insert(Object.assign({ user_id: VX.user.id }, row));
      q.then(function (r) {
        end();
        if (r.error) { msg('err', t('err') + r.error.message); return; }
        var was = !!mine; dlg.close(); S.say(was ? t('okUp') : t('ok')); load().then(function () { grid.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      });
      return;
    }
    // Ancien système : feuille Google
    if (!d.rating || !(d.name || '').trim() || text.length < 5) { msg('err', t('needName')); end(); return; }
    fetch(API, { method: 'POST', body: JSON.stringify({ rating: Number(d.rating), name: d.name.trim(), role: role, link: link, email: d.email, text: text, _honey: d._honey }) })
      .then(function (r) { return r.json(); }).then(function (res) {
        end();
        if (!res.ok) { msg('err', res.error === 'wait' ? t('wait') : t('needName')); return; }
        dlg.close(); S.say(t('ok')); setTimeout(load, 1200);
      }).catch(function (er) { end(); msg('err', t('err') + er.message); });
  });

  document.addEventListener('vx:lang', render);
  VX.ready.then(function () {
    load();
    if (VX.onChange) VX.onChange(function () { load(); });
    if (location.hash === '#laisser-un-avis') { history.replaceState(null, '', location.pathname); setTimeout(open, 200); }
  });
})();
