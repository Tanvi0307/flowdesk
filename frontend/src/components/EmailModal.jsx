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
      console.error("AI reply error:", err);
      setAiReply("Failed to generate reply.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1a1a2e] w-[600px] p-6 rounded-xl shadow-lg text-white">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{email.subject}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Email Content */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">
            From: {email.from}
          </p>
          <p className="text-sm">{email.body}</p>
        </div>

        {/* AI Section */}
        <div className="border-t border-[#2a2a3e] pt-4">
          <button
            onClick={generateReply}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm transition"
          >
            ✨ Generate AI Reply
          </button>

          {loading && (
            <p className="text-sm text-gray-400 mt-3 animate-pulse">
              Generating reply...
            </p>
          )}

          {aiReply && (
            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-sm whitespace-pre-line">
                {aiReply}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}