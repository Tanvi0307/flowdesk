import { useState } from "react";
import EmailCard from "./EmailCard";
import inboxData from "../data/inboxData";

function Inbox() {
  const [emails, setEmails] = useState(inboxData);
  const [loading, setLoading] = useState(false);

  // =============================
  // CLASSIFY EMAILS
  // =============================
  const classifyEmails = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/ai/classify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: emails }),
        }
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setEmails((prev) =>
          prev.map((email) => {
            const updated = data.find((d) => d.id === email.id);
            return updated ? { ...email, ...updated } : email;
          })
        );
      }
    } catch (error) {
      console.error("Classification error:", error);
    }

    setLoading(false);
  };

  // =============================
  // GENERATE REPLY (FIXED)
  // =============================
  const generateReply = async (id) => {
    try {
      const email = emails.find((e) => e.id === id);

      const response = await fetch(
        "http://localhost:8080/api/ai/reply",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: email.content }),
        }
      );

      const data = await response.json();

      setEmails((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, reply: data.reply } : e
        )
      );
    } catch (error) {
      console.error("Reply error:", error);
    }
  };

  return (
    <div>
      <h2>Inbox</h2>

      <button onClick={classifyEmails}>
        {loading ? "Classifying..." : "Run AI Classification"}
      </button>

      <div style={{ marginTop: "20px" }}>
        {emails.map((email) => (
          <EmailCard
            key={email.id}
            email={email}
            onGenerateReply={generateReply}  
          />
        ))}
      </div>
    </div>
  );
}

export default Inbox;