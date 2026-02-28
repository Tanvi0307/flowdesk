import React, { useState, useEffect, useRef } from "react";
import Inbox from "./components/Inbox";
import Drive from "./components/Drive";
import Slack from "./components/Slack";
import DailyBrief from "./components/DailyBrief";
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
    { k: "inbox",   lbl: "Inbox",    icon: "✉️",  badge: 3,  bdType: "bdg-red" },
    { k: "slack",   lbl: "Slack",    icon: "⚡",  badge: 18, bdType: "bdg-blue" },
    { k: "calendar",lbl: "Calendar", icon: "📅",  badge: null },
    { k: "tasks",   lbl: "Tasks",    icon: "✅",  badge: 2,  bdType: "bdg-red" },
    { k: "drive",   lbl: "Drive",    icon: "📁",  badge: null },
    { k: "daily-brief", lbl: "Daily Brief", icon: "📋", badge: null },
  ];

  return (
    <div className="dash">
      {/* LEFT BRIEF PANEL */}
      <BriefSidebar user={user} />

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
          {active === "inbox"       && <Inbox setAllClassifiedData={setAllClassifiedData} />}
          {active === "slack"       && <Slack setAllClassifiedData={setAllClassifiedData} />}
          {active === "calendar"    && <CalendarPanel />}
          {active === "tasks"       && <TasksPanel />}
          {active === "drive"       && <Drive setAllClassifiedData={setAllClassifiedData} />}
          {active === "daily-brief" && <DailyBrief allClassifiedData={allClassifiedData} />}
        </div>
      </div>
    </div>
  );
}

// ── TASKS PANEL (inline, simple) ─────────────────────────────────────────────
const INIT_TASKS = [
  { id: 1, title: "Review & sign off on contract amendment (David Yuen)", done: false, priority: "urgent",    due: "Today, 5 PM" },
  { id: 2, title: "Resolve security alert — review active sessions",       done: false, priority: "urgent",    due: "Today" },
  { id: 3, title: "Approve Q3 board report — slides 12–16",                done: false, priority: "important", due: "Today" },
  { id: 4, title: "Review PR #247 — authentication refactor",              done: false, priority: "important", due: "Today" },
  { id: 5, title: "Update team OKRs for Q4 in Notion",                    done: true,  priority: "important", due: "Completed" },
  { id: 6, title: "Sprint 12 retrospective document",                      done: false, priority: "later",     due: "This week" },
  { id: 7, title: "Schedule Q4 offsite planning session",                  done: false, priority: "later",     due: "Next week" },
];

function Chip({ p }) {
  const map = {
    urgent:    ["chip chip-u", "Urgent"],
    important: ["chip chip-i", "Important"],
    later:     ["chip chip-l", "Later"],
  };
  const [cls, lbl] = map[p] || ["chip chip-l", "Later"];
  return (
    <span className={cls}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
      {lbl}
    </span>
  );
}

function TasksPanel() {
  const [tasks, setTasks] = useState(INIT_TASKS);
  const tog = (id) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const dn = tasks.filter((t) => t.done).length;
  const pct = Math.round((dn / tasks.length) * 100);
  const groups = [
    { k: "urgent", lbl: "Urgent" },
    { k: "important", lbl: "Important" },
    { k: "later", lbl: "Later" },
  ];
  return (
    <div className="panel-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, fontWeight: 400, marginBottom: 4 }}>Tasks</h2>
          <p style={{ fontSize: 12.5, color: "var(--text3)" }}>{tasks.filter((t) => !t.done).length} open · {dn} completed today</p>
        </div>
      </div>
      <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 11, padding: "14px 16px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "var(--text3)" }}>Daily progress</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: pct === 100 ? "var(--later)" : "var(--accent)" }}>{pct}% complete</span>
        </div>
        <div className="prog-track">
          <div style={{ height: "100%", borderRadius: 5, background: pct === 100 ? "var(--later)" : "linear-gradient(90deg,var(--accent),#b899e8)", width: `${pct}%`, transition: "width .5s ease" }} />
        </div>
      </div>
      {groups.map((g) => {
        const items = tasks.filter((t) => t.priority === g.k);
        if (!items.length) return null;
        return (
          <div key={g.k}>
            <div className="mail-sec-hdr">
              <Chip p={g.k} />
              <div className="mail-sec-line" />
              <span style={{ fontSize: 11, color: "var(--text3)" }}>{items.filter((t) => !t.done).length} open</span>
            </div>
            {items.map((t) => (
              <div key={t.id} className="task-row" onClick={() => tog(t.id)}>
                <div className={`chk ${t.done ? "dn" : ""}`}>
                  {t.done && <span style={{ color: "#fff", fontWeight: 700 }}>✓</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13.5, fontWeight: t.done ? 400 : 500, color: t.done ? "var(--text3)" : "var(--text)", textDecoration: t.done ? "line-through" : "none", marginBottom: 3 }}>{t.title}</p>
                  <span style={{ fontSize: 11.5, color: t.due.includes("Today") && !t.done ? "var(--urgent)" : "var(--text3)", fontWeight: t.due.includes("Today") && !t.done ? 600 : 400 }}>Due: {t.due}</span>
                </div>
              </div>
            ))}
          </div>
        );
      })}
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