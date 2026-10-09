import * as THREE from '../vendor/three.module.min.js';

// Život oko krana, sve kao funkcija skrola (nema sata ni petlje u pozadini, kao ostatak scene):
//  • njihanje tereta — klatno koje pokreće ubrzanje strijele i kolica, izračunato unaprijed u tabelu;
//  • sjenka krana — ravna "štampana" traka na tlu koja se okreće sa strijelom;
//  • jato ptica — sjede na strijeli i prhnu čim se kran pokrene.

const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));

// ——— Klatno ———
// Tabela kuta otklona (tangencijalno i radijalno, u radijanima) za progres 0..1.
// slewAt(p) daje ugao strijele, trolleyAt(p) udaljenost kolica od stuba.
export function swayTable(slewAt, trolleyAt, { N = 2400, omega = 105, zeta = .045, maxT = .14, maxR = .06 } = {}) {
  const h = 1 / N;
  const t = new Float32Array(N + 1), r = new Float32Array(N + 1);
  let a = 0, va = 0, b = 0, vb = 0;
  for (let i = 0; i <= N; i++) {
    const p = i * h;
    // ubrzanje tačke ovjesa (drugi izvod po progresu)
    const thAcc = (slewAt(p + h) - 2 * slewAt(p) + slewAt(p - h)) / (h * h);
    const txAcc = (trolleyAt(p + h) - 2 * trolleyAt(p) + trolleyAt(p - h)) / (h * h);
    const R = trolleyAt(p);
    for (let s = 0; s < 4; s++) {
      const dt = h / 4;
      va += (-omega * omega * a - 2 * zeta * omega * va - R * thAcc) * dt;
      a += va * dt;
      vb += (-omega * omega * b - 2 * zeta * omega * vb - txAcc) * dt;
      b += vb * dt;
    }
    t[i] = a;
    r[i] = b;
  }
  const norm = (arr, max) => {
    let m = 0;
    for (const v of arr) m = Math.max(m, Math.abs(v));
    if (m > 0) for (let i = 0; i < arr.length; i++) arr[i] *= max / m;
  };
  norm(t, maxT);
  norm(r, maxR);
  return (p, out) => {
    const x = clamp(p) * N, i = Math.min(N - 1, Math.floor(x)), f = x - i;
    out.t = t[i] + (t[i + 1] - t[i]) * f;
    out.r = r[i] + (r[i + 1] - r[i]) * f;
    return out;
  };
}

// ——— Sjenka krana ———
// Pravac svjetla isti kao u print rendereru (lightDir -.5,.74,.46): tačka na visini y pada
// na tlo pomjerena za (k.x*y, k.z*y).
const K = { x: .5 / .74, z: -.46 / .74 };
export function createCraneShadow(scene) {
  const mat = new THREE.MeshStandardMaterial({ color: '#8f9bb3' });
  Object.assign(mat.userData, { ink: .34, flat: true, edgeW: 0 });
  const geo = new THREE.BoxGeometry(1, .02, 1);
  const root = new THREE.Group();
  root.name = 'craneShadow';
  scene.add(root);
  const strip = () => { const s = new THREE.Mesh(geo, mat); s.userData.printSolid = true; root.add(s); return s; };
  const mast = strip(), jib = strip(), counter = strip(), cable = strip(), load = strip();
  const Y = .05;
  const lay = (s, ax, az, bx, bz, w) => {
    const dx = bx - ax, dz = bz - az, len = Math.max(.01, Math.hypot(dx, dz));
    s.position.set((ax + bx) / 2, Y, (az + bz) / 2);
    s.rotation.y = -Math.atan2(dz, dx);
    s.scale.set(len, 1, w);
  };
  const proj = (v) => ({ x: v.x + K.x * v.y, z: v.z + K.z * v.y });
  return {
    root,
    /** mastBase, jibRoot, jibTip, trolleyTop, loadPos: THREE.Vector3 u svijetu */
    update(mastBase, top, jibRoot, jibTip, trolleyTop, loadPos, loadVisible) {
      const a = proj(top), r = proj(jibRoot), t = proj(jibTip), c = proj(trolleyTop), l = proj(loadPos);
      lay(mast, mastBase.x, mastBase.z, a.x, a.z, 1.5);
      lay(jib, a.x, a.z, t.x, t.z, 1.1);
      lay(counter, r.x, r.z, a.x, a.z, 1.9);
      lay(cable, c.x, c.z, l.x, l.z, .18);
      load.visible = cable.visible = loadVisible;
      load.position.set(l.x, Y, l.z);
      load.scale.set(2.6, 1, 2.6);
    },
  };
}

// ——— Ptice ———
// Jato kruži na otvorenom nebu pored glave krana (prvi kadar gleda odozdo, pa bi ih strijela
// zaklonila da sjede na njoj). Kad se kran pokrene, ptice jedna za drugom prhnu u stranu i uvis.
export function createBirds(scene, count = 9) {
  const mat = new THREE.MeshStandardMaterial({ color: '#1b2436', side: THREE.DoubleSide });
  Object.assign(mat.userData, { ink: .95, flat: true, edgeW: 0 });
  // Silueta galeba: unutrašnji i spoljašnji dio krila (pregib daje "M" oblik), ravni, u XZ ravni.
  const flat = (pts) => {
    const s = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, z)));
    const g = new THREE.ShapeGeometry(s);
    g.rotateX(Math.PI / 2);
    return g;
  };
  const innerGeo = flat([[0, -.1], [.2, -.16], [.46, -.12], [.46, .06], [.2, .1], [0, .12]]);
  const outerGeo = flat([[0, -.12], [.28, -.1], [.6, .05], [.3, .03], [0, .06]]);
  const bodyGeo = new THREE.BoxGeometry(.09, .07, .52);
  const root = new THREE.Group();
  root.name = 'birds';
  scene.add(root);
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const birds = Array.from({ length: count }, (_, i) => {
    const g = new THREE.Group();
    g.userData.printCrane = true; // puno mastilo, kao kran
    const body = new THREE.Mesh(bodyGeo, mat);
    const wing = (side) => {
      const inner = new THREE.Group(), outer = new THREE.Group();
      inner.add(new THREE.Mesh(innerGeo, mat));
      outer.add(new THREE.Mesh(outerGeo, mat));
      outer.position.x = .46;
      inner.add(outer);
      inner.scale.x = side;
      g.add(inner);
      return { inner, outer };
    };
    const left = wing(1), right = wing(-1);
    g.add(body);
    root.add(g);
    return {
      g, left, right,
      home: new THREE.Vector3(),
      // mjesto u prvom kadru (NDC): desno od stuba, u gornjem nebu, rastresito
      // kamera se smješta sa odnosom 1:1, a ekran je širi — x je zato veći od 1
      ndc: [.62 + rnd() * .8, .12 + rnd() * .62],
      depth: 38 + rnd() * 22,
      takeoff: .018 + i * .006 + rnd() * .006,
      dir: new THREE.Vector3(.4 + rnd() * .6, .35 + rnd() * .4, -.6 + rnd() * 1.2).normalize(),
      reach: 30 + rnd() * 16,
      circle: .6 + rnd() * .9,
      phase: rnd() * Math.PI * 2,
      rate: 320 + rnd() * 140,
      scale: 1.6 + rnd() * .7,
    };
  });
  const _v = new THREE.Vector3(), _c = new THREE.Vector3();
  return {
    root,
    /** Smjesti jato u prvi kadar (kamera postavljena za progres 0). */
    place(camera) {
      camera.updateMatrixWorld();
      for (const b of birds) {
        _v.set(b.ndc[0], b.ndc[1], .5).unproject(camera).sub(camera.position).normalize();
        b.home.copy(camera.position).addScaledVector(_v, b.depth);
      }
    },
    update(p) {
      root.visible = p < .3;
      if (!root.visible) return;
      for (const b of birds) {
        const u = clamp((p - b.takeoff) / .16);
        const e = u * u * (3 - 2 * u);
        // prije polijetanja: lagano kruženje (vezano za skrol, ne za sat)
        const a = b.phase + p * 60;
        _c.set(Math.cos(a) * b.circle, Math.sin(a * 1.3) * .3, Math.sin(a) * b.circle);
        b.g.position.copy(b.home).add(_c).addScaledVector(b.dir, b.reach * e);
        b.g.position.y += Math.sin(e * Math.PI) * 2;
        const heading = u > 0 ? Math.atan2(b.dir.x, b.dir.z) : a + Math.PI / 2;
        b.g.rotation.set(u > 0 ? -.3 * (1 - e) : 0, heading, 0);
        b.g.scale.setScalar(b.scale);
        const flap = Math.sin(p * b.rate * (u > 0 ? 1.5 - .5 * e : .45) + b.phase) * (u > 0 ? .8 : .35);
        // unutrašnji dio diže, spoljašnji zaostaje i povija vrh nadolje (galeb)
        b.left.inner.rotation.z = flap + .18;
        b.right.inner.rotation.z = -flap - .18;
        b.left.outer.rotation.z = -.55 * flap - .32;
        b.right.outer.rotation.z = -.55 * flap - .32; // roditelj je zrcaljen, pa isti znak
      }
    },
  };
}
