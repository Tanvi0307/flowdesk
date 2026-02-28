import { useState } from "react";

function EmailCard({ email, onGenerateReply }) {
  const [copied, setCopied] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReplyClick = async () => {
    setLoadingReply(true);
    await onGenerateReply(email.id);
    setLoadingReply(false);
  };

  const getPriorityColor = (priority) => {
    if (priority === "urgent") return "red";
    if (priority === "important") return "orange";
    return "gray";
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "15px",
        background: "#fff",
      }}
    >
      <h3>{email.title}</h3>
      <p>{email.content}</p>

      <p>
        <strong>Priority:</strong>{" "}
        <span style={{ color: getPriorityColor(email.priority) }}>
          {email.priority}
        </span>
      </p>

      <p>
        <strong>Confidence:</strong> {email.confidence}%
      </p>

      <p>
        <strong>Reason:</strong> {email.reason}
      </p>

      {/* Generate Reply Button */}
      <button
        onClick={handleReplyClick}
        disabled={loadingReply}
        style={{
          padding: "6px 10px",
          marginTop: "5px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {loadingReply ? "Generating..." : "Generate AI Reply"}
      </button>

      {/* AI Reply Section */}
      {email.reply && (
        <div style={{ marginTop: "15px" }}>
          <strong>AI Reply:</strong>

          <div
            style={{
              background: "#f4f4f4",
              padding: "10px",
              borderRadius: "6px",
              marginTop: "5px",
              whiteSpace: "pre-wrap",
            }}
          >
            {email.reply}
          </div>

          <button
            onClick={() => handleCopy(email.reply)}
            style={{
              padding: "6px 10px",
              marginTop: "8px",
              cursor: "pointer",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {copied ? "Copied ✓" : "Copy Reply"}
          </button>
        </div>
      )}
    </div>
  );
}

export default EmailCard;