import React, { useState } from "react";
import Inbox from "./components/Inbox";
import Drive from "./components/Drive";
import Slack from "./components/Slack"; 
import DailyBrief from "./components/DailyBrief";



function App() {

  const [activeTab, setActiveTab] = useState("inbox");

  return (
    <div style={{ display: "flex" }}>

      {/* Sidebar */}
      <div style={{ width: "150px", padding: "10px" }}>
        <h3>FlowDesk</h3>

        <button onClick={() => setActiveTab("inbox")}>Inbox</button><br/><br/>
        <button onClick={() => setActiveTab("drive")}>Drive</button><br/><br/>
        <button onClick={() => setActiveTab("slack")}>Slack</button><br/><br/>
        <button onClick={() => setActiveTab("brief")}>Daily Brief</button><br/><br/>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px" }}>

        {activeTab === "inbox" && <Inbox />}
        {activeTab === "drive" && <Drive />}
        {activeTab === "slack" && <Slack />}
        {activeTab === "brief" && <DailyBrief />}

      </div>

    </div>
  );
}

export default App;