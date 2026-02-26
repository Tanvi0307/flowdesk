import { useEffect, useState } from "react";

export default function EmailView({ email }) {
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (!email) return;

    fetch("http://localhost:8080/api/ai/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: email.from,
        subject: email.subject
      })
    })
      .then(res => res.json())
      .then(data => setReply(data.reply))
      .catch(err => console.error("AI error:", err));
  }, [email]);

  if (!email) {
    return (
      <div className="flex-1 p-6 text-gray-400">
        Select an email to view
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold mb-2">{email.subject}</h2>
      <p className="text-sm text-gray-400 mb-4">
        From: {email.from}
      </p>

      <p className="mb-6">{email.body}</p>

      <div className="mt-6 p-4 border border-purple-500 rounded-lg bg-purple-500/10">
        <h3 className="text-purple-400 font-semibold mb-2">
          ✨ AI Suggested Reply
        </h3>
        <pre className="text-sm whitespace-pre-wrap">
          {reply || "Generating reply..."}
        </pre>
      </div>
    </div>
  );
}