import { useState, useEffect } from "react";

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function getDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

const BRIEF = [
  { icon: "🔴", label: "Urgent",        value: "2 actions required",    detail: "Contract amendment due 5 PM · Security alert on your account", priority: "urgent" },
  { icon: "🟡", label: "Important",     value: "3 items need attention", detail: "Q3 board report · Figma handoff review · Feature spec sign-off", priority: "important" },
  { icon: "🟢", label: "Later",         value: "3 items, no deadline",   detail: "Budget follow-up · Infrastructure digest · Newsletter",          priority: "later" },
  { icon: "📅", label: "Meetings today",value: "4 on calendar",         detail: "Standup 10 AM · Investor call 4 PM (don't miss)",               priority: "neutral" },
  { icon: "💬", label: "Slack",         value: "18 unread",             detail: "#engineering prod deploy (urgent) · #design brand assets",       priority: "neutral" },
];

const bgMap  = { urgent: "var(--urgent-bg)",    important: "var(--important-bg)",    later: "var(--later-bg)",    neutral: "var(--surface)" };
const bdMap  = { urgent: "var(--urgent-border)", important: "var(--important-border)", later: "var(--later-border)", neutral: "var(--border)"  };

export default function BriefSidebar({ user }) {
  const [rev, setRev] = useState(0);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setRev(i);
      if (i >= BRIEF.length) clearInterval(id);
    }, 300);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="left-col">
      <div className="left-body">
        {/* ── Greeting ── */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--text3)", letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: 10 }}>
            {getDate()}
          </div>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 30, fontWeight: 400, lineHeight: 1.2, marginBottom: 5 }}>
            {getGreeting()},<br />
            <span style={{ color: "var(--accent)" }}>{user.name.split(" ")[0]}.</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>{user.role}</div>
        </div>

        {/* ── Urgent Banner ── */}
        <div style={{
          background: "var(--urgent-bg)",
          border: "1.5px solid var(--urgent-border)",
          borderRadius: 12,
          padding: "13px 16px",
          marginBottom: 20,
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}>
          <span style={{ fontSize: 17, lineHeight: 1, marginTop: 1 }}>🚨</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--urgent)", marginBottom: 4 }}>
              2 Urgent Actions Required
            </div>
            <div style={{ fontSize: 12, color: "#922a20", lineHeight: 1.55 }}>
              <div>· Contract amendment — sign-off due <b>today by 5 PM</b></div>
              <div>· Security alert: unrecognized login on your account</div>
            </div>
          </div>
        </div>

        {/* ── Daily Brief Cards ── */}
        <div className="sec-lbl">Daily Brief</div>

        {BRIEF.map((item, i) => (
          <div
            key={i}
            className={`brief-card ${i < rev ? "vis" : ""}`}
            style={{ background: bgMap[item.priority], borderColor: bdMap[item.priority] }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11.5, fontWeight: 500, color: "var(--text2)" }}>{item.label}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)" }}>{item.value}</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 11.5, color: "var(--text3)", paddingLeft: 27, lineHeight: 1.55 }}>
              {item.detail}
            </p>
          </div>
        ))}

        <div className="hr" />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--later)", flexShrink: 0 }} />
          <span style={{ fontSize: 11.5, color: "var(--text3)" }}>All systems operational</span>
        </div>
      </div>
    </div>
  );
}