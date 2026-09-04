import {
  Color,
  CylinderGeometry,
  DynamicDrawUsage,
  Euler,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
} from "three";

export class Shells {
  constructor(t, e = 64) {
    const n = new CylinderGeometry(0.0045, 0.0045, 0.028, 8);
    n.rotateZ(Math.PI / 2);
    const s = new MeshStandardMaterial({
      color: 16777215,
      metalness: 1,
      roughness: 0.28,
    });
    ((this.mesh = new InstancedMesh(n, s, e)),
      this.mesh.instanceMatrix.setUsage(DynamicDrawUsage),
      (this.mesh.frustumCulled = !1),
      (this.mesh.castShadow = !1));
    for (let r = 0; r < e; r++) this.mesh.setColorAt(r, new Color(14266954));
    ((this.n = e), (this.items = []));
    for (let r = 0; r < e; r++)
      this.items.push({
        active: !1,
        p: new Vector3(),
        v: new Vector3(),
        rot: new Euler(),
        av: new Vector3(),
        life: 0,
        scale: 1,
        bounced: !1,
      });
    ((this.head = 0),
      (this._m = new Matrix4()),
      (this._q = new Quaternion()),
      (this._s = new Vector3()),
      t.add(this.mesh),
      (this.onBounce = null));
  }
  eject(t, e, n) {
    const s = this.items[this.head];
    ((this.head = (this.head + 1) % this.n),
      (s.active = !0),
      s.p.copy(t),
      s.v.copy(e),
      (s.life = 5),
      (s.bounced = !1),
      s.rot.set(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      s.av.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
      ),
      (s.scale = n === "shotgun" ? 2.2 : n === "dmr" ? 1.5 : 1));
    const r = this.items.indexOf(s);
    (this.mesh.setColorAt(
      r,
      n === "shotgun" ? new Color(13380138) : new Color(14266954),
    ),
      (this.mesh.instanceColor.needsUpdate = !0));
  }
  update(t, e) {
    for (let n = 0; n < this.n; n++) {
      const s = this.items[n];
      if (!s.active) {
        (this._m.makeScale(0, 0, 0), this.mesh.setMatrixAt(n, this._m));
        continue;
      }
      if (((s.life -= t), s.life <= 0)) {
        ((s.active = !1),
          this._m.makeScale(0, 0, 0),
          this.mesh.setMatrixAt(n, this._m));
        continue;
      }
      ((s.v.y -= 22 * t), s.p.addScaledVector(s.v, t));
      const r = e ? e(s.p.x, s.p.z) : 0;
      (s.p.y < r + 0.006 &&
        ((s.p.y = r + 0.006),
        Math.abs(s.v.y) > 0.6
          ? ((s.v.y *= -0.38),
            (s.v.x *= 0.55),
            (s.v.z *= 0.55),
            s.av.multiplyScalar(0.4),
            !s.bounced &&
              this.onBounce &&
              (this.onBounce(s.p), (s.bounced = !0)))
          : (s.v.set(0, 0, 0),
            s.av.set(0, 0, 0),
            (s.rot.x = 0),
            (s.rot.z = 0))),
        (s.rot.x += s.av.x * t),
        (s.rot.y += s.av.y * t),
        (s.rot.z += s.av.z * t));
      const a = s.scale * (s.life < 0.6 ? s.life / 0.6 : 1);
      (this._q.setFromEuler(s.rot),
        this._s.set(a, a, a),
        this._m.compose(s.p, this._q, this._s),
        this.mesh.setMatrixAt(n, this._m));
    }
    this.mesh.instanceMatrix.needsUpdate = !0;
  }
}
