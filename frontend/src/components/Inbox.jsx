import { useState, useEffect } from "react";
import EmailCard from "./EmailCard";
import inboxData from "../data/inboxData";

function Inbox({ setAllClassifiedData }) {
  const [emails, setEmails] = useState(inboxData);
  const [loading, setLoading] = useState(false);

  const classifyEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: inboxData }),
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        const updated = inboxData.map((email) => {
          const match = data.find((d) => d.id === email.id);
          return match ? { ...email, ...match } : email;
        });

        setEmails(updated);

        setAllClassifiedData((prev) => [
          ...prev.filter((item) => item.source !== "inbox"),
          ...updated.map((item) => ({ ...item, source: "inbox" })),
        ]);
      }
    } catch (error) {
      console.error("Auto Classification error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    classifyEmails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateReply = async (id) => {
    try {
      const email = emails.find((e) => e.id === id);
      const response = await fetch("http://localhost:8080/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: email.content }),
      });
      const data = await response.json();
      setEmails((prev) =>
        prev.map((e) => (e.id === id ? { ...e, reply: data.reply } : e))
      );
    } catch (error) {
      console.error("Reply error:", error);
    }
  };

  const unreadCount = emails.filter((e) => e.unread).length;
  const urgentCount = emails.filter((e) => e.priority === "urgent" && e.unread).length;

  const grouped = {
    urgent: emails.filter((e) => e.priority === "urgent"),
    important: emails.filter((e) => e.priority === "important"),
    later: emails.filter(
      (e) => !e.priority || (e.priority !== "urgent" && e.priority !== "important")
    ),
  };

  const renderSection = (priority, items) => {
    if (!items.length) return null;
    const cfgs = {
      urgent: { bg: "#fdf0f5", border: "#f0c0d4", color: "#b5426a" },
      important: { bg: "#fdf6ef", border: "#f0d8b8", color: "#a0622a" },
      later: { bg: "#eef7f4", border: "#b0dcd2", color: "#3a7a6a" },
    };
    const cfg = cfgs[priority];
    const labels = { urgent: "Urgent", important: "Important", later: "Later" };

    return (
      <div key={priority}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0 10px" }}>
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
            {items.length} message{items.length !== 1 ? "s" : ""}
          </span>
        </div>
        {items.map((email) => (
          <EmailCard
            key={email.id}
            email={email}
            onGenerateReply={generateReply}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: "26px 28px", fontFamily: "'Geist', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 26, fontWeight: 400, marginBottom: 4, color: "#1e1628",
          }}>
            Inbox
          </h2>
          <p style={{ fontSize: 12.5, color: "#a899be" }}>
            {unreadCount} unread · triaged by priority
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
          Auto-classifying emails…
        </div>
      )}

      {/* Email sections */}
      {renderSection("urgent", grouped.urgent)}
      {renderSection("important", grouped.important)}
      {renderSection("later", grouped.later)}
    </div>
  );
}

export default Inbox;