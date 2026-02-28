import React, { useState, useEffect } from "react";

const styles = {
  container: {
    padding: "26px 28px",
    fontFamily: "'Geist', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
  },
  title: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: 26,
    fontWeight: 400,
    marginBottom: 4,
    color: "#1e1628",
  },
  subtitle: {
    fontSize: 12.5,
    color: "#a899be",
  },
  loadingWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 16px",
    background: "#f0eafa",
    border: "1.5px solid #d0bef5",
    borderRadius: 11,
    marginBottom: 16,
    fontSize: 13,
    color: "#7c5cbf",
    fontWeight: 500,
  },
  spinner: {
    display: "inline-block",
    animation: "spin 0.75s linear infinite",
    fontSize: 14,
  },
  emptyWrap: {
    textAlign: "center",
    padding: "48px 24px",
    color: "#a899be",
    fontSize: 13.5,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 12,
    display: "block",
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "1.8px",
    textTransform: "uppercase",
    color: "#a899be",
    marginBottom: 12,
    marginTop: 20,
  },
  divider: {
    height: 1,
    background: "#e8e2f0",
    margin: "20px 0",
  },
  briefCard: {
    border: "1.5px solid",
    borderRadius: 11,
    padding: "14px 16px",
    marginBottom: 8,
    transition: "box-shadow 0.2s",
    cursor: "default",
  },
  briefCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  briefCardIcon: {
    fontSize: 18,
  },
  briefCardLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.4px",
    textTransform: "uppercase",
  },
  bulletItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    padding: "8px 0",
    borderBottom: "1px solid",
    fontSize: 13,
    lineHeight: 1.5,
  },
  bullet: {
    flexShrink: 0,
    marginTop: 2,
    width: 6,
    height: 6,
    borderRadius: "50%",
    display: "inline-block",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#3a7a6a",
    flexShrink: 0,
    animation: "pulse 2.5s ease-in-out infinite",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    background: "#f2eef7",
    border: "1.5px solid #e8e2f0",
    borderRadius: 10,
    padding: "12px 14px",
    textAlign: "center",
  },
  statNum: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1e1628",
    fontFamily: "'Instrument Serif', serif",
  },
  statLabel: {
    fontSize: 11,
    color: "#a899be",
    marginTop: 2,
  },
};

const SECTION_CONFIG = {
  urgent: {
    icon: "🔴",
    label: "Urgent",
    bg: "#fdf0f5",
    border: "#f0c0d4",
    textColor: "#b5426a",
    labelColor: "#b5426a",
    bulletColor: "#b5426a",
    itemBorder: "#f0c0d4",
  },
  important: {
    icon: "🟡",
    label: "Important",
    bg: "#fdf6ef",
    border: "#f0d8b8",
    textColor: "#a0622a",
    labelColor: "#a0622a",
    bulletColor: "#a0622a",
    itemBorder: "#f0d8b8",
  },
  later: {
    icon: "⚪",
    label: "Later",
    bg: "#eef7f4",
    border: "#b0dcd2",
    textColor: "#3a7a6a",
    labelColor: "#3a7a6a",
    bulletColor: "#3a7a6a",
    itemBorder: "#b0dcd2",
  },
};

function BriefSection({ sectionKey, items }) {
  const cfg = SECTION_CONFIG[sectionKey];
  if (!items || items.length === 0) return null;

  return (
    <div
      style={{
        ...styles.briefCard,
        background: cfg.bg,
        borderColor: cfg.border,
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 3px 14px rgba(0,0,0,0.06)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={styles.briefCardHeader}>
        <span style={styles.briefCardIcon}>{cfg.icon}</span>
        <span style={{ ...styles.briefCardLabel, color: cfg.labelColor }}>
          {cfg.label}
        </span>
        <span style={{
          marginLeft: "auto",
          fontSize: 11,
          fontWeight: 600,
          background: "rgba(255,255,255,0.6)",
          padding: "2px 8px",
          borderRadius: 20,
          color: cfg.textColor,
        }}>
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              ...styles.bulletItem,
              borderBottomColor: i < items.length - 1 ? cfg.itemBorder : "transparent",
              color: cfg.textColor,
            }}
          >
            <span style={{ ...styles.bullet, background: cfg.bulletColor }} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyBrief({ allClassifiedData }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!allClassifiedData || allClassifiedData.length === 0) return;

    const generateBrief = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/ai/daily-brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: allClassifiedData }),
        });
        const result = await response.json();
        setSummary(result);
      } catch (error) {
        console.error("Daily Brief error:", error);
      }
      setLoading(false);
    };

    generateBrief();
  }, [allClassifiedData]);

  const urgentCount = summary?.urgent?.length || 0;
  const importantCount = summary?.important?.length || 0;
  const laterCount = summary?.later?.length || 0;
  const totalItems = urgentCount + importantCount + laterCount;

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.35} }
        @keyframes fadeup { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        .brief-in { animation: fadeup 0.4s ease forwards; }
      `}</style>

      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Daily Brief</h2>
          <p style={styles.subtitle}>
            {summary
              ? `${totalItems} items across ${allClassifiedData?.length || 0} sources`
              : "Your AI-powered day overview"}
          </p>
        </div>
        {urgentCount > 0 && (
          <div style={{
            background: "#fdf0f5",
            border: "1px solid #f0c0d4",
            borderRadius: 9,
            padding: "7px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <span style={{ fontSize: 12 }}>🔴</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#b5426a" }}>
              {urgentCount} urgent
            </span>
          </div>
        )}
      </div>

      {loading && (
        <div style={styles.loadingWrap}>
          <span style={styles.spinner}>↻</span>
          Generating your daily brief…
        </div>
      )}

      {!loading && !summary && (
        <div style={styles.emptyWrap}>
          <span style={styles.emptyIcon}>📋</span>
          <p style={{ fontWeight: 500, color: "#6b5f82", marginBottom: 6 }}>
            No brief generated yet
          </p>
          <p style={{ fontSize: 12, color: "#a899be" }}>
            Brief will auto-generate once your inbox, Slack, and Drive are classified.
          </p>
        </div>
      )}

      {summary && (
        <div className="brief-in">
          {/* Stats Row */}
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statNum, color: "#b5426a" }}>{urgentCount}</div>
              <div style={styles.statLabel}>Urgent</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statNum, color: "#a0622a" }}>{importantCount}</div>
              <div style={styles.statLabel}>Important</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statNum, color: "#3a7a6a" }}>{laterCount}</div>
              <div style={styles.statLabel}>Later</div>
            </div>
          </div>

          <div style={styles.sectionLabel}>Breakdown</div>

          <BriefSection sectionKey="urgent" items={summary.urgent} />
          <BriefSection sectionKey="important" items={summary.important} />
          <BriefSection sectionKey="later" items={summary.later} />

          <div style={styles.divider} />
          <div style={styles.statusRow}>
            <span style={styles.statusDot} />
            <span style={{ fontSize: 11.5, color: "#a899be" }}>
              Brief generated from {allClassifiedData?.length || 0} classified items
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyBrief;