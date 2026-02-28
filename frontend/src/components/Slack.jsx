import React, { useState } from "react";
import slackMessages from "../data/slackData";

function Slack({ setAllClassifiedData }) {

  const [messages, setMessages] = useState(slackMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAI = async () => {

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8080/api/ai/classify-slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: messages
        })
      });

      if (!response.ok) {
        throw new Error("Server returned status: " + response.status);
      }

      const result = await response.json();

      console.log("Slack AI Response:", result);

      const updated = messages.map(msg => {
        const match = result.find(r => String(r.id) === String(msg.id));
        return match ? { ...msg, ...match } : msg;
      });

      setMessages(updated);

      // 🔥 PUSH TO GLOBAL STATE (FOR DAILY BRIEF)
      setAllClassifiedData(prev => [
        ...prev.filter(item => item.source !== "slack"),
        ...updated.map(item => ({
          ...item,
          source: "slack"
        }))
      ]);

    } catch (err) {
      console.error("Slack AI Error:", err);
      setError("Failed to run Slack AI. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const getColor = (tag) => {
    switch (tag) {
      case "urgent": return "red";
      case "action": return "orange";
      case "important": return "goldenrod";
      case "meeting-change": return "blue";
      case "informational": return "gray";
      default: return "gray";
    }
  };

  return (
    <div>
      <h2>Slack</h2>

      <button onClick={runAI} disabled={loading}>
        {loading ? "Running AI..." : "Run Slack AI"}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          {error}
        </div>
      )}

      {messages.map(msg => (
        <div
          key={msg.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            margin: "10px",
            borderRadius: "6px"
          }}
        >

          <div style={{ fontSize: "12px", color: "gray" }}>
            {msg.channel}
          </div>

          <strong>{msg.sender}</strong> — {msg.time}

          <p>{msg.message}</p>

          {msg.aiTag && (
            <div style={{
              backgroundColor: getColor(msg.aiTag),
              color: "white",
              padding: "4px 8px",
              display: "inline-block",
              borderRadius: "10px",
              marginTop: "5px",
              fontSize: "12px"
            }}>
              {msg.aiTag.toUpperCase()}
            </div>
          )}

        </div>
      ))}

    </div>
  );
}

export default Slack;