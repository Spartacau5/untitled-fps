export class DebugOverlay {
  constructor(root) {
    this.root = root;
    this.visible = false;
    this.timer = 0;
  }

  toggle() { this.visible = !this.visible; this.root.classList.toggle("show", this.visible); }

  update(dt, data) {
    if (!this.visible) return;
    this.timer -= dt;
    if (this.timer > 0) return;
    this.timer = 0.12;
    const sway = data.sway;
    const recoil = data.recoil;
    this.root.textContent = [
      `FPS ${data.fps.toFixed(1)}  FRAME ${data.frameMs.toFixed(2)}ms`,
      `DRAW ${data.drawCalls}  TRI ${data.triangles}`,
      `AI ${data.ai}  PARTICLES ${data.particles}  RAGDOLLS ${data.ragdolls}`,
      `POOL particles ${data.particlePool} / decals ${data.decalPool} / shells ${data.shellPool}`,
      `SEED 0xC0DA  FIXED 120Hz  TIME ${data.timeScale.toFixed(2)}x`,
      `RESTARTS ${data.restartCount}  LISTENERS SINGLE-BIND`,
      `ADS ${data.adsBlend.toFixed(3)}  MIN FLOOR LOOK ${data.adsFloor.toFixed(2)} BOB ${data.bobFloor.toFixed(2)} BREATH ${data.breathFloor.toFixed(2)}`,
      `SWAY yaw ${sway.yaw.toFixed(4)} pitch ${sway.pitch.toFixed(4)} roll ${sway.roll.toFixed(4)}`,
      `SWAY lagX ${sway.lagX.toFixed(4)} lagY ${sway.lagY.toFixed(4)} ADS FLOOR ${sway.floor.toFixed(2)} POSE ${sway.poseX.toFixed(3)} ${sway.poseY.toFixed(3)}`,
      `RECOIL p ${recoil.pitch.toFixed(4)} y ${recoil.yaw.toFixed(4)} r ${recoil.roll.toFixed(4)} z ${recoil.punch.toFixed(4)} v ${recoil.pitchVelocity.toFixed(2)} ${recoil.punchVelocity.toFixed(2)} N ${recoil.shots}`,
    ].join("\n");
  }
}
