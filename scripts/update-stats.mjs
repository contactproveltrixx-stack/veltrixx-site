// Robot de statistiques Veltrixx — lancé toutes les 10 minutes par GitHub Actions.
//
// YouTube (clé API dans le secret YT_API_KEY) :
//   vues de toutes les vidéos publiées depuis ton arrivée sur chaque chaîne + abonnés.
// TikTok (ce que tout le monde voit sur le profil, sans connexion) :
//   vues de chaque vidéo publiée depuis ton arrivée + abonnés + J'aime du profil.
//
// Un point n'est ajouté à l'historique que si un chiffre a changé.

import { readFile, writeFile } from 'node:fs/promises';

const YOUTUBE = { akiira: 'UCKWNLyvbV-vt6fM5q_E-igw', skyjump: 'UCcifpfOD-8hCO9vbMoN41Nw', werex: 'UCvQDDvqFF0A0ZQvdCW2irzQ', leo: 'UCu7zXI2tMumbrjmBgJIfPBA' };
const TIKTOK = { akiira: 'akiiraftn', werex: 'werexfn', skyjump: 'skyjumpftnn' };
const SINCE = {
  youtube: { werex: '2026-03-28', akiira: '2026-06-11', skyjump: '2026-06-11', leo: '2026-08-12' },
  tiktok:  { werex: '2026-03-28', akiira: '2026-06-11', skyjump: '2026-06-11' }
};
const FILE = new URL('../data/stats.json', import.meta.url);
const SEED = new URL('../assets/stats-seed.js', import.meta.url);
const MAX_LIVE = 6000;

// node scripts/update-stats.mjs youtube  -> seulement YouTube (robot GitHub, dans le cloud)
// node scripts/update-stats.mjs tiktok   -> seulement TikTok (robot installé sur le PC : TikTok bloque les serveurs)
const ONLY = process.argv[2] || 'all';
const now = new Date().toISOString();
const ts = d => Math.floor(Date.parse(d + 'T00:00:00Z') / 1000);
let stats;
try { stats = JSON.parse(await readFile(FILE, 'utf8')); } catch { stats = {}; }
stats.since = SINCE;
stats.youtube ??= { videos: {}, live: [] };
stats.tiktok ??= { videos: {}, live: [] };
let changed = false;
const sum = o => Object.values(o).reduce((a, b) => a + b, 0);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* ================= YouTube ================= */
const key = process.env.YT_API_KEY;
async function yt(path) {
  const res = await fetch('https://www.googleapis.com/youtube/v3/' + path + '&key=' + key);
  const j = await res.json();
  if (!res.ok) throw new Error(j.error?.message || res.status);
  return j;
}
if (ONLY === 'tiktok') console.log('YouTube : ignoré (robot TikTok).');
else if (!key) console.log('YT_API_KEY absent : YouTube ignoré.');
else {
  try {
    const ch = await yt('channels?part=statistics,contentDetails&id=' + Object.values(YOUTUBE).join(','));
    const subs = {}, views = {}, videos = {};
    for (const [name, id] of Object.entries(YOUTUBE)) {
      const item = ch.items.find(i => i.id === id);
      subs[name] = Number(item.statistics.subscriberCount);
      const cutoff = ts(SINCE.youtube[name]);
      // toutes les mises en ligne depuis la date d'arrivée (vidéos, Shorts et lives)
      const ids = []; let page = '', done = false;
      while (!done) {
        const pl = await yt('playlistItems?part=contentDetails&maxResults=50&playlistId=' + item.contentDetails.relatedPlaylists.uploads + (page ? '&pageToken=' + page : ''));
        for (const it of pl.items) {
          const p = Math.floor(Date.parse(it.contentDetails.videoPublishedAt) / 1000);
          if (p >= cutoff) ids.push([it.contentDetails.videoId, p]); else done = true;
        }
        page = pl.nextPageToken; if (!page) done = true;
      }
      const list = [];
      for (let i = 0; i < ids.length; i += 50) {
        const part = ids.slice(i, i + 50);
        const v = await yt('videos?part=statistics&id=' + part.map(x => x[0]).join(','));
        for (const [vid, p] of part) {
          const s = v.items.find(x => x.id === vid);
          if (s) list.push([p, Number(s.statistics.viewCount || 0)]);
        }
      }
      list.sort((a, b) => a[0] - b[0]);
      videos[name] = list;
      views[name] = list.reduce((a, x) => a + x[1], 0);
    }
    const last = stats.youtube.live.at(-1);
    stats.youtube.videos = videos;
    if (!last || !same(last.views, views) || !same(last.subs, subs)) {
      stats.youtube.live.push({ t: now, views, subs });
      changed = true;
      console.log('YouTube :', sum(views), 'vues', views, '| abonnés', subs);
    } else console.log('YouTube : pas de changement.');
  } catch (e) { console.log('YouTube : erreur', e.message); }
}

/* ================= TikTok ================= */
// Ouvre chaque profil dans un vrai navigateur (Playwright) et lit la liste des vidéos que TikTok
// envoie à la page, comme quand on fait défiler un profil.
async function tiktokAll() {
  let chromium;
  try { ({ chromium } = await import('playwright')); }
  catch { console.log('Playwright absent : TikTok ignoré.'); return null; }
  // Sur le PC Windows, on utilise Microsoft Edge (déjà installé) ; sinon le Chromium de Playwright.
  let browser;
  if (process.platform === 'win32') browser = await chromium.launch({ channel: 'msedge' }).catch(() => null);
  if (!browser) browser = await chromium.launch();
  const opts = { locale: 'fr-FR', viewport: { width: 1280, height: 900 } };
  if (process.platform !== 'win32') opts.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';
  const ctx = await browser.newContext(opts);
  const out = {};
  for (const [name, user] of Object.entries(TIKTOK)) {
    const page = await ctx.newPage();
    const items = {}; let more = true; let profile = null;
    page.on('response', async res => {
      if (!res.url().includes('/api/post/item_list/')) return;
      try { const j = await res.json(); more = !!j.hasMore; for (const i of j.itemList || []) items[i.id] = [i.createTime, Number(i.statsV2?.playCount ?? i.stats?.playCount ?? 0)]; } catch {}
    });
    try {
      await page.goto('https://www.tiktok.com/@' + user, { waitUntil: 'domcontentloaded', timeout: 45000 });
      const raw = await page.locator('#__UNIVERSAL_DATA_FOR_REHYDRATION__').textContent({ timeout: 15000 }).catch(() => null);
      if (raw) { const st = JSON.parse(raw).__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo?.stats; if (st) profile = { followers: Number(st.followerCount), likes: Number(st.heartCount ?? st.heart) }; }
      const cutoff = ts(SINCE.tiktok[name]);
      let still = 0, last = -1;
      for (let i = 0; i < 80 && more; i++) {
        const retry = page.getByRole('button', { name: /Actualiser|Refresh/i });
        if (await retry.count()) await retry.first().click().catch(() => {});
        await page.mouse.wheel(0, 4000);
        await page.waitForTimeout(1500);
        const n = Object.keys(items).length;
        if (n === last) { if (++still > 6) break; } else { still = 0; last = n; }
      }
      const list = Object.values(items).filter(x => x[0] >= cutoff).sort((a, b) => a[0] - b[0]);
      if (list.length) out[name] = { list, profile };
      else console.log('TikTok @' + user + ' : aucune vidéo lue (TikTok a peut-être bloqué la visite).');
    } catch (e) { console.log('TikTok @' + user + ' :', e.message); }
    await page.close();
  }
  await browser.close();
  return out;
}
const tk = ONLY === 'youtube' ? (console.log('TikTok : ignoré (robot YouTube).'), null) : await tiktokAll();
if (tk && Object.keys(tk).length) {
  const last = stats.tiktok.live.at(-1) || { views: {}, followers: {}, likes: {} };
  const views = { ...last.views }, followers = { ...last.followers }, likes = { ...last.likes };
  for (const [name, r] of Object.entries(tk)) {
    const prev = stats.tiktok.videos[name]?.length || 0;
    // si TikTok n'a renvoyé qu'une partie de la liste, on garde l'ancienne
    if (r.list.length >= prev * 0.9) {
      stats.tiktok.videos[name] = r.list;
      views[name] = r.list.reduce((a, x) => a + x[1], 0);
    }
    if (r.profile) { followers[name] = r.profile.followers; likes[name] = r.profile.likes; }
  }
  if (!same(last.views, views) || !same(last.followers, followers) || !same(last.likes, likes)) {
    stats.tiktok.live.push({ t: now, views, followers, likes });
    changed = true;
    console.log('TikTok :', sum(views), 'vues', views);
  } else console.log('TikTok : pas de changement.');
}

/* ================= Enregistrement ================= */
if (changed) {
  stats.youtube.live = stats.youtube.live.slice(-MAX_LIVE);
  stats.tiktok.live = stats.tiktok.live.slice(-MAX_LIVE);
  const json = JSON.stringify(stats);
  await writeFile(FILE, json);
  await writeFile(SEED, "/* Copie de secours de data/stats.json (utilisée quand le site est ouvert depuis l'ordinateur). */\nwindow.STATS_SEED = " + json + ';\n');
  console.log('data/stats.json mis à jour.');
} else console.log('Rien de nouveau.');
