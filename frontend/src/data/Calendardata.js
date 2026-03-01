// calendarData.js — mirrors inboxData.js pattern
// Each event has an id, content field (used for AI classification), and metadata

const calendarData = [
  {
    id: "cal-1",
    title: "Daily Standup",
    time: "10:00 AM",
    duration: "15 min",
    tag: "Team",
    attendees: 8,
    content: "Quick team sync on blockers and daily goals. Recurring standup meeting with the full engineering team.",
  },
  {
    id: "cal-2",
    title: "Design Review — v2.4",
    time: "11:30 AM",
    duration: "60 min",
    tag: "Product",
    attendees: 5,
    content: "Review updated Figma designs for v2.4 release before dev handoff. Critical milestone before sprint deadline.",
  },
  {
    id: "cal-3",
    title: "1:1 — Sarah Chen",
    time: "2:00 PM",
    duration: "30 min",
    tag: "1:1",
    attendees: 2,
    content: "Weekly check-in with Sarah on OKR progress and blockers. Important for performance review cycle.",
  },
  {
    id: "cal-4",
    title: "Investor Update Call",
    time: "4:00 PM",
    duration: "60 min",
    tag: "External",
    attendees: 4,
    content: "Quarterly update to investors — Q3 metrics and roadmap preview. Executive presence required, critical external meeting.",
  },
];

export default calendarData;