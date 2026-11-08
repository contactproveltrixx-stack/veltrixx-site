// Enregistre les nouveaux chiffres sur GitHub, sans avoir besoin de Git.
//   node scripts/save-stats.mjs youtube   (robot YouTube, dans le cloud)
//   node scripts/save-stats.mjs tiktok    (robot TikTok, sur le PC)
// On repart toujours de la dernière version en ligne et on ne remplace que la partie de ce robot :
// les deux robots peuvent donc tourner en même temps sans s'écraser.
import { readFile } from 'node:fs/promises';

const PART = process.argv[2];
const REPO = process.env.GITHUB_REPOSITORY;
const TOKEN = process.env.GITHUB_TOKEN;
const BRANCH = process.env.GITHUB_REF_NAME || 'main';
if (!['youtube', 'tiktok'].includes(PART) || !REPO || !TOKEN) { console.log('Usage : node scripts/save-stats.mjs youtube|tiktok (dans GitHub Actions)'); process.exit(1); }

const local = JSON.parse(await readFile(new URL('../data/stats.json', import.meta.url), 'utf8'));
const api = async (path, opts = {}) => {
  const res = await fetch('https://api.github.com/repos/' + REPO + '/' + path, {
    ...opts,
    headers: { Authorization: 'Bearer ' + TOKEN, Accept: opts.raw ? 'application/vnd.github.raw' : 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'veltrixx-stats' }
  });
  if (!res.ok) { const e = new Error(path + ' : ' + res.status + ' ' + (await res.text()).slice(0, 200)); e.status = res.status; throw e; }
  return opts.raw ? res.text() : res.json();
};

for (let essai = 1; essai <= 5; essai++) {
  const ref = await api('git/ref/heads/' + BRANCH);
  const head = ref.object.sha;
  const remote = JSON.parse(await api('contents/data/stats.json?ref=' + head, { raw: true }));
  const lt = local[PART]?.live?.at(-1)?.t, rt = remote[PART]?.live?.at(-1)?.t;
  if (!lt || (rt && rt >= lt)) { console.log('Aucun nouveau relevé à enregistrer.'); process.exit(0); }
  remote[PART] = local[PART];
  remote.since = local.since;
  const json = JSON.stringify(remote);
  const seed = "/* Copie de secours de data/stats.json (utilisée quand le site est ouvert depuis l'ordinateur). */\nwindow.STATS_SEED = " + json + ';\n';
  const commit = await api('git/commits/' + head);
  const tree = await api('git/trees', { method: 'POST', body: JSON.stringify({ base_tree: commit.tree.sha, tree: [
    { path: 'data/stats.json', mode: '100644', type: 'blob', content: json },
    { path: 'assets/stats-seed.js', mode: '100644', type: 'blob', content: seed }
  ] }) });
  const c = await api('git/commits', { method: 'POST', body: JSON.stringify({ message: 'Stats ' + (PART === 'youtube' ? 'YouTube' : 'TikTok') + ' : nouvelle donnée', tree: tree.sha, parents: [head], author: { name: 'veltrixx-stats', email: 'actions@users.noreply.github.com' } }) });
  try {
    await api('git/refs/heads/' + BRANCH, { method: 'PATCH', body: JSON.stringify({ sha: c.sha, force: false }) });
    console.log('Enregistré (' + PART + ').');
    process.exit(0);
  } catch (e) {
    if (e.status !== 422 && e.status !== 409) throw e;
    console.log('Quelqu’un a enregistré entre-temps, nouvel essai…');
    await new Promise(r => setTimeout(r, essai * 3000));
  }
}
console.log('Impossible d’enregistrer après 5 essais.');
process.exit(1);
