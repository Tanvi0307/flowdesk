import { useState } from "react";

export default function EmailModal({ email, onClose }) {

  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);

  const generateReply = async () => {
    setLoading(true);
    setAiReply("");

    try {
      const res = await fetch("http://localhost:8080/api/ai/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: email.from,
          subject: email.subject
        })
      });

      const data = await res.json();
      setAiReply(data.reply);

    } catch (err) {
      console.error(err);
      setAiReply("Failed to generate reply.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1a1a2e] w-[600px] p-6 rounded-xl shadow-lg text-white">

        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">{email.subject}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <p className="text-sm text-gray-400 mb-2">
          From: {email.from}
        </p>

        <p className="mb-4">{email.body}</p>

        <button
          onClick={generateReply}
          className="bg-purple-600 px-4 py-2 rounded"
        >
          ✨ Generate AI Reply
        </button>

        {loading && (
          <p className="text-sm mt-3">Generating reply...</p>
        )}

        {aiReply && (
  <div className="mt-4">
    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded">
      <p className="whitespace-pre-line text-sm">
        {aiReply}
      </p>
    </div>

    <button
      onClick={() => navigator.clipboard.writeText(aiReply)}
      className="mt-2 bg-purple-600 px-4 py-1 rounded"
    >
      Copy Reply
    </button>
  </div>
)}
      </div>
    </div>
  );
}