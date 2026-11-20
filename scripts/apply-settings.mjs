// Recopie dans assets/data.js les paramètres enregistrés depuis le panneau admin du site (table Supabase « site_settings »).
// Lancé par le robot « Stats en direct » (scripts/save-stats.mjs youtube) toutes les 10 minutes.
// Ne fait rien si les paramètres de data.js sont plus récents (modifiés depuis SaaS Veltrixx par exemple).
import { createRequire } from 'node:module';

const SiteForm = createRequire(import.meta.url)('../assets/settings-form.js');
const time = SiteForm.time;

export async function applySettings({ repo, token, branch = 'main' }) {
  const api = async (path, opts = {}) => {
    const res = await fetch('https://api.github.com/repos/' + repo + '/' + path, {
      ...opts,
      headers: { Authorization: 'Bearer ' + token, Accept: opts.raw ? 'application/vnd.github.raw' : 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'veltrixx-settings' }
    });
    if (!res.ok) { const e = new Error(path + ' : ' + res.status + ' ' + (await res.text()).slice(0, 200)); e.status = res.status; throw e; }
    return opts.raw ? res.text() : res.json();
  };
  for (let essai = 1; essai <= 4; essai++) {
    const head = (await api('git/ref/heads/' + branch)).object.sha;
    const text = await api('contents/assets/data.js?ref=' + head, { raw: true });
    const cur = SiteForm.parse(text);
    const sb = cur.supabase || {};
    if (!sb.url || !sb.anonKey) return 'Supabase non configuré';
    const r = await fetch(sb.url.replace(/\/$/, '') + '/rest/v1/site_settings?id=eq.1&select=data,updated_at', { headers: { apikey: sb.anonKey, Authorization: 'Bearer ' + sb.anonKey } });
    if (!r.ok) return 'Table site_settings indisponible (' + r.status + ')';
    const row = (await r.json())[0];
    if (!row || !row.data) return 'Aucun paramètre enregistré depuis le panneau admin';
    if (time(row.updated_at) <= time(cur._maj)) return 'Paramètres déjà à jour';
    const next = SiteForm.normalize(row.data);
    next._maj = row.updated_at;
    next.supabase = cur.supabase; // la connexion à la base ne se modifie pas depuis le panneau
    const ordered = SiteForm.order(next);
    const commit = await api('git/commits/' + head);
    const tree = await api('git/trees', { method: 'POST', body: JSON.stringify({ base_tree: commit.tree.sha, tree: [{ path: 'assets/data.js', mode: '100644', type: 'blob', content: SiteForm.write(text, ordered) }] }) });
    const c = await api('git/commits', { method: 'POST', body: JSON.stringify({ message: 'Paramètres du site mis à jour depuis le panneau admin', tree: tree.sha, parents: [head], author: { name: 'veltrixx-settings', email: 'actions@users.noreply.github.com' } }) });
    try {
      await api('git/refs/heads/' + branch, { method: 'PATCH', body: JSON.stringify({ sha: c.sha, force: false }) });
      return 'Paramètres appliqués (' + row.updated_at + ')';
    } catch (e) {
      if (e.status !== 422 && e.status !== 409) throw e;
      await new Promise(res => setTimeout(res, essai * 3000));
    }
  }
  return 'Impossible d’enregistrer les paramètres après plusieurs essais';
}
