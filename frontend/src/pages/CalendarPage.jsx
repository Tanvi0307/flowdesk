import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/meetings")
      .then(res => res.json())
      .then(data => setMeetings(data))
      .catch(err => console.error("Error fetching meetings:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>

      {meetings.map(meeting => (
        <div key={meeting.id} className="mb-4 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-semibold">{meeting.title}</h3>
          <p className="text-sm text-gray-400">
            {meeting.time} • {meeting.duration}
          </p>
          <div className="mt-2 text-xs text-gray-500">
            Attendees: {meeting.attendees.join(", ")}
          </div>
        </div>
      ))}
    </div>
  );
}