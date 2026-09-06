import { listTop, submitRun } from "../../server/leaderboard-store.js";
import { listNotes, submitNote } from "../../server/feedback-store.js";
import { markPlayer } from "../../server/visitor-store.js";

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

// Dev-only: same /api/leaderboard the production Vercel function exposes.
export function leaderboardPlugin() {
  return {
    name: "leaderboard-api",
    configureServer(server) {
      server.middlewares.use("/api/leaderboard", async (req, res, next) => {
        if (req.method !== "GET" && req.method !== "POST") return next();
        try {
          if (req.method === "GET") {
            send(res, 200, await listTop(req));
            return;
          }
          const raw = (await readBody(req)) || "{}";
          let body;
          try {
            body = JSON.parse(raw);
          } catch {
            send(res, 400, { error: "invalid json" });
            return;
          }
          send(res, 200, await submitRun(body, req));
        } catch (err) {
          const msg = err && err.message ? err.message : "leaderboard error";
          send(res, msg.startsWith("invalid") ? 400 : 500, { error: msg });
        }
      });
      server.middlewares.use("/api/feedback", async (req, res, next) => {
        if (req.method !== "GET" && req.method !== "POST") return next();
        try {
          if (req.method === "GET") {
            send(res, 200, await listNotes(req));
            return;
          }
          const raw = (await readBody(req)) || "{}";
          let body;
          try {
            body = JSON.parse(raw);
          } catch {
            send(res, 400, { error: "invalid json" });
            return;
          }
          send(res, 200, await submitNote(body));
        } catch (err) {
          const msg = err && err.message ? err.message : "feedback error";
          const status =
            err && err.status
              ? err.status
              : msg.startsWith("invalid")
                ? 400
                : 500;
          send(res, status, { error: msg });
        }
      });
      server.middlewares.use("/api/play", async (req, res, next) => {
        if (req.method !== "POST") return next();
        try {
          await markPlayer(req);
          send(res, 200, await listTop(req));
        } catch (err) {
          const msg = err && err.message ? err.message : "play error";
          send(res, 500, { error: msg });
        }
      });
    },
  };
}
