import { listTop } from "../server/leaderboard-store.js";
import { markPlayer } from "../server/visitor-store.js";

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      send(res, 405, { error: "method not allowed" });
      return;
    }
    await markPlayer(req);
    send(res, 200, await listTop(req));
  } catch (err) {
    const msg = err && err.message ? err.message : "play error";
    send(res, 500, { error: msg });
  }
}
