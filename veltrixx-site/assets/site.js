/* Veltrixx — en-tête, pied de page, traduction FR/EN, montages, collaborations, stats en direct, formulaire. */
(function () {
  var page = document.body.dataset.page || 'home';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= Traductions =================
     Le français est écrit directement dans les pages (attribut data-i18n).
     L'anglais est ici. Pour corriger une traduction, modifie la ligne correspondante. */
  var EN = {
    'nav.home': 'Home', 'nav.edits': 'Edits', 'nav.collabs': 'Collabs', 'nav.stats': 'Stats', 'nav.lyost': 'Lyost Esport', 'nav.contact': 'Contact me',
    'footer.role': 'Video editor & Channel Manager',

    'home.status': 'Available for new projects',
    'home.h1': 'Video editor<br><span class="b">Veltrixx</span>',
    'home.lead': 'Editor and Channel Manager for Fortnite creators and pros: Leothecrack, Akiira, SkyJump, Werex, Kurama and Lyost Esport.',
    'home.cta1': 'See my edits', 'home.cta2': 'Work with me',
    'home.s1': 'views generated (YouTube + TikTok)', 'home.s2': 'TikTok views since I joined', 'home.s5': 'YouTube views since I joined', 'home.s6': 'creators and orgs', 'home.s3': 'edits on show', 'home.s4': 'total views across managed accounts',
    'home.live': 'Live',
    'home.feat': 'My <span class="b">edits</span>', 'home.featk': 'One edit per channel',
    'home.all': 'See all edits',
    'home.trust': 'They <span class="b">trusted me</span>', 'home.trustk': 'Creators and orgs I have edited for',
    'home.collabsbtn': 'See my collabs',
    'home.ctah': 'Ready to <span class="b">blow up</span> your views?', 'home.ctal': 'Editing, thumbnails, YouTube channel and TikTok management. Tell me about your project.',

    'ed.h1': 'My <span class="b">edits</span>', 'ed.lead': 'Five edits for each channel I work on. Click a video to watch it here.',
    'ed.filter': 'Channel', 'ed.note': 'Views and likes as of 8 November 2026. Source: YouTube.',

    'co.h1': 'My <span class="b">collabs</span>', 'co.lead': 'Creators, pro players and esports orgs I edit for or whose channels I manage.',
    'co.boss': 'Business contact: Theo (@FuLLkb9) on X.',

    'st.h1': 'My <span class="b">stats</span>', 'st.lead': 'Live views on the YouTube and TikTok accounts I manage, counted from the day I started with each creator.',
    'st.gen': 'Views I generated', 'st.genk': 'YouTube + TikTok, since I joined each creator',
    'st.viewsBtn': 'Views', 'st.subsBtn': 'Subscribers',
    'st.yt': 'YouTube', 'st.ytk': 'Werex since 28/03, Akiira & SkyJump since 11/06, Leo since 12/08',
    'st.tt': 'TikTok', 'st.ttk': 'Werex since 28/03, Akiira & SkyJump since 11/06 · public profiles',
    'st.likesBtn': 'Likes', 'st.folBtn': 'Followers', 'st.hover': 'Hover for details',
    'st.liveNote': 'The charts update on their own: the site checks for new data every minute, and the accounts are read every 10 minutes.',
    'st.edits': 'My <span class="b">edits</span> in numbers', 'st.editsk': 'The 20 videos on the Edits page',
    'st.byvid': 'Views per video', 'st.bych': 'Views per channel', 'st.likes': 'Likes per channel',
    'st.s5': 'likes on these edits', 'st.s6': 'average views per video', 'st.s7': 'views on these edits',
    'st.src': 'Edit figures as of 8 November 2026. Click a video to watch it.',

    'ly.k': 'Marseille esports club', 'ly.h1': 'Lyost <span class="g">Esport</span>',
    'ly.lead': '“For Marseille, by Marseille.” A competitive org from Marseille on Fortnite and Valorant, where I am part of the staff as a video editor.',
    'ly.what': 'The <span class="g">org</span>',
    'ly.p1': '<strong>Lyost Esport</strong> is an esports organisation based in Marseille, focused on high-level play, team culture and its community. The club competes on <strong>Fortnite</strong> and <strong>Valorant</strong>.',
    'ly.p2': 'It is backed by its partners Sealing and AutoFull, and released its 2026 jersey with Hummel in the colours of Marseille. In 2026, Fortnite player Momsy qualified for the Esports World Cup.',
    'ly.f1': 'followers on X', 'ly.f2': 'followers on TikTok', 'ly.f3': 'Fortnite players', 'ly.f4': 'games: Fortnite & Valorant',
    'ly.struct': 'How the <span class="g">club</span> is built', 'ly.structk': 'From the official roster on lyost.org',
    'ly.dir': 'Management', 'ly.dird': 'Sets the vision and drives the club’s growth.',
    'ly.staff': 'Staff', 'ly.staffd': 'Video and art direction, behind the scenes.',
    'ly.fn': 'Fortnite roster', 'ly.fnd': 'Pro players and the academy.',
    'ly.role': 'My <span class="g">role</span>',
    'ly.r1t': 'Video editor in the staff', 'ly.r1': 'I am one of the club’s two video editors, alongside Oba, working with art director Goddi.',
    'ly.r2t': 'Editing for Werex', 'ly.r2': 'I edit and manage the YouTube channel of Werex, a Lyost Fortnite pro: tournament recaps, FNCS, cash cups.',
    'ly.r3t': 'Content for the club', 'ly.r3': 'Edits that show off the players and results on Lyost’s social accounts.',
    'ly.links': 'Follow <span class="g">Lyost</span>', 'ly.site': 'Official website',
    'ly.founder': 'Founder / President', 'ly.ceo': 'CEO', 'ly.comm': 'Communication Director', 'ly.editor': 'Video editor', 'ly.me': 'Video editor · me', 'ly.art': 'Art Director', 'ly.head': 'Head of Fortnite', 'ly.pro': 'Pro player', 'ly.acad': 'Academy player',

    'ct.h1': 'Contact <span class="b">me</span>', 'ct.lead': 'Tell me what you need. Your request goes straight to my inbox and I reply within 24 hours.',
    'ct.name': 'Name or handle', 'ct.email': 'Your email', 'ct.type': 'Type of request', 'ct.budget': 'Budget', 'ct.deadline': 'Deadline', 'ct.link': 'Link to your channel', 'ct.msg': 'Your message',
    'ct.t1': 'YouTube edit', 'ct.t2': 'Short / TikTok / Reel', 'ct.t3': 'Channel Manager', 'ct.t4': 'TikTok management', 'ct.t5': 'Collab / partnership', 'ct.t6': 'Other',
    'ct.b0': 'To discuss', 'ct.send': 'Send request', 'ct.direct': 'Email me directly', 'ct.social': 'My socials', 'ct.business': 'Business contact',
    'ct.phname': 'e.g. Leo', 'ct.phmsg': 'Type of video, length, references, publishing date…', 'ct.phdeadline': 'e.g. in 1 week'
  };
  var UI = {
    fr: { views: 'vues', onYt: 'Voir sur YouTube', close: 'Fermer', copied: 'Copié !', discordCopied: 'Pseudo Discord copié : ', more: 'Voir la page', sending: 'Envoi…', ok: 'Merci ! Ta demande est bien partie, je te réponds vite.', err: 'L’envoi n’a pas marché. Écris-moi directement à ', required: 'Remplis ton nom, ton email et ton message.', badEmail: 'Ton adresse email ne semble pas valide.', all: 'Tout', video: 'vidéo', videos: 'vidéos', channel: 'Voir la chaîne', lastData: 'Dernière donnée', newData: 'Nouvelle donnée reçue', growing: 'Le graphique se remplit à chaque nouvelle donnée.', total: 'Total', likesW: 'J’aime', followersW: 'abonnés', viewsSince: 'vues depuis mon arrivée', subsNow: 'abonnés', likesProfile: 'J’aime sur les profils', genBy: 'Qui a fait le plus de vues', since: 'depuis le premier relevé', justNow: 'à l’instant', minAgo: 'il y a {n} min', hAgo: 'il y a {n} h', dAgo: 'il y a {n} j' },
    en: { views: 'views', onYt: 'Watch on YouTube', close: 'Close', copied: 'Copied!', discordCopied: 'Discord username copied: ', more: 'Open page', sending: 'Sending…', ok: 'Thanks! Your request was sent, I’ll get back to you soon.', err: 'Sending failed. Email me directly at ', required: 'Please fill in your name, email and message.', badEmail: 'That email address doesn’t look valid.', all: 'All', video: 'video', videos: 'videos', channel: 'Open channel', lastData: 'Latest data', newData: 'New data received', growing: 'The chart fills in with every new data point.', total: 'Total', likesW: 'likes', followersW: 'followers', viewsSince: 'views since I joined', subsNow: 'subscribers', likesProfile: 'profile likes', genBy: 'Who brought in the most views', since: 'since the first reading', justNow: 'just now', minAgo: '{n} min ago', hAgo: '{n} h ago', dAgo: '{n} d ago' }
  };

  var lang = 'fr';
  try { lang = localStorage.getItem('vx-lang') || (navigator.language || 'fr').slice(0, 2); } catch (e) {}
  var q = new URLSearchParams(location.search).get('lang'); if (q) lang = q;
  if (lang !== 'en') lang = 'fr';
  function u(k) { return UI[lang][k]; }
  function loc() { return lang === 'en' ? 'en-US' : 'fr-FR'; }
  function nf(n) { return Number(n).toLocaleString(loc()); }
  function compact(n) {
    n = Number(n);
    var s, unit;
    if (n >= 1e6) { s = (n / 1e6).toFixed(n >= 1e7 ? 1 : 2); unit = 'M'; }
    else if (n >= 1e3) { s = (n / 1e3).toFixed(n >= 1e5 ? 0 : 1); unit = 'k'; }
    else return String(n);
    s = s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
    return lang === 'en' ? s + unit : s.replace('.', ',') + ' ' + unit;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ago(iso) {
    var m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (m < 1) return u('justNow');
    if (m < 60) return u('minAgo').replace('{n}', m);
    if (m < 1440) return u('hAgo').replace('{n}', Math.round(m / 60));
    return u('dAgo').replace('{n}', Math.round(m / 1440));
  }

  /* ================= Icônes ================= */
  var I = {
    bolt: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.5 1L3 9h4l-1.5 6L13 7H9z"/></svg>',
    play: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z"/></svg>',
    eye: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3C4 3 1.5 6.5 1 8c.5 1.5 3 5 7 5s6.5-3.5 7-5c-.5-1.5-3-5-7-5zm0 8a3 3 0 110-6 3 3 0 010 6z"/></svg>',
    heart: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14S1.5 10 1.5 5.6A3.2 3.2 0 018 4a3.2 3.2 0 016.5 1.6C14.5 10 8 14 8 14z"/></svg>',
    youtube: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 3.5h12a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5H2A1.5 1.5 0 01.5 11V5A1.5 1.5 0 012 3.5zm4.5 2v5l4-2.5z"/></svg>',
    x: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2h3.2L8 6l3-4h2.5L9.2 7.6 14 14h-3.2L7.8 9.9 4.6 14H2l4.6-5.8z"/></svg>',
    tiktok: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9 1h2.4c.2 1.6 1.3 2.7 3 2.9v2.4c-1.1 0-2.1-.3-3-.9V10a4.5 4.5 0 11-4.5-4.5v2.5A2 2 0 109 10z"/></svg>',
    instagram: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 1h6a4 4 0 014 4v6a4 4 0 01-4 4H5a4 4 0 01-4-4V5a4 4 0 014-4zm0 1.6A2.4 2.4 0 002.6 5v6A2.4 2.4 0 005 13.4h6a2.4 2.4 0 002.4-2.4V5A2.4 2.4 0 0011 2.6zM8 4.6a3.4 3.4 0 110 6.8 3.4 3.4 0 010-6.8zm0 1.6a1.8 1.8 0 100 3.6 1.8 1.8 0 000-3.6zM11.8 3.4a.9.9 0 110 1.8.9.9 0 010-1.8z"/></svg>',
    twitch: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 1L1.5 4v9h3v2h2l2-2h2.5l3.5-3.5V1zm10 8l-2 2H8l-2 2v-2H3.5V2.5h9zM10 4.5h1.5V8H10zm-3.5 0H8V8H6.5z"/></svg>',
    discord: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 3.2A12 12 0 0010.6 2l-.4.8a11 11 0 00-4.4 0L5.4 2a12 12 0 00-2.9 1.2C.7 6 .3 8.7.5 11.4a12 12 0 003.6 1.8l.8-1.2c-.5-.2-.9-.4-1.3-.7l.3-.2a8.5 8.5 0 007.2 0l.3.2c-.4.3-.8.5-1.3.7l.8 1.2a12 12 0 003.6-1.8c.3-3.1-.5-5.8-2-8.2zM5.6 9.8c-.7 0-1.3-.7-1.3-1.5s.6-1.5 1.3-1.5 1.3.7 1.3 1.5-.6 1.5-1.3 1.5zm4.8 0c-.7 0-1.3-.7-1.3-1.5s.6-1.5 1.3-1.5 1.3.7 1.3 1.5-.6 1.5-1.3 1.5z"/></svg>',
    site: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm4.9 6.2h-2.2a11 11 0 00-.9-4 5.4 5.4 0 013.1 4zM8 2.7c.6.8 1.1 2.4 1.2 4.5H6.8C6.9 5.1 7.4 3.5 8 2.7zM6.2 3.2a11 11 0 00-.9 4H3.1a5.4 5.4 0 013.1-4zM3.1 8.8h2.2a11 11 0 00.9 4 5.4 5.4 0 01-3.1-4zM8 13.3c-.6-.8-1.1-2.4-1.2-4.5h2.4c-.1 2.1-.6 3.7-1.2 4.5zm1.8-.5a11 11 0 00.9-4h2.2a5.4 5.4 0 01-3.1 4z"/></svg>',
    mail: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 3h13a1 1 0 011 1v8a1 1 0 01-1 1h-13a1 1 0 01-1-1V4a1 1 0 011-1zm.5 1.6v.3L8 9l6-4.1v-.3zm0 2.2V11.4h12V6.8L8 10.9z"/></svg>',
    menu: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14v2H3zm0 4h14v2H3zm0 4h14v2H3z"/></svg>'
  };
  var NETS = { site: 'Site', youtube: 'YouTube', x: 'X', tiktok: 'TikTok', instagram: 'Instagram', twitch: 'Twitch', discord: 'Discord' };
  function socialLinks(links, big) {
    return Object.keys(NETS).filter(function (k) { return links[k]; }).map(function (k) {
      return '<a class="soc' + (big ? ' lg' : '') + '" href="' + links[k] + '" target="_blank" rel="noopener">' + I[k] + NETS[k] + '</a>';
    }).join('');
  }
  function discordHref() { return ME.discordId ? 'https://discord.com/users/' + ME.discordId : '#'; }

  /* Photo de profil : l'image de assets/pp/ si elle existe, sinon l'initiale */
  function avatar(key, cls) {
    var c = CREATORS[key] || { name: key };
    return '<span class="av ' + (cls || '') + (c.gold ? ' av-gold' : '') + '" aria-hidden="true"><span class="ini">' + esc(c.name.charAt(0)) + '</span>' +
      (c.pp ? '<img src="' + c.pp + '" alt="" loading="lazy" onerror="this.remove()">' : '') + '</span>';
  }

  /* ================= En-tête & pied de page ================= */
  var NAV = [
    ['home', 'index.html', 'nav.home', 'Accueil'],
    ['edits', 'montages.html', 'nav.edits', 'Montages'],
    ['collabs', 'collaborations.html', 'nav.collabs', 'Collaborations'],
    ['stats', 'statistiques.html', 'nav.stats', 'Statistiques'],
    ['lyost', 'lyost.html', 'nav.lyost', 'Lyost Esport']
  ];
  var header = document.createElement('header'); header.className = 'top';
  header.innerHTML =
    '<div class="wrap">' +
      '<a class="logo" href="index.html"><span class="me-pp"><img src="' + ME.pp + '" alt="" onerror="this.parentNode.classList.add(\'nopp\');this.remove()"><b>V</b></span>Veltrixx</a>' +
      '<nav class="nav" id="nav" aria-label="Navigation">' +
        NAV.map(function (n) { return '<a href="' + n[1] + '"' + (n[0] === 'lyost' ? ' class="gold-link"' : '') + (n[0] === page ? ' aria-current="page"' : '') + ' data-i18n="' + n[2] + '">' + n[3] + '</a>'; }).join('') +
      '</nav>' +
      '<div class="tools">' +
        '<div class="lang" role="group" aria-label="Langue / Language"><button type="button" data-lang="fr">FR</button><button type="button" data-lang="en">EN</button></div>' +
        '<a class="btn btn-blue btn-sm contact-btn" href="contact.html" data-i18n="nav.contact">Me contacter</a>' +
        '<button class="burger" type="button" id="burger" aria-expanded="false" aria-controls="nav" aria-label="Menu">' + I.menu + '</button>' +
      '</div>' +
    '</div>';
  document.body.prepend(header);
  var aur = document.createElement('div'); aur.className = 'aurora'; aur.setAttribute('aria-hidden', 'true'); aur.innerHTML = '<i></i><i></i><i></i>';
  document.body.prepend(aur);

  var footer = document.createElement('footer');
  footer.innerHTML =
    '<div class="wrap"><span>© ' + new Date().getFullYear() + ' Veltrixx · <span data-i18n="footer.role">Monteur vidéo & Channel Manager</span></span>' +
    '<div class="socials">' +
      '<a class="soc" href="' + ME.x + '" target="_blank" rel="noopener">' + I.x + 'X</a>' +
      '<a class="soc" href="' + ME.twitch + '" target="_blank" rel="noopener">' + I.twitch + 'Twitch</a>' +
      '<a class="soc js-discord" href="#">' + I.discord + 'Discord</a>' +
      '<a class="soc" href="contact.html">' + I.mail + 'Email</a>' +
    '</div></div>';
  document.body.appendChild(footer);

  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  burger.addEventListener('click', function () { var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o ? 'true' : 'false'); });

  /* ================= Toast & copie ================= */
  var toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast);
  var tt; function say(t) { toast.textContent = t; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('show'); }, 2600); }
  function copy(text, done) {
    var ok = function () { done && done(); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok, ok); else ok();
  }
  document.addEventListener('click', function (e) {
    var d = e.target.closest('.js-discord');
    if (!d) return;
    copy(ME.discordUser, function () { say(u('discordCopied') + ME.discordUser); });
    if (!ME.discordId) e.preventDefault();
  });

  /* ================= Lecteur vidéo ================= */
  var dlg = document.createElement('dialog'); dlg.setAttribute('aria-label', 'Video');
  dlg.innerHTML = '<div class="dlg-bar"><h3 id="dlgT"></h3><span style="display:flex;gap:12px;align-items:center"><a id="dlgY" target="_blank" rel="noopener"></a><button class="btn btn-ghost btn-sm" type="button" id="dlgC"></button></span></div><div class="player" id="dlgP"></div>';
  document.body.appendChild(dlg);
  function openVideo(v) {
    document.getElementById('dlgT').textContent = v.t;
    var y = document.getElementById('dlgY'); y.href = 'https://www.youtube.com/watch?v=' + v.id; y.textContent = u('onYt') + ' ↗';
    document.getElementById('dlgC').textContent = u('close') + ' ✕';
    document.getElementById('dlgP').innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + v.id + '?autoplay=1&rel=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="' + esc(v.t) + '"></iframe>';
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function closeVideo() { document.getElementById('dlgP').innerHTML = ''; if (dlg.open) dlg.close(); }
  dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.id === 'dlgC') closeVideo(); });
  dlg.addEventListener('close', function () { document.getElementById('dlgP').innerHTML = ''; });

  /* ================= Montages ================= */
  var sorted = VIDEOS.slice().sort(function (a, b) { return b.v - a.v; });
  function bestPerChannel() {
    return MONTAGE_CHANNELS.map(function (k) { return sorted.filter(function (v) { return v.ch === k; })[0]; }).filter(Boolean);
  }
  function videoCard(v, big) {
    var c = CREATORS[v.ch] || { name: v.ch };
    var el = document.createElement('article'); el.className = 'vid'; el.dataset.ch = v.ch;
    el.innerHTML =
      '<button class="th" type="button" aria-label="' + esc(v.t) + '">' +
        '<img alt="" loading="lazy" src="https://i.ytimg.com/vi/' + v.id + '/' + (big ? 'maxresdefault' : 'hqdefault') + '.jpg" onerror="this.onerror=null;this.src=\'https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg\'">' +
        '<span class="chip-ch">' + avatar(v.ch, 'av-sm') + '<span>' + esc(c.name) + '</span></span>' +
        '<span class="mini">' + I.play + '</span><span class="dur">' + v.dur + '</span>' +
      '</button>' +
      '<div class="body"><h3>' + esc(v.t) + '</h3>' +
        '<div class="meta"><span>' + I.eye + nf(v.v) + ' ' + u('views') + '</span><span>' + I.heart + nf(v.l) + '</span></div>' +
      '</div>';
    el.querySelector('.th').addEventListener('click', function () { openVideo(v); });
    return el;
  }

  /* ================= Cartes créateurs ================= */
  function creatorCard(key) {
    var c = CREATORS[key], L = lang === 'en' ? 1 : 0;
    var el = document.createElement('article'); el.className = 'cr' + (c.gold ? ' gold' : ''); el.dataset.key = key; el.id = key;
    el.innerHTML =
      '<div class="id">' + avatar(key, 'av-lg') + '<div style="min-width:0"><h3>' + esc(c.name) + '</h3><div class="desc">' + esc(c.desc[L]) + '</div></div></div>' +
      '<div class="role">' + esc(c.role[L]) + '</div>' +
      (c.stats ? '<div class="nums">' + c.stats.map(function (s) { return '<span><b>' + s[0] + '</b>' + s[1] + '</span>'; }).join('') + '</div>' : '') +
      '<div class="socials">' + socialLinks(c.links) + '</div>' +
      (c.page ? '<a class="btn btn-gold btn-sm more" href="' + c.page + '">' + u('more') + ' ' + I.bolt + '</a>' : '');
    return el;
  }
  function clientItem(key) {
    var c = CREATORS[key], L = lang === 'en' ? 1 : 0;
    var first = c.links.youtube || c.links.site || c.links.x || c.links.tiktok || '#';
    var href = c.page || first;
    return '<a class="client' + (c.gold ? ' gold' : '') + '" href="' + href + '"' + (c.page ? '' : ' target="_blank" rel="noopener"') + '>' + avatar(key, 'av-md') +
      '<span class="cl-t"><b>' + esc(c.name) + '</b><small>' + esc(c.role[L]) + '</small></span></a>';
  }

  /* ================= Stats en direct =================
     data/stats.json est rempli par le robot (scripts/update-stats.mjs) toutes les 10 minutes.
     youtube.videos / tiktok.videos : [date, vues] de chaque vidéo publiée depuis ton arrivée.
     youtube.live / tiktok.live : un relevé à chaque changement (vues, abonnés, J'aime). */
  var STATS = null, lastStamp = '', shownGen = null;
  var ytField = 'views', ttField = 'views';
  var NETNAME = { yt: 'YouTube', tt: 'TikTok' };
  function sumObj(o) { var s = 0; for (var k in o) s += o[k]; return s; }
  function lastLive(net) { var l = (STATS[net === 'yt' ? 'youtube' : 'tiktok'] || {}).live || []; return l[l.length - 1]; }
  function prevLive(net) { var l = (STATS[net === 'yt' ? 'youtube' : 'tiktok'] || {}).live || []; return l[l.length - 2]; }
  function totals() {
    var y = lastLive('yt'), t = lastLive('tt');
    return { yt: y ? sumObj(y.views) : 0, tt: t ? sumObj(t.views) : 0 };
  }
  function genTotal() { var x = totals(); return x.yt + x.tt; }
  /* Courbe des vues : cumul des vues des vidéos par date de publication, puis les relevés en direct */
  function viewsSeries(block) {
    var all = [];
    for (var k in (block.videos || {})) block.videos[k].forEach(function (v) { all.push(v); });
    all.sort(function (a, b) { return a[0] - b[0]; });
    var pts = [], acc = 0, day = null;
    all.forEach(function (v) {
      acc += v[1];
      var d = Math.floor(v[0] / 86400);
      if (d === day) pts[pts.length - 1].v = acc; else { pts.push({ t: v[0] * 1000, v: acc }); day = d; }
    });
    var lastT = pts.length ? pts[pts.length - 1].t : 0;
    (block.live || []).forEach(function (p) { var t = new Date(p.t).getTime(); if (t > lastT) { pts.push({ t: t, v: sumObj(p.views) }); lastT = t; } });
    return pts;
  }
  function liveSeries(block, field) {
    return (block.live || []).map(function (p) { return { t: new Date(p.t).getTime(), v: sumObj(p[field] || {}) }; });
  }
  function fmtGen(n) { // ex. 5,9 M — une décimale, comme demandé
    n = Number(n);
    if (n >= 1e6) { var s = (Math.round(n / 1e5) / 10).toFixed(1); return (lang === 'en' ? s : s.replace('.', ',')) + (lang === 'en' ? 'M' : ' M'); }
    return compact(n);
  }

  function chart(el, pts, opt) {
    if (!el) return;
    var W = Math.max(280, el.clientWidth), H = opt.h || 250, pad = { l: 74, r: 14, t: 16, b: 30 };
    var iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    var id = el.id + 'g';
    if (!pts.length) { el.innerHTML = '<p class="chart-hint">' + u('growing') + '</p>'; return; }
    var vs = pts.map(function (p) { return p.v; }), ts = pts.map(function (p) { return p.t; });
    var vmin = Math.min.apply(null, vs), vmax = Math.max.apply(null, vs);
    if (opt.zero) vmin = 0;
    if (vmax === vmin) { var d = Math.max(1, vmax * 0.004); vmin -= d; vmax += d; }
    else if (!opt.zero) { var pd = (vmax - vmin) * 0.12; vmin -= pd; vmax += pd; }
    else vmax *= 1.06;
    var tmin = Math.min.apply(null, ts), tmax = Math.max.apply(null, ts);
    var single = tmax === tmin;
    if (single) { tmin -= 3600e3; tmax += 600e3; }
    function X(t) { return pad.l + (t - tmin) / (tmax - tmin) * iw; }
    function Y(v) { return pad.t + (1 - (v - vmin) / (vmax - vmin)) * ih; }
    var g = '';
    for (var i = 0; i <= 4; i++) {
      var val = vmin + (vmax - vmin) * i / 4, y = Y(val);
      g += '<line x1="' + pad.l + '" x2="' + (W - pad.r) + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '" class="grid"/>' +
        '<text x="' + (pad.l - 10) + '" y="' + (y + 4).toFixed(1) + '" class="ax" text-anchor="end">' + axisFmt(val, (vmax - vmin) / 4) + '</text>';
    }
    var span = tmax - tmin, nt = W < 480 ? 2 : 4;
    for (var j = 0; j <= nt; j++) {
      var t = tmin + span * j / nt, dt = new Date(t);
      var lab = span > 60 * 86400e3 ? dt.toLocaleDateString(loc(), { month: 'short', year: '2-digit' }) : span > 2 * 86400e3 ? dt.toLocaleDateString(loc(), { day: '2-digit', month: '2-digit' }) : dt.toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit' });
      g += '<text x="' + X(t).toFixed(1) + '" y="' + (H - 8) + '" class="ax" text-anchor="' + (j === 0 ? 'start' : j === nt ? 'end' : 'middle') + '">' + lab + '</text>';
    }
    var line = '', area = '';
    if (single) {
      var yy = Y(pts[0].v).toFixed(1);
      line = '<line x1="' + pad.l + '" x2="' + X(pts[0].t).toFixed(1) + '" y1="' + yy + '" y2="' + yy + '" class="ln dash" stroke="' + opt.color + '"/>';
    } else {
      var dpath = pts.map(function (p, k) { return (k ? 'L' : 'M') + X(p.t).toFixed(1) + ' ' + Y(p.v).toFixed(1); }).join(' ');
      area = '<path d="' + dpath + ' L' + X(pts[pts.length - 1].t).toFixed(1) + ' ' + (pad.t + ih) + ' L' + X(pts[0].t).toFixed(1) + ' ' + (pad.t + ih) + ' Z" fill="url(#' + id + ')"/>';
      line = '<path d="' + dpath + '" class="ln" stroke="' + opt.color + '"/>';
    }
    var lp = pts[pts.length - 1];
    el.innerHTML =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' + esc(opt.label) + '">' +
        '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + opt.color + '" stop-opacity=".35"/><stop offset="1" stop-color="' + opt.color + '" stop-opacity="0"/></linearGradient></defs>' +
        g + area + line +
        '<circle cx="' + X(lp.t).toFixed(1) + '" cy="' + Y(lp.v).toFixed(1) + '" r="9" fill="' + opt.color + '" opacity=".25" class="pulse-dot"/>' +
        '<circle cx="' + X(lp.t).toFixed(1) + '" cy="' + Y(lp.v).toFixed(1) + '" r="4.5" fill="#fff" stroke="' + opt.color + '" stroke-width="2.5"/>' +
        '<line class="cross" x1="0" x2="0" y1="' + pad.t + '" y2="' + (pad.t + ih) + '" visibility="hidden"/>' +
        '<circle class="hov" r="5" fill="' + opt.color + '" stroke="#fff" stroke-width="2" visibility="hidden"/>' +
        '<rect x="' + pad.l + '" y="' + pad.t + '" width="' + iw + '" height="' + ih + '" fill="transparent" class="hit"/>' +
      '</svg>' +
      (single ? '<p class="chart-hint">' + u('growing') + '</p>' : '') +
      '<div class="tip" hidden></div>';
    var svg = el.querySelector('svg'), tip = el.querySelector('.tip'), cross = svg.querySelector('.cross'), hov = svg.querySelector('.hov');
    svg.querySelector('.hit').addEventListener('pointermove', function (e) {
      var r = svg.getBoundingClientRect(), mx = (e.clientX - r.left) * (W / r.width);
      var best = pts[0], bd = Infinity;
      pts.forEach(function (p) { var dd = Math.abs(X(p.t) - mx); if (dd < bd) { bd = dd; best = p; } });
      var cx = X(best.t), cy = Y(best.v);
      cross.setAttribute('x1', cx); cross.setAttribute('x2', cx); cross.setAttribute('visibility', 'visible');
      hov.setAttribute('cx', cx); hov.setAttribute('cy', cy); hov.setAttribute('visibility', 'visible');
      tip.hidden = false;
      tip.innerHTML = '<b>' + nf(best.v) + '</b><span>' + new Date(best.t).toLocaleString(loc(), { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + '</span>';
      var left = cx / W * r.width; tip.style.left = Math.min(Math.max(left, 80), r.width - 80) + 'px'; tip.style.top = (cy / H * r.height - 12) + 'px';
    });
    svg.querySelector('.hit').addEventListener('pointerleave', function () { tip.hidden = true; cross.setAttribute('visibility', 'hidden'); hov.setAttribute('visibility', 'hidden'); });
  }
  /* Étiquettes d'axe assez précises pour que deux graduations ne se ressemblent jamais */
  function axisFmt(v, step) {
    var div = v >= 1e6 ? 1e6 : v >= 1e3 ? 1e3 : 1, unit = div === 1e6 ? 'M' : div === 1e3 ? 'k' : '';
    var dec = div === 1 ? 0 : Math.max(0, Math.ceil(-Math.log10(step / div)));
    if (div > 1 && step / div < 1 && dec < 1) dec = 1;
    if (dec > 2) return nf(Math.round(v));
    var s = (v / div).toFixed(dec);
    return (lang === 'en' ? s : s.replace('.', ',')) + (unit ? (lang === 'en' ? unit : ' ' + unit) : '');
  }
  function breakdown(el, map) {
    if (!el || !map) return;
    var rows = Object.keys(map).map(function (k) { return [k, map[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
    var total = rows.reduce(function (s, r) { return s + r[1]; }, 0) || 1;
    el.innerHTML = rows.map(function (r) {
      return '<a class="bd" href="collaborations.html#' + r[0] + '">' + avatar(r[0], 'av-sm') + '<span class="bd-n">' + esc(CREATORS[r[0]].name) + '</span><span class="bd-bar"><span style="width:' + (r[1] / total * 100).toFixed(1) + '%"></span></span><span class="bd-v">' + compact(r[1]) + '</span></a>';
    }).join('');
  }
  /* Détail du compteur total : qui a fait le plus de vues, sur quel réseau */
  function genDetail() {
    var rows = [], y = lastLive('yt'), t = lastLive('tt');
    if (y) for (var k in y.views) rows.push([k, 'yt', y.views[k]]);
    if (t) for (var k2 in t.views) rows.push([k2, 'tt', t.views[k2]]);
    rows.sort(function (a, b) { return b[2] - a[2]; });
    var total = genTotal() || 1;
    return '<div class="gen-pop-h">' + u('genBy') + '</div>' + rows.map(function (r, i) {
      return '<a class="gen-row" href="collaborations.html#' + r[0] + '">' + '<span class="gen-rank">' + (i + 1) + '</span>' + avatar(r[0], 'av-sm') +
        '<span class="gen-who"><b>' + esc(CREATORS[r[0]].name) + '</b><small>' + (r[1] === 'yt' ? I.youtube : I.tiktok) + NETNAME[r[1]] + ' · ' + Math.round(r[2] / total * 100) + ' %</small></span>' +
        '<span class="gen-v">' + compact(r[2]) + '</span></a>';
    }).join('');
  }
  function renderLive(isNew) {
    if (!STATS) return;
    var ytb = STATS.youtube || {}, ttb = STATS.tiktok || {};
    var ly = lastLive('yt'), lt = lastLive('tt'), py = prevLive('yt'), pt = prevLive('tt');
    var gen = genTotal();
    var prevGen = shownGen != null ? shownGen : ((py ? sumObj(py.views) : (ly ? sumObj(ly.views) : 0)) + (pt ? sumObj(pt.views) : (lt ? sumObj(lt.views) : 0)));
    var plus = gen - prevGen;
    document.querySelectorAll('[data-live]').forEach(function (e) {
      var k = e.dataset.live;
      if (k === 'gen') e.textContent = fmtGen(gen);
      if (k === 'genFull') e.textContent = nf(gen);
      if (k === 'genPlus') { e.hidden = !(plus > 0); e.textContent = '+' + nf(plus); if (plus > 0 && isNew) { e.classList.remove('pop'); void e.offsetWidth; e.classList.add('pop'); } }
      if (k === 'genPop') e.innerHTML = genDetail();
      if (k === 'yt' && ly) e.textContent = fmtGen(sumObj(ly.views));
      if (k === 'tt' && lt) e.textContent = fmtGen(sumObj(lt.views));
      if (k === 'ytFull' && ly) e.textContent = nf(sumObj(ly[ytField]));
      if (k === 'ttFull' && lt) e.textContent = nf(sumObj(lt[ttField]));
      if (k === 'ytLabel') e.textContent = ytField === 'views' ? u('viewsSince') : u('subsNow');
      if (k === 'ttLabel') e.textContent = ttField === 'views' ? u('viewsSince') : ttField === 'followers' ? u('followersW') : u('likesProfile');
      if (k === 'ytAgo' && ly) e.textContent = u('lastData') + ' · ' + ago(ly.t);
      if (k === 'ttAgo' && lt) e.textContent = u('lastData') + ' · ' + ago(lt.t);
    });
    shownGen = gen;
    chart(document.getElementById('ytChart'), ytField === 'views' ? viewsSeries(ytb) : liveSeries(ytb, 'subs'), { color: '#3CCBFF', label: 'YouTube', zero: ytField === 'views' });
    chart(document.getElementById('ttChart'), ttField === 'views' ? viewsSeries(ttb) : liveSeries(ttb, ttField), { color: '#9B7BFF', label: 'TikTok', zero: ttField === 'views' });
    if (ly) breakdown(document.getElementById('ytBreak'), ly[ytField]);
    if (lt) breakdown(document.getElementById('ttBreak'), lt[ttField]);
  }
  function loadStats(first) {
    if (!document.querySelector('[data-live]')) return;
    fetch('data/stats.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .catch(function () { return STATS || window.STATS_SEED; })
      .then(function (s) {
        if (!s) return;
        var stamp = JSON.stringify([((s.youtube || {}).live || []).length, ((s.tiktok || {}).live || []).length, (((s.youtube || {}).live || []).slice(-1)[0] || {}).t, (((s.tiktok || {}).live || []).slice(-1)[0] || {}).t]);
        var isNew = stamp !== lastStamp;
        STATS = s; lastStamp = stamp;
        if (isNew || first) renderLive(!first);
        if (isNew && !first) { say(u('newData')); document.querySelectorAll('.live-card, .gen').forEach(function (c) { c.classList.remove('flash'); void c.offsetWidth; c.classList.add('flash'); }); }
        else renderAgo();
      });
  }
  function renderAgo() {
    if (!STATS) return;
    var ly = lastLive('yt'), lt = lastLive('tt');
    document.querySelectorAll('[data-live="ytAgo"]').forEach(function (e) { if (ly) e.textContent = u('lastData') + ' · ' + ago(ly.t); });
    document.querySelectorAll('[data-live="ttAgo"]').forEach(function (e) { if (lt) e.textContent = u('lastData') + ' · ' + ago(lt.t); });
  }
  function bindToggle(attr, set) {
    document.querySelectorAll('[' + attr + ']').forEach(function (b) {
      b.addEventListener('click', function () {
        set(b.getAttribute(attr));
        document.querySelectorAll('[' + attr + ']').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        renderLive(false);
      });
    });
  }
  bindToggle('data-yt', function (v) { ytField = v; });
  bindToggle('data-tt', function (v) { ttField = v; });
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { renderLive(false); }, 150); });

  /* ================= Rendu des pages ================= */
  function renderAll() {
    var feat = document.getElementById('featured');
    if (feat) { feat.innerHTML = ''; bestPerChannel().forEach(function (v) { feat.appendChild(videoCard(v, true)); }); }

    var by = document.getElementById('byChannel');
    if (by) {
      by.innerHTML = '';
      MONTAGE_CHANNELS.forEach(function (k) {
        var c = CREATORS[k], list = sorted.filter(function (v) { return v.ch === k; });
        var sec = document.createElement('div'); sec.className = 'ch-sec'; sec.dataset.ch = k;
        sec.innerHTML = '<div class="ch-head">' + avatar(k, 'av-lg') + '<div style="min-width:0"><h2>' + esc(c.name) + '</h2><span>' + list.length + ' ' + (list.length > 1 ? u('videos') : u('video')) + ' · ' + esc(c.role[lang === 'en' ? 1 : 0]) + '</span></div>' +
          (c.links.youtube ? '<a class="btn btn-ghost btn-sm" href="' + c.links.youtube + '" target="_blank" rel="noopener">' + u('channel') + '</a>' : '') + '</div><div class="vids"></div>';
        var g = sec.querySelector('.vids'); list.forEach(function (v) { g.appendChild(videoCard(v)); });
        by.appendChild(sec);
      });
      var fl = document.getElementById('chFilter');
      fl.innerHTML = '<button type="button" data-f="all" aria-pressed="true">' + u('all') + '</button>' +
        MONTAGE_CHANNELS.map(function (k) { return '<button type="button" data-f="' + k + '" aria-pressed="false">' + esc(CREATORS[k].name) + '</button>'; }).join('');
      fl.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          fl.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          by.querySelectorAll('.ch-sec').forEach(function (s) { s.hidden = !(b.dataset.f === 'all' || s.dataset.ch === b.dataset.f); });
        });
      });
    }

    var cr = document.getElementById('creators');
    if (cr) { cr.innerHTML = ''; COLLABS.forEach(function (k) { cr.appendChild(creatorCard(k)); }); }

    var cl = document.getElementById('clients');
    if (cl) {
      var items = CLIENTS.map(clientItem).join('');
      cl.innerHTML = '<div class="marquee-track">' + items + '<span class="dup" aria-hidden="true">' + items + '</span></div>';
      cl.querySelectorAll('.dup a').forEach(function (a) { a.tabIndex = -1; });
    }

    var totalViews = VIDEOS.reduce(function (s, v) { return s + v.v; }, 0);
    var totalLikes = VIDEOS.reduce(function (s, v) { return s + v.l; }, 0);
    document.querySelectorAll('[data-num]').forEach(function (el) {
      var val = { views: compact(totalViews), likes: nf(totalLikes), count: String(VIDEOS.length), claim: '+' + ME.viewsClaim, avg: compact(Math.round(totalViews / VIDEOS.length)) }[el.dataset.num];
      if (val != null) el.textContent = val;
    });

    var bv = document.getElementById('barsVid');
    if (bv) {
      var max = sorted[0].v;
      bv.innerHTML = sorted.slice(0, 10).map(function (v) {
        return '<button type="button" class="bar bar-vid" data-vid="' + v.id + '"><span class="lbl"><img class="bthumb" alt="" loading="lazy" src="https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg"><span class="lbl-t" title="' + esc(v.t) + '">' + esc(v.t) + '<small>' + esc(CREATORS[v.ch].name) + '</small></span></span><span class="track"><span class="fill" style="display:block;width:' + (v.v / max * 100).toFixed(1) + '%"></span></span><span class="val">' + compact(v.v) + '</span></button>';
      }).join('');
      bv.querySelectorAll('[data-vid]').forEach(function (b) { b.addEventListener('click', function () { openVideo(VIDEOS.filter(function (v) { return v.id === b.dataset.vid; })[0]); }); });
    }
    function byChannel(field) {
      var m = {}; VIDEOS.forEach(function (v) { m[v.ch] = (m[v.ch] || 0) + v[field]; });
      var arr = Object.keys(m).map(function (k) { return [k, m[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
      var mx = arr[0][1];
      return arr.map(function (p) {
        return '<div class="bar"><a class="lbl lbl-ch" href="collaborations.html#' + p[0] + '">' + avatar(p[0], 'av-sm') + '<span>' + esc(CREATORS[p[0]].name) + '</span></a><span class="track"><span class="fill" style="display:block;width:' + (p[1] / mx * 100).toFixed(1) + '%"></span></span><span class="val">' + (field === 'v' ? compact(p[1]) : nf(p[1])) + '</span></div>';
      }).join('');
    }
    var bc = document.getElementById('barsCh'); if (bc) bc.innerHTML = byChannel('v');
    var bl = document.getElementById('barsLikes'); if (bl) bl.innerHTML = byChannel('l');

    document.querySelectorAll('.js-discord').forEach(function (a) {
      a.href = discordHref();
      if (ME.discordId) { a.target = '_blank'; a.rel = 'noopener'; }
    });
    document.querySelectorAll('.js-email').forEach(function (e) { e.textContent = ME.email; if (e.tagName === 'A') e.href = 'mailto:' + ME.email; });
    renderLive(false);
  }

  /* ================= Langue ================= */
  function collect() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) { if (!el.dataset.fr) el.dataset.fr = el.innerHTML; });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { if (!el.dataset.frPh) el.dataset.frPh = el.placeholder; });
  }
  function applyLang(l) {
    lang = l;
    try { localStorage.setItem('vx-lang', l); } catch (e) {}
    document.documentElement.lang = l;
    collect();
    document.querySelectorAll('[data-i18n]').forEach(function (el) { var k = el.dataset.i18n; el.innerHTML = l === 'en' && EN[k] ? EN[k] : el.dataset.fr; });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { var k = el.dataset.i18nPh; el.placeholder = l === 'en' && EN[k] ? EN[k] : el.dataset.frPh; });
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === l ? 'true' : 'false'); });
    var tEl = document.querySelector('title'); if (tEl) { if (!tEl.dataset.fr) tEl.dataset.fr = tEl.textContent; tEl.textContent = l === 'en' && tEl.dataset.en ? tEl.dataset.en : tEl.dataset.fr; }
    renderAll();
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { applyLang(b.dataset.lang); }); });
  STATS = window.STATS_SEED || null;
  applyLang(lang);
  loadStats(true);
  setInterval(function () { loadStats(false); }, 60 * 1000);

  /* ================= Formulaire de contact =================
     Envoi via FormSubmit (gratuit, sans compte) vers ME.email.
     La toute première demande déclenche un email d'activation de FormSubmit : clique sur "Activate Form". */
  var form = document.getElementById('contactForm');
  if (form) {
    var msg = document.getElementById('formMsg'), btn = form.querySelector('button[type=submit]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = Object.fromEntries(new FormData(form).entries());
      if (d._honey) return;
      msg.hidden = true;
      if (!d.nom || !d.email || !d.message) { show('err', u('required')); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) { show('err', u('badEmail')); return; }
      var label = btn.innerHTML; btn.disabled = true; btn.textContent = u('sending');
      var payload = {
        Nom: d.nom, Email: d.email, Demande: d.type, Budget: d.budget || '-', Delai: d.delai || '-', Chaine: d.lien || '-', Message: d.message,
        Langue: lang.toUpperCase(),
        _subject: '[Site Veltrixx] ' + d.type + ' — ' + d.nom,
        _replyto: d.email, _template: 'table', _captcha: 'false'
      };
      fetch('https://formsubmit.co/ajax/' + ME.email, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload)
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (String(res.success) === 'true') { show('ok', u('ok')); form.reset(); }
        else throw new Error(res.message || 'error');
      }).catch(function () {
        show('err', u('err') + ME.email);
      }).finally(function () { btn.disabled = false; btn.innerHTML = label; });
    });
    function show(type, text) { msg.className = 'msg ' + type; msg.textContent = text; msg.hidden = false; }
  }
  document.querySelectorAll('.js-copy-email').forEach(function (b) {
    b.addEventListener('click', function () { copy(ME.email, function () { say(u('copied') + ' ' + ME.email); }); });
  });

  /* Apparition au scroll (les éléments restent visibles sans JS) */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('rise'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.sec-head, .panel, .cr, .stat, .org .col, .tasks li, .cta-box, .ch-sec').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) io.observe(el);
    });
  }
})();
