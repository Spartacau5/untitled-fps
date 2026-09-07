import test from "node:test";
import assert from "node:assert/strict";
import { TouchInput } from "../games/onslaught/src/core/touch-input.js";
import { isTouchDevice, lockLandscape } from "../games/onslaught/src/core/device.js";
import { World } from "../games/onslaught/src/sim/world.js";

test("touch actions coexist and edges survive render frames until the sim tick", () => {
  const i = new TouchInput(); i.lock(); i.move = {x: .4, y: .8};
  i.press("fire"); i.press("jump"); i.dx = 5; i.endFrame();
  assert.equal(i.dx, 0); assert.equal(i.frame().jump, true);
  assert.equal(i.frame().fireHeld, true); assert.deepEqual(i.frame().move, {x:.4,y:.8});
  i.endTick(); assert.equal(i.frame().jump, false); assert.equal(i.frame().fire, false);
  assert.equal(i.frame().fireHeld, true);
});
test("auto sprint yields to fire and toggled ADS and returns after release", () => {
  const i = new TouchInput(); i.lock(); assert.equal(i.frame().sprint, true);
  i.press("fire"); assert.equal(i.frame().sprint, false);
  i.release("fire"); assert.equal(i.frame().sprint, true);
  i.press("ads"); i.release("ads"); assert.equal(i.frame().ads, true);
  assert.equal(i.frame().sprint, false);
  i.press("ads"); assert.equal(i.frame().sprint, true);
});
test("pause clears held actions, pending edges, motion and ADS before resume", () => {
  const i = new TouchInput(); i.lock();
  for (const a of ["fire", "ads", "crouch", "weapon", "reload"]) i.press(a);
  i.move.y = 1; i.dx = 15; i.unlock(); i.lock();
  const f = i.frame();
  for (const a of ["fire", "fireHeld", "ads", "crouch", "reload"]) assert.equal(f[a], false);
  assert.equal(f.wheel, 0); assert.equal(f.move.y, 0); assert.equal(i.dx, 0);
});
test("device detection keeps fine primary pointers desktop and supports explicit overrides", () => {
  const win = {location:{search:""}, navigator:{maxTouchPoints:5}, matchMedia:()=>({matches:true})};
  assert.equal(isTouchDevice(win), true);
  win.matchMedia = ()=>({matches:false}); assert.equal(isTouchDevice(win), false);
  win.location.search = "?mobile=1"; assert.equal(isTouchDevice(win), true);
  win.location.search = "?mobile=0"; assert.equal(isTouchDevice(win), false);
  win.location.search = "?desktop=1&mobile=1"; assert.equal(isTouchDevice(win), false);
});
test("unsupported or rejected orientation lock is nonfatal", async () => {
  assert.equal(await lockLandscape({}), false);
  assert.equal(await lockLandscape({screen:{orientation:{lock:async()=>{throw Error("denied");}}}}),false);
});
test("touch ADS transitions out of a real sprint without a stuck aim state", () => {
  const w = new World({seed:123,noSpawn:true}); w.startRun();
  const i = new TouchInput(); i.lock(); i.move.y = 1;
  for(let n=0;n<60;n++) {w.step(1/60,i.frame()); i.endTick();}
  assert.equal(w.player.sprinting, true);
  i.press("ads");
  for(let n=0;n<60;n++) {w.step(1/60,i.frame()); i.endTick();}
  assert.equal(w.player.sprinting, false);
  assert.ok(w.player.ads > .8);
});
