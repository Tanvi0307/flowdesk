import { useState } from "react";
import Sidebar from "./components/Sidebar";
import DailyBrief from "./components/DailyBrief";
import InboxPage from "./pages/InboxPage";
import CalendarPage from "./pages/CalendarPage";
import DrivePage from "./pages/DrivePage";
import SlackPage from "./pages/SlackPage";

function App() {
  const [activePage, setActivePage] = useState("inbox");

  const renderPage = () => {
    switch (activePage) {
      case "calendar":
        return <CalendarPage />;
      case "drive":
        return <DrivePage />;
      case "slack":
        return <SlackPage />;
      default:
        return <InboxPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex">

      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderPage()}
      </div>

      {/* Daily Brief (RIGHT PANEL) */}
      <DailyBrief />

    </div>
  );
}

export default App;