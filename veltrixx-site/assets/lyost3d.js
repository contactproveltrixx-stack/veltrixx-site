/* Page Lyost : le logo tourne en 3D derrière la page et se déplace quand on descend.
   Le logo vient du fichier assets/lyost-logo.png (PNG carré, fond transparent de préférence).
   Tant que ce fichier n'est pas là, la pièce affiche simplement « LYOST ESPORT ». */
(function () {
  var canvas = document.getElementById('lyost3d');
  if (!canvas || !window.THREE) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); }
  catch (e) { canvas.remove(); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  /* Lumières : bleu Marseille d'un côté, or de l'autre */
  scene.add(new THREE.AmbientLight(0x8fa8ff, 0.55));
  var key = new THREE.DirectionalLight(0xffffff, 0.75); key.position.set(3, 4, 6); scene.add(key);
  var blue = new THREE.PointLight(0x3ccbff, 2.2, 30); blue.position.set(-5, -2, 4); scene.add(blue);
  var gold = new THREE.PointLight(0xf4c14a, 2.4, 30); gold.position.set(5, 2, 3); scene.add(gold);

  /* Face de la pièce : dessinée sur un canvas (fond bleu nuit + logo ou texte) */
  function faceTexture(img) {
    var c = document.createElement('canvas'); c.width = c.height = 1024;
    var x = c.getContext('2d');
    var g = x.createRadialGradient(512, 420, 60, 512, 512, 520);
    g.addColorStop(0, '#173a8a'); g.addColorStop(0.65, '#0a1638'); g.addColorStop(1, '#050a1c');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 1024);
    x.strokeStyle = 'rgba(244,193,74,.55)'; x.lineWidth = 10; x.beginPath(); x.arc(512, 512, 470, 0, Math.PI * 2); x.stroke();
    if (img) {
      var s = 620, r = Math.min(s / img.width, s / img.height);
      x.drawImage(img, 512 - img.width * r / 2, 512 - img.height * r / 2, img.width * r, img.height * r);
    } else {
      x.fillStyle = '#ffffff'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = 'italic 900 210px Montserrat, Arial Black, sans-serif'; x.fillText('LYOST', 512, 470);
      x.fillStyle = '#F4C14A'; x.font = 'italic 900 92px Montserrat, Arial Black, sans-serif'; x.fillText('ESPORT', 512, 640);
    }
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8;
    return t;
  }
  var faceMat = new THREE.MeshPhysicalMaterial({ map: faceTexture(null), metalness: 0.2, roughness: 0.5, clearcoat: 0.6, clearcoatRoughness: 0.35 });
  var rimMat = new THREE.MeshPhysicalMaterial({ color: 0xe8b23a, metalness: 1, roughness: 0.22, clearcoat: 1, emissive: 0x3a2400, emissiveIntensity: 0.35 });

  var coin = new THREE.Group();
  // tranche de la pièce (cylindre ouvert) + deux faces rondes qui regardent devant et derrière
  var edge = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.26, 128, 1, true), rimMat);
  edge.rotation.x = Math.PI / 2;
  coin.add(edge);
  var front = new THREE.Mesh(new THREE.CircleGeometry(1.6, 128), faceMat);
  front.position.z = 0.13; coin.add(front);
  var back = new THREE.Mesh(new THREE.CircleGeometry(1.6, 128), faceMat);
  back.position.z = -0.13; back.rotation.y = Math.PI; coin.add(back);
  [0.14, -0.14].forEach(function (z) {
    var ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.075, 24, 128), rimMat);
    ring.position.z = z; coin.add(ring);
  });
  /* Halo en verre autour de la pièce */
  var halo = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.02, 12, 160), new THREE.MeshBasicMaterial({ color: 0x3ccbff, transparent: true, opacity: 0.35 }));
  coin.add(halo);
  var halo2 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.012, 12, 160), new THREE.MeshBasicMaterial({ color: 0xf4c14a, transparent: true, opacity: 0.25 }));
  coin.add(halo2);
  scene.add(coin);

  /* Le vrai logo, s'il a été ajouté (PNG puis l'image de profil Lyost) */
  // Quand le site est ouvert directement depuis l'ordinateur (adresse en file://), le navigateur
  // interdit d'utiliser une image dans la 3D par sécurité : la pièce garde alors « LYOST ESPORT ».
  // Une fois le site en ligne (GitHub Pages…), le logo s'affiche normalement.
  function usable(tex) {
    try { tex.image.getContext('2d').getImageData(0, 0, 1, 1); return true; } catch (e) { return false; }
  }
  function tryLogo(srcs) {
    if (!srcs.length || location.protocol === 'file:') return;
    var img = new Image();
    img.onload = function () {
      var tex = faceTexture(img);
      if (!usable(tex)) { tryLogo(srcs.slice(1)); return; }
      faceMat.map = tex; faceMat.needsUpdate = true; draw();
    };
    img.onerror = function () { tryLogo(srcs.slice(1)); };
    img.src = srcs[0];
  }
  tryLogo(['assets/lyost-logo.png', (window.CREATORS && CREATORS.lyost && CREATORS.lyost.pp) || 'assets/pp/lyost.jpg']);

  /* Taille et position selon l'écran */
  var W = 0, H = 0, mobile = false, amp = 2.7;
  function resize() {
    W = window.innerWidth; H = window.innerHeight; mobile = W < 820;
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    coin.scale.setScalar(mobile ? 0.75 : 0.9);
    // jusqu'où la pièce peut aller sur les côtés sans sortir de l'écran
    amp = Math.max(0, Math.tan(17.5 * Math.PI / 180) * 9 * camera.aspect - 2.3);
    canvas.style.opacity = mobile ? '.32' : '.95';
    draw();
  }

  var mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener('pointermove', function (e) { tx = (e.clientX / W - 0.5) * 2; ty = (e.clientY / H - 0.5) * 2; }, { passive: true });

  function scrollProgress() {
    var max = Math.max(1, document.documentElement.scrollHeight - H);
    return Math.min(1, Math.max(0, window.scrollY / max));
  }
  var t0 = performance.now();
  function draw(now) {
    var p = scrollProgress(), t = ((now || performance.now()) - t0) / 1000;
    mx += (tx - mx) * 0.06; my += (ty - my) * 0.06;
    /* droite en haut de page, gauche au milieu, puis de retour à droite, comme une vague */
    var side = mobile ? 0 : Math.cos(p * Math.PI * 2) * amp;
    coin.position.x = side;
    coin.position.y = mobile ? 0 : Math.sin(p * Math.PI * 2) * 0.5 + (reduce ? 0 : Math.sin(t * 0.9) * 0.08);
    coin.rotation.y = p * Math.PI * 4 + (reduce ? 0 : t * 0.45) + mx * 0.35;
    coin.rotation.x = -0.18 + my * 0.25 + Math.sin(p * Math.PI * 3) * 0.25;
    halo.rotation.x = t * 0.3; halo.rotation.y = t * 0.2;
    halo2.rotation.y = -t * 0.25; halo2.rotation.x = 0.6;
    renderer.render(scene, camera);
  }
  function loop(now) { draw(now); requestAnimationFrame(loop); }
  window.addEventListener('resize', resize);
  resize();
  if (reduce) window.addEventListener('scroll', function () { draw(); }, { passive: true });
  else requestAnimationFrame(loop);

  /* Bandeau « Pour Marseille, par Marseille » qui glisse avec le scroll */
  var motto = document.getElementById('motto');
  if (motto) {
    var move = function () { var r = motto.parentNode.getBoundingClientRect(); motto.style.transform = 'translateX(' + (-(H - r.top) * 0.35) + 'px)'; };
    window.addEventListener('scroll', move, { passive: true }); move();
  }
})();
