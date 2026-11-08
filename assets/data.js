/* =====================================================================
   DONNÉES DU SITE — modifie ce fichier pour mettre à jour le site.
   Chiffres relevés sur YouTube, X et TikTok le 8 novembre 2026.
   ===================================================================== */

/* Tes infos */
const ME = {
  pseudo: "Veltrixx",
  // Ta photo de profil X, toujours à jour : unavatar.io va chercher ta photo actuelle sur X.
  // Si le service ne répond pas, l'ancienne photo s'affiche, puis le V.
  pp: "https://unavatar.io/x/veltrixx10?fallback=" + encodeURIComponent("https://pbs.twimg.com/profile_images/2116868082761101312/RHSWf1au_400x400.jpg"),
  email: "contact@veltrixx.eu",
  // Adresse de l'application Google (Apps Script) qui enregistre les avis. Vide = les avis arrivent par mail.
  reviewsApi: "https://script.google.com/macros/s/AKfycbw_6ucXhna9G0TwGYLsUSDtdoCVHHVt1K2wjr4QNI6kM18RraAkXCyH4QvmhUvAmO8jbA/exec",
  discordUser: "veltrixxm10",
  // Pour que le bouton Discord ouvre directement ton profil, colle ton ID Discord ici
  // (Discord > Paramètres > Avancés > Mode développeur, puis clic droit sur ton profil > Copier l'identifiant).
  discordId: "",
  x: "https://x.com/veltrixx10",
  twitch: "https://www.twitch.tv/veltrixx10",
  viewsClaim: "6M"           // "+6M views" de ta bio X (toutes plateformes confondues)
};

/* Chaînes suivies en direct sur la page Statistiques (Lyost Esport, Kurama et Zocian sont exclus).
   Les vues sont comptées à partir de ton arrivée sur chaque chaîne.
   Pour changer une date ou un compte, modifie aussi scripts/update-stats.mjs (même valeurs). */
/* Comptes, avis et messagerie (Supabase). L'adresse et la clé « anon » sont publiques : elles sont faites pour être dans le site,
   la sécurité est assurée par les règles de la base de données (supabase/schema.sql). Vide = comptes désactivés. */
const SUPABASE = { url: "", anonKey: "" };

const LIVE = {
  youtube: { akiira: "UCKWNLyvbV-vt6fM5q_E-igw", skyjump: "UCcifpfOD-8hCO9vbMoN41Nw", werex: "UCvQDDvqFF0A0ZQvdCW2irzQ", leo: "UCu7zXI2tMumbrjmBgJIfPBA" },
  tiktok:  { akiira: "akiiraftn", werex: "werexfn", skyjump: "skyjumpftnn" },
  since:   { werex: "2026-03-28", akiira: "2026-06-11", skyjump: "2026-06-11", leo: "2026-08-12" },
  refreshMinutes: 10
};

/* Montages : 5 vidéos par chaîne. ch = clé du créateur (voir CREATORS). v = vues, l = likes.
   Le site prend automatiquement la plus vue de chaque chaîne pour la page d'accueil. */
const VIDEOS = [
  { id: "IXR9GzDJFm4", ch: "leo",     t: "J’ai RÉUNI 6 PROS pour un 3VS3 TOKEN avec SHXRK, RAX, AKIIRA.. (Akiira est devenu Peterbot..)", v: 62276, l: 1057, dur: "18:47" },
  { id: "8misPuF_eQ8", ch: "leo",     t: "J’ai ORGANISÉ LE 1VS1 entre le MEILLEUR JOUEUR DU MONDE et le MEILLEUR FRANÇAIS.. (Faut voir ça)", v: 33251, l: 708, dur: "18:13" },
  { id: "lGLx3EJRSSY", ch: "leo",     t: "J'ai ORGANISÉ UN 2VS2 ENTRE PROS AVEC DE L'ARGENT EN JEU (Faut voir ça)", v: 20661, l: 419, dur: "19:01" },
  { id: "nDBlZl9qGyo", ch: "leo",     t: "Les MEILLEURS MOMENTS du JOUR 1 des WORLDS FORTNITE 😭 (Best Of Globals)", v: 15907, l: 422, dur: "14:26" },
  { id: "U6umtmVpoVE", ch: "leo",     t: "LE PLUS GROS 1v1 de l'HISTOIRE de FORTNITE 😱 (Best Of Globals)", v: 12421, l: 340, dur: "10:00" },

  { id: "v2tI9HZqOLg", ch: "akiira",  t: "3RD PLACE FNCS SOLO ON CONTROLLER (2/4 WINS + QUAL GRANDS) 🏆", v: 16710, l: 350, dur: "11:13" },
  { id: "owccJ0V1lZg", ch: "akiira",  t: "14th in FNCS Grand Finals (+$2000) | Best Controller + Settings", v: 14489, l: 331, dur: "22:48" },
  { id: "GWbFf-K8uME", ch: "akiira",  t: "W-KEYING SOLO CASH CUP RELOAD (MOST KILLS) 🥇 | Akiira", v: 14121, l: 323, dur: "15:00" },
  { id: "4s8WjEnXSt0", ch: "akiira",  t: "1ST PLACE IN PERF CUP W/@Podasai (+800$) 🏆 | Akiira", v: 13353, l: 243, dur: "21:41" },
  { id: "6XqWpSbgS5A", ch: "akiira",  t: "1ST PLACE IN PERF CUP WITH MY NEW TRIO (+1200$) 🏆 | Akiira", v: 7717, l: 140, dur: "17:16" },

  { id: "zQJzlb5ORBg", ch: "werex",   t: "Le RETOUR DU MEILLEUR TRIO FRANÇAIS.. (+1200$) 🔥| Werex", v: 15195, l: 193, dur: "17:39" },
  { id: "QDnz9CeYffw", ch: "werex",   t: "COMMENT ON A FINI PREMIER DE LA FINALE DIV CUP AVEC KURAMA 🏆🔥| Werex", v: 5442, l: 60, dur: "17:45" },
  { id: "MfyjKWBf9vM", ch: "werex",   t: "MON INCROYABLE SETUP POUR 2026 À 10 000€ !", v: 4457, l: 378, dur: "5:23" },
  { id: "jGY4-u_x6k8", ch: "werex",   t: "Comment JE ME SUIS QUALIFIER EN GRANDE FINALE FNCS !?🏆", v: 3654, l: 63, dur: "15:20" },
  { id: "rQ6q3Z8_fVE", ch: "werex",   t: "COMMENT ON A GAGNÉ 5000€ EN COUPE DE FRANCE 🇫🇷..", v: 3443, l: 74, dur: "11:09" },

  { id: "owfKrlQzqBA", ch: "skyjump", t: "1ST IN FNCS DIV CUP OPEN | SkyJump", v: 12373, l: 87, dur: "15:28" },
  { id: "SwWL2ras1Jw", ch: "skyjump", t: "1ST PLACE EWC LAN (QUAL FOR 1.000.000$ WORLD CUP) 🥇", v: 6264, l: 167, dur: "13:52" },
  { id: "qFkm_9E8tvU", ch: "skyjump", t: "How We Qualified For FINALS LAST CHANCE QUALIFIER ! 🏆", v: 5144, l: 100, dur: "17:11" },
  { id: "uboTqw0Po6o", ch: "skyjump", t: "VICE CHAMPION DU MONDE DE FORTNITE (+ 150 000€) 🏆 | SkyJump", v: 4159, l: 143, dur: "15:31" },
  { id: "2pG5Kgq8bWY", ch: "skyjump", t: "COMMENT J'AI DOMINÉ LES LOBBYS DE LA PLAYSTATION CUP 😱🔥", v: 3005, l: 82, dur: "16:09" }
];

/* Ordre des chaînes sur la page Montages */
const MONTAGE_CHANNELS = ["leo", "akiira", "werex", "skyjump"];

/* Page Collaborations (d'après ta bio X) */
const COLLABS = ["lyost", "leo", "akiira", "skyjump", "werex", "kurama"];

/* Carrousel "Ils m'ont fait confiance" sur l'accueil */
const CLIENTS = ["podasai", "lyost", "kurama", "akiira", "skyjump", "werex", "laizen", "leo"];

/* Créateurs et structures.
   pp : photo de profil. Dépose l'image dans assets/pp/ avec le nom indiqué (jpg, carrée).
        Tant qu'elle n'est pas là, la première lettre s'affiche à la place.
   role / desc : [français, anglais]. Les liens viennent de leurs profils officiels. */
/* Avis : ceux écrits par les clients sur le site sont dans la feuille Google « Avis site Veltrixx » (ME.reviewsApi).
   Tu peux aussi en ajouter ici à la main, ils s'affichent en plus.
   Format : { name: "Pseudo", role: "Créateur YouTube", rating: 5, text: "…", date: "2026-11-08", link: "https://…" (facultatif) } */
const REVIEWS = [
];

const CREATORS = {
  lyost: {
    name: "Lyost Esport", gold: true, page: "lyost.html", pp: "assets/pp/lyost.jpg",
    desc: ["Club esport marseillais · Fortnite & Valorant", "Marseille esports club · Fortnite & Valorant"],
    role: ["Monteur vidéo du staff", "Staff video editor"],
    stats: [["17,2 k", "X"], ["18 k", "TikTok"]],
    links: { site: "https://lyost.org", x: "https://x.com/Lyost_Esport", tiktok: "https://www.tiktok.com/@lyost_esport", youtube: "https://www.youtube.com/@lyostesport", instagram: "https://www.instagram.com/lyostesport/", twitch: "https://www.twitch.tv/lyostesport", discord: "https://discord.com/invite/EAvv7CDGkU" }
  },
  leo: {
    name: "Leothecrack", pp: "assets/pp/leo.jpg",
    desc: ["Créateur de contenu XP42 · ViewingParty Pro Fortnite", "XP42 content creator · Fortnite ViewingParty Pro"],
    role: ["Monteur & Channel Manager YouTube", "Editor & YouTube Channel Manager"],
    stats: [["91,7 k", "X"], ["18,5 k", "YouTube"]],
    links: { youtube: "https://www.youtube.com/@leothecrack", x: "https://x.com/leothecrack_", twitch: "https://www.twitch.tv/leothecrackfn", instagram: "https://www.instagram.com/leothecrackfn" }
  },
  akiira: {
    name: "Akiira", pp: "assets/pp/akiira.jpg",
    desc: ["Joueur pro Fortnite · Gentle Mates", "Fortnite pro player · Gentle Mates"],
    role: ["Monteur, Channel Manager YouTube & gestion TikTok", "Editor, YouTube Channel Manager & TikTok management"],
    stats: [["38,3 k", "X"], ["28,3 k", "TikTok"], ["16,3 k", "YouTube"]],
    links: { youtube: "https://www.youtube.com/@akiirafn", x: "https://x.com/AkiiraFN", tiktok: "https://www.tiktok.com/@akiiraftn", twitch: "https://www.twitch.tv/AkiiraL2", instagram: "https://www.instagram.com/akiiral2" }
  },
  skyjump: {
    name: "SkyJump", pp: "assets/pp/skyjump.jpg",
    desc: ["Joueur pro Fortnite", "Fortnite pro player"],
    role: ["Monteur, miniatures, Channel Manager & gestion TikTok", "Editor, thumbnails, Channel Manager & TikTok management"],
    stats: [["19,7 k", "X"], ["6 k", "TikTok"], ["3,7 k", "YouTube"]],
    links: { youtube: "https://www.youtube.com/@skyjumpftn", x: "https://x.com/SkyJumpftn", tiktok: "https://www.tiktok.com/@skyjumpftnn" }
  },
  werex: {
    name: "Werex", pp: "assets/pp/werex.jpg",
    desc: ["Joueur pro Fortnite · Lyost Esport", "Fortnite pro player · Lyost Esport"],
    role: ["Monteur & Channel Manager YouTube", "Editor & YouTube Channel Manager"],
    stats: [["16,4 k", "X"], ["13,6 k", "TikTok"], ["3,6 k", "YouTube"]],
    links: { youtube: "https://www.youtube.com/@werexfn", x: "https://x.com/WerexFNBR", twitch: "https://www.twitch.tv/werexeu", tiktok: "https://www.tiktok.com/@werexfn" }
  },
  kurama: {
    name: "Kurama", pp: "assets/pp/kurama.jpg",
    desc: ["Joueur pro Fortnite · Gentle Mates · Partenaire Twitch", "Fortnite pro player · Gentle Mates · Twitch Partner"],
    role: ["Montage & gestion de chaîne", "Editing & channel management"],
    stats: [["30,8 k", "X"]],
    links: { x: "https://x.com/FtnKurama", twitch: "https://www.twitch.tv/Kurama_203", site: "https://konect.gg/ftnkurama" }
  },
  podasai: {
    name: "Podasai", pp: "assets/pp/podasai.jpg",
    desc: ["Créateur de contenu Fortnite", "Fortnite content creator"],
    role: ["Montage de vidéos", "Video editing"],
    links: { youtube: "https://www.youtube.com/@podasai", x: "https://x.com/PodaSaiFN", twitch: "https://www.twitch.tv/podasai", tiktok: "https://www.tiktok.com/@podasai_off" }
  },
  laizen: {
    name: "Laizen", pp: "assets/pp/laizen.jpg",
    desc: ["Créateur de contenu · ancien joueur pro Fortnite", "Content creator · former Fortnite pro"],
    role: ["Montage", "Editing"],
    links: { youtube: "https://www.youtube.com/@LaizenYT", x: "https://x.com/LaizenYT", tiktok: "https://www.tiktok.com/@laizenftn", twitch: "https://www.twitch.tv/laiizenfn" }
  }
};
