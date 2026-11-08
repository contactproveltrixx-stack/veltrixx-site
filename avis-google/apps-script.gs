/* Avis du site Veltrixx — stockés dans cette feuille Google Sheets.
   Installation : Extensions > Apps Script, colle tout ce code à la place de l'existant, enregistre,
   puis Déployer > Nouveau déploiement > Type : Application Web > Exécuter en tant que : Moi > Accès : Tout le monde.
   Pour masquer un avis : écris « non » dans la colonne « afficher » (ou supprime la ligne). */

const NOTIFY = 'contact@veltrixx.eu'; // mail à chaque nouvel avis ('' pour ne rien recevoir)

function sheet_() { return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]; }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
// Nettoie le texte et empêche qu'il soit lu comme une formule par Sheets
function clean_(s, n) {
  s = String(s || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, n);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// Le site lit les avis publiés
function doGet() {
  const rows = sheet_().getDataRange().getValues().slice(1);
  const out = rows.filter(r => r[1] && String(r[7]).trim().toLowerCase() !== 'non').map(r => ({
    date: r[0] instanceof Date ? Utilities.formatDate(r[0], 'Europe/Paris', 'yyyy-MM-dd') : String(r[0]).slice(0, 10),
    rating: Number(r[1]), name: String(r[2]).replace(/^'/, ''), role: String(r[3] || '').replace(/^'/, ''),
    link: String(r[4] || ''), text: String(r[5]).replace(/^'/, '')
  }));
  return json_(out);
}

// Le site envoie un nouvel avis
function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'format' }); }
  if (d._honey) return json_({ ok: true }); // robot
  const rating = Math.round(Number(d.rating));
  const name = clean_(d.name, 40), text = clean_(d.text, 600), role = clean_(d.role, 50), email = clean_(d.email, 100);
  let link = String(d.link || '').trim().slice(0, 200);
  if (!/^https?:\/\/[^\s"'<>]+$/i.test(link)) link = '';
  if (!(rating >= 1 && rating <= 5) || !name || text.length < 5) return json_({ ok: false, error: 'invalid' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // anti-spam : un avis toutes les 20 secondes maximum sur tout le site
    const props = PropertiesService.getScriptProperties();
    if (Date.now() - Number(props.getProperty('last') || 0) < 20000) return json_({ ok: false, error: 'wait' });
    props.setProperty('last', String(Date.now()));
    sheet_().appendRow([new Date(), rating, name, role, link, text, email, 'oui']);
  } finally { lock.releaseLock(); }

  if (NOTIFY) {
    try {
      MailApp.sendEmail(NOTIFY, 'Nouvel avis ' + rating + '/5 sur ton site — ' + name,
        '★'.repeat(rating) + '☆'.repeat(5 - rating) + '\n' + name + (role ? ' (' + role + ')' : '') + '\n\n' + text +
        '\n\nIl est déjà en ligne. Pour le masquer : écris « non » dans la colonne « afficher » de la feuille :\n' +
        SpreadsheetApp.getActiveSpreadsheet().getUrl());
    } catch (err) {}
  }
  return json_({ ok: true });
}
