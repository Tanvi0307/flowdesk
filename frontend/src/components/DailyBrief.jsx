import React, { useState } from "react";

function DailyBrief({ allClassifiedData }) {

  // ✅ DEFINE summary STATE
  const [summary, setSummary] = useState(null);

  const runBrief = async () => {

    const response = await fetch("http://localhost:8080/api/ai/daily-brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: allClassifiedData })
    });

    const result = await response.json();
    console.log("Daily Brief:", result);

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

          {/* 🔴 URGENT */}
          <div>
            <h3 style={{ color: "red" }}>🔴 Urgent</h3>
            {summary.urgent && summary.urgent.length > 0 ? (
              summary.urgent.map((item, index) => (
                <div key={"u" + index}>• {item}</div>
              ))
            ) : (
              <div>No urgent items</div>
            )}
          </div>

          {/* 🟠 IMPORTANT */}
          <div>
            <h3 style={{ color: "orange" }}>🟠 Important</h3>
            {summary.important && summary.important.length > 0 ? (
              summary.important.map((item, index) => (
                <div key={"i" + index}>• {item}</div>
              ))
            ) : (
              <div>No important items</div>
            )}
          </div>

          {/* ⚪ LATER */}
          <div>
            <h3 style={{ color: "gray" }}>⚪ Later</h3>
            {summary.later && summary.later.length > 0 ? (
              summary.later.map((item, index) => (
                <div key={"l" + index}>• {item}</div>
              ))
            ) : (
              <div>No later items</div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default DailyBrief;