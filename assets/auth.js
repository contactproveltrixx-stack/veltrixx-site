/* Comptes Veltrixx (Supabase) : connexion, bouton « SE CONNECTER » / menu du compte, badge des messages non lus.
   Les pages (compte, messages, avis, admin) attendent window.VX.ready.
   Configuration : SUPABASE.url et SUPABASE.anonKey dans assets/data.js (clé publique, faite pour être dans le site). */
(function () {
  var CFG = (typeof SUPABASE !== 'undefined' && SUPABASE) || {};
  var S = window.VXS;
  var T = {
    fr: { login: 'Se connecter', account: 'Mon compte', messages: 'Messages', admin: 'Panneau admin', logout: 'Déconnexion', review: 'Mon avis', bye: 'Tu es déconnecté.' },
    en: { login: 'Sign in', account: 'My account', messages: 'Messages', admin: 'Admin panel', logout: 'Sign out', review: 'My review', bye: 'You are signed out.' }
  };
  function t(k) { return (T[S.lang()] || T.fr)[k]; }

  var VX = window.VX = { configured: !!(CFG.url && CFG.anonKey), sb: null, user: null, profile: null, isAdmin: false, unread: 0, t: t };
  var listeners = [];
  VX.onChange = function (cb) { listeners.push(cb); };
  function emit() { listeners.forEach(function (cb) { try { cb(VX); } catch (e) { console.error(e); } }); renderMenu(); }

  /* ---------- Bouton / menu dans l'en-tête ---------- */
  var tools = document.querySelector('header.top .tools');
  var box = document.createElement('div'); box.className = 'acct';
  if (tools) tools.insertBefore(box, tools.querySelector('.contact-btn'));
  function pp(p, cls) {
    var name = (p && p.display_name) || '?';
    return '<span class="acct-av ' + (cls || '') + '"><span>' + S.esc(name.charAt(0).toUpperCase()) + '</span>' +
      (p && p.avatar_url ? '<img src="' + S.esc(p.avatar_url) + '" alt="" referrerpolicy="no-referrer" onerror="this.remove()">' : '') + '</span>';
  }
  VX.pp = pp;
  function renderMenu() {
    if (!box) return;
    if (VX.configured && !VX.loaded) { box.innerHTML = ''; return; }
    if (!VX.user) { box.innerHTML = '<a class="btn btn-ghost btn-sm acct-login" href="compte.html" aria-label="' + t('login') + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5z"/></svg><span>' + t('login') + '</span></a>'; return; }
    var badge = VX.unread ? '<span class="acct-badge">' + (VX.unread > 9 ? '9+' : VX.unread) + '</span>' : '';
    box.innerHTML = '<button class="acct-btn" type="button" aria-haspopup="true" aria-expanded="false">' + pp(VX.profile) + '<span class="acct-name">' + S.esc(VX.profile.display_name) + '</span>' + badge + '</button>' +
      '<div class="acct-menu" hidden>' +
        '<a href="compte.html">' + t('account') + '</a>' +
        '<a href="messages.html">' + t('messages') + (VX.unread ? ' <b>' + VX.unread + '</b>' : '') + '</a>' +
        '<a href="avis.html#laisser-un-avis">' + t('review') + '</a>' +
        (VX.isAdmin ? '<a href="admin.html" class="acct-admin">' + t('admin') + '</a>' : '') +
        '<button type="button" data-out>' + t('logout') + '</button>' +
      '</div>';
  }
  box.addEventListener('click', function (e) {
    var btn = e.target.closest('.acct-btn'), menu = box.querySelector('.acct-menu');
    if (btn && menu) { var o = menu.hidden; menu.hidden = !o; btn.setAttribute('aria-expanded', o ? 'true' : 'false'); }
    if (e.target.closest('[data-out]')) VX.signOut();
  });
  document.addEventListener('click', function (e) { if (!box.contains(e.target)) { var m = box.querySelector('.acct-menu'); if (m) m.hidden = true; } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { var m = box.querySelector('.acct-menu'); if (m) m.hidden = true; } });
  document.addEventListener('vx:lang', renderMenu);
  renderMenu();

  if (!VX.configured) { box.innerHTML = ''; VX.ready = Promise.resolve(VX); return; }
  // La bibliothèque Supabase n'est chargée que si les comptes sont activés
  VX.ready = new Promise(function (ok) {
    var sc = document.createElement('script');
    sc.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
    sc.onload = function () { init().then(ok, function (e) { console.error(e); ok(VX); }); };
    sc.onerror = function () { VX.configured = false; renderMenu(); ok(VX); };
    document.head.appendChild(sc);
  });
  var sb;
  function init() {
  sb = VX.sb = supabase.createClient(CFG.url, CFG.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' } });
  VX.redirect = function (page) { return location.origin + location.pathname.replace(/[^/]*$/, '') + (page || 'compte.html'); };

  function loadUser(session) {
    VX.user = session ? session.user : null;
    if (!VX.user) { VX.profile = null; VX.isAdmin = false; VX.unread = 0; return Promise.resolve(); }
    return Promise.all([
      sb.from('profiles').select('id, display_name, avatar_url').eq('id', VX.user.id).maybeSingle(),
      sb.rpc('is_admin')
    ]).then(function (r) {
      VX.profile = r[0].data || { id: VX.user.id, display_name: (VX.user.email || 'Membre').split('@')[0], avatar_url: null };
      VX.isAdmin = r[1].data === true;
      return refreshUnread();
    });
  }
  function refreshUnread() {
    if (!VX.user) return Promise.resolve();
    var q = VX.isAdmin
      ? sb.rpc('admin_stats').then(function (r) { VX.unread = (r.data && r.data.unread) || 0; })
      : sb.from('messages').select('id', { count: 'exact', head: true }).eq('thread_id', VX.user.id).neq('sender_id', VX.user.id).is('read_at', null)
        .then(function (r) { VX.unread = r.count || 0; });
    return q.then(renderMenu);
  }
  VX.refreshUnread = refreshUnread;

  // Badge en direct : nouveau message => on recompte
  var live = null;
  function watch() {
    if (live) { sb.removeChannel(live); live = null; }
    if (!VX.user) return;
    var opts = { event: '*', schema: 'public', table: 'messages' };
    if (!VX.isAdmin) opts.filter = 'thread_id=eq.' + VX.user.id;
    live = sb.channel('badge-' + VX.user.id).on('postgres_changes', opts, function () { refreshUnread(); }).subscribe();
  }

  var first = true;
  sb.auth.onAuthStateChange(function (event, session) {
    if (first && event === 'INITIAL_SESSION') { first = false; return; }
    if (event === 'TOKEN_REFRESHED') return;
    VX.lastEvent = event;
    setTimeout(function () { loadUser(session).then(function () { watch(); emit(); }); }, 0);
  });
  VX.signOut = function () { return sb.auth.signOut().then(function () { S.say(t('bye')); if (/messages|admin/.test(location.pathname)) location.href = 'index.html'; }); };
  return sb.auth.getSession().then(function (r) { return loadUser(r.data.session); }).then(function () { VX.loaded = true; watch(); emit(); return VX; });
  }

})();
