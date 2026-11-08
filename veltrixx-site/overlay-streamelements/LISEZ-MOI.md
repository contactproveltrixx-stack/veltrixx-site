# Overlay Veltrixx pour StreamElements

C'est un **bandeau horizontal**. Il sort du bord gauche de l'écran, reste affiché quelques secondes,
puis rentre vers la gauche. Il affiche tour à tour 4 contenus :

1. **Mes meilleurs montages** : tes 3 vidéos les plus vues, avec leurs miniatures.
2. **Vues générées** : ton compteur total (YouTube + TikTok), son graphique et le « +X » quand de nouvelles vues arrivent.
3. **Mes réseaux** : X, Twitch, Discord et ton email pro. L'adresse de ton site est affichée sous ton pseudo.
4. **Code créateur** : VELTRIXXVFX, avec « #publicité » juste en dessous.

Les données viennent directement de ton site (`assets/data.js` et `data/stats.json`).
Quand le robot met à jour les stats, l'overlay suit tout seul.

## Installation (environ 5 minutes)

1. Va sur **streamelements.com** > **Streaming tools** > **My overlays** > **New overlay** (1920 x 1080).
2. Clique sur **+** (Add widget) > **Static / Custom** > **Custom widget**.
3. Dans le panneau de gauche, clique sur **Open editor**. Tu verras plusieurs onglets.
   Remplace le contenu de chaque onglet par celui du fichier correspondant :
   - onglet **HTML** : `1-HTML.html`
   - onglet **CSS** : `2-CSS.css`
   - onglet **JS** : `3-JS.js`
   - onglet **FIELDS** : `4-FIELDS.json`
   - laisse l'onglet **DATA** tel quel.
4. Clique sur **Done**.
5. Dans les réglages du widget, à gauche :
   - **Adresse de ton site** : mets l'adresse de ton site en ligne (ex. `https://veltrixx.fr`).
     Sans elle, l'overlay affiche les chiffres du 8 novembre.
   - Pour placer le widget, choisis **Mode > Fixe : top montages** : le bandeau reste affiché.
     Remets **Défilement automatique** quand c'est bon.
6. Étire le widget sur **toute la largeur de l'écran** (1920 de large, environ 250 de haut) et place-le en bas.
   Tu peux régler la largeur du bandeau (1500 px par défaut) et sa marge depuis le bas dans « Apparence ». Enregistre avec **Save** en haut à droite.
7. Copie le lien de l'overlay (bouton **Copy URL**) et ajoute-le dans OBS :
   **Sources > + > Navigateur**, colle le lien, 1920 x 1080.

## Réglages utiles
- **Durée d'affichage** et **pause entre deux panneaux** : par défaut 12 s et 25 s.
- Tu peux masquer un panneau avec les cases « Afficher : … ».
- **Commandes chat** : toi et tes modos pouvez taper `!code`, `!reseaux`, `!stats` ou `!montages`
  pour afficher tout de suite le panneau correspondant.
- **Langue** : français ou anglais.

## Tester sur ton PC
Ouvre le dossier du site avec Live Server, puis va sur `overlay-streamelements/apercu.html`.
Ajoute `?panel=stats` (ou `videos`, `socials`, `code`) à l'adresse pour figer un panneau.
