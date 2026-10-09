// Njihanje tereta kao funkcija skrola (nema sata ni petlje u pozadini, kao ostatak scene):
// klatno koje pokreće ubrzanje strijele i kolica, izračunato unaprijed u tabelu.

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
