import { useEffect, useState } from "react";

function getInitials(str) {
  if (!str) return "??";
  return str.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function EmailView({ email }) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
  if (!email) return;

  const fetchReply = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: email.content || email.body || email.preview
        }),
      });

      const data = await res.json();
      setReply(data.reply || "");

    } catch (err) {
      console.error("AI error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchReply();

}, [email]);
  const copy = async () => {
    await navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!email) {
    return (
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#a899be",
        fontFamily: "'Geist', sans-serif",
        background: "#f7f4f9",
        gap: 12,
      }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');`}</style>
        <span style={{ fontSize: 36 }}>✉️</span>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#6b5f82" }}>Select an email to read</p>
        <p style={{ fontSize: 12.5, color: "#a899be" }}>Your messages, prioritized by AI</p>
      </div>
    );
  }

  const priorityColors = {
    urgent: { bg: "#fdf0f5", border: "#f0c0d4", color: "#b5426a", avt: "#b5426a" },
    important: { bg: "#fdf6ef", border: "#f0d8b8", color: "#a0622a", avt: "#a0622a" },
    later: { bg: "#f0eafa", border: "#d0bef5", color: "#7c5cbf", avt: "#7c5cbf" },
  };
  const pc = priorityColors[email.priority] || priorityColors.later;

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      background: "#ffffff",
      fontFamily: "'Geist', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeup { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e8e2f0; border-radius: 4px; }
      `}</style>

      {/* Email Header */}
      <div style={{
        padding: "24px 28px 20px",
        borderBottom: "1px solid #e8e2f0",
        background: "#f7f4f9",
      }}>
        <div style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11,
            background: pc.avt + "18", color: pc.avt,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 600, flexShrink: 0,
          }}>
            {getInitials(email.from)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 20, fontWeight: 400, color: "#1e1628",
              marginBottom: 6, lineHeight: 1.25,
            }}>
              {email.subject}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12.5, color: "#6b5f82" }}>
                <span style={{ color: "#a899be" }}>From:</span>{" "}
                <span style={{ fontWeight: 500 }}>{email.from}</span>
              </span>
              {email.time && (
                <span style={{ fontSize: 11.5, color: "#a899be" }}>{email.time}</span>
              )}
              {email.priority && (
                <span style={{
                  fontSize: 10.5, fontWeight: 600, padding: "2px 8px",
                  borderRadius: 20, letterSpacing: "0.4px", textTransform: "uppercase",
                  background: pc.bg, color: pc.color, border: `1px solid ${pc.border}`,
                }}>
                  {email.priority}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div style={{ flex: 1, padding: "24px 28px" }}>
        <p style={{ fontSize: 14, color: "#1e1628", lineHeight: 1.75, marginBottom: 28 }}>
          {email.body || email.content || email.preview}
        </p>

        {/* AI Reply Section */}
        <div style={{ height: 1, background: "#e8e2f0", marginBottom: 24 }} />
        <div style={{
          background: "#f0eafa",
          border: "1.5px solid #d0bef5",
          borderRadius: 12,
          padding: "18px 20px",
          animation: "fadeup 0.3s ease forwards",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 14 }}>✨</span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.4px", textTransform: "uppercase", color: "#7c5cbf" }}>
              AI Suggested Reply
            </span>
          </div>

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#7c5cbf", fontSize: 13 }}>
              <span style={{ display: "inline-block", animation: "spin 0.75s linear infinite" }}>↻</span>
              Generating reply…
            </div>
          )}

          {!loading && reply && (
            <>
              <p style={{ fontSize: 13.5, color: "#1e1628", lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 14 }}>
                {reply}
              </p>
              <button
                onClick={copy}
                style={{
                  padding: "7px 14px",
                  background: copied ? "#eef7f4" : "#ffffff",
                  color: copied ? "#3a7a6a" : "#7c5cbf",
                  border: `1.5px solid ${copied ? "#b0dcd2" : "#d0bef5"}`,
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'Geist', sans-serif",
                  transition: "all 0.18s",
                }}
              >
                {copied ? "✓ Copied" : "Copy Reply"}
              </button>
            </>
          )}

          {!loading && !reply && (
            <p style={{ fontSize: 13, color: "#a899be" }}>Reply will appear here…</p>
          )}
        </div>
      </div>
    </div>
  );
}