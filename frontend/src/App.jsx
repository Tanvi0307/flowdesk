import React, { useState, useEffect, useRef } from "react";
import Inbox from "./components/Inbox";
import Drive from "./components/Drive";
import Slack from "./components/Slack";
import CalendarPanel from "./components/CalendarPanel";
import BriefSidebar from "./components/BriefSidebar";
import LoginPage from "./components/LoginPage";

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ fontSize: 13, color: "var(--text3)", fontVariantNumeric: "tabular-nums" }}>
      {t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

function Dashboard({ user, onLogout }) {
  const [active, setActive] = useState("inbox");
  const [dd, setDd] = useState(false);
  const [allClassifiedData, setAllClassifiedData] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setDd(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const tabs = [
    { k: "inbox",    lbl: "Inbox",    icon: "✉️", badge: 3,  bdType: "bdg-red"  },
    { k: "slack",    lbl: "Slack",    icon: "⚡", badge: 18, bdType: "bdg-blue" },
    { k: "calendar", lbl: "Calendar", icon: "📅", badge: null },
    { k: "drive",    lbl: "Drive",    icon: "📁", badge: null },
  ];

  return (
    <div className="dash">
      {/* LEFT BRIEF PANEL — now receives allClassifiedData */}
      <BriefSidebar user={user} allClassifiedData={allClassifiedData} />

      {/* RIGHT COLUMN */}
      <div className="right-col">
        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 17, color: "var(--text2)", letterSpacing: "-0.2px", marginRight: 6 }}>
            Flowdesk
          </div>
          <div style={{ fontSize: 13, color: "var(--text3)", marginLeft: 6 }}>
            {getGreeting()}, {user.name.split(" ")[0]}
          </div>
          <div className="search">
            <span style={{ fontSize: 13 }}>🔍</span>
            <span>Search anything…</span>
          </div>
          <div style={{ flex: 1 }} />
          <Clock />
          <div style={{ width: 1, height: 18, background: "var(--border)", margin: "0 6px" }} />
          <div style={{ position: "relative" }} ref={ref}>
            <button className="u-avatar" onClick={() => setDd((d) => !d)}>
              {user.initials}
            </button>
            {dd && (
              <div className="dropdown">
                <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{user.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text3)" }}>{user.email}</div>
                </div>
                {["Profile & settings", "Notification preferences", "Integrations", "Keyboard shortcuts"].map((item) => (
                  <button key={item} className="dd-item">{item}</button>
                ))}
                <div className="dd-div" />
                <button className="dd-item danger" onClick={onLogout}>Sign out</button>
              </div>
            )}
          </div>
        </div>

        {/* TABS */}
        <div className="tab-row">
          {tabs.map((t) => (
            <button
              key={t.k}
              className={`tab-btn ${active === t.k ? "on" : ""}`}
              onClick={() => setActive(t.k)}
            >
              <span>{t.icon}</span>
              {t.lbl}
              {t.badge > 0 && (
                <span className={`bdg ${t.bdType || "bdg-gray"}`}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="right-scroll">
          {active === "inbox"    && <Inbox    setAllClassifiedData={setAllClassifiedData} />}
          {active === "slack"    && <Slack    setAllClassifiedData={setAllClassifiedData} />}
          {active === "calendar" && <CalendarPanel />}
          {active === "drive"    && <Drive    setAllClassifiedData={setAllClassifiedData} />}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  return user ? (
    <Dashboard user={user} onLogout={() => setUser(null)} />
  ) : (
    <LoginPage onLogin={setUser} />
  );
}

export default App;