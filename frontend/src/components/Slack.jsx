import React, { useState, useEffect } from "react";
import slackMessages from "../data/slackData";

const TAG_CONFIG = {
  urgent: { bg: "#fdf0f5", border: "#f0c0d4", color: "#b5426a" },
  action: { bg: "#fdf6ef", border: "#f0d8b8", color: "#a0622a" },
  important: { bg: "#fdf6ef", border: "#f0d8b8", color: "#a0622a" },
  "meeting-change": { bg: "#eef4fd", border: "#b8d2f0", color: "#2a5fa0" },
  informational: { bg: "#f2eef7", border: "#d4cbea", color: "#6b5f82" },
  later: { bg: "#f2eef7", border: "#d4cbea", color: "#6b5f82" },
};

function getTagConfig(tag) {
  return TAG_CONFIG[tag] || TAG_CONFIG.informational;
}

function getChannelIcon(channel) {
  const icons = {
    "#engineering": "⚙️",
    "#design": "🎨",
    "#general": "🏛️",
    "#product": "🗺️",
    "#random": "🎲",
    "#sales": "📈",
    "#marketing": "📣",
    "#hr": "👥",
  };
  return icons[channel] || "💬";
}

function Slack({ setAllClassifiedData }) {
  const [messages, setMessages] = useState(slackMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const runAI = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:8080/api/ai/classify-slack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: slackMessages }),
        });

        if (!response.ok) throw new Error("Server returned status: " + response.status);

        const result = await response.json();

        const updated = slackMessages.map((msg) => {
          const match = result.find((r) => String(r.id) === String(msg.id));
          return match ? { ...msg, ...match } : msg;
        });

        setMessages(updated);

        setAllClassifiedData((prev) => [
          ...prev.filter((item) => item.source !== "slack"),
          ...updated.map((item) => ({ ...item, source: "slack" })),
        ]);
      } catch (err) {
        console.error("Slack auto AI error:", err);
        setError("Failed to run Slack AI.");
      } finally {
        setLoading(false);
      }
    };

    runAI();
  }, []);

  const generateReply = async (id) => {
    try {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, generating: true } : m))
      );

      const message = messages.find((m) => m.id === id);

      const response = await fetch("http://localhost:8080/api/ai/slack-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.message }),
      });

      if (!response.ok) throw new Error("Reply API failed");

      const data = await response.json();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, reply: data.reply, generating: false } : m
        )
      );
    } catch (error) {
      console.error("Slack Reply error:", error);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, generating: false } : m))
      );
    }
  };

  const urgentCount = messages.filter((m) => m.aiTag === "urgent").length;
  const totalUnread = messages.reduce((s, m) => s + (m.unread || 0), 0);

  return (
    <div style={{ padding: "26px 28px", fontFamily: "'Geist', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeup { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        .slack-msg:hover { background: #f7f4f9; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 26, fontWeight: 400, marginBottom: 4, color: "#1e1628",
          }}>
            Slack
          </h2>
          <p style={{ fontSize: 12.5, color: "#a899be" }}>
            {totalUnread > 0 ? `${totalUnread} unread across ${messages.filter(m => (m.unread || 0) > 0).length} channels` : `${messages.length} channels`}
          </p>
        </div>
        {urgentCount > 0 && (
          <div style={{
            background: "#fdf0f5", border: "1px solid #f0c0d4",
            borderRadius: 9, padding: "7px 12px",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 12 }}>🔴</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#b5426a" }}>
              {urgentCount} urgent
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 16px",
          background: "#f0eafa", border: "1.5px solid #d0bef5",
          borderRadius: 11, marginBottom: 16,
          fontSize: 13, color: "#7c5cbf", fontWeight: 500,
        }}>
          <span style={{ display: "inline-block", animation: "spin 0.75s linear infinite" }}>↻</span>
          Running Slack AI classification…
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: "#fdf0f5", border: "1px solid #f0c0d4",
          borderRadius: 8, padding: "10px 14px",
          fontSize: 12.5, color: "#b5426a", marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      {/* Messages */}
      <div>
        {messages.map((msg) => {
          const tagCfg = getTagConfig(msg.aiTag);
          return (
            <div
              key={msg.id}
              className="slack-msg"
              style={{
                borderRadius: 11,
                padding: "15px 17px",
                marginBottom: 8,
                border: "1.5px solid",
                borderColor: msg.aiTag === "urgent"
                  ? "#f0c0d4"
                  : msg.aiTag === "action" || msg.aiTag === "important"
                  ? "#f0d8b8"
                  : "#e8e2f0",
                background: msg.aiTag === "urgent"
                  ? "#fdf0f5"
                  : msg.aiTag === "action" || msg.aiTag === "important"
                  ? "#fdf6ef"
                  : "#ffffff",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                {/* Channel icon */}
                <div style={{
                  fontSize: 20, width: 36, textAlign: "center",
                  lineHeight: "36px", flexShrink: 0,
                }}>
                  {getChannelIcon(msg.channel)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Top row */}
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1e1628", flexShrink: 0 }}>
                        {msg.channel}
                      </span>
                      {msg.aiTag && msg.aiTag !== "informational" && (
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: 10.5, fontWeight: 600, padding: "2px 8px",
                          borderRadius: 20, letterSpacing: "0.4px", textTransform: "uppercase",
                          background: tagCfg.bg, color: tagCfg.color, border: `1px solid ${tagCfg.border}`,
                          flexShrink: 0,
                        }}>
                          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                          {msg.aiTag}
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: "#a899be" }}>{msg.time}</span>
                      {(msg.unread || 0) > 0 && (
                        <span style={{
                          background: msg.aiTag === "urgent" ? "#b5426a" : "#7c5cbf",
                          color: "#fff",
                          borderRadius: 20,
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: "2px 7px",
                        }}>
                          {msg.unread}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sender */}
                  <div style={{ fontSize: 11.5, color: "#a899be", marginBottom: 3 }}>
                    <span style={{ fontWeight: 500, color: "#6b5f82" }}>{msg.sender}</span>
                  </div>

                  {/* Message */}
                  <p style={{ fontSize: 12.5, color: "#6b5f82", lineHeight: 1.5 }}>
                    {msg.message}
                  </p>

                  {/* Generate reply button */}
                  <div style={{ marginTop: 12 }}>
                    <button
                      disabled={msg.generating}
                      onClick={() => generateReply(msg.id)}
                      style={{
                        padding: "7px 14px",
                        background: msg.generating ? "#f2eef7" : "#7c5cbf",
                        color: msg.generating ? "#7c5cbf" : "#fff",
                        border: msg.generating ? "1.5px solid #d0bef5" : "none",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: msg.generating ? "not-allowed" : "pointer",
                        fontFamily: "'Geist', sans-serif",
                        transition: "all 0.18s",
                        display: "flex", alignItems: "center", gap: 6,
                      }}
                    >
                      {msg.generating ? (
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
                  {msg.reply && (
                    <div style={{
                      marginTop: 12,
                      background: "#f0eafa",
                      border: "1.5px solid #d0bef5",
                      borderRadius: 10,
                      padding: "12px 14px",
                      animation: "fadeup 0.3s ease forwards",
                    }}>
                      <div style={{
                        fontSize: 10, fontWeight: 600,
                        letterSpacing: "1.4px", textTransform: "uppercase",
                        color: "#7c5cbf", marginBottom: 8,
                      }}>
                        AI Reply
                      </div>
                      <p style={{ fontSize: 13, color: "#1e1628", lineHeight: 1.6 }}>
                        {msg.reply}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Slack;