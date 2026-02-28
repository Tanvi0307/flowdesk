import React, { useState, useEffect } from "react";
import driveData from "../data/driveData";

const PRIORITY_CONFIG = {
  urgent: {
    bg: "#fdf0f5",
    border: "#f0c0d4",
    color: "#b5426a",
    badge: { bg: "#fdf0f5", color: "#b5426a", border: "#f0c0d4" },
    chip: "chip-u",
    dot: "#b5426a",
  },
  important: {
    bg: "#fdf6ef",
    border: "#f0d8b8",
    color: "#a0622a",
    badge: { bg: "#fdf6ef", color: "#a0622a", border: "#f0d8b8" },
    chip: "chip-i",
    dot: "#a0622a",
  },
  later: {
    bg: "#ffffff",
    border: "#e8e2f0",
    color: "#3a7a6a",
    badge: { bg: "#eef7f4", color: "#3a7a6a", border: "#b0dcd2" },
    chip: "chip-l",
    dot: "#3a7a6a",
  },
};

const FILE_ICONS = {
  pdf: "📄",
  doc: "📝",
  docx: "📝",
  xls: "📊",
  xlsx: "📊",
  ppt: "📑",
  pptx: "📑",
  png: "🖼️",
  jpg: "🖼️",
  default: "📁",
};

function getFileIcon(name) {
  if (!name) return FILE_ICONS.default;
  const ext = name.split(".").pop().toLowerCase();
  return FILE_ICONS[ext] || FILE_ICONS.default;
}

function Drive({ setAllClassifiedData }) {
  const [files, setFiles] = useState(driveData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const runClassification = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:8080/api/ai/classify-drive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: driveData }),
        });

        if (!response.ok) throw new Error("Server error: " + response.status);

        const result = await response.json();

        const updatedFiles = driveData.map((file) => {
          const match = result.find((r) => String(r.id) === String(file.id));
          return match ? { ...file, ...match } : file;
        });

        setFiles(updatedFiles);

        setAllClassifiedData((prev) => [
          ...prev.filter((item) => item.source !== "drive"),
          ...updatedFiles.map((item) => ({ ...item, source: "drive" })),
        ]);
      } catch (err) {
        console.error("Drive auto-classification error:", err);
        setError("Failed to classify Drive files.");
      } finally {
        setLoading(false);
      }
    };

    runClassification();
  }, []);

  const grouped = {
    urgent: files.filter((f) => f.priority === "urgent"),
    important: files.filter((f) => f.priority === "important"),
    later: files.filter(
      (f) => !f.priority || (f.priority !== "urgent" && f.priority !== "important")
    ),
  };

  return (
    <div style={{ padding: "26px 28px", fontFamily: "'Geist', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeup { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        .drive-card { transition: all 0.18s; }
        .drive-card:hover { transform: translateY(-1px); box-shadow: 0 3px 14px rgba(0,0,0,0.07); }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, fontWeight: 400, marginBottom: 4, color: "#1e1628" }}>
            Drive
          </h2>
          <p style={{ fontSize: 12.5, color: "#a899be" }}>
            {files.length} files · AI classified by priority
          </p>
        </div>
        {grouped.urgent.length > 0 && (
          <div style={{ background: "#fdf0f5", border: "1px solid #f0c0d4", borderRadius: 9, padding: "7px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12 }}>🔴</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#b5426a" }}>
              {grouped.urgent.length} urgent
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "#f0eafa", border: "1.5px solid #d0bef5", borderRadius: 11, marginBottom: 16, fontSize: 13, color: "#7c5cbf", fontWeight: 500 }}>
          <span style={{ display: "inline-block", animation: "spin 0.75s linear infinite" }}>↻</span>
          Auto-classifying Drive files…
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: "#fdf0f5", border: "1px solid #f0c0d4", borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: "#b5426a", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Sections */}
      {["urgent", "important", "later"].map((priority) => {
        const items = grouped[priority];
        if (!items.length) return null;
        const cfg = PRIORITY_CONFIG[priority];
        const labels = { urgent: "Urgent", important: "Important", later: "Later" };

        return (
          <div key={priority} style={{ marginBottom: 24 }}>
            {/* Section Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 10.5, fontWeight: 600, padding: "3px 9px",
                borderRadius: 20, letterSpacing: "0.4px", textTransform: "uppercase",
                background: cfg.badge.bg, color: cfg.badge.color,
                border: `1px solid ${cfg.badge.border}`,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                {labels[priority]}
              </span>
              <div style={{ flex: 1, height: 1, background: "#e8e2f0" }} />
              <span style={{ fontSize: 11, color: "#a899be", fontWeight: 500 }}>
                {items.length} file{items.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* File Cards */}
            {items.map((file) => (
              <div
                key={file.id}
                className="drive-card"
                style={{
                  background: priority === "urgent" ? cfg.bg : priority === "important" ? cfg.bg : "#ffffff",
                  border: `1.5px solid ${cfg.border}`,
                  borderRadius: 11,
                  padding: "15px 17px",
                  marginBottom: 8,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                  {/* File icon */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: cfg.badge.bg, border: `1.5px solid ${cfg.badge.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>
                    {getFileIcon(file.name)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1e1628", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {file.name}
                      </span>
                      {file.priority && (
                        <span style={{
                          fontSize: 10.5, fontWeight: 600, padding: "2px 8px",
                          borderRadius: 20, letterSpacing: "0.4px", textTransform: "uppercase",
                          background: cfg.badge.bg, color: cfg.badge.color,
                          border: `1px solid ${cfg.badge.border}`, flexShrink: 0,
                        }}>
                          {file.priority}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12.5, color: "#6b5f82", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {file.content}
                    </p>
                    {file.modified && (
                      <span style={{ fontSize: 11, color: "#a899be", marginTop: 5, display: "block" }}>
                        Modified: {file.modified}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Drive;