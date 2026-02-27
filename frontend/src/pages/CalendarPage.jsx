import { useEffect, useState } from "react";

export default function CalendarPage() {

  const [meetings, setMeetings] = useState([]);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/calendar")
      .then(res => res.json())
      .then(data => setMeetings(data));

    fetch("http://localhost:8080/api/emails")
      .then(res => res.json())
      .then(data => setEmails(data));
  }, []);

  const urgentEmails = emails.filter(e => e.priority === "urgent");
  const importantEmails = emails.filter(e => e.priority === "important");

  return (
    <div className="text-white">

      <h2 className="text-xl font-semibold mb-6">
        Calendar
      </h2>

      <h3 className="mb-3">📅 Meetings</h3>
      {meetings.map((m, i) => (
        <div key={i} className="mb-2">
          {m.time} - {m.title}
        </div>
      ))}

      <h3 className="mt-6 mb-3 text-red-400">🔴 Today Reminders</h3>
      {urgentEmails.map(e => (
        <div key={e.id} className="mb-2">
          {e.subject}
        </div>
      ))}

      <h3 className="mt-6 mb-3 text-yellow-400">🟡 Tomorrow</h3>
      {importantEmails.map(e => (
        <div key={e.id} className="mb-2">
          {e.subject}
        </div>
      ))}
    </div>
  );
}