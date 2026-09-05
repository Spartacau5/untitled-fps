const API = "/api/feedback";

export function mountFeedback(getCallsign) {
  const btn = document.getElementById("btn-feedback");
  const panel = document.getElementById("feedback-panel");
  const nameEl = document.getElementById("feedback-name");
  const bodyEl = document.getElementById("feedback-body");
  const status = document.getElementById("feedback-status");
  const send = document.getElementById("feedback-send");
  const cancel = document.getElementById("feedback-cancel");
  if (!btn || !panel) return;

  const setStatus = (t) => {
    status.textContent = t;
  };

  const open = () => {
    panel.classList.remove("hidden");
    nameEl.value = (getCallsign && getCallsign()) || nameEl.value || "";
    bodyEl.value = "";
    setStatus("");
    bodyEl.focus();
  };

  const close = () => {
    panel.classList.add("hidden");
    setStatus("");
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    panel.classList.contains("hidden") ? open() : close();
  });
  cancel.addEventListener("click", (e) => {
    e.preventDefault();
    close();
  });
  send.addEventListener("click", async (e) => {
    e.preventDefault();
    const message = bodyEl.value.trim();
    if (!message) {
      setStatus("WRITE SOMETHING FIRST.");
      return;
    }
    send.disabled = true;
    setStatus("SENDING…");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameEl.value, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "send failed");
      setStatus("GOT IT. THANK YOU.");
      bodyEl.value = "";
      setTimeout(close, 1200);
    } catch {
      setStatus("COULD NOT SEND. TRY AGAIN.");
    } finally {
      send.disabled = false;
    }
  });
}
