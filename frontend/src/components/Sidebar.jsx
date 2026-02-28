import React, { useState } from "react";

const NAV_ITEMS = [
  { key: "inbox", label: "Inbox", icon: "✉️" },
  { key: "slack", label: "Slack", icon: "⚡" },
  { key: "drive", label: "Drive", icon: "📁" },
  { key: "calendar", label: "Calendar", icon: "📅" },
  { key: "daily-brief", label: "Daily Brief", icon: "📋" },
];

function Sidebar({ setView, currentView, counts = {} }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      width: 220,
      minWidth: 220,
      background: "#ffffff",
      borderRight: "1px solid #e8e2f0",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      fontFamily: "'Geist', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Logo */}
      <div style={{
        padding: "22px 20px 18px",
        borderBottom: "1px solid #e8e2f0",
      }}>
        <div style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 19,
          color: "#1e1628",
          letterSpacing: "-0.2px",
        }}>
          Flowdesk
        </div>
        <div style={{
          fontSize: 10.5,
          color: "#a899be",
          letterSpacing: "0.3px",
          marginTop: 2,
        }}>
          Daily Command Center
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "14px 10px", flex: 1 }}>
        <div style={{
          fontSize: 9.5,
          fontWeight: 600,
          letterSpacing: "1.8px",
          textTransform: "uppercase",
          color: "#a899be",
          padding: "0 10px",
          marginBottom: 8,
        }}>
          Navigation
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.key;
          const isHov = hovered === item.key;
          const count = counts[item.key] || 0;
          const isUrgent = item.key === "inbox" && counts.urgentInbox > 0;

          return (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              onMouseEnter={() => setHovered(item.key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "9px 10px",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "'Geist', sans-serif",
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#7c5cbf" : isHov ? "#1e1628" : "#6b5f82",
                background: isActive ? "#f0eafa" : isHov ? "#f7f4f9" : "transparent",
                textAlign: "left",
                transition: "all 0.15s",
                marginBottom: 2,
              }}
            >
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {count > 0 && (
                <span style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  padding: "1.5px 6px",
                  borderRadius: 20,
                  minWidth: 18,
                  textAlign: "center",
                  background: isUrgent && item.key === "inbox" ? "#fdf0f5" : isActive ? "#e8dcf8" : "#f2eef7",
                  color: isUrgent && item.key === "inbox" ? "#b5426a" : isActive ? "#7c5cbf" : "#a899be",
                  border: `1px solid ${isUrgent && item.key === "inbox" ? "#f0c0d4" : isActive ? "#d0bef5" : "#e8e2f0"}`,
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: "14px 12px",
        borderTop: "1px solid #e8e2f0",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          <div style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#3a7a6a",
            animation: "pulse 2.5s ease-in-out infinite",
          }} />
          <span style={{ fontSize: 11.5, color: "#a899be" }}>All systems operational</span>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.35} }`}</style>
      </div>
    </div>
  );
}

export default Sidebar;