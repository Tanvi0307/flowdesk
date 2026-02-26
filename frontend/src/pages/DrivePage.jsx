import { useEffect, useState } from "react";

export default function DrivePage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/files")
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(err => console.error("Error fetching files:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Drive Files</h2>

      {files.map(file => (
        <div key={file.id} className="mb-4 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-semibold">{file.name}</h3>
          <p className="text-sm text-gray-400">
            Size: {file.size}
          </p>
          <p className="text-sm text-gray-400">
            Last edited by: {file.editedBy}
          </p>
          <p className="text-sm text-gray-400">
            Comments: {file.comments}
          </p>
        </div>
      ))}
    </div>
  );
}