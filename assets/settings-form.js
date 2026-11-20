/* Paramètres du site Veltrixx : formulaire partagé entre le panneau admin du site (admin.html)
   et l'application SaaS Veltrixx (Mon site → Paramètres du site).
   Les données sont le bloc JSON de assets/data.js, entre DEBUT-PARAMETRES et FIN-PARAMETRES. */
(function (root) {
  'use strict';
  var LINKS = [['youtube', 'YouTube'], ['x', 'X'], ['tiktok', 'TikTok'], ['twitch', 'Twitch'], ['instagram', 'Instagram'], ['site', 'Site web'], ['discord', 'Discord']];
  var START = '/*DEBUT-PARAMETRES*/', END = '/*FIN-PARAMETRES*/';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function slug(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 24); }
  function ytId(v) {
    v = String(v || '').trim();
    var m = v.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
    return m ? m[1] : v;
  }
  function getP(o, path) { return path.split('.').reduce(function (a, k) { return a == null ? undefined : a[k]; }, o); }
  function setP(o, path, v) {
    var ks = path.split('.'), last = ks.pop(), t = o;
    ks.forEach(function (k, i) {
      if (t[k] == null || typeof t[k] !== 'object') t[k] = /^\d+$/.test(ks[i + 1] || last) ? [] : {};
      t = t[k];
    });
    t[last] = v;
  }

  /* ---------- Lecture / écriture de assets/data.js ---------- */
  function parse(text) {
    var a = text.indexOf(START), b = text.indexOf(END);
    if (a < 0 || b < a) throw new Error('Bloc de paramètres introuvable dans assets/data.js');
    return JSON.parse(text.slice(a + START.length, b));
  }
  function write(text, data) {
    var a = text.indexOf(START), b = text.indexOf(END);
    if (a < 0 || b < a) throw new Error('Bloc de paramètres introuvable dans assets/data.js');
    return text.slice(0, a + START.length) + JSON.stringify(data, null, 2) + text.slice(b);
  }

  /* Remet les données au propre avant l'enregistrement (le site attend certains formats). */
  function normalize(src) {
    var d = clone(src), keys;
    d.me = d.me || {};
    d.creators = d.creators || {};
    keys = Object.keys(d.creators);
    keys.forEach(function (k) {
      var c = d.creators[k];
      c.name = String(c.name || k).trim() || k;
      c.pp = String(c.pp || '').trim();
      ['desc', 'role'].forEach(function (f) { var v = Array.isArray(c[f]) ? c[f] : [c[f] || '', '']; c[f] = [String(v[0] || '').trim(), String(v[1] || v[0] || '').trim()]; });
      var links = {};
      Object.keys(c.links || {}).forEach(function (l) { var u = String(c.links[l] || '').trim(); if (u) links[l] = /^https?:\/\//i.test(u) ? u : 'https://' + u; });
      c.links = links;
      var stats = (c.stats || []).map(function (s) { return [String(s[0] || '').trim(), String(s[1] || '').trim()]; }).filter(function (s) { return s[0] || s[1]; });
      if (stats.length) c.stats = stats; else delete c.stats;
      if (!c.gold) delete c.gold; else c.gold = true;
      if (!String(c.page || '').trim()) delete c.page;
    });
    var has = function (k) { return keys.indexOf(k) >= 0; };
    ['clients', 'collabs', 'montageChannels'].forEach(function (l) { d[l] = (d[l] || []).filter(function (k, i, a) { return has(k) && a.indexOf(k) === i; }); });
    d.videos = (d.videos || []).map(function (v) {
      return { id: ytId(v.id), ch: v.ch, t: String(v.t || '').trim(), v: Math.max(0, Math.round(+v.v || 0)), l: Math.max(0, Math.round(+v.l || 0)), dur: String(v.dur || '').trim() };
    }).filter(function (v) { return v.id && has(v.ch); });
    d.reviews = (d.reviews || []).map(function (r) {
      var o = { name: String(r.name || '').trim(), role: String(r.role || '').trim(), rating: Math.min(5, Math.max(1, Math.round(+r.rating || 5))), text: String(r.text || '').trim(), date: r.date || '' };
      if (String(r.link || '').trim()) o.link = String(r.link).trim();
      return o;
    }).filter(function (r) { return r.name && r.text; });
    d.live = d.live || {};
    ['youtube', 'tiktok', 'since'].forEach(function (g) {
      var o = {}; Object.keys(d.live[g] || {}).forEach(function (k) { var v = String(d.live[g][k] || '').trim().replace(/^@/, ''); if (v && has(k)) o[k] = v; }); d.live[g] = o;
    });
    d.live.refreshMinutes = Math.max(5, Math.round(+d.live.refreshMinutes || 10));
    return d;
  }

  /* Ordre des rubriques dans data.js (lisible à la main) */
  function order(d) {
    var o = {};
    ['_maj', 'me', 'videos', 'creators', 'clients', 'collabs', 'montageChannels', 'reviews', 'live', 'supabase'].forEach(function (k) { if (d[k] !== undefined) o[k] = d[k]; });
    Object.keys(d).forEach(function (k) { if (!(k in o)) o[k] = d[k]; });
    return o;
  }
  function time(t) { return Date.parse(String(t || '').replace(/(\.\d{3})\d+/, '$1')) || 0; }

  /* ---------- Formulaire ---------- */
  function mount(el, data, o) {
    o = o || {};
    var cls = Object.assign({ btn: 'sf-btn', sm: 'sf-btn sf-sm', primary: 'sf-btn sf-primary', ghost: 'sf-btn sf-ghost', danger: 'sf-btn sf-danger' }, o.cls || {});
    var d = clone(data), open = {}, onChange = o.onChange || function () {};
    var asset = o.asset || function (s) { return s; };
    var ask = o.prompt || function (m) { return Promise.resolve(window.prompt(m)); };
    var sure = o.confirm || function (m) { return Promise.resolve(window.confirm(m)); };
    var notify = o.notify || function (m) { window.alert(m); };
    var field = o.field || function (label, control, opt) { return '<label class="sf-field' + (opt && opt.full ? ' sf-full' : '') + '"><span>' + label + '</span>' + control + (opt && opt.hint ? '<small>' + opt.hint + '</small>' : '') + '</label>'; };
    ['videos', 'reviews', 'clients', 'collabs', 'montageChannels'].forEach(function (k) { if (!Array.isArray(d[k])) d[k] = []; });
    d.me = d.me || {}; d.creators = d.creators || {}; d.live = d.live || {};
    ['youtube', 'tiktok', 'since'].forEach(function (g) { d.live[g] = d.live[g] || {}; });

    function inp(path, type, extra) {
      var v = getP(d, path); extra = extra || {};
      if (type === 'long') return '<textarea data-sp="' + path + '" rows="' + (extra.rows || 3) + '"' + (extra.ph ? ' placeholder="' + esc(extra.ph) + '"' : '') + '>' + esc(v) + '</textarea>';
      if (type === 'bool') return '<input type="checkbox" data-sp="' + path + '" data-st="bool"' + (v ? ' checked' : '') + '>';
      if (type === 'creator') return '<select data-sp="' + path + '">' + Object.keys(d.creators).map(function (k) { return '<option value="' + esc(k) + '"' + (k === v ? ' selected' : '') + '>' + esc(d.creators[k].name || k) + '</option>'; }).join('') + '</select>';
      return '<input data-sp="' + path + '"' + (type === 'num' ? ' type="number" min="0" inputmode="numeric" data-st="num"' : type === 'date' ? ' type="date"' : type === 'email' ? ' type="email"' : type === 'url' ? ' type="url" inputmode="url"' : type === 'img' ? ' inputmode="url"' : '') +
        (type === 'yt' ? ' data-st="yt"' : '') + ' value="' + esc(v == null ? '' : v) + '"' + (extra.ph ? ' placeholder="' + esc(extra.ph) + '"' : '') + '>';
    }
    function img(path, label, hint) {
      var v = getP(d, path) || '';
      return field(esc(label), '<div class="sf-img"><span class="sf-thumb">' + (v ? '<img src="' + esc(asset(v)) + '" alt="" onerror="this.remove()">' : '') + '</span>' + inp(path, 'img', { ph: 'https://… ou assets/pp/photo.jpg' }) +
        (o.imgUpload ? '<button type="button" class="' + cls.sm + '" data-sa="img" data-path="' + path + '">Envoyer une image</button>' : '') + '</div>', { full: true, hint: hint });
    }
    function sec(key, title, sub, body, count) {
      return '<details class="sf-sec" data-k="' + key + '"' + (open[key] ? ' open' : '') + '><summary><span class="sf-st"><b>' + esc(title) + '</b>' + (count != null ? '<em>' + count + '</em>' : '') + '</span><small>' + esc(sub) + '</small></summary><div class="sf-body">' + body + '</div></details>';
    }
    function tools(kind, i, n) {
      return '<span class="sf-tools"><button type="button" class="' + cls.ghost + ' sf-ico" data-sa="up" data-kind="' + kind + '" data-i="' + i + '" title="Monter"' + (i ? '' : ' disabled') + '>↑</button>' +
        '<button type="button" class="' + cls.ghost + ' sf-ico" data-sa="down" data-kind="' + kind + '" data-i="' + i + '" title="Descendre"' + (i < n - 1 ? '' : ' disabled') + '>↓</button>' +
        '<button type="button" class="' + cls.danger + ' sf-ico" data-sa="del" data-kind="' + kind + '" data-i="' + i + '" title="Retirer">✕</button></span>';
    }
    function chips(list, title, hint) {
      var sel = d[list];
      return '<div class="sf-chipbox"><b>' + esc(title) + '</b><small>' + esc(hint) + '</small><div class="sf-chips">' + Object.keys(d.creators).map(function (k) {
        var i = sel.indexOf(k);
        return '<button type="button" class="sf-chip' + (i >= 0 ? ' on' : '') + '" data-sa="chip" data-list="' + list + '" data-key="' + esc(k) + '">' + (i >= 0 ? '<i>' + (i + 1) + '</i>' : '') + esc(d.creators[k].name || k) + '</button>';
      }).join('') + '</div></div>';
    }

    function render() {
      var me = d.me, cr = d.creators, ck = Object.keys(cr), h = '';
      h += sec('me', 'Tes infos', 'Pseudo, contact, réseaux et photo de profil',
        '<div class="sf-grid">' + field('Pseudo', inp('me.pseudo')) + field('E-mail de contact', inp('me.email', 'email'), { hint: 'Reçoit les demandes du formulaire de contact' }) +
        field('Lien X', inp('me.x', 'url')) + field('Lien Twitch', inp('me.twitch', 'url')) +
        field('Pseudo Discord', inp('me.discordUser')) + field('ID Discord', inp('me.discordId', '', { ph: 'Facultatif' }), { hint: 'Pour que le bouton Discord ouvre ton profil' }) +
        field('Vues cumulées affichées', inp('me.viewsClaim', '', { ph: '6M' }), { hint: 'Affiché « +6M » sur l’accueil' }) + '</div>' +
        img('me.pp', 'Photo de profil', 'L’adresse de l’image (par défaut ta photo X via unavatar.io)'));

      h += sec('videos', 'Montages', 'Les vidéos affichées sur l’accueil et la page Montages', (d.videos.length ? d.videos.map(function (v, i) {
        var k = 'v:' + i, c = cr[v.ch] || {};
        return '<details class="sf-item" data-k="' + k + '"' + (open[k] ? ' open' : '') + '><summary>' + (v.id ? '<img class="sf-yt" src="https://i.ytimg.com/vi/' + esc(ytId(v.id)) + '/mqdefault.jpg" alt="" loading="lazy" onerror="this.remove()">' : '<span class="sf-yt"></span>') +
          '<span class="sf-it"><b>' + esc(v.t || 'Nouvelle vidéo') + '</b><small>' + esc(c.name || v.ch || '—') + ' · ' + (+v.v || 0).toLocaleString('fr-FR') + ' vues</small></span>' + tools('videos', i, d.videos.length) + '</summary>' +
          '<div class="sf-grid">' + field('Vidéo YouTube', inp('videos.' + i + '.id', 'yt', { ph: 'Colle le lien de la vidéo' }), { hint: 'Le lien complet ou juste l’identifiant' }) + field('Chaîne', inp('videos.' + i + '.ch', 'creator')) +
          field('Titre', inp('videos.' + i + '.t', 'long', { rows: 2 }), { full: true }) + field('Vues', inp('videos.' + i + '.v', 'num')) + field('J’aime', inp('videos.' + i + '.l', 'num')) + field('Durée', inp('videos.' + i + '.dur', '', { ph: '12:34' })) + '</div></details>';
      }).join('') : '<p class="sf-empty">Aucune vidéo.</p>') + '<button type="button" class="' + cls.sm + '" data-sa="add-video"' + (ck.length ? '' : ' disabled') + '>+ Ajouter une vidéo</button>', d.videos.length);

      h += sec('creators', 'Créateurs et structures', 'Les chaînes et clubs avec qui tu travailles', ck.map(function (key, i) {
        var c = cr[key], k = 'c:' + key, p = 'creators.' + key;
        return '<details class="sf-item" data-k="' + k + '"' + (open[k] ? ' open' : '') + '><summary><span class="sf-av">' + esc((c.name || key).charAt(0)) + (c.pp ? '<img src="' + esc(asset(c.pp)) + '" alt="" onerror="this.remove()">' : '') + '</span>' +
          '<span class="sf-it"><b>' + esc(c.name || key) + (c.gold ? ' ★' : '') + '</b><small>' + esc((c.role && c.role[0]) || 'Rôle à préciser') + '</small></span>' + tools('creators', i, ck.length) + '</summary>' +
          '<div class="sf-grid">' + field('Nom', inp(p + '.name')) + field('Mise en avant (carte dorée)', '<span class="sf-check">' + inp(p + '.gold', 'bool') + '<span>Oui</span></span>') +
          field('Description (français)', inp(p + '.desc.0')) + field('Description (anglais)', inp(p + '.desc.1')) +
          field('Ton rôle (français)', inp(p + '.role.0')) + field('Ton rôle (anglais)', inp(p + '.role.1')) + '</div>' +
          img(p + '.pp', 'Photo', 'Image carrée (ex. assets/pp/' + key + '.jpg)') +
          '<div class="sf-sub"><b>Liens</b><div class="sf-grid">' + LINKS.map(function (l) { return field(l[1], inp(p + '.links.' + l[0], 'url', { ph: 'https://…' })); }).join('') + '</div></div>' +
          '<div class="sf-sub"><b>Chiffres affichés</b><small>Ex. « 38,3 k » abonnés sur « X »</small>' + (c.stats || []).map(function (s, j) {
            return '<div class="sf-pair">' + inp(p + '.stats.' + j + '.0', '', { ph: '38,3 k' }) + inp(p + '.stats.' + j + '.1', '', { ph: 'X' }) + '<button type="button" class="' + cls.danger + ' sf-ico" data-sa="del-stat" data-key="' + esc(key) + '" data-i="' + j + '" title="Retirer">✕</button></div>';
          }).join('') + '<button type="button" class="' + cls.sm + '" data-sa="add-stat" data-key="' + esc(key) + '">+ Ajouter un chiffre</button></div>' +
          '<div class="sf-grid">' + field('Page dédiée (facultatif)', inp(p + '.page', '', { ph: 'lyost.html' })) + field('Identifiant', '<input value="' + esc(key) + '" disabled>', { hint: 'Utilisé par les listes et les vidéos' }) + '</div></details>';
      }).join('') + '<button type="button" class="' + cls.sm + '" data-sa="add-creator">+ Ajouter un créateur</button>', ck.length);

      h += sec('lists', 'Où apparaissent les créateurs', 'Clique pour ajouter ou retirer, l’ordre suit tes clics',
        chips('clients', 'Carrousel « Ils m’ont fait confiance » (accueil)', 'Dans l’ordre d’affichage') +
        chips('collabs', 'Page Collaborations', 'Les cartes détaillées') +
        chips('montageChannels', 'Page Montages', 'Une section par chaîne, dans cet ordre'));

      h += sec('reviews', 'Avis ajoutés à la main', 'En plus de ceux laissés par tes clients sur le site', d.reviews.map(function (r, i) {
        var k = 'r:' + i;
        return '<details class="sf-item" data-k="' + k + '"' + (open[k] ? ' open' : '') + '><summary><span class="sf-it"><b>' + esc(r.name || 'Nouvel avis') + ' · ' + '★★★★★'.slice(0, Math.max(1, Math.min(5, +r.rating || 5))) + '</b><small>' + esc((r.text || '').slice(0, 90)) + '</small></span>' + tools('reviews', i, d.reviews.length) + '</summary>' +
          '<div class="sf-grid">' + field('Pseudo', inp('reviews.' + i + '.name')) + field('Qui est-ce ?', inp('reviews.' + i + '.role', '', { ph: 'Créateur YouTube' })) + field('Note (1 à 5)', inp('reviews.' + i + '.rating', 'num')) + field('Date', inp('reviews.' + i + '.date', 'date')) +
          field('Avis', inp('reviews.' + i + '.text', 'long'), { full: true }) + field('Lien (facultatif)', inp('reviews.' + i + '.link', 'url'), { full: true }) + '</div></details>';
      }).join('') + '<button type="button" class="' + cls.sm + '" data-sa="add-review">+ Ajouter un avis</button>', d.reviews.length);

      var lk = ck.filter(function (k) { return d.live.youtube[k] != null || d.live.tiktok[k] != null || d.live.since[k] != null; });
      h += sec('live', 'Statistiques en direct', 'Chaînes suivies par le robot (vues comptées depuis ton arrivée)', lk.map(function (k) {
        return '<div class="sf-live"><b>' + esc(cr[k].name || k) + '</b>' + field('ID de chaîne YouTube', inp('live.youtube.' + k, '', { ph: 'UC…' })) + field('Pseudo TikTok', inp('live.tiktok.' + k, '', { ph: 'Facultatif' })) +
          field('Date d’arrivée', inp('live.since.' + k, 'date')) + '<button type="button" class="' + cls.danger + ' sf-ico" data-sa="del-live" data-key="' + esc(k) + '" title="Ne plus suivre">✕</button></div>';
      }).join('') + (ck.filter(function (k) { return lk.indexOf(k) < 0; }).length ? '<div class="sf-addlive"><select data-live-add>' + ck.filter(function (k) { return lk.indexOf(k) < 0; }).map(function (k) { return '<option value="' + esc(k) + '">' + esc(cr[k].name || k) + '</option>'; }).join('') + '</select><button type="button" class="' + cls.sm + '" data-sa="add-live">+ Suivre cette chaîne</button></div>' : '') +
        '<div class="sf-grid">' + field('Relevé toutes les (minutes)', inp('live.refreshMinutes', 'num')) + '</div>', lk.length);

      el.innerHTML = '<div class="sf">' + h + '</div>';
    }

    function changed(rerender) { if (rerender) render(); onChange(d); }
    function move(arr, i, j) { if (j < 0 || j >= arr.length) return; var x = arr.splice(i, 1)[0]; arr.splice(j, 0, x); }
    function moveKey(i, j) {
      var ks = Object.keys(d.creators); if (j < 0 || j >= ks.length) return;
      var x = ks.splice(i, 1)[0]; ks.splice(j, 0, x);
      var n = {}; ks.forEach(function (k) { n[k] = d.creators[k]; }); d.creators = n;
    }

    el.addEventListener('toggle', function (e) { var t = e.target; if (t.dataset && t.dataset.k) open[t.dataset.k] = t.open; }, true);
    el.addEventListener('input', function (e) {
      var t = e.target, p = t.dataset.sp; if (!p) return;
      var v = t.dataset.st === 'bool' ? t.checked : t.dataset.st === 'num' ? (t.value === '' ? 0 : +t.value) : t.value;
      setP(d, p, v);
      changed(false);
    });
    el.addEventListener('change', function (e) {
      var t = e.target, p = t.dataset.sp;
      if (p && t.dataset.st === 'yt') { var id = ytId(t.value); if (id !== t.value) { t.value = id; setP(d, p, id); } changed(true); return; }
      if (p && (t.tagName === 'SELECT' || /\.(name|t|pp|rating)$/.test(p))) changed(true);
    });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-sa]'); if (!b || !el.contains(b)) return;
      var a = b.dataset.sa, i = +b.dataset.i, kind = b.dataset.kind, key = b.dataset.key;
      if (a === 'up' || a === 'down' || a === 'del') { e.preventDefault(); e.stopPropagation(); }
      if (a === 'up' || a === 'down') { if (kind === 'creators') moveKey(i, a === 'up' ? i - 1 : i + 1); else move(d[kind], i, a === 'up' ? i - 1 : i + 1); open = {}; open[kind] = true; return changed(true); }
      if (a === 'del') {
        if (kind === 'creators') {
          var ck = Object.keys(d.creators)[i], used = d.videos.filter(function (v) { return v.ch === ck; }).length;
          if (used) { notify('Retire d’abord les ' + used + ' vidéo' + (used > 1 ? 's' : '') + ' de ' + (d.creators[ck].name || ck) + ' (section Montages).'); return; }
          sure('Retirer ' + (d.creators[ck].name || ck) + ' du site ?').then(function (ok) {
            if (!ok) return;
            delete d.creators[ck];
            ['clients', 'collabs', 'montageChannels'].forEach(function (l) { d[l] = d[l].filter(function (k) { return k !== ck; }); });
            ['youtube', 'tiktok', 'since'].forEach(function (g) { delete d.live[g][ck]; });
            open = { creators: true }; changed(true);
          });
          return;
        }
        d[kind].splice(i, 1);
        open = {}; open[kind] = true; return changed(true);
      }
      if (a === 'chip') { var l = d[b.dataset.list], at = l.indexOf(key); if (at >= 0) l.splice(at, 1); else l.push(key); return changed(true); }
      if (a === 'add-video') { var first = d.montageChannels[0] || Object.keys(d.creators)[0]; d.videos.unshift({ id: '', ch: first, t: '', v: 0, l: 0, dur: '' }); open = { videos: true, 'v:0': true }; return changed(true); }
      if (a === 'add-review') { d.reviews.push({ name: '', role: '', rating: 5, text: '', date: new Date().toISOString().slice(0, 10) }); open = { reviews: true }; open['r:' + (d.reviews.length - 1)] = true; return changed(true); }
      if (a === 'add-stat') { var c = d.creators[key]; c.stats = c.stats || []; c.stats.push(['', '']); return changed(true); }
      if (a === 'del-stat') { d.creators[key].stats.splice(i, 1); return changed(true); }
      if (a === 'add-creator') {
        ask('Nom du créateur ou de la structure ?').then(function (name) {
          name = String(name || '').trim(); if (!name) return;
          var base = slug(name) || 'createur', nk = base, n = 2; while (d.creators[nk]) nk = base + n++;
          d.creators[nk] = { name: name, pp: '', desc: ['', ''], role: ['', ''], links: {} };
          open = { creators: true }; open['c:' + nk] = true; changed(true);
        });
        return;
      }
      if (a === 'add-live') { var s = el.querySelector('[data-live-add]'); if (!s) return; d.live.since[s.value] = new Date().toISOString().slice(0, 10); d.live.youtube[s.value] = d.live.youtube[s.value] || ''; return changed(true); }
      if (a === 'del-live') { ['youtube', 'tiktok', 'since'].forEach(function (g) { delete d.live[g][key]; }); return changed(true); }
      if (a === 'img' && o.imgUpload) {
        b.disabled = true;
        Promise.resolve(o.imgUpload()).then(function (url) { b.disabled = false; if (url) { setP(d, b.dataset.path, url); changed(true); } }, function () { b.disabled = false; });
      }
    });
    render();
    return {
      get data() { return normalize(d); },
      raw: function () { return d; },
      set: function (nd) { d = clone(nd); render(); },
      render: render
    };
  }

  var api = { parse: parse, write: write, normalize: normalize, order: order, time: time, mount: mount, ytId: ytId, START: START, END: END };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.SiteForm = api;
})(typeof window !== 'undefined' ? window : globalThis);
