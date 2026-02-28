import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Inbox from "./components/Inbox";

function App() {
  const [view, setView] = useState("inbox");

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setView={setView} />

      <div style={{ flex: 1 }}>
        {view === "inbox" && <Inbox />}
      </div>
    </div>
  );
}

export default App;