export const KEEP = 200;
export const MAX_MESSAGE = 2000;
export const MAX_NAME = 16;

export function sanitizeFeedbackName(raw) {
  const s = String(raw ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, MAX_NAME)
    .replace(/[^\w \-]/g, "");
  return s;
}

export function sanitizeNote(body) {
  if (!body || typeof body !== "object") throw new Error("invalid body");
  const message = String(body.message ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "")
    .trim()
    .slice(0, MAX_MESSAGE);
  if (!message) throw new Error("invalid message");
  return {
    name: sanitizeFeedbackName(body.name),
    message,
    at: Date.now(),
  };
}

export function insertNote(records, entry) {
  const list = Array.isArray(records) ? records.slice() : [];
  list.unshift(entry);
  return list.slice(0, KEEP);
}
