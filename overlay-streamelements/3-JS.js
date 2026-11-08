/* Overlay Veltrixx — onglet JS du widget personnalisé StreamElements.
   Les données viennent de ton site (assets/data.js et data/stats.json), comme sur la page Statistiques.
   Si le site n'est pas joignable, l'overlay affiche les derniers chiffres connus (relevé du 8 nov. 2026). */
(function () {
  var DEFAULTS = {
    siteUrl: '', lang: 'fr', position: 'bottom', scale: 1, offset: 40,
    displaySeconds: 12, gapSeconds: 25, refreshMinutes: 5,
    showVideos: true, showStats: true, showSocials: true, showCode: true,
    creatorCode: 'VELTRIXXVFX', testPanel: 'cycle', chatCommands: true
  };

  /* Secours si le site ne répond pas */
  var FALLBACK = {
    me: { pseudo: 'Veltrixx', pp: 'https://unavatar.io/x/veltrixx10', x: 'https://x.com/veltrixx10', twitch: 'https://www.twitch.tv/veltrixx10', discordUser: 'veltrixxm10', email: 'contact@veltrixx.eu' },
    videos: [
      { id: 'IXR9GzDJFm4', ch: 'leo', t: 'J’ai RÉUNI 6 PROS pour un 3VS3 TOKEN avec SHXRK, RAX, AKIIRA.. (Akiira est devenu Peterbot..)', v: 62276, dur: '18:47' },
      { id: '8misPuF_eQ8', ch: 'leo', t: 'J’ai ORGANISÉ LE 1VS1 entre le MEILLEUR JOUEUR DU MONDE et le MEILLEUR FRANÇAIS.. (Faut voir ça)', v: 33251, dur: '18:13' },
      { id: 'lGLx3EJRSSY', ch: 'leo', t: 'J\'ai ORGANISÉ UN 2VS2 ENTRE PROS AVEC DE L\'ARGENT EN JEU (Faut voir ça)', v: 20661, dur: '19:01' }
    ],
    creators: { leo: { name: 'Leothecrack', pp: 'assets/pp/leo.jpg' }, akiira: { name: 'Akiira', pp: 'assets/pp/akiira.jpg' }, werex: { name: 'Werex', pp: 'assets/pp/werex.jpg' }, skyjump: { name: 'SkyJump', pp: 'assets/pp/skyjump.jpg' } },
    stats: {
      yt: { werex: 102026, akiira: 112784, skyjump: 101524, leo: 392278 },
      tt: { akiira: 2957728, werex: 1249753, skyjump: 1015579 },
      t: '2026-11-08T00:10:00Z',
      series: [[1774702842,1193],[1776199278,88119],[1776536114,161160],[1777228792,176223],[1777550252,206526],[1779225543,221437],[1779884976,269031],[1780129311,402647],[1780585221,476538],[1780850606,489005],[1781206845,591030],[1781467547,713500],[1781731835,910298],[1781993467,1075549],[1782253288,1372920],[1782507424,1558569],[1782729409,1889431],[1783024217,1941333],[1783270235,2086014],[1783548010,2240329],[1783803785,2569073],[1784072254,2716361],[1784293229,2932565],[1784591972,3059970],[1784802072,3175818],[1785099629,3264455],[1785354632,3416970],[1785575286,3659974],[1785884021,3855886],[1786101397,4054163],[1786384050,4157712],[1786631817,4231625],[1786980660,4431844],[1787265128,4540320],[1787604464,4839915],[1787998449,4868454],[1788359421,4904158],[1788655948,4927126],[1788967815,4957866],[1789212030,5000614],[1789576218,5051222],[1789894300,5134186],[1790356525,5169214],[1790629140,5229348],[1790894039,5260951],[1791151761,5343394],[1791446231,5356866],[1791923208,5498741],[1792441293,5649163],[1793145442,5743052],[1793377819,5800224],[1793743159,5819640],[1793983740,5909551],[1794095892,5931672]]
    }
  };

  var T = {
    fr: { role: 'Monteur vidéo', live: 'Live', vids: 'Top <span class="b">montages</span>', stats: 'Vues <span class="b">générées</span>', socials: 'Mes <span class="b">réseaux</span>', code: 'Code créateur <span class="g">Epic</span>', k_vids: 'Les plus vus', k_stats: 'YouTube + TikTok', k_socials: 'Retrouve-moi', k_code: 'Epic Games', views: 'vues', since: 'YouTube + TikTok · depuis mon arrivée chez chaque créateur', most: 'N°1', on: 'sur', site: 'Site', contact: 'Contact pro', shop: 'Boutique d’objets Fortnite', how: 'Utilise mon code dans la boutique d’objets Fortnite pour me soutenir', pub: '#publicité', upd: 'Mis à jour', ago: 'il y a {n} min', now: 'à l’instant', h: 'il y a {n} h' },
    en: { role: 'Video editor', live: 'Live', vids: 'Top <span class="b">edits</span>', stats: 'Views <span class="b">generated</span>', socials: 'My <span class="b">socials</span>', code: 'Epic creator <span class="g">code</span>', k_vids: 'Most watched', k_stats: 'YouTube + TikTok', k_socials: 'Find me', k_code: 'Epic Games', views: 'views', since: 'YouTube + TikTok · since I joined each creator', most: 'No. 1', on: 'on', site: 'Website', contact: 'Business contact', shop: 'Fortnite Item Shop', how: 'Use my code in the Item Shop to support me', pub: '#ad', upd: 'Updated', ago: '{n} min ago', now: 'just now', h: '{n} h ago' }
  };
  var I = {
    eye: '<svg class="ey" viewBox="0 0 16 16"><path d="M8 3C4 3 1.5 6.5 1 8c.5 1.5 3 5 7 5s6.5-3.5 7-5c-.5-1.5-3-5-7-5zm0 8a3 3 0 110-6 3 3 0 010 6z"/></svg>',
    yt: '<svg viewBox="0 0 16 16"><path d="M2 3.5h12a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5H2A1.5 1.5 0 01.5 11V5A1.5 1.5 0 012 3.5zm4.5 2v5l4-2.5z"/></svg>',
    tt: '<svg viewBox="0 0 16 16"><path d="M9 1h2.4c.2 1.6 1.3 2.7 3 2.9v2.4c-1.1 0-2.1-.3-3-.9V10a4.5 4.5 0 11-4.5-4.5v2.5A2 2 0 109 10z"/></svg>',
    x: '<svg viewBox="0 0 16 16"><path d="M2 2h3.2L8 6l3-4h2.5L9.2 7.6 14 14h-3.2L7.8 9.9 4.6 14H2l4.6-5.8z"/></svg>',
    tw: '<svg viewBox="0 0 16 16"><path d="M2.5 1L1.5 4v9h3v2h2l2-2h2.5l3.5-3.5V1zm10 8l-2 2H8l-2 2v-2H3.5V2.5h9zM10 4.5h1.5V8H10zm-3.5 0H8V8H6.5z"/></svg>',
    dc: '<svg viewBox="0 0 16 16"><path d="M13.5 3.2A12 12 0 0010.6 2l-.4.8a11 11 0 00-4.4 0L5.4 2a12 12 0 00-2.9 1.2C.7 6 .3 8.7.5 11.4a12 12 0 003.6 1.8l.8-1.2c-.5-.2-.9-.4-1.3-.7l.3-.2a8.5 8.5 0 007.2 0l.3.2c-.4.3-.8.5-1.3.7l.8 1.2a12 12 0 003.6-1.8c.3-3.1-.5-5.8-2-8.2zM5.6 9.8c-.7 0-1.3-.7-1.3-1.5s.6-1.5 1.3-1.5 1.3.7 1.3 1.5-.6 1.5-1.3 1.5zm4.8 0c-.7 0-1.3-.7-1.3-1.5s.6-1.5 1.3-1.5 1.3.7 1.3 1.5-.6 1.5-1.3 1.5z"/></svg>',
    web: '<svg viewBox="0 0 16 16"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm4.9 6.2h-2.2a11 11 0 00-.9-4 5.4 5.4 0 013.1 4zM8 2.7c.6.8 1.1 2.4 1.2 4.5H6.8C6.9 5.1 7.4 3.5 8 2.7zM6.2 3.2a11 11 0 00-.9 4H3.1a5.4 5.4 0 013.1-4zM3.1 8.8h2.2a11 11 0 00.9 4 5.4 5.4 0 01-3.1-4zM8 13.3c-.6-.8-1.1-2.4-1.2-4.5h2.4c-.1 2.1-.6 3.7-1.2 4.5zm1.8-.5a11 11 0 00.9-4h2.2a5.4 5.4 0 01-3.1 4z"/></svg>',
    mail: '<svg viewBox="0 0 16 16"><path d="M1.5 3h13a1 1 0 011 1v8a1 1 0 01-1 1h-13a1 1 0 01-1-1V4a1 1 0 011-1zm.5 1.6v.3L8 9l6-4.1v-.3zm0 2.2V11.4h12V6.8L8 10.9z"/></svg>'
  };

  var F = {}, D = null, S = null, idx = 0, timer = null, current = null, shownTotal = null, plus = 0, started = false;
  var card = document.getElementById('card'), stage = document.getElementById('stage');

  function on(v) { return v === true || v === 'true' || v === 1 || v === '1'; }
  function t(k) { return (T[F.lang] || T.fr)[k]; }
  function loc() { return F.lang === 'en' ? 'en-US' : 'fr-FR'; }
  function nf(n) { return Number(n).toLocaleString(loc()).replace(/\u202f/g, '\u00a0'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function compact(n) {
    n = Number(n); var s, u;
    if (n >= 1e6) { s = (Math.round(n / 1e5) / 10).toFixed(1); u = 'M'; }
    else if (n >= 1e3) { s = String(Math.round(n / 100) / 10).replace(/\.0$/, ''); u = 'k'; }
    else return String(n);
    return F.lang === 'en' ? s + u : s.replace('.', ',') + ' ' + u;
  }
  function base() { return String(F.siteUrl || '').trim().replace(/\/+$/, ''); }
  function domain() { return base().replace(/^https?:\/\//, ''); }
  function abs(u) { if (!u) return ''; if (/^https?:/.test(u)) return u; return base() ? base() + '/' + u.replace(/^\.?\//, '') : ''; }
  function sum(o) { var s = 0; for (var k in o) s += Number(o[k]) || 0; return s; }

  /* ---------- Données ---------- */
  function me() { return (D && D.ME) || FALLBACK.me; }
  function creators() { return (D && D.CREATORS) || FALLBACK.creators; }
  function topVideos() { var v = ((D && D.VIDEOS) || FALLBACK.videos).slice(); v.sort(function (a, b) { return b.v - a.v; }); return v.slice(0, 3); }
  function liveTotals() {
    if (S && S.youtube && S.tiktok) {
      var y = (S.youtube.live || []).slice(-1)[0], k = (S.tiktok.live || []).slice(-1)[0];
      if (y && k) return { yt: y.views, tt: k.views, t: y.t > k.t ? y.t : k.t };
    }
    return { yt: FALLBACK.stats.yt, tt: FALLBACK.stats.tt, t: FALLBACK.stats.t };
  }
  function series() {
    if (!(S && S.youtube && S.tiktok)) return FALLBACK.stats.series.map(function (p) { return { t: p[0] * 1000, v: p[1] }; });
    var all = [];
    [S.youtube.videos || {}, S.tiktok.videos || {}].forEach(function (blk) { for (var k in blk) blk[k].forEach(function (v) { all.push(v); }); });
    all.sort(function (a, b) { return a[0] - b[0]; });
    var pts = [], acc = 0;
    all.forEach(function (v) { acc += v[1]; var d = Math.floor(v[0] / 86400); if (pts.length && Math.floor(pts[pts.length - 1].t / 86400000) === d) pts[pts.length - 1].v = acc; else pts.push({ t: v[0] * 1000, v: acc }); });
    var lt = liveTotals(), tt = new Date(lt.t).getTime(), tot = sum(lt.yt) + sum(lt.tt);
    if (!pts.length || tt > pts[pts.length - 1].t) pts.push({ t: tt, v: tot });
    return pts;
  }
  function loadData() {
    if (!base()) return Promise.resolve();
    return fetch(base() + '/assets/data.js?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw 0; return r.text(); })
      .then(function (txt) {
        D = new Function(txt + '\n;return {ME: typeof ME !== "undefined" ? ME : null, VIDEOS: typeof VIDEOS !== "undefined" ? VIDEOS : null, CREATORS: typeof CREATORS !== "undefined" ? CREATORS : null};')();
      }).catch(function () {});
  }
  function loadStats() {
    if (!base()) return Promise.resolve();
    return fetch(base() + '/data/stats.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) {
        var before = shownTotal;
        S = j;
        var lt = liveTotals(), tot = sum(lt.yt) + sum(lt.tt);
        if (before != null && tot > before) { plus = tot - before; if (current === 'stats') refreshStatsPanel(true); }
      }).catch(function () {});
  }
  function ago(iso) {
    var m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (m < 1) return t('now'); if (m < 60) return t('ago').replace('{n}', m); return t('h').replace('{n}', Math.round(m / 60));
  }

  /* ---------- Morceaux communs ---------- */
  function avatar(key) {
    var c = creators()[key] || { name: key };
    var src = abs(c.pp);
    return '<span class="av">' + esc((c.name || '?').charAt(0)) + (src ? '<img src="' + esc(src) + '" alt="" onerror="this.remove()">' : '') + '</span>';
  }
  /* En-tête du module : ta photo, ton pseudo, le titre du contenu */
  function head(title) {
    var m = me();
    return '<div class="hd it" style="--d:0"><span class="me"><b>V</b><img src="' + esc(m.pp || FALLBACK.me.pp) + '" alt="" onerror="this.remove()"></span>' +
      '<span class="nm">' + esc(m.pseudo || 'Veltrixx') + '</span><span class="sep"></span><h2 class="ttl">' + title + '</h2>' +
      '<span class="live"><span class="dot"></span>' + t('live') + '</span></div>';
  }

  /* ---------- Contenus du module ---------- */
  function pVideos() {
    var html = head(t('vids')) + '<div class="bd">';
    topVideos().forEach(function (v, i) {
      html += '<div class="v it' + (i === 0 ? ' first' : '') + '" style="--d:' + (1 + i) + '"><img src="https://i.ytimg.com/vi/' + esc(v.id) + '/mqdefault.jpg" alt="">' +
        '<span class="rk">#' + (i + 1) + '</span><span class="vm">' + avatar(v.ch) + I.eye + compact(v.v) + '</span></div>';
    });
    return html + '</div>';
  }
  function chartSvg(pts) {
    var W = 300, H = 88, pad = 8;
    var t0 = pts[0].t, t1 = pts[pts.length - 1].t, vmax = pts[pts.length - 1].v * 1.1 || 1;
    function X(x) { return (t1 === t0 ? W - 12 : (x - t0) / (t1 - t0) * (W - 12)); }
    function Y(v) { return pad + (1 - v / vmax) * (H - pad - 4); }
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + X(p.t).toFixed(1) + ' ' + Y(p.v).toFixed(1); }).join(' ');
    var lp = pts[pts.length - 1], grid = '';
    for (var g = 1; g <= 2; g++) { var gy = (pad + (H - pad) * g / 3).toFixed(1); grid += '<line class="gr" x1="0" x2="' + W + '" y1="' + gy + '" y2="' + gy + '"/>'; }
    var len = 2000;
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none"><defs><linearGradient id="vxg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3CCBFF" stop-opacity=".4"/><stop offset="1" stop-color="#3CCBFF" stop-opacity="0"/></linearGradient></defs>' + grid +
      '<path class="ar" d="' + d + ' L' + X(lp.t).toFixed(1) + ' ' + H + ' L0 ' + H + ' Z" fill="url(#vxg)"/>' +
      '<path class="ln" style="--len:' + len + '" pathLength="' + len + '" d="' + d + '"/></svg>' +
      '<span class="endpt" style="left:' + (X(lp.t) / W * 100).toFixed(2) + '%;top:' + (Y(lp.v) / H * 100).toFixed(2) + '%"></span>' +
      '<span class="ax l">' + new Date(t0).toLocaleDateString(loc(), { month: 'short', year: '2-digit' }) + '</span><span class="ax r">' + new Date(t1).toLocaleDateString(loc(), { day: '2-digit', month: 'short' }) + '</span>';
  }
  function pStats() {
    var lt = liveTotals(), yt = sum(lt.yt), tk = sum(lt.tt), tot = yt + tk;
    shownTotal = tot;
    return head(t('stats')) + '<div class="bd">' +
      '<div class="big it" style="--d:1"><div class="row"><b id="vxTot">' + compact(tot) + '</b><span class="plus" id="vxPlus"' + (plus > 0 ? '' : ' hidden') + '>+' + nf(plus) + '</span></div>' +
      '<div class="split"><span class="y">' + I.yt + '<b>' + compact(yt) + '</b></span><span class="k">' + I.tt + '<b>' + compact(tk) + '</b></span></div></div>' +
      '<div class="chart it" style="--d:2">' + chartSvg(series()) + '</div></div>';
  }
  function refreshStatsPanel(pop) {
    var lt = liveTotals(), tot = sum(lt.yt) + sum(lt.tt);
    var a = document.getElementById('vxTot'), p = document.getElementById('vxPlus');
    if (a) a.textContent = compact(tot);
    if (p && plus > 0) { p.hidden = false; p.textContent = '+' + nf(plus); if (pop) { p.classList.remove('pop'); void p.offsetWidth; p.classList.add('pop'); } }
    shownTotal = tot;
  }
  function pSocials() {
    var m = me(), rows = [
      ['x', I.x, '@' + String(m.x || 'https://x.com/veltrixx10').split('/').pop()],
      ['tw', I.tw, String(m.twitch || 'https://www.twitch.tv/veltrixx10').split('/').pop()],
      ['dc', I.dc, m.discordUser || 'veltrixxm10'],
      domain() ? ['web', I.web, domain()] : ['mail', I.mail, m.email || FALLBACK.me.email]
    ];
    return head(t('socials')) + '<div class="bd"><div class="soc">' +
      rows.map(function (r, i) { return '<div class="s ' + r[0] + ' it" style="--d:' + (1 + i) + '"><span class="ic">' + r[1] + '</span><b>' + esc(r[2]) + '</b></div>'; }).join('') +
      '</div></div>';
  }
  function pCode() {
    return head(t('code')) + '<div class="bd">' +
      '<div class="codewrap it" style="--d:1"><div class="code"><b>' + esc(String(F.creatorCode || 'VELTRIXXVFX').toUpperCase()) + '</b></div><span class="pub">' + t('pub') + '</span></div></div>';
  }
  var BUILD = { videos: pVideos, stats: pStats, socials: pSocials, code: pCode };

  /* ---------- Enchaînement : entrée par la gauche, pause, sortie par la gauche ---------- */
  function list() {
    var l = [];
    if (on(F.showVideos)) l.push('videos');
    if (on(F.showStats)) l.push('stats');
    if (on(F.showSocials)) l.push('socials');
    if (on(F.showCode)) l.push('code');
    return l;
  }
  function show(key, hold) {
    clearTimeout(timer);
    current = key;
    card.className = 'card panel-' + key;
    card.innerHTML = BUILD[key]() + (hold ? '' : '<div class="prog"><span></span></div>');
    card.style.setProperty('--dur', (Number(F.displaySeconds) || 12) + 's');
    void card.offsetWidth;
    card.classList.add('in');
    if (key === 'stats') plus = 0;
    if (!hold) timer = setTimeout(hide, (Number(F.displaySeconds) || 12) * 1000);
  }
  function hide(then) {
    clearTimeout(timer);
    card.classList.remove('in'); card.classList.add('out');
    current = null;
    timer = setTimeout(function () {
      card.classList.remove('out');
      if (then) then(); else timer = setTimeout(next, (Number(F.gapSeconds) || 0) * 1000);
    }, 750);
  }
  function next() {
    var l = list(); if (!l.length) return;
    show(l[idx % l.length]); idx++;
  }
  /* Montre tout de suite un panneau précis (commande chat), puis reprend le cycle */
  function jump(key) {
    if (!BUILD[key]) return;
    if (current) hide(function () { show(key); }); else show(key);
  }

  function start() {
    if (started) return; started = true;
    document.documentElement.style.setProperty('--s', String(Number(F.scale) || 1));
    document.documentElement.style.setProperty('--offset', (Number(F.offset) || 0) + 'px');
    stage.className = 'stage pos-' + (F.position || 'bottom');
    Promise.all([loadData(), loadStats()]).then(function () {
      var test = F.testPanel && F.testPanel !== 'cycle' ? F.testPanel : null;
      if (test && BUILD[test]) show(test, true);
      else timer = setTimeout(next, 800);
    });
    setInterval(function () { loadStats(); loadData(); }, Math.max(1, Number(F.refreshMinutes) || 5) * 60000);
  }

  /* StreamElements : réglages du widget */
  window.addEventListener('onWidgetLoad', function (obj) {
    var fd = (obj && obj.detail && obj.detail.fieldData) || {};
    F = {}; for (var k in DEFAULTS) F[k] = fd[k] !== undefined && fd[k] !== '' ? fd[k] : DEFAULTS[k];
    start();
  });
  /* Commandes chat : !code, !reseaux, !stats, !montages */
  var CMDS = { '!code': 'code', '!reseaux': 'socials', '!réseaux': 'socials', '!socials': 'socials', '!stats': 'stats', '!montages': 'videos', '!edits': 'videos' };
  window.addEventListener('onEventReceived', function (obj) {
    if (!on(F.chatCommands) || !obj || !obj.detail || obj.detail.listener !== 'message') return;
    var data = obj.detail.event && obj.detail.event.data, txt = String((data && data.text) || '').trim().toLowerCase().split(/\s+/)[0];
    var badges = (data && data.badges) || [], allowed = badges.some(function (b) { return /broadcaster|moderator/.test(b.type); });
    if (allowed && CMDS[txt]) jump(CMDS[txt]);
  });
})();
