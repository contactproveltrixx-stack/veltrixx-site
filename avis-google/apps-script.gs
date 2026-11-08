/* Avis du site Veltrixx — stockés dans cette feuille Google Sheets.
   Installation : Extensions > Apps Script, colle tout ce code à la place de l'existant,
   CHANGE le mot de passe admin juste en dessous, enregistre, puis
   Déployer > Nouveau déploiement > Type : Application Web > Exécuter en tant que : Moi > Accès : Tout le monde.
   Après une modification du code : Déployer > Gérer les déploiements > ✏️ > Version : Nouvelle version > Déployer.
   Pour masquer un avis : panneau admin du site (veltrixx.eu/admin.html), ou « non » dans la colonne « afficher ». */

const ADMIN_PASSWORD = 'CHANGE-MOI';          // ← mets ton mot de passe du panneau admin (garde-le pour toi)
const NOTIFY = 'contact@veltrixx.eu';         // mail à chaque nouvel avis ('' pour ne rien recevoir)

// Colonnes : A date | B note | C nom | D profil | E lien | F avis | G email | H afficher | I id
function sheet_() { return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]; }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function clean_(s, n) {  // nettoie le texte et empêche qu'il soit lu comme une formule
  s = String(s || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, n);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function txt_(v) { return String(v == null ? '' : v).replace(/^'/, ''); }
function day_(v) { return v instanceof Date ? Utilities.formatDate(v, 'Europe/Paris', 'yyyy-MM-dd') : String(v).slice(0, 10); }
function visible_(r) { return String(r[7]).trim().toLowerCase() !== 'non'; }

// ---------- Le site lit les avis publiés ----------
function doGet() {
  const rows = sheet_().getDataRange().getValues().slice(1);
  return json_(rows.filter(r => r[1] && visible_(r)).map(r => ({
    date: day_(r[0]), rating: Number(r[1]), name: txt_(r[2]), role: txt_(r[3]), link: txt_(r[4]), text: txt_(r[5])
  })));
}

// ---------- Le site envoie un avis, ou le panneau admin agit ----------
function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'format' }); }
  if (d.action === 'admin') return admin_(d);
  if (d._honey) return json_({ ok: true }); // robot
  const rating = Math.round(Number(d.rating));
  const name = clean_(d.name, 40), text = clean_(d.text, 600), role = clean_(d.role, 50), email = clean_(d.email, 100);
  let link = String(d.link || '').trim().slice(0, 200);
  if (!/^https?:\/\/[^\s"'<>]+$/i.test(link)) link = '';
  if (!(rating >= 1 && rating <= 5) || !name || text.length < 5) return json_({ ok: false, error: 'invalid' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const props = PropertiesService.getScriptProperties();  // anti-spam : 1 avis / 20 s sur tout le site
    if (Date.now() - Number(props.getProperty('last') || 0) < 20000) return json_({ ok: false, error: 'wait' });
    props.setProperty('last', String(Date.now()));
    sheet_().appendRow([new Date(), rating, name, role, link, text, email, 'oui', Utilities.getUuid()]);
  } finally { lock.releaseLock(); }

  if (NOTIFY) {
    try {
      MailApp.sendEmail(NOTIFY, 'Nouvel avis ' + rating + '/5 sur ton site — ' + txt_(name),
        '★'.repeat(rating) + '☆'.repeat(5 - rating) + '\n' + txt_(name) + (role ? ' (' + txt_(role) + ')' : '') + '\n\n' + txt_(text) +
        '\n\nIl est déjà en ligne. Pour le masquer ou le supprimer : https://veltrixx.eu/admin.html');
    } catch (err) {}
  }
  return json_({ ok: true });
}

// ---------- Panneau admin (protégé par mot de passe) ----------
function admin_(d) {
  const props = PropertiesService.getScriptProperties();
  const fails = Number(props.getProperty('fails') || 0), failT = Number(props.getProperty('failT') || 0);
  if (fails >= 8 && Date.now() - failT < 15 * 60000) return json_({ ok: false, error: 'locked' }); // trop d'essais : 15 min
  if (ADMIN_PASSWORD === 'CHANGE-MOI' || String(d.password || '') !== ADMIN_PASSWORD) {
    props.setProperties({ fails: String(Date.now() - failT < 15 * 60000 ? fails + 1 : 1), failT: String(Date.now()) });
    Utilities.sleep(800);
    return json_({ ok: false, error: ADMIN_PASSWORD === 'CHANGE-MOI' ? 'nopass' : 'password' });
  }
  props.setProperty('fails', '0');

  const sh = sheet_();
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const values = sh.getDataRange().getValues();
    // donne un identifiant aux lignes ajoutées à la main
    for (let i = 1; i < values.length; i++) if (values[i][1] && !values[i][8]) { values[i][8] = Utilities.getUuid(); sh.getRange(i + 1, 9).setValue(values[i][8]); }
    const find = id => values.findIndex((r, i) => i > 0 && r[8] === id);

    if (d.op === 'hide' || d.op === 'show') {
      const i = find(d.id); if (i < 1) return json_({ ok: false, error: 'notfound' });
      sh.getRange(i + 1, 8).setValue(d.op === 'hide' ? 'non' : 'oui');
    } else if (d.op === 'delete') {
      const i = find(d.id); if (i < 1) return json_({ ok: false, error: 'notfound' });
      sh.deleteRow(i + 1);
    }
    const rows = sh.getDataRange().getValues().slice(1).filter(r => r[1]);
    return json_({
      ok: true, sheet: SpreadsheetApp.getActiveSpreadsheet().getUrl(),
      reviews: rows.map(r => ({ id: r[8], date: day_(r[0]), rating: Number(r[1]), name: txt_(r[2]), role: txt_(r[3]), link: txt_(r[4]), text: txt_(r[5]), email: txt_(r[6]), visible: visible_(r) }))
    });
  } finally { lock.releaseLock(); }
}
