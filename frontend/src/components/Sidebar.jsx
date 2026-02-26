export default function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { id: "inbox", label: "📧 Inbox" },
    { id: "calendar", label: "📅 Calendar" },
    { id: "drive", label: "📁 Drive" },
    { id: "slack", label: "💬 Slack" },
  ];

  return (
    <div className="w-64 bg-[#1a1a2e] p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-purple-500 mb-8">
        FlowDesk
      </h1>

      {menuItems.map(item => (
        <button
          key={item.id}
          onClick={() => setActivePage(item.id)}
          className={`text-left px-4 py-3 rounded-lg mb-2 transition 
            ${activePage === item.id
              ? "bg-purple-600 text-white"
              : "text-gray-300 hover:bg-gray-700"}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}