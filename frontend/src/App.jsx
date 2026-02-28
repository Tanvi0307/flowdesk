import React, { useState } from "react";
import Inbox from "./components/Inbox";
import Drive from "./components/Drive";
import Slack from "./components/Slack";
import DailyBrief from "./components/DailyBrief";

function App() {

  const [activeTab, setActiveTab] = useState("inbox");

  // 🔥 GLOBAL classified data
  const [allClassifiedData, setAllClassifiedData] = useState([]);

  return (
    <div style={{ display: "flex" }}>

      <div style={{ width: "150px", padding: "10px" }}>
        <h3>FlowDesk</h3>

        <button onClick={() => setActiveTab("inbox")}>Inbox</button><br/><br/>
        <button onClick={() => setActiveTab("drive")}>Drive</button><br/><br/>
        <button onClick={() => setActiveTab("slack")}>Slack</button><br/><br/>
        <button onClick={() => setActiveTab("dailybrief")}>Daily Brief</button>
      </div>

      <div style={{ flex: 1, padding: "20px" }}>

        {activeTab === "inbox" && 
          <Inbox setAllClassifiedData={setAllClassifiedData} />
        }

        {activeTab === "drive" && 
          <Drive setAllClassifiedData={setAllClassifiedData} />
        }

        {activeTab === "slack" && 
          <Slack setAllClassifiedData={setAllClassifiedData} />
        }

        {activeTab === "dailybrief" && 
          <DailyBrief allClassifiedData={allClassifiedData} />
        }

      </div>
    </div>
  );
}

export default App;