import { useEffect, useState } from "react";
import EmailModal from "../components/EmailModal";

export default function InboxPage() {

  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/emails")
      .then(res => res.json())
      .then(data => setEmails(data));
  }, []);

  const groupEmails = (priority) =>
    emails.filter(email => email.priority === priority);

  return (
    <div className="text-white">

      <h2 className="text-xl font-semibold mb-6">
        Inbox ({emails.length})
      </h2>

      {/* 🔴 Today */}
      <Section
        title="🔴 Today"
        emails={groupEmails("urgent")}
        onClick={setSelectedEmail}
      />

      {/* 🟡 Important */}
      <Section
        title="🟡 Important"
        emails={groupEmails("important")}
        onClick={setSelectedEmail}
      />

      {/* 🟢 Later */}
      <Section
        title="🟢 Later"
        emails={groupEmails("later")}
        onClick={setSelectedEmail}
      />

      {selectedEmail && (
        <EmailModal
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
        />
      )}
    </div>
  );
}

function Section({ title, emails, onClick }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3">{title}</h3>

      {emails.length === 0 && (
        <p className="text-gray-500 text-sm">No emails</p>
      )}

      {emails.map(email => (
        <div
          key={email.id}
          onClick={() => onClick(email)}
          className="p-3 bg-[#1a1a2e] rounded mb-2 cursor-pointer hover:bg-[#222244]"
        >
          <p className="font-semibold">{email.subject}</p>
          <p className="text-sm text-gray-400">{email.from}</p>
        </div>
      ))}
    </div>
  );
}