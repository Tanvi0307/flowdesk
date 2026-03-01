import { useState, useEffect } from "react";
import calendarData from "../data/Calendardata";

const TAG_COLORS = {
  Team:     "#7c5cbf",
  Product:  "#b96b12",
  "1:1":    "#9b6bbf",
  External: "#c0392b",
  Design:   "#2980b9",
  Internal: "#27ae60",
  default:  "#6b7280",
};

function getTagColor(tag) {
  return TAG_COLORS[tag] || TAG_COLORS.default;
}

function getDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function EventCard({ event }) {
  const color = getTagColor(event.tag);
  const priorityCfg = {
    urgent:    { bg: "#fdf0f5", border: "#f0c0d4", dot: "#b5426a" },
    important: { bg: "#fdf6ef", border: "#f0d8b8", dot: "#a0622a" },
    later:     { bg: "#eef7f4", border: "#b0dcd2", dot: "#3a7a6a" },
  };
  const cfg = priorityCfg[event.priority] || priorityCfg.later;

  return (
    <div
      style={{
        display: "flex", gap: 14, alignItems: "stretch",
        padding: "16px 20px",
        transition: "background 0.15s",
        cursor: "default",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.02)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <div style={{
        width: 3, minHeight: 44, borderRadius: 3,
        background: event.priority ? cfg.dot : color,
        flexShrink: 0, alignSelf: "stretch",
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5, gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", lineHeight: 1.3 }}>
            {event.title}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20,
            background: color + "18", color, letterSpacing: "0.3px",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>
            {event.tag}
          </span>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--text2)" }}>🕐 {event.time}</span>
          {event.duration && (
            <span style={{ fontSize: 12, color: "var(--text3)" }}>⏱ {event.duration}</span>
          )}
          {event.attendees > 0 && (
            <span style={{ fontSize: 12, color: "var(--text3)" }}>
              👤 {event.attendees} attendee{event.attendees !== 1 ? "s" : ""}
            </span>
          )}
          {event.priority && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 10.5, fontWeight: 600, padding: "1px 7px",
              borderRadius: 20, letterSpacing: "0.4px", textTransform: "uppercase",
              background: cfg.bg, color: cfg.dot, border: `1px solid ${cfg.border}`,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
              {event.priority}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function renderSection(priority, items) {
  if (!items.length) return null;

  const cfgs = {
    urgent:    { bg: "#fdf0f5", border: "#f0c0d4", color: "#b5426a" },
    important: { bg: "#fdf6ef", border: "#f0d8b8", color: "#a0622a" },
    later:     { bg: "#eef7f4", border: "#b0dcd2", color: "#3a7a6a" },
  };
  const labels = { urgent: "Urgent", important: "Important", later: "Later" };
  const cfg = cfgs[priority];

  return (
    <div key={priority}>
      {/* Section label — identical to Inbox */}
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
          {items.length} event{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Event cards */}
      <div style={{
        background: "var(--surface)", border: "1.5px solid var(--border)",
        borderRadius: 12, overflow: "hidden",
      }}>
        {items.map((event, i) => (
          <div
            key={event.id}
            style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CalendarPanel() {
  // ── Start with mock data, same as Inbox starts with inboxData ──────────────
  const [events, setEvents] = useState(calendarData);
  const [loading, setLoading] = useState(false);

  // ── Auto-classify on mount — exact same flow as Inbox.classifyEmails() ─────
  const classifyEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: calendarData }),  // same shape as inboxData
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        const updated = calendarData.map((event) => {
          const match = data.find((d) => d.id === event.id);
          return match ? { ...event, ...match } : event;
        });
        setEvents(updated);
      }
    } catch (error) {
      console.error("Calendar classification error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    classifyEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Group by priority — same as Inbox grouped ──────────────────────────────
  const grouped = {
    urgent:    events.filter(e => e.priority === "urgent"),
    important: events.filter(e => e.priority === "important"),
    later:     events.filter(e => !e.priority || (e.priority !== "urgent" && e.priority !== "important")),
  };

  const urgentCount = grouped.urgent.length;

  return (
    <div style={{ padding: "26px 28px", fontFamily: "'Geist', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Header — mirrors Inbox header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 26, fontWeight: 400, marginBottom: 4, color: "#1e1628",
          }}>
            Today's Schedule
          </h2>
          <p style={{ fontSize: 12.5, color: "#a899be" }}>
            {events.length} meetings · {getDate()}
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

      {/* ── Loading — mirrors Inbox loading bar ── */}
      {loading && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 16px",
          background: "#f0eafa", border: "1.5px solid #d0bef5",
          borderRadius: 11, marginBottom: 16,
          fontSize: 13, color: "#7c5cbf", fontWeight: 500,
        }}>
          <span style={{ display: "inline-block", animation: "spin 0.75s linear infinite" }}>↻</span>
          Auto-classifying schedule…
        </div>
      )}

      {/* ── Sections — mirrors Inbox renderSection ── */}
      {renderSection("urgent",    grouped.urgent)}
      {renderSection("important", grouped.important)}
      {renderSection("later",     grouped.later)}
    </div>
  );
}