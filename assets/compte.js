/* Page « Mon compte » : connexion, inscription, Google, Discord, mot de passe oublié, profil, suppression du compte. */
(function () {
  var S = window.VXS, VX = window.VX, root = document.getElementById('account');
  var T = {
    fr: {
      off: 'Les comptes ne sont pas encore activés sur le site.', loginTab: 'Connexion', signupTab: 'Créer un compte',
      google: 'Continuer avec Google', discord: 'Continuer avec Discord', or: 'ou avec ton email',
      email: 'Email', pass: 'Mot de passe', pass8: 'Mot de passe (8 caractères minimum)', name: 'Pseudo', login: 'Se connecter', signup: 'Créer mon compte',
      forgot: 'Mot de passe oublié ?', sendReset: 'Envoyer le lien', back: 'Retour',
      resetSent: 'Si un compte existe avec cet email, tu vas recevoir un lien pour choisir un nouveau mot de passe.',
      checkMail: 'Compte créé ! Clique sur le lien reçu par email pour l’activer, puis connecte-toi.',
      newPass: 'Choisis ton nouveau mot de passe', savePass: 'Enregistrer', passSaved: 'Mot de passe changé.',
      legal: 'En créant un compte, tu acceptes la <a href="confidentialite.html">politique de confidentialité</a>.',
      hello: 'Salut', member: 'Membre depuis', profile: 'Mon profil', avatar: 'Photo de profil (lien https, facultatif)', save: 'Enregistrer', saved: 'Profil enregistré.',
      goMsg: 'Écrire à Veltrixx', goReview: 'Mon avis', goAdmin: 'Panneau admin', logout: 'Se déconnecter',
      security: 'Sécurité', changePass: 'Changer mon mot de passe', danger: 'Supprimer mon compte',
      dangerTxt: 'Ton compte, ton avis et tes messages seront effacés définitivement. Tape SUPPRIMER pour confirmer.',
      delete: 'Supprimer définitivement', deleted: 'Ton compte a été supprimé.',
      errs: { 'Invalid login credentials': 'Email ou mot de passe incorrect.', 'Email not confirmed': 'Confirme d’abord ton email (regarde tes mails, et les spams).',
        'User already registered': 'Un compte existe déjà avec cet email : connecte-toi.', 'Password should be at least': 'Le mot de passe doit faire au moins 8 caractères.',
        'rate limit': 'Trop d’essais : réessaie dans quelques minutes.', 'Unable to validate email address': 'Cet email n’est pas valide.' },
      err: 'Erreur : ', need: 'Remplis tous les champs.', show: 'Afficher le mot de passe', hide: 'Masquer le mot de passe'
    },
    en: {
      off: 'Accounts are not enabled on the site yet.', loginTab: 'Sign in', signupTab: 'Create an account',
      google: 'Continue with Google', discord: 'Continue with Discord', or: 'or with your email',
      email: 'Email', pass: 'Password', pass8: 'Password (8 characters minimum)', name: 'Username', login: 'Sign in', signup: 'Create my account',
      forgot: 'Forgot your password?', sendReset: 'Send the link', back: 'Back',
      resetSent: 'If an account exists with this email, you will get a link to choose a new password.',
      checkMail: 'Account created! Click the link in the email we sent to activate it, then sign in.',
      newPass: 'Choose your new password', savePass: 'Save', passSaved: 'Password changed.',
      legal: 'By creating an account, you accept the <a href="confidentialite.html">privacy policy</a>.',
      hello: 'Hi', member: 'Member since', profile: 'My profile', avatar: 'Profile picture (https link, optional)', save: 'Save', saved: 'Profile saved.',
      goMsg: 'Message Veltrixx', goReview: 'My review', goAdmin: 'Admin panel', logout: 'Sign out',
      security: 'Security', changePass: 'Change my password', danger: 'Delete my account',
      dangerTxt: 'Your account, review and messages will be permanently deleted. Type SUPPRIMER to confirm.',
      delete: 'Delete permanently', deleted: 'Your account has been deleted.',
      errs: { 'Invalid login credentials': 'Wrong email or password.', 'Email not confirmed': 'Please confirm your email first (check your inbox and spam).',
        'User already registered': 'An account already exists with this email: sign in.', 'Password should be at least': 'Password must be at least 8 characters.',
        'rate limit': 'Too many attempts: try again in a few minutes.', 'Unable to validate email address': 'This email is not valid.' },
      err: 'Error: ', need: 'Please fill in every field.', show: 'Show password', hide: 'Hide password'
    }
  };
  function t(k) { return (T[S.lang()] || T.fr)[k]; }
  function errText(e) {
    var m = (e && e.message) || String(e), map = t('errs');
    for (var k in map) if (m.indexOf(k) >= 0) return map[k];
    return t('err') + m;
  }
  function esc(s) { return S.esc(s == null ? '' : s); }
  var mode = 'login', recovering = false;
  var next = new URLSearchParams(location.search).get('next');
  if (next && !/^[a-z0-9-]+\.html(#[a-z0-9-]+)?$/i.test(next)) next = null; // seulement une page du site

  function msg(type, text) { var m = root.querySelector('.msg'); if (!m) return; m.className = 'msg ' + type; m.textContent = text; m.hidden = !text; }
  function busy(btn, on) { if (!btn) return; btn.disabled = on; if (on) { btn.dataset.l = btn.innerHTML; btn.textContent = '…'; } else if (btn.dataset.l) btn.innerHTML = btn.dataset.l; }

  var ICON_G = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  var ICON_D = '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M13.5 3.2A12 12 0 0010.6 2l-.4.8a11 11 0 00-4.4 0L5.4 2a12 12 0 00-2.9 1.2C.7 6 .3 8.7.5 11.4a12 12 0 003.6 1.8l.8-1.2c-.5-.2-.9-.4-1.3-.7l.3-.2a8.5 8.5 0 007.2 0l.3.2c-.4.3-.8.5-1.3.7l.8 1.2a12 12 0 003.6-1.8c.3-3.1-.5-5.8-2-8.2zM5.6 9.8c-.7 0-1.3-.7-1.3-1.5s.6-1.5 1.3-1.5 1.3.7 1.3 1.5-.6 1.5-1.3 1.5zm4.8 0c-.7 0-1.3-.7-1.3-1.5s.6-1.5 1.3-1.5 1.3.7 1.3 1.5-.6 1.5-1.3 1.5z"/></svg>';

  // Bouton « œil » pour voir le mot de passe pendant qu'on le tape
  var EYE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5C6.5 5 2.7 9.1 1.5 12c1.2 2.9 5 7 10.5 7s9.3-4.1 10.5-7C21.3 9.1 17.5 5 12 5zm0 11.5A4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 0 1 0 9zm0-2.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor"/></svg>';
  var EYE_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.3 2.3L2 3.6l3.2 3.2C3.4 8.1 2.2 9.9 1.5 12c1.2 2.9 5 7 10.5 7 2 0 3.8-.5 5.3-1.4l3.1 3.1 1.3-1.3L3.3 2.3zM12 16.5A4.5 4.5 0 0 1 7.5 12c0-.8.2-1.5.5-2.1l1.6 1.6a2.5 2.5 0 0 0 2.9 2.9l1.6 1.6c-.6.3-1.3.5-2.1.5zM12 5c-1.3 0-2.6.2-3.7.6l2.1 2.1A4.5 4.5 0 0 1 16.3 13.6l3 3c1.5-1.3 2.6-3 3.2-4.6C21.3 9.1 17.5 5 12 5z" fill="currentColor"/></svg>';
  function addEyes() {
    root.querySelectorAll('input[type=password]').forEach(function (inp) {
      if (inp.parentNode.classList.contains('pw-wrap')) return;
      var w = document.createElement('div'); w.className = 'pw-wrap';
      inp.parentNode.insertBefore(w, inp); w.appendChild(inp);
      var b = document.createElement('button'); b.type = 'button'; b.className = 'pw-eye'; b.innerHTML = EYE;
      b.setAttribute('aria-label', t('show')); b.setAttribute('aria-pressed', 'false');
      w.appendChild(b);
    });
  }
  function render() { draw(); addEyes(); }
  function draw() {
    if (!VX.configured) { root.innerHTML = '<div class="panel acc-card"><p class="msg err">' + t('off') + '</p></div>'; return; }
    if (recovering) return renderRecovery();
    if (VX.user) return renderProfile();
    if (mode === 'forgot') return renderForgot();
    root.innerHTML =
      '<div class="panel acc-card">' +
        '<div class="toggle acc-tabs" role="tablist">' +
          '<button type="button" role="tab" data-mode="login" aria-pressed="' + (mode === 'login') + '">' + t('loginTab') + '</button>' +
          '<button type="button" role="tab" data-mode="signup" aria-pressed="' + (mode === 'signup') + '">' + t('signupTab') + '</button>' +
        '</div>' +
        '<div class="acc-oauth">' +
          '<button class="btn acc-g" type="button" data-oauth="google">' + ICON_G + t('google') + '</button>' +
          '<button class="btn acc-d" type="button" data-oauth="discord">' + ICON_D + t('discord') + '</button>' +
        '</div>' +
        '<div class="acc-or"><span>' + t('or') + '</span></div>' +
        '<form class="acc-form" novalidate>' +
          (mode === 'signup' ? '<div class="field"><label for="a-name">' + t('name') + '</label><input id="a-name" name="name" maxlength="40" autocomplete="nickname" required></div>' : '') +
          '<div class="field"><label for="a-email">' + t('email') + '</label><input id="a-email" name="email" type="email" autocomplete="email" required></div>' +
          '<div class="field"><label for="a-pass">' + (mode === 'signup' ? t('pass8') : t('pass')) + '</label><input id="a-pass" name="pass" type="password" minlength="8" autocomplete="' + (mode === 'signup' ? 'new-password' : 'current-password') + '" required></div>' +
          '<button class="btn btn-blue" type="submit">' + (mode === 'signup' ? t('signup') : t('login')) + '</button>' +
          (mode === 'login' ? '<button class="acc-link" type="button" data-mode="forgot">' + t('forgot') + '</button>' : '<p class="acc-legal">' + t('legal') + '</p>') +
          '<p class="msg" role="status" hidden></p>' +
        '</form>' +
      '</div>';
  }
  function renderForgot() {
    root.innerHTML = '<div class="panel acc-card"><h2 class="acc-h">' + t('forgot') + '</h2><form class="acc-form" data-form="forgot" novalidate>' +
      '<div class="field"><label for="a-email">' + t('email') + '</label><input id="a-email" name="email" type="email" autocomplete="email" required></div>' +
      '<button class="btn btn-blue" type="submit">' + t('sendReset') + '</button><button class="acc-link" type="button" data-mode="login">' + t('back') + '</button>' +
      '<p class="msg" role="status" hidden></p></form></div>';
  }
  function renderRecovery() {
    root.innerHTML = '<div class="panel acc-card"><h2 class="acc-h">' + t('newPass') + '</h2><form class="acc-form" data-form="newpass" novalidate>' +
      '<div class="field"><label for="a-pass">' + t('pass8') + '</label><input id="a-pass" name="pass" type="password" minlength="8" autocomplete="new-password" required></div>' +
      '<button class="btn btn-blue" type="submit">' + t('savePass') + '</button><p class="msg" role="status" hidden></p></form></div>';
  }
  function renderProfile() {
    var p = VX.profile || {}, u = VX.user, since = new Date(u.created_at).toLocaleDateString(S.loc(), { month: 'long', year: 'numeric' });
    var prov = (u.app_metadata && u.app_metadata.provider) || 'email';
    root.innerHTML =
      '<div class="acc-grid">' +
      '<div class="panel acc-card acc-me">' + VX.pp(p, 'acct-av-xl') +
        '<div><h2 class="acc-h">' + t('hello') + ' ' + esc(p.display_name) + '</h2><p class="acc-sub">' + esc(u.email || '') + ' · ' + t('member') + ' ' + esc(since) + '</p></div>' +
        '<div class="acc-actions"><a class="btn btn-blue btn-sm" href="messages.html">' + t('goMsg') + '</a><a class="btn btn-gold btn-sm" href="avis.html#laisser-un-avis">' + t('goReview') + ' ★</a>' +
        (VX.isAdmin ? '<a class="btn btn-ghost btn-sm" href="admin.html">' + t('goAdmin') + '</a>' : '') +
        '<button class="btn btn-ghost btn-sm" type="button" data-out>' + t('logout') + '</button></div>' +
      '</div>' +
      '<form class="panel acc-card acc-form" data-form="profile" novalidate><h3 class="acc-h3">' + t('profile') + '</h3>' +
        '<div class="field"><label for="p-name">' + t('name') + '</label><input id="p-name" name="name" maxlength="40" value="' + esc(p.display_name) + '" required></div>' +
        '<div class="field"><label for="p-av">' + t('avatar') + '</label><input id="p-av" name="avatar" type="url" placeholder="https://…" value="' + esc(p.avatar_url || '') + '"></div>' +
        '<button class="btn btn-ghost" type="submit">' + t('save') + '</button><p class="msg" role="status" hidden></p></form>' +
      (prov === 'email' ? '<form class="panel acc-card acc-form" data-form="newpass" novalidate><h3 class="acc-h3">' + t('security') + '</h3>' +
        '<div class="field"><label for="a-pass">' + t('changePass') + '</label><input id="a-pass" name="pass" type="password" minlength="8" autocomplete="new-password" placeholder="' + t('pass8') + '"></div>' +
        '<button class="btn btn-ghost" type="submit">' + t('savePass') + '</button><p class="msg" role="status" hidden></p></form>' : '') +
      '<form class="panel acc-card acc-form acc-danger" data-form="delete" novalidate><h3 class="acc-h3">' + t('danger') + '</h3><p class="acc-sub">' + t('dangerTxt') + '</p>' +
        '<div class="field"><input name="confirm" autocomplete="off" placeholder="SUPPRIMER"></div>' +
        '<button class="btn adm-del" type="submit">' + t('delete') + '</button><p class="msg" role="status" hidden></p></form>' +
      '</div>';
  }

  root.addEventListener('click', function (e) {
    var eye = e.target.closest('.pw-eye');
    if (eye) {
      var inp = eye.parentNode.querySelector('input'), show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      eye.innerHTML = show ? EYE_OFF : EYE; eye.setAttribute('aria-pressed', show ? 'true' : 'false'); eye.setAttribute('aria-label', show ? t('hide') : t('show'));
      inp.focus(); return;
    }
    var m = e.target.closest('[data-mode]'); if (m) { mode = m.dataset.mode; render(); return; }
    if (e.target.closest('[data-out]')) { VX.signOut(); return; }
    var o = e.target.closest('[data-oauth]');
    if (o) {
      var opts = { redirectTo: VX.redirect(next || 'compte.html') };
      if (o.dataset.oauth === 'discord') opts.scopes = 'identify email';
      VX.sb.auth.signInWithOAuth({ provider: o.dataset.oauth, options: opts }).then(function (r) { if (r.error) msg('err', errText(r.error)); });
    }
  });
  root.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, d = Object.fromEntries(new FormData(f).entries()), btn = f.querySelector('button[type=submit]'), kind = f.dataset.form || mode;
    var sb = VX.sb, p;
    function done(r, ok) { busy(btn, false); if (r && r.error) msg('err', errText(r.error)); else if (ok) ok(r); }
    if (kind === 'login' || kind === 'signup') {
      if (!d.email || !d.pass || (kind === 'signup' && !d.name.trim())) { msg('err', t('need')); return; }
      busy(btn, true);
      if (kind === 'login') p = sb.auth.signInWithPassword({ email: d.email.trim(), password: d.pass }).then(function (r) { done(r, function () { if (next) location.href = next; }); });
      else p = sb.auth.signUp({ email: d.email.trim(), password: d.pass, options: { data: { display_name: d.name.trim() }, emailRedirectTo: VX.redirect(next || 'compte.html') } })
        .then(function (r) { done(r, function (res) { if (!res.data.session) { mode = 'login'; render(); msg('ok', t('checkMail')); } else if (next) location.href = next; }); });
    } else if (kind === 'forgot') {
      if (!d.email) { msg('err', t('need')); return; }
      busy(btn, true);
      sb.auth.resetPasswordForEmail(d.email.trim(), { redirectTo: VX.redirect('compte.html') }).then(function (r) { done(r, function () { msg('ok', t('resetSent')); }); });
    } else if (kind === 'newpass') {
      if (!d.pass || d.pass.length < 8) { msg('err', t('errs')['Password should be at least']); return; }
      busy(btn, true);
      sb.auth.updateUser({ password: d.pass }).then(function (r) { done(r, function () { recovering = false; render(); S.say(t('passSaved')); }); });
    } else if (kind === 'profile') {
      var name = d.name.trim(), av = d.avatar.trim();
      if (!name) { msg('err', t('need')); return; }
      if (av && !/^https:\/\//i.test(av)) av = '';
      busy(btn, true);
      sb.from('profiles').update({ display_name: name.slice(0, 40), avatar_url: av || null }).eq('id', VX.user.id).select().single()
        .then(function (r) { done(r, function (res) { VX.profile = res.data; render(); S.say(t('saved')); window.dispatchEvent(new Event('vx:profile')); }); });
    } else if (kind === 'delete') {
      if (d.confirm.trim().toUpperCase() !== 'SUPPRIMER') { msg('err', t('dangerTxt')); return; }
      busy(btn, true);
      sb.rpc('delete_my_account').then(function (r) { done(r, function () { sb.auth.signOut().finally(function () { S.say(t('deleted')); setTimeout(function () { location.href = 'index.html'; }, 1800); }); }); });
    }
  });

  VX.onChange(function () { if (VX.lastEvent === 'PASSWORD_RECOVERY') recovering = true; render(); });
  document.addEventListener('vx:lang', render);
  VX.ready.then(function () { if (VX.user && next && VX.lastEvent !== 'PASSWORD_RECOVERY') { location.replace(next); return; } render(); });
  render();
})();
