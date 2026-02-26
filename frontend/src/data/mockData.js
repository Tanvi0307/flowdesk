// ---------------- EMAILS ----------------
export const emails = [
  {
    id: 1,
    from: "Prof. Sharma",
    subject: "Urgent: Project Deadline",
    preview: "Please submit the final draft by tonight.",
    body: "Reminder: Submit project before 11:59 PM.",
    time: "9:10 AM",
    urgent: true,
  },
  {
    id: 2,
    from: "Placement Cell",
    subject: "Interview Shortlist",
    preview: "You have been shortlisted...",
    body: "Congratulations! You are shortlisted.",
    time: "8:40 AM",
    urgent: true,
  },
  {
    id: 3,
    from: "Rahul",
    subject: "Backend Update",
    preview: "I pushed the latest code.",
    body: "Backend API changes are complete.",
    time: "Yesterday",
    urgent: false,
  },
];

// ---------------- MEETINGS ----------------
export const meetings = [
  {
    id: 1,
    title: "Project Review",
    time: "11:00 AM",
    duration: "1 hour",
    attendees: ["Prof. Sharma", "Rahul"],
  },
  {
    id: 2,
    title: "Placement Prep",
    time: "2:00 PM",
    duration: "45 mins",
    attendees: ["Placement Cell"],
  },
  {
    id: 3,
    title: "Office Hours",
    time: "4:30 PM",
    duration: "30 mins",
    attendees: ["Prof. Sharma"],
  },
];

// ---------------- FILES ----------------
export const files = [
  {
    id: 1,
    name: "Group Project Report.pdf",
    size: "2.4 MB",
    editedBy: "Tanvi",
  },
  {
    id: 2,
    name: "Placement Notes.docx",
    size: "1.1 MB",
    editedBy: "Rahul",
  },
  {
    id: 3,
    name: "Lab Report.xlsx",
    size: "850 KB",
    editedBy: "Tanvi",
  },
];

// ---------------- SLACK ----------------
export const slackMessages = [
  {
    id: 1,
    sender: "Priya",
    preview: "Need urgent fix!",
  },
  {
    id: 2,
    sender: "Placements Admin",
    preview: "Interview slot update.",
  },
  {
    id: 3,
    sender: "Arjun",
    preview: "Team lunch today?",
  },
];