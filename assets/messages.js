/* Messagerie en direct avec Veltrixx.
   Membre : une conversation avec toi.  Admin (toi) : la liste des conversations à gauche, le chat à droite. */
(function () {
  var S = window.VXS, VX = window.VX, root = document.getElementById('chat');
  var T = {
    fr: { off: 'La messagerie n’est pas encore activée sur le site.', login: 'Connecte-toi pour écrire à Veltrixx.', loginBtn: 'Se connecter / créer un compte',
      with: 'Veltrixx', withSub: 'Monteur vidéo & Channel Manager · répond en général sous 24 h', ph: 'Écris ton message…',
      send: 'Envoyer', empty: 'Aucun message pour l’instant. Présente-toi et parle-moi de ton projet !', today: 'Aujourd’hui', yesterday: 'Hier',
      threads: 'Conversations', noThreads: 'Aucune conversation pour l’instant.', pick: 'Choisis une conversation à gauche.', you: 'Toi : ', seen: 'Vu', err: 'Le message n’est pas parti : ', back: '← Conversations', del: 'Supprimer' },
    en: { off: 'Messaging is not enabled on the site yet.', login: 'Sign in to message Veltrixx.', loginBtn: 'Sign in / create an account',
      with: 'Veltrixx', withSub: 'Video editor & Channel Manager · usually replies within 24 h', ph: 'Write your message…',
      send: 'Send', empty: 'No messages yet. Introduce yourself and tell me about your project!', today: 'Today', yesterday: 'Yesterday',
      threads: 'Conversations', noThreads: 'No conversations yet.', pick: 'Pick a conversation on the left.', you: 'You: ', seen: 'Seen', err: 'Message not sent: ', back: '← Conversations', del: 'Delete' }
  };
  function t(k) { return (T[S.lang()] || T.fr)[k]; }
  function esc(s) { return S.esc(s == null ? '' : s); }
  var me = null, thread = null, msgs = [], threads = [], chan = null, mobileList = true;
  var ME_PROFILE = { display_name: 'Veltrixx', avatar_url: (typeof ME !== 'undefined' && ME.pp) || null };

  function time(d) { return new Date(d).toLocaleTimeString(S.loc(), { hour: '2-digit', minute: '2-digit' }); }
  function dayLabel(d) {
    var x = new Date(d), now = new Date(), y = new Date(); y.setDate(now.getDate() - 1);
    if (x.toDateString() === now.toDateString()) return t('today');
    if (x.toDateString() === y.toDateString()) return t('yesterday');
    return x.toLocaleDateString(S.loc(), { weekday: 'long', day: 'numeric', month: 'long' });
  }

  function shell() {
    if (!VX.configured) { root.innerHTML = '<div class="panel acc-card"><p class="msg err">' + t('off') + '</p></div>'; return false; }
    if (!VX.user) {
      root.innerHTML = '<div class="panel acc-card chat-login"><p>' + t('login') + '</p><a class="btn btn-blue" href="compte.html?next=messages.html">' + t('loginBtn') + '</a></div>';
      return false;
    }
    return true;
  }

  /* ---------- Rendu ---------- */
  function render() {
    if (!shell()) return;
    me = VX.user.id;
    if (!VX.isAdmin) thread = me;
    var head = VX.isAdmin ? threadHead() : '<div class="chat-head">' + VX.pp(ME_PROFILE, 'acct-av-lg') + '<div><b>' + t('with') + '</b><span>' + t('withSub') + '</span></div></div>';
    root.innerHTML = '<div class="chat' + (VX.isAdmin ? ' chat-admin' : '') + (VX.isAdmin && mobileList ? ' show-list' : '') + '">' +
      (VX.isAdmin ? '<aside class="chat-threads"><h2>' + t('threads') + '</h2><div class="chat-tl" id="chatTL"></div></aside>' : '') +
      '<section class="chat-main">' + head +
        '<div class="chat-log" id="chatLog" aria-live="polite"></div>' +
        '<form class="chat-form" id="chatForm"' + (thread ? '' : ' hidden') + '><textarea name="body" rows="1" maxlength="2000" placeholder="' + t('ph') + '" required></textarea>' +
        '<button class="btn btn-blue" type="submit" aria-label="' + t('send') + '"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 14.5L15 8 1 1.5l1.6 5.3L10 8l-7.4 1.2z" fill="currentColor"/></svg></button></form>' +
      '</section></div>';
    if (VX.isAdmin) renderThreads();
    renderLog();
  }
  function threadHead() {
    var th = threads.filter(function (x) { return x.thread_id === thread; })[0];
    if (!th) return '<div class="chat-head"><div><b>' + t('pick') + '</b></div></div>';
    return '<div class="chat-head"><button class="btn btn-ghost btn-sm chat-back" type="button" data-back>' + t('back') + '</button>' + VX.pp(th, 'acct-av-lg') +
      '<div><b>' + esc(th.display_name) + '</b><span>' + esc(th.email || '') + '</span></div></div>';
  }
  function renderThreads() {
    var el = document.getElementById('chatTL'); if (!el) return;
    el.innerHTML = threads.length ? threads.map(function (th) {
      return '<button type="button" class="chat-th' + (th.thread_id === thread ? ' on' : '') + '" data-th="' + th.thread_id + '">' + VX.pp(th) +
        '<span class="chat-th-t"><b>' + esc(th.display_name) + '</b><small>' + (th.last_sender === me ? t('you') : '') + esc(th.last_body) + '</small></span>' +
        '<span class="chat-th-m"><time>' + time(th.last_at) + '</time>' + (th.unread ? '<span class="acct-badge">' + th.unread + '</span>' : '') + '</span></button>';
    }).join('') : '<p class="chat-empty">' + t('noThreads') + '</p>';
  }
  function renderLog() {
    var log = document.getElementById('chatLog'); if (!log) return;
    if (!thread) { log.innerHTML = '<p class="chat-empty">' + t('pick') + '</p>'; return; }
    if (!msgs.length) { log.innerHTML = '<p class="chat-empty">' + t('empty') + '</p>'; return; }
    var html = '', lastDay = '', lastMine = msgs.filter(function (m) { return m.sender_id === me; }).slice(-1)[0];
    msgs.forEach(function (m) {
      var dl = dayLabel(m.created_at); if (dl !== lastDay) { html += '<div class="chat-day"><span>' + esc(dl) + '</span></div>'; lastDay = dl; }
      var mine = m.sender_id === me;
      html += '<div class="bub ' + (mine ? 'me' : 'them') + '" data-id="' + m.id + '"><p>' + esc(m.body).replace(/\n/g, '<br>') + '</p><time>' + time(m.created_at) +
        (mine && m === lastMine && m.read_at ? ' · ' + t('seen') : '') + '</time>' +
        (VX.isAdmin ? '<button type="button" class="bub-del" data-del="' + m.id + '" title="' + t('del') + '">✕</button>' : '') + '</div>';
    });
    log.innerHTML = html;
    log.scrollTop = log.scrollHeight;
  }

  /* ---------- Données ---------- */
  function loadThreads() {
    return VX.sb.rpc('admin_threads').then(function (r) { threads = r.data || []; renderThreads(); var h = root.querySelector('.chat-head'); if (h && thread) h.outerHTML = threadHead(); });
  }
  function loadMsgs() {
    if (!thread) { msgs = []; renderLog(); return Promise.resolve(); }
    return VX.sb.from('messages').select('id, thread_id, sender_id, body, created_at, read_at').eq('thread_id', thread).order('created_at').limit(500)
      .then(function (r) { msgs = r.data || []; renderLog(); markRead(); });
  }
  function markRead() {
    if (!thread || document.hidden) return;
    var ids = msgs.filter(function (m) { return m.sender_id !== me && !m.read_at; }).map(function (m) { return m.id; });
    if (!ids.length) return;
    VX.sb.from('messages').update({ read_at: new Date().toISOString() }).in('id', ids).then(function () { VX.refreshUnread(); if (VX.isAdmin) loadThreads(); });
  }
  function subscribe() {
    if (chan) VX.sb.removeChannel(chan);
    var opts = { event: '*', schema: 'public', table: 'messages' };
    if (!VX.isAdmin) opts.filter = 'thread_id=eq.' + me;
    chan = VX.sb.channel('chat-' + me).on('postgres_changes', opts, function (p) {
      var row = p.new && p.new.id ? p.new : p.old;
      if (VX.isAdmin) loadThreads();
      if (!row || row.thread_id !== thread && p.eventType !== 'DELETE') return;
      if (p.eventType === 'INSERT') { if (!msgs.some(function (m) { return m.id === row.id; })) msgs.push(row); renderLog(); markRead(); }
      else if (p.eventType === 'UPDATE') { msgs = msgs.map(function (m) { return m.id === row.id ? row : m; }); renderLog(); }
      else if (p.eventType === 'DELETE') { msgs = msgs.filter(function (m) { return m.id !== (p.old && p.old.id); }); renderLog(); }
    }).subscribe();
  }

  /* ---------- Actions ---------- */
  root.addEventListener('submit', function (e) {
    if (e.target.id !== 'chatForm') return;
    e.preventDefault();
    var ta = e.target.querySelector('textarea'), body = ta.value.trim();
    if (!body || !thread) return;
    ta.value = ''; ta.style.height = '';
    VX.sb.from('messages').insert({ thread_id: thread, sender_id: me, body: body }).select().single().then(function (r) {
      if (r.error) { ta.value = body; S.say(t('err') + r.error.message); return; }
      if (!msgs.some(function (m) { return m.id === r.data.id; })) { msgs.push(r.data); renderLog(); }
      if (VX.isAdmin) loadThreads();
    });
  });
  root.addEventListener('keydown', function (e) {
    if (e.target.matches('.chat-form textarea') && e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); e.target.form.requestSubmit(); }
  });
  root.addEventListener('input', function (e) {
    if (e.target.matches('.chat-form textarea')) { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'; }
  });
  root.addEventListener('click', function (e) {
    var th = e.target.closest('[data-th]');
    if (th) { thread = th.dataset.th; mobileList = false; history.replaceState(null, '', '#' + thread); render(); loadMsgs(); return; }
    if (e.target.closest('[data-back]')) { mobileList = true; render(); return; }
    var del = e.target.closest('[data-del]');
    if (del) {
      if (!del.classList.contains('sure')) { del.classList.add('sure'); del.textContent = t('del') + ' ?'; return; }
      VX.sb.from('messages').delete().eq('id', del.dataset.del).then(function () { msgs = msgs.filter(function (m) { return String(m.id) !== del.dataset.del; }); renderLog(); loadThreads(); });
    }
  });
  document.addEventListener('visibilitychange', markRead);
  document.addEventListener('vx:lang', function () { render(); });

  var started = false;
  function start() {
    if (!VX.user) { render(); return; }
    if (started && me === VX.user.id) return;
    started = true; me = VX.user.id;
    if (VX.isAdmin) {
      var h = location.hash.slice(1); if (/^[0-9a-f-]{36}$/.test(h)) { thread = h; mobileList = false; }
      render(); loadThreads().then(loadMsgs);
    } else { thread = me; render(); loadMsgs(); }
    subscribe();
  }
  render();
  VX.ready.then(start);
  VX.onChange(function () { if (!VX.user) { started = false; render(); } else start(); });
})();
