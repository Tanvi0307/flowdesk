import { useEffect, useState } from "react";
import EmailModal from "../components/EmailModal";

export default function InboxPage() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/emails")
      .then(res => res.json())
      .then(data => setEmails(data))
      .catch(err => console.error("Email fetch error:", err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Inbox ({emails.length})
      </h2>

      <div className="space-y-3">
        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => setSelectedEmail(email)}
            className={`p-4 rounded-lg border cursor-pointer transition hover:bg-[#1a1a2e]
              ${email.urgent ? "border-red-500" : "border-[#2a2a3e]"}`}
          >
            <p className="font-semibold">{email.subject}</p>
            <p className="text-sm text-gray-400">
              {email.from}
            </p>
            <p className="text-xs text-gray-500">
              {email.time}
            </p>
          </div>
        ))}
      </div>

      {selectedEmail && (
        <EmailModal
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
        />
      )}
    </div>
  );
}