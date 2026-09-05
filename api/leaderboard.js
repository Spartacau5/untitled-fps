import { listTop, submitRun } from "../server/leaderboard-store.js";

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      send(res, 200, await listTop(req));
      return;
    }
    if (req.method === "POST") {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString("utf8") || "{}";
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        send(res, 400, { error: "invalid json" });
        return;
      }
      send(res, 200, await submitRun(body, req));
      return;
    }
    send(res, 405, { error: "method not allowed" });
  } catch (err) {
    const msg = err && err.message ? err.message : "leaderboard error";
    send(res, msg.startsWith("invalid") ? 400 : 500, { error: msg });
  }
}
