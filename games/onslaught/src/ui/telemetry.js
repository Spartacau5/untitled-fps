const API = "/api/telemetry";
const SESSION_KEY = "onslaught.session.v1";

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `s-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

// One session per tab. sessionStorage (not localStorage) is deliberate: it
// survives a reload of the same tab but not a new one, which is the closest
// thing the browser offers to "a sitting".
function loadSessionId() {
  try {
    const found = sessionStorage.getItem(SESSION_KEY);
    if (found) return found;
    const made = newId();
    sessionStorage.setItem(SESSION_KEY, made);
    return made;
  } catch {
    return newId();
  }
}

export class Telemetry {
  constructor() {
    ((this.sessionId = loadSessionId()),
      (this.startedAt = new Date().toISOString()),
      (this.startMs = Date.now()),
      (this.runs = 0),
      (this.sent = false));
  }
  // Beacons rather than fetch: the interesting events are the ones that fire
  // as the tab is going away, and a normal request is cancelled on unload.
  _send(payload, viaBeacon) {
    const body = JSON.stringify(payload);
    if (viaBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
      try {
        if (
          navigator.sendBeacon(
            API,
            new Blob([body], { type: "application/json" }),
          )
        )
          return;
      } catch {
        /* fall through to fetch */
      }
    }
    try {
      fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: !!viaBeacon,
      }).catch(() => {});
    } catch {
      /* telemetry must never break play */
    }
  }
  run(record, runId, viaBeacon = false) {
    if (!record) return;
    this.runs += 1;
    this._send(
      { type: "run", sessionId: this.sessionId, runId: runId || "", record },
      viaBeacon,
    );
  }
  // Fired once, as the tab goes away. `lastState` and `lastWave` are what make
  // "clicked off on wave 4" answerable for people who never died.
  end(lastState, lastWave) {
    if (this.sent) return;
    this.sent = true;
    this._send(
      {
        type: "session",
        sessionId: this.sessionId,
        startedAt: this.startedAt,
        msOnPage: Date.now() - this.startMs,
        runs: this.runs,
        lastState,
        lastWave,
      },
      true,
    );
  }
}
