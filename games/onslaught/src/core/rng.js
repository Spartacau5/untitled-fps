export function mulberry32(i) {
  return function () {
    ((i |= 0), (i = (i + 1831565813) | 0));
    let t = Math.imul(i ^ (i >>> 15), 1 | i);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
