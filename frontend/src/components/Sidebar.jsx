export default function Sidebar({ activePage, onNavigate }) {

  const navItem = (key, label) => (
    <button
      onClick={() => onNavigate(key)}
      className={`px-4 py-2 rounded ${
        activePage === key
          ? "bg-purple-600"
          : "bg-[#1a1a2e]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-60 bg-[#1a1a2e] p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-purple-400">
        FlowDesk
      </h1>

      {navItem("inbox", "📧 Inbox")}
      {navItem("calendar", "📅 Calendar")}
      {navItem("drive", "📁 Drive")}
      {navItem("slack", "💬 Slack")}
    </div>
  );
}