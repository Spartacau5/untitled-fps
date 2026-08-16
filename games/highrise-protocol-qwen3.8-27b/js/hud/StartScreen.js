// U4: start screen before the match with START + GOD MODE + HUD toggles.
export class StartScreen {
  constructor(onStart) {
    this.el = document.getElementById('start-screen');
    this.btnStart = document.getElementById('btn-start');
    this.btnGod = document.getElementById('btn-god');
    this.btnHud = document.getElementById('btn-hud');
    this.god = false;
    this.hudOn = true;
    this.controlsCard = document.getElementById('controls-card');
    this._onStart = this.btnStart.addEventListener('click', () => {
      this.hide();
      onStart(this.god, this.hudOn);
    });
    this._onGod = this.btnGod.addEventListener('click', () => {
      this.god = !this.god;
      this.btnGod.textContent = 'GOD MODE: ' + (this.god ? 'ON' : 'OFF');
      this.btnGod.classList.toggle('on', this.god);
    });
    this._onHud = this.btnHud.addEventListener('click', () => {
      this.hudOn = !this.hudOn;
      this.btnHud.textContent = 'HUD: ' + (this.hudOn ? 'ON' : 'OFF');
      this.btnHud.classList.toggle('on', this.hudOn);
    });
    // dismiss controls card on first input (U3)
    this._dismiss = () => { this.controlsCard.style.opacity = '0.4'; };
    window.addEventListener('keydown', this._dismiss, { once: true });
    window.addEventListener('mousedown', this._dismiss, { once: true });
  }
  show() { this.el.classList.remove('hidden'); }
  hide() { this.el.classList.add('hidden'); }
  dispose() {
    this.btnStart.removeEventListener('click', this._onStart);
    this.btnGod.removeEventListener('click', this._onGod);
    this.btnHud.removeEventListener('click', this._onHud);
    window.removeEventListener('keydown', this._dismiss);
    window.removeEventListener('mousedown', this._dismiss);
    this.el.classList.add('hidden');
  }
}
