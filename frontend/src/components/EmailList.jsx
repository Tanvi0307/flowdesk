import { useState } from "react";

const PRIORITY_CONFIG = {
  urgent: {
    bg: "#fdf0f5",
    border: "#f0c0d4",
    color: "#b5426a",
    leftBorder: "#b5426a",
    dot: "#b5426a",
  },
  important: {
    bg: "#fdf6ef",
    border: "#f0d8b8",
    color: "#a0622a",
    leftBorder: "#7c5cbf",
    dot: "#7c5cbf",
  },
  later: {
    bg: "#ffffff",
    border: "#e8e2f0",
    color: "#3a7a6a",
    leftBorder: "#7c5cbf",
    dot: "#7c5cbf",
  },
};

function getInitials(str) {
  if (!str) return "??";
  return str.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function getAvatarBg(priority) {
  if (priority === "urgent") return { bg: "#fdf0f5", color: "#b5426a" };
  if (priority === "important") return { bg: "#fff3e8", color: "#a0622a" };
  return { bg: "#f0eafa", color: "#7c5cbf" };
}

export default function EmailList({ emails, onSelect, selectedId }) {
  const [hovered, setHovered] = useState(null);

  const grouped = {
    urgent: emails.filter((e) => e.priority === "urgent"),
    important: emails.filter((e) => e.priority === "important"),
    later: emails.filter((e) => !e.priority || (e.priority !== "urgent" && e.priority !== "important")),
  };

  const renderSection = (priority, items) => {
    if (!items.length) return null;
    const cfg = PRIORITY_CONFIG[priority];
    const labels = { urgent: "Urgent", important: "Important", later: "Later" };

    return (
      <div key={priority} style={{ marginBottom: 8 }}>
        {/* Section Label */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0 8px", padding: "0 2px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 10.5, fontWeight: 600, padding: "2px 8px",
            borderRadius: 20, letterSpacing: "0.4px", textTransform: "uppercase",
            background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
            {labels[priority]}
          </span>
          <div style={{ flex: 1, height: 1, background: "#e8e2f0" }} />
          <span style={{ fontSize: 11, color: "#a899be", fontWeight: 500 }}>
            {items.length}
          </span>
        </div>

        {/* Email rows */}
        {items.map((email) => {
          const avt = getAvatarBg(email.priority);
          const isSelected = selectedId === email.id;
          const isHov = hovered === email.id;

          return (
            <div
              key={email.id}
              onClick={() => onSelect(email)}
              onMouseEnter={() => setHovered(email.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                padding: "13px 14px",
                borderRadius: 10,
                cursor: "pointer",
                transition: "all 0.15s",
                background: isSelected ? "#f0eafa" : isHov ? "#f7f4f9" : "transparent",
                borderLeft: `3px solid ${isSelected ? "#7c5cbf" : isHov && priority === "urgent" ? cfg.leftBorder : "transparent"}`,
                marginBottom: 2,
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: avt.bg, color: avt.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 600, flexShrink: 0, letterSpacing: "0.3px",
              }}>
                {getInitials(email.from || email.subject || "")}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: email.unread ? 600 : 500, color: "#1e1628", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {email.from || email.subject}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: "#a899be" }}>{email.time}</span>
                    {email.unread && (
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: priority === "urgent" ? "#b5426a" : "#7c5cbf", display: "inline-block" }} />
                    )}
                  </div>
                </div>
                <p style={{ fontSize: 12.5, color: "#6b5f82", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>
                  {email.subject}
                </p>
                <p style={{ fontSize: 12, color: "#a899be", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.4 }}>
                  {email.preview || email.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{
      height: "100%",
      overflowY: "auto",
      borderRight: "1px solid #e8e2f0",
      fontFamily: "'Geist', sans-serif",
      background: "#ffffff",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e8e2f0; border-radius: 4px; }
      `}</style>

      <div style={{ padding: "16px 16px 8px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#a899be", marginBottom: 4 }}>
          Inbox
        </div>
        <div style={{ fontSize: 12, color: "#6b5f82" }}>
          {emails.filter((e) => e.unread).length} unread
        </div>
      </div>

      <div style={{ padding: "0 8px 16px" }}>
        {renderSection("urgent", grouped.urgent)}
        {renderSection("important", grouped.important)}
        {renderSection("later", grouped.later)}
      </div>
    </div>
  );
}