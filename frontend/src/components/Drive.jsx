import React, { useState } from "react";
import driveData from "../data/driveData";

function Drive() {

  const [files, setFiles] = useState(driveData);

  const runClassification = async () => {

    const response = await fetch("http://localhost:8080/api/ai/classify-drive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: files })
    });

    const result = await response.json();

    const updatedFiles = files.map(file => {
      const match = result.find(r => r.id === file.id);
      return match ? { ...file, ...match } : file;
    });

    setFiles(updatedFiles);
  };

  return (
    <div>
      <h2>Drive</h2>

      <button onClick={runClassification}>
        Run AI Classification
      </button>

      {files.map(file => (
        <div key={file.id} style={{border:"1px solid gray", padding:"10px", margin:"10px"}}>
          <h3>{file.name}</h3>
          <p>{file.content}</p>
          <p><strong>Priority:</strong> {file.priority}</p>
          
          
        </div>
      ))}
    </div>
  );
}

export default Drive;