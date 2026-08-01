import { Spring } from "../core/spring.js";

const LINE_LENGTH = 11; // px
const LINE_THICKNESS = 2; // px

export class Crosshair {
  constructor(root) {
    this.root = document.createElement("div");
    this.root.id = "crosshair";
    this.root.innerHTML = '<i class="ch-dot"></i><i class="ch-line ch-top"></i><i class="ch-line ch-right"></i><i class="ch-line ch-bottom"></i><i class="ch-line ch-left"></i>';
    root.appendChild(this.root);
    this.bloom = new Spring(0, 13, 0.86);
    this.alpha = new Spring(1, 12, 0.9);
    this.recoilPunch = new Spring(0, 18, 0.75);
    // Zero-size anchor at the exact screen center: every child is laid out
    // symmetrically around (0, 0), so the reticle can never drift off-axis.
    this.root.style.cssText = "position:absolute;left:50%;top:50%;width:0;height:0;opacity:1";
    this.root.querySelector(".ch-dot").style.cssText = "position:absolute;width:3px;height:3px;border-radius:50%;background:#eaffff;box-shadow:0 0 8px #7defff;left:-1.5px;top:-1.5px";
    this.lines = {
      top: this.root.querySelector(".ch-top"),
      right: this.root.querySelector(".ch-right"),
      bottom: this.root.querySelector(".ch-bottom"),
      left: this.root.querySelector(".ch-left"),
    };
    const base = "position:absolute;background:#dffcff;box-shadow:0 0 6px rgba(151,240,255,.8);border-radius:2px";
    this.lines.top.style.cssText = `${base};width:${LINE_THICKNESS}px;height:${LINE_LENGTH}px`;
    this.lines.bottom.style.cssText = `${base};width:${LINE_THICKNESS}px;height:${LINE_LENGTH}px`;
    this.lines.left.style.cssText = `${base};width:${LINE_LENGTH}px;height:${LINE_THICKNESS}px`;
    this.lines.right.style.cssText = `${base};width:${LINE_LENGTH}px;height:${LINE_THICKNESS}px`;
  }

  update(dt, { moving, firing, adsBlend }) {
    const targetBloom = Math.min(1, moving * 0.6 + (firing ? 0.42 : 0));
    this.bloom.target = targetBloom;
    this.alpha.target = adsBlend > 0.62 ? 0 : 1;
    this.bloom.update(dt);
    this.alpha.update(dt);
    this.recoilPunch.update(dt);
    const gap = 6 + this.bloom.value * 15 + this.recoilPunch.value * 12;
    this.root.style.opacity = String(this.alpha.value);
    const half = LINE_THICKNESS / 2;
    this.lines.top.style.left = `${-half}px`;
    this.lines.top.style.top = `${-gap - LINE_LENGTH}px`;
    this.lines.bottom.style.left = `${-half}px`;
    this.lines.bottom.style.top = `${gap}px`;
    this.lines.left.style.top = `${-half}px`;
    this.lines.left.style.left = `${-gap - LINE_LENGTH}px`;
    this.lines.right.style.top = `${-half}px`;
    this.lines.right.style.left = `${gap}px`;
  }

  punch() { this.recoilPunch.impulse(0.8); }
}
