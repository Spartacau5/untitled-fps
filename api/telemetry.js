import {
  exportEvents,
  listEvents,
  recordEvent,
  statsOnly,
} from "../server/telemetry-store.js";

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function sendCsv(res, status, body, name) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Disposition", `attachment; filename="${name}.csv"`);
  res.end(body);
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const url = new URL(req.url, "http://localhost");
      const format = url.searchParams.get("format");
      const type =
        url.searchParams.get("type") === "session" ? "session" : "run";
      if (format === "csv") {
        sendCsv(res, 200, await exportEvents(req, type), `onslaught-${type}s`);
        return;
      }
      if (format === "stats") {
        send(res, 200, await statsOnly(req));
        return;
      }
      send(res, 200, await listEvents(req));
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
      send(res, 200, await recordEvent(body, req));
      return;
    }
    send(res, 405, { error: "method not allowed" });
  } catch (err) {
    const msg = err && err.message ? err.message : "telemetry error";
    const status =
      err && err.status ? err.status : msg.startsWith("invalid") ? 400 : 500;
    send(res, status, { error: msg });
  }
}
