import React, { useState } from "react";
import driveData from "../data/driveData";

function Drive({ setAllClassifiedData }) {

  const [files, setFiles] = useState(driveData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runClassification = async () => {

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:8080/api/ai/classify-drive",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: files })
        }
      );

      if (!response.ok) {
        throw new Error("Server error: " + response.status);
      }

      const result = await response.json();

      const updatedFiles = files.map(file => {
        const match = result.find(r => String(r.id) === String(file.id));
        return match ? { ...file, ...match } : file;
      });

      setFiles(updatedFiles);

      // 🔥 PUSH TO GLOBAL STATE (FOR DAILY BRIEF)
      setAllClassifiedData(prev => [
        ...prev.filter(item => item.source !== "drive"),
        ...updatedFiles.map(item => ({
          ...item,
          source: "drive"
        }))
      ]);

    } catch (err) {
      console.error("Drive classification error:", err);
      setError("Failed to classify Drive files.");
    } finally {
      setLoading(false);
    }
  };

  const getColor = (priority) => {
    switch (priority) {
      case "urgent": return "red";
      case "important": return "orange";
      default: return "gray";
    }
  };

  return (
    <div>
      <h2>Drive</h2>

      <button onClick={runClassification} disabled={loading}>
        {loading ? "Classifying..." : "Run AI Classification"}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          {error}
        </div>
      )}

      {files.map(file => (
        <div
          key={file.id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            margin: "10px",
            borderRadius: "6px"
          }}
        >
          <h3>{file.name}</h3>
          <p>{file.content}</p>

          {file.priority && (
            <div style={{
              backgroundColor: getColor(file.priority),
              color: "white",
              padding: "4px 8px",
              display: "inline-block",
              borderRadius: "8px",
              fontSize: "12px",
              marginTop: "5px"
            }}>
              {file.priority.toUpperCase()}
            </div>
          )}
        </div>
      ))}

    </div>
  );
}

export default Drive;