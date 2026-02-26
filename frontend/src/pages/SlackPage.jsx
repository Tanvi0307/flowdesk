import { useEffect, useState } from "react";

export default function SlackPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/messages")
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("Error fetching messages:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Slack Messages</h2>

      {messages.map(msg => (
        <div
          key={msg.id}
          className={`mb-4 p-4 rounded-lg ${
            msg.unread ? "bg-purple-800" : "bg-gray-800"
          }`}
        >
          <p className="text-xs text-gray-400">{msg.channel}</p>
          <h3 className="font-semibold">{msg.sender}</h3>
          <p className="text-sm text-gray-300">{msg.preview}</p>
          <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
        </div>
      ))}
    </div>
  );
}