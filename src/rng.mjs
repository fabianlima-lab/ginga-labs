// RNG com seed (mulberry32) — mundos reproduzíveis: mesma seed, mesmo mundo.

export function criarRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function entre(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function escolher(rng, lista) {
  return lista[Math.floor(rng() * lista.length)];
}

export function embaralhar(rng, lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Distribuição em sino (média de 3 uniformes) — atributos realistas, não uniformes.
export function sino(rng, min, max) {
  const u = (rng() + rng() + rng()) / 3;
  return Math.round(min + u * (max - min));
}
