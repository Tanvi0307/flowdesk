const CALENDAR = [
  { id: 1, title: "Daily Standup",         time: "10:00 AM", duration: "15 min", tag: "Team",     color: "#7c5cbf", pax: 8 },
  { id: 2, title: "Design Review — v2.4",  time: "11:30 AM", duration: "60 min", tag: "Product",  color: "#b96b12", pax: 5 },
  { id: 3, title: "1:1 — Sarah Chen",      time: "2:00 PM",  duration: "30 min", tag: "1:1",      color: "#9b6bbf", pax: 2 },
  { id: 4, title: "Investor Update Call",  time: "4:00 PM",  duration: "60 min", tag: "External", color: "#c0392b", pax: 4 },
];

function getDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

export default function CalendarPanel() {
  return (
    <div className="panel-in">
      <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, fontWeight: 400, marginBottom: 4 }}>
        Today's Schedule
      </h2>
      <p style={{ fontSize: 12.5, color: "var(--text3)", marginBottom: 22 }}>
        {CALENDAR.length} meetings · {getDate()}
      </p>

      <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 12, padding: "4px 0" }}>
        {CALENDAR.map((e, i) => (
          <div
            key={e.id}
            className="cal-row"
            style={{ padding: "16px 20px", borderBottom: i < CALENDAR.length - 1 ? "1px solid var(--border)" : "none" }}
          >
            <div style={{ width: 3, background: e.color, borderRadius: 3, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{e.title}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "2px 9px",
                  borderRadius: 20, background: e.color + "18", color: e.color, letterSpacing: "0.3px",
                }}>
                  {e.tag}
                </span>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <span style={{ fontSize: 12.5, color: "var(--text2)" }}>🕐 {e.time}</span>
                <span style={{ fontSize: 12.5, color: "var(--text3)" }}>⏱ {e.duration}</span>
                <span style={{ fontSize: 12.5, color: "var(--text3)" }}>👤 {e.pax} attendees</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}