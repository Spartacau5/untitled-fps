import * as THREE from "three";

export const Easing = {
  easeOutCubic: (t) => 1 - (1 - t) ** 3,
  easeInOutCubic: (t) => t < 0.5 ? 4 * t ** 3 : 1 - ((-2 * t + 2) ** 3) / 2,
  easeOutBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
  },
  easeInQuad: (t) => t * t,
};

function finite(value, fallback = 0) { return Number.isFinite(value) ? value : fallback; }

function integrateSpring(state, frequency, damping, dt) {
  if (dt <= 0) return;
  const omega = Math.max(0.01, frequency * Math.PI * 2);
  const ratio = Math.max(0, damping);
  const error = state.value - state.target;
  const velocity = state.velocity;
  if (Math.abs(error) < 0.000000001 && Math.abs(velocity) < 0.000000001) {
    state.value = state.target;
    state.velocity = 0;
    return;
  }
  if (ratio < 0.9999) {
    const wd = omega * Math.sqrt(Math.max(0.000001, 1 - ratio * ratio));
    const phase = wd * dt;
    const decay = Math.exp(-ratio * omega * dt);
    const cosine = Math.cos(phase);
    const sine = Math.sin(phase);
    const coefficient = (velocity + ratio * omega * error) / wd;
    state.value = state.target + decay * (error * cosine + coefficient * sine);
    state.velocity = decay * (velocity * cosine - ((ratio * omega * velocity + omega * omega * error) / wd) * sine);
  } else if (ratio <= 1.0001) {
    const decay = Math.exp(-omega * dt);
    const coefficient = velocity + omega * error;
    state.value = state.target + decay * (error + coefficient * dt);
    state.velocity = decay * (velocity - omega * coefficient * dt);
  } else {
    const root = Math.sqrt(Math.max(0.000001, ratio * ratio - 1));
    const rootA = -omega * (ratio - root);
    const rootB = -omega * (ratio + root);
    const coefficientB = (velocity - rootA * error) / (rootB - rootA);
    const coefficientA = error - coefficientB;
    const termA = coefficientA * Math.exp(rootA * dt);
    const termB = coefficientB * Math.exp(rootB * dt);
    state.value = state.target + termA + termB;
    state.velocity = rootA * termA + rootB * termB;
  }
  if (!Number.isFinite(state.value) || !Number.isFinite(state.velocity)) {
    state.value = finite(state.target);
    state.velocity = 0;
  }
}

export class Spring {
  constructor(value = 0, frequency = 12, damping = 0.86) {
    this.value = value;
    this.velocity = 0;
    this.target = value;
    this.frequency = frequency;
    this.damping = damping;
  }

  set(value, preserveVelocity = false) {
    this.value = finite(value);
    if (!preserveVelocity) this.velocity = 0;
    this.target = this.value;
    return this;
  }

  impulse(amount) { this.velocity += finite(amount); return this; }

  update(dt) {
    integrateSpring(this, this.frequency, this.damping, dt);
    return this.value;
  }

  snap(target, velocity = 0) { this.target = finite(target); this.velocity = finite(velocity); return this; }
}

export class Vec3Spring {
  constructor(value = new THREE.Vector3(), frequency = 12, damping = 0.86) {
    this.value = value.clone();
    this.velocity = new THREE.Vector3();
    this.target = value.clone();
    this.frequency = frequency;
    this.damping = damping;
    this.xState = { value: this.value.x, velocity: 0, target: this.target.x };
    this.yState = { value: this.value.y, velocity: 0, target: this.target.y };
    this.zState = { value: this.value.z, velocity: 0, target: this.target.z };
  }

  set(value, preserveVelocity = false) {
    this.value.copy(value);
    this.target.copy(value);
    if (!preserveVelocity) this.velocity.set(0, 0, 0);
    this.xState.value = this.value.x; this.xState.target = this.target.x; this.xState.velocity = this.velocity.x;
    this.yState.value = this.value.y; this.yState.target = this.target.y; this.yState.velocity = this.velocity.y;
    this.zState.value = this.value.z; this.zState.target = this.target.z; this.zState.velocity = this.velocity.z;
    return this;
  }

  impulse(value) { this.velocity.add(value); return this; }

  update(dt) {
    this.xState.value = this.value.x; this.xState.target = this.target.x; this.xState.velocity = this.velocity.x;
    this.yState.value = this.value.y; this.yState.target = this.target.y; this.yState.velocity = this.velocity.y;
    this.zState.value = this.value.z; this.zState.target = this.target.z; this.zState.velocity = this.velocity.z;
    integrateSpring(this.xState, this.frequency, this.damping, dt);
    integrateSpring(this.yState, this.frequency, this.damping, dt);
    integrateSpring(this.zState, this.frequency, this.damping, dt);
    this.value.set(this.xState.value, this.yState.value, this.zState.value);
    this.velocity.set(this.xState.velocity, this.yState.velocity, this.zState.velocity);
    return this.value;
  }

  snap(target, velocity = new THREE.Vector3()) { this.target.copy(target); this.velocity.copy(velocity); return this; }
}

export class QuatSpring {
  constructor(value = new THREE.Quaternion(), frequency = 12, damping = 0.86) {
    this.value = value.clone();
    this.target = value.clone();
    this.angularVelocity = new THREE.Vector3();
    this.frequency = frequency;
    this.damping = damping;
  }

  set(value) { this.value.copy(value); this.target.copy(value); this.angularVelocity.set(0, 0, 0); return this; }
  impulse(axis, amount) { this.angularVelocity.addScaledVector(axis, amount); return this; }

  update(dt) {
    const error = new THREE.Quaternion().copy(this.target).multiply(this.value.clone().invert());
    const axis = new THREE.Vector3();
    let angle = 2 * Math.acos(THREE.MathUtils.clamp(error.w, -1, 1));
    if (angle > Math.PI) angle -= Math.PI * 2;
    const sinHalf = Math.sqrt(Math.max(0, 1 - error.w * error.w));
    if (sinHalf > 0.0001) axis.set(error.x / sinHalf, error.y / sinHalf, error.z / sinHalf);
    const omega = Math.max(0.01, this.frequency * Math.PI * 2);
    this.angularVelocity.addScaledVector(axis, angle * omega * omega * dt);
    this.angularVelocity.multiplyScalar(Math.max(0, 1 - 2 * omega * this.damping * dt));
    const step = this.angularVelocity.length() * dt;
    if (step > 0.000001) this.value.multiply(new THREE.Quaternion().setFromAxisAngle(this.angularVelocity.clone().normalize(), step)).normalize();
    if (!Number.isFinite(this.value.w)) this.set(this.target);
    return this.value;
  }
}

export function softClamp(value, limit, softness = 0.65) {
  const safeLimit = Math.max(0.0001, Math.abs(limit));
  const magnitude = Math.abs(value);
  if (magnitude <= safeLimit) return value;
  const excess = magnitude - safeLimit;
  return Math.sign(value) * (safeLimit + Math.tanh(excess / (safeLimit * softness)) * safeLimit * softness);
}

export function damp(value, target, sharpness, dt) {
  return target + (value - target) * Math.exp(-Math.max(0, sharpness) * dt);
}
