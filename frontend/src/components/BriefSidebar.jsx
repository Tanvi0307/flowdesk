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

// Mock data — used when no real allClassifiedData is passed in.
// Each item has a `content` and `priority` field matching what AIController expects.
const MOCK_INBOX_ITEMS = [
  { source: "email",    content: "Contract amendment needs sign-off TODAY by 5 PM",          priority: "urgent"    },
  { source: "email",    content: "Security alert: Unrecognized login detected on your account", priority: "urgent" },
  { source: "slack",    content: "Prod deploy blocked — need your approval ASAP",             priority: "urgent"    },
  { source: "calendar", content: "Investor call — critical, do not miss at 4:00 PM",          priority: "urgent"    },
  { source: "email",    content: "Q3 board report draft — please review before Friday",        priority: "important" },
  { source: "email",    content: "Figma handoff: review new design tokens",                    priority: "important" },
  { source: "email",    content: "Feature spec sign-off needed this week",                     priority: "important" },
  { source: "slack",    content: "Brand asset updates are ready for your review",              priority: "important" },
  { source: "calendar", content: "Standup at 10:00 AM",                                        priority: "important" },
  { source: "slack",    content: "Team lunch poll — vote by end of day",                       priority: "later"     },
  { source: "drive",    content: "Budget follow-up spreadsheet updated",                        priority: "later"     },
  { source: "drive",    content: "Infrastructure digest Q3",                                    priority: "later"     },
  { source: "drive",    content: "Monthly newsletter draft ready",                              priority: "later"     },
];

const SECTION_CONFIG = {
  urgent: {
    icon: "🔴", label: "Urgent",
    bg: "var(--urgent-bg)", border: "var(--urgent-border)",
    textColor: "var(--urgent)", bulletColor: "var(--urgent)", itemBorder: "var(--urgent-border)",
  },
  important: {
    icon: "🟡", label: "Important",
    bg: "var(--important-bg)", border: "var(--important-border)",
    textColor: "var(--important, #a0622a)", bulletColor: "var(--important, #a0622a)", itemBorder: "var(--important-border)",
  },
  later: {
    icon: "⚪", label: "Later",
    bg: "var(--later-bg)", border: "var(--later-border)",
    textColor: "var(--later)", bulletColor: "var(--later)", itemBorder: "var(--later-border)",
  },
};

function BriefSection({ sectionKey, items, visible }) {
  const cfg = SECTION_CONFIG[sectionKey];
  if (!items || items.length === 0) return null;
  return (
    <div style={{
      background: cfg.bg, border: `1.5px solid ${cfg.border}`,
      borderRadius: 10, padding: "11px 13px", marginBottom: 8,
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)",
      transition: "opacity 0.35s ease, transform 0.35s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
        <span style={{ fontSize: 13 }}>{cfg.icon}</span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: cfg.textColor }}>
          {cfg.label}
        </span>
        <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, background: "rgba(255,255,255,0.6)", padding: "1px 7px", borderRadius: 20, color: cfg.textColor }}>
          {items.length}
        </span>
      </div>
      <div>
        {items.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 7, padding: "5px 0",
            borderBottom: i < items.length - 1 ? `1px solid ${cfg.itemBorder}` : "none",
            fontSize: 11.5, lineHeight: 1.5, color: cfg.textColor,
          }}>
            <span style={{ flexShrink: 0, marginTop: 5, width: 5, height: 5, borderRadius: "50%", background: cfg.bulletColor, display: "inline-block" }} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 10, padding: "11px 13px", marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--border)", animation: "shimmer 1.5s ease-in-out infinite" }} />
        <div style={{ width: 60, height: 9, borderRadius: 4, background: "var(--border)", animation: "shimmer 1.5s ease-in-out infinite" }} />
      </div>
      {[80, 95, 70].map((w, i) => (
        <div key={i} style={{ width: `${w}%`, height: 8, borderRadius: 4, background: "var(--border)", marginBottom: 6, animation: `shimmer 1.5s ease-in-out ${i * 0.15}s infinite` }} />
      ))}
    </div>
  );
}

export default function BriefSidebar({ user, allClassifiedData }) {
  const [summary, setSummary]               = useState(null);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);
  const [sectionsVisible, setSectionsVisible] = useState(false);
  const [retryCount, setRetryCount]         = useState(0);

  // Use real data if provided, otherwise use mock
  const dataToClassify = (allClassifiedData && allClassifiedData.length > 0)
    ? allClassifiedData
    : MOCK_INBOX_ITEMS;

  useEffect(() => {
    const generateBrief = async () => {
      setLoading(true);
      setError(null);
      setSectionsVisible(false);
      setSummary(null);

      try {
        // ✅ Calls Spring Boot backend at /api/ai/daily-brief
        // Backend reads `priority` from each item and buckets them — no AI needed on frontend
        const response = await fetch("http://localhost:8080/api/ai/daily-brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: dataToClassify }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Server responded ${response.status}: ${text}`);
        }

        const result = await response.json();
        // result shape: { urgent: [...], important: [...], later: [...] }
        setSummary(result);
        setTimeout(() => setSectionsVisible(true), 100);

      } catch (err) {
        console.error("Daily Brief error:", err);
        setError(err.message?.includes("Failed to fetch")
          ? "Backend not reachable. Make sure Spring Boot is running on port 8080."
          : (err.message || "Couldn't generate brief."));
      } finally {
        setLoading(false);
      }
    };

    generateBrief();
  }, [retryCount, allClassifiedData]);

  const urgentCount    = summary?.urgent?.length    || 0;
  const importantCount = summary?.important?.length || 0;
  const laterCount     = summary?.later?.length     || 0;
  const totalItems     = urgentCount + importantCount + laterCount;

  return (
    <div className="left-col">
      <style>{`
        @keyframes shimmer { 0%,100%{opacity:1}50%{opacity:0.4} }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1}50%{opacity:0.35} }
        @keyframes fadeup  { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="left-body">

        {/* ── Greeting ── */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--text3)", letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: 10 }}>
            {getDate()}
          </div>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 28, fontWeight: 400, lineHeight: 1.2, marginBottom: 5 }}>
            {getGreeting()},<br />
            <span style={{ color: "var(--accent)" }}>{user?.name?.split(" ")[0] ?? "there"}.</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>{user?.role}</div>
        </div>

        {/* ── Daily Brief Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div className="sec-lbl" style={{ margin: 0 }}>Daily Brief</div>
          {summary && (
            <span style={{ fontSize: 10.5, color: "var(--text3)" }}>
              {totalItems} items · {dataToClassify.length} sources
            </span>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 13px",
              background: "var(--surface)", border: "1.5px solid var(--border)",
              borderRadius: 10, marginBottom: 10, fontSize: 11.5, color: "var(--text3)",
            }}>
              <span style={{ display: "inline-block", animation: "spin 0.75s linear infinite", fontSize: 13 }}>↻</span>
              Generating your brief…
            </div>
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div style={{ background: "var(--urgent-bg)", border: "1.5px solid var(--urgent-border)", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--urgent)", marginBottom: 6 }}>
              ⚠ {error}
            </div>
            <button
              onClick={() => setRetryCount(c => c + 1)}
              style={{ fontSize: 11, fontWeight: 600, color: "var(--urgent)", background: "rgba(255,255,255,0.5)", border: "1px solid var(--urgent-border)", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}
            >
              Retry
            </button>
          </div>
        )}

        {/* ── AI Summary ── */}
        {summary && !loading && (
          <>
            {urgentCount > 0 && (
              <div style={{
                background: "var(--urgent-bg)", border: "1.5px solid var(--urgent-border)",
                borderRadius: 12, padding: "12px 14px", marginBottom: 14,
                display: "flex", alignItems: "flex-start", gap: 10,
                opacity: sectionsVisible ? 1 : 0, transform: sectionsVisible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
              }}>
                <span style={{ fontSize: 16, lineHeight: 1, marginTop: 1 }}>🚨</span>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--urgent)", marginBottom: 4 }}>
                    {urgentCount} Urgent Action{urgentCount !== 1 ? "s" : ""} Required
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--urgent)", lineHeight: 1.55 }}>
                    {summary.urgent.slice(0, 2).map((item, i) => (
                      <div key={i}>· {item}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 12,
              opacity: sectionsVisible ? 1 : 0, transform: sectionsVisible ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s",
            }}>
              {[
                { num: urgentCount,    label: "Urgent",    color: "var(--urgent)" },
                { num: importantCount, label: "Important", color: "var(--important, #a0622a)" },
                { num: laterCount,     label: "Later",     color: "var(--later)" },
              ].map(({ num, label, color }) => (
                <div key={label} style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 9, padding: "9px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Instrument Serif',serif", color }}>{num}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>{label}</div>
                </div>
              ))}
            </div>

            <BriefSection sectionKey="urgent"    items={summary.urgent}    visible={sectionsVisible} />
            <BriefSection sectionKey="important" items={summary.important} visible={sectionsVisible} />
            <BriefSection sectionKey="later"     items={summary.later}     visible={sectionsVisible} />
          </>
        )}

        

      </div>
    </div>
  );
}