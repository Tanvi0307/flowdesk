import React, { useState } from "react";

function DailyBrief({ allClassifiedData }) {

  // ✅ YOU MUST DECLARE summary STATE
  const [summary, setSummary] = useState(null);

  const runBrief = async () => {

    const response = await fetch("http://localhost:8080/api/ai/daily-brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: allClassifiedData })
    });

    const result = await response.json();
    setSummary(result);
  };

  return (
    <div>
      <h2>Daily Brief</h2>

      <button onClick={runBrief}>
        Generate Daily Brief
      </button>

      {summary && (
        <div style={{ marginTop: "20px" }}>

          <div>
            <h3 style={{ color: "red" }}>🔴 Urgent</h3>
            {summary.urgent.map((item, index) => (
              <div key={"u" + index}>• {item}</div>
            ))}
          </div>

          <div>
            <h3 style={{ color: "orange" }}>🟠 Important</h3>
            {summary.important.map((item, index) => (
              <div key={"i" + index}>• {item}</div>
            ))}
          </div>

          <div>
            <h3 style={{ color: "gray" }}>⚪ Others</h3>
            {summary.other.map((item, index) => (
              <div key={"o" + index}>• {item}</div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

export default DailyBrief;