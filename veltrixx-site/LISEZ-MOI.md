# Site Veltrixx — mise en route

## 1. Mettre le site en ligne (GitHub Pages)
1. Crée un dépôt public sur GitHub (ex. `veltrixx.github.io`).
2. Envoie **tout le contenu** de ce dossier, y compris les dossiers cachés `.github` et le fichier `.nojekyll`.
   Le plus simple : GitHub Desktop, ou glisser-déposer dans « Add file > Upload files » (affiche les fichiers cachés dans ton explorateur).
3. Settings > Pages > Source : « Deploy from a branch », branche `main`, dossier `/ (root)`.

## 2. Brancher les stats en direct (YouTube : clé API gratuite · TikTok : rien à faire)
1. Va sur https://console.cloud.google.com avec ton compte Google et crée un projet (ex. « Veltrixx stats »).
2. Menu « API et services » > « Bibliothèque » > cherche **YouTube Data API v3** > Activer.
3. « Identifiants » > « Créer des identifiants » > « Clé API ». Copie la clé.
   Conseillé : « Restreindre la clé » > restrictions d'API > YouTube Data API v3.
4. Sur GitHub, dans ton dépôt : Settings > Secrets and variables > Actions > « New repository secret ».
   Nom : `YT_API_KEY` — Valeur : ta clé.
5. Onglet **Actions** > « Stats en direct » > « Run workflow » pour lancer le premier relevé.

Ensuite le robot tourne tout seul toutes les 10 minutes (GitHub peut parfois décaler de quelques minutes).
Il ajoute un point au graphique seulement quand un chiffre a changé.
YouTube : vues de toutes les vidéos publiées depuis ton arrivée (Werex 28/03, Akiira et SkyJump 11/06, Leo 12/08) + abonnés.
TikTok : le robot ouvre les profils publics d'Akiira, Werex et SkyJump dans un navigateur et additionne les vues des vidéos publiées depuis ces mêmes dates.
Si TikTok bloque une visite, le site garde simplement les derniers chiffres connus.
Pour changer une date : modifie SINCE en haut de scripts/update-stats.mjs.

## 3. Ce que tu peux modifier
- `assets/data.js` : tes infos, vidéos, créateurs, ID Discord.
- `assets/pp/` : photos de profil des créateurs (voir LISEZ-MOI.txt dedans).
- `assets/site.js` : traductions anglaises (en haut du fichier).
- Formulaire : la première demande envoyée déclenche un mail de FormSubmit, clique sur « Activate Form ».
