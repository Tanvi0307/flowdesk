import React from "react";

function Sidebar({ setView }) {
  return (
    <div style={{ width: 200, background: "#f4f4f4", padding: 20 }}>
      <h3>FlowDesk</h3>
      <button onClick={() => setView("inbox")}>Inbox</button><br /><br />
      <button onClick={() => setView("slack")}>Slack</button><br /><br />
      <button onClick={() => setView("drive")}>Drive</button><br /><br />
      <button onClick={() => setView("calendar")}>Calendar</button>
    </div>
  );
}

export default Sidebar;