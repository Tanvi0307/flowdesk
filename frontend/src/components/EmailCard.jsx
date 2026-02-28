import { useState } from "react";

const PRIORITY_CONFIG = {
  urgent: {
    bg: "#fdf0f5",
    border: "#f0c0d4",
    color: "#b5426a",
    leftBorder: "#b5426a",
    badgeBg: "#fdf0f5",
  },
  important: {
    bg: "#fdf6ef",
    border: "#f0d8b8",
    color: "#a0622a",
    leftBorder: "#7c5cbf",
    badgeBg: "#fdf6ef",
  },
  later: {
    bg: "#ffffff",
    border: "#e8e2f0",
    color: "#3a7a6a",
    leftBorder: "#7c5cbf",
    badgeBg: "#eef7f4",
  },
};

function getInitials(name) {
  if (!name) return "??";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function getAvatarColor(priority) {
  if (priority === "urgent") return "#b5426a";
  if (priority === "important") return "#a0622a";
  return "#7c5cbf";
}

function EmailCard({ email, onGenerateReply }) {
  const [copied, setCopied] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);
  const [hovered, setHovered] = useState(false);

  const cfg = PRIORITY_CONFIG[email.priority] || PRIORITY_CONFIG.later;

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReplyClick = async () => {
    setLoadingReply(true);
    await onGenerateReply(email.id);
    setLoadingReply(false);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: email.priority === "urgent" ? cfg.bg : email.priority === "important" ? cfg.bg : "#ffffff",
        border: `1.5px solid ${cfg.border}`,
        borderLeft: `3px solid ${cfg.leftBorder}`,
        borderRadius: 11,
        padding: "15px 17px",
        marginBottom: 8,
        cursor: "pointer",
        transition: "all 0.18s",
        transform: hovered ? "translateY(-1px)" : "none",
        boxShadow: hovered ? "0 3px 14px rgba(0,0,0,0.07)" : "none",
        fontFamily: "'Geist', sans-serif",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: getAvatarColor(email.priority) + "18",
          color: getAvatarColor(email.priority),
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 600, flexShrink: 0, letterSpacing: "0.3px",
        }}>
          {getInitials(email.from || email.title)}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1e1628" }}>
              {email.from || email.title}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {email.priority && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 10.5, fontWeight: 600, padding: "2px 8px",
                  borderRadius: 20, letterSpacing: "0.4px", textTransform: "uppercase",
                  background: cfg.badgeBg, color: cfg.color, border: `1px solid ${cfg.border}`,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                  {email.priority}
                </span>
              )}
            </div>
          </div>

          {/* Subject */}
          <p style={{ fontSize: 13, fontWeight: 500, color: "#1e1628", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {email.subject || email.title}
          </p>

          {/* Content/preview */}
          <p style={{ fontSize: 12, color: "#a899be", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.45 }}>
            {email.content || email.preview}
          </p>

          {/* Actions */}
          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={handleReplyClick}
              disabled={loadingReply}
              style={{
                padding: "7px 14px",
                background: loadingReply ? "#f2eef7" : "#7c5cbf",
                color: loadingReply ? "#7c5cbf" : "#fff",
                border: loadingReply ? "1.5px solid #d0bef5" : "none",
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 500,
                cursor: loadingReply ? "not-allowed" : "pointer",
                fontFamily: "'Geist', sans-serif",
                transition: "all 0.18s",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {loadingReply ? (
                <>
                  <span style={{ display: "inline-block", animation: "spin 0.75s linear infinite" }}>↻</span>
                  Generating…
                </>
              ) : (
                <>✨ Generate AI Reply</>
              )}
            </button>
          </div>

          {/* AI Reply */}
          {email.reply && (
            <div style={{
              marginTop: 14,
              background: "#f0eafa",
              border: "1.5px solid #d0bef5",
              borderRadius: 10,
              padding: "12px 14px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#7c5cbf", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 8 }}>
                AI Reply
              </div>
              <div style={{ fontSize: 13, color: "#1e1628", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {email.reply}
              </div>
              <button
                onClick={() => handleCopy(email.reply)}
                style={{
                  marginTop: 10,
                  padding: "6px 12px",
                  background: copied ? "#eef7f4" : "#ffffff",
                  color: copied ? "#3a7a6a" : "#7c5cbf",
                  border: `1.5px solid ${copied ? "#b0dcd2" : "#d0bef5"}`,
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'Geist', sans-serif",
                  transition: "all 0.18s",
                }}
              >
                {copied ? "✓ Copied" : "Copy Reply"}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default EmailCard;