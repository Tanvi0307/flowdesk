import { useState } from "react";

function getInitials(str) {
  if (!str) return "??";
  return str.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function EmailModal({ email, onClose }) {
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateReply = async () => {
    setLoading(true);
    setAiReply("");

    try {
      const res = await fetch("http://localhost:8080/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: email.from, subject: email.subject }),
      });
      const data = await res.json();
      setAiReply(data.reply);
    } catch (err) {
      console.error(err);
      setAiReply("Failed to generate reply.");
    }

    setLoading(false);
  };

  const copyReply = async () => {
    await navigator.clipboard.writeText(aiReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeup { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        .modal-box { animation: fadeup 0.22s ease forwards; }
      `}</style>

      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(30,22,40,0.52)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200,
          fontFamily: "'Geist', sans-serif",
        }}
      >
        {/* Modal */}
        <div
          className="modal-box"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#ffffff",
            width: 580,
            maxWidth: "94vw",
            maxHeight: "85vh",
            borderRadius: 18,
            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
            border: "1.5px solid #e8e2f0",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Modal Header */}
          <div style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #e8e2f0",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            background: "#f7f4f9",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "#f0eafa", color: "#7c5cbf",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600, flexShrink: 0,
            }}>
              {getInitials(email.from)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 17, fontWeight: 400, color: "#1e1628", marginBottom: 4,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {email.subject}
              </div>
              <div style={{ fontSize: 12, color: "#a899be" }}>
                From: <span style={{ color: "#6b5f82", fontWeight: 500 }}>{email.from}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 18, color: "#a899be", padding: 4, borderRadius: 6,
                transition: "color 0.15s",
                lineHeight: 1, flexShrink: 0,
              }}
              onMouseEnter={e => e.target.style.color = "#1e1628"}
              onMouseLeave={e => e.target.style.color = "#a899be"}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            <p style={{ fontSize: 14, color: "#1e1628", lineHeight: 1.7, marginBottom: 20 }}>
              {email.body}
            </p>

            <div style={{ height: 1, background: "#e8e2f0", marginBottom: 20 }} />

            {/* AI Reply section */}
            {!aiReply && !loading && (
              <button
                onClick={generateReply}
                style={{
                  padding: "10px 18px",
                  background: "#7c5cbf",
                  color: "#fff",
                  border: "none",
                  borderRadius: 9,
                  fontSize: 13.5,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'Geist', sans-serif",
                  display: "flex", alignItems: "center", gap: 7,
                  transition: "all 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#6748a8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#7c5cbf"; e.currentTarget.style.transform = "none"; }}
              >
                ✨ Generate AI Reply
              </button>
            )}

            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "#f0eafa", border: "1.5px solid #d0bef5", borderRadius: 11, fontSize: 13, color: "#7c5cbf", fontWeight: 500 }}>
                <span style={{ display: "inline-block", animation: "spin 0.75s linear infinite" }}>↻</span>
                Generating reply…
              </div>
            )}

            {aiReply && (
              <div style={{ animation: "fadeup 0.3s ease forwards" }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.4px", textTransform: "uppercase", color: "#a899be", marginBottom: 10 }}>
                  AI Suggested Reply
                </div>
                <div style={{
                  background: "#f0eafa",
                  border: "1.5px solid #d0bef5",
                  borderRadius: 11,
                  padding: "14px 16px",
                  marginBottom: 10,
                }}>
                  <p style={{ fontSize: 13.5, color: "#1e1628", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>
                    {aiReply}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={copyReply}
                    style={{
                      padding: "8px 14px",
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
                  <button
                    onClick={generateReply}
                    style={{
                      padding: "8px 14px",
                      background: "none",
                      color: "#a899be",
                      border: "1.5px solid #e8e2f0",
                      borderRadius: 8,
                      fontSize: 12.5,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "'Geist', sans-serif",
                      transition: "all 0.18s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#d0bef5"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#e8e2f0"}
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}