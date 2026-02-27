import { useEffect, useState } from "react";

export default function DailyBrief() {

  const today = new Date().toDateString();

  const [brief, setBrief] = useState({
    urgent: [],
    important: [],
    later: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchBrief = () => {
    setLoading(true);
    setError(false);

    fetch("http://localhost:8080/api/ai/daily-brief")
      .then(res => res.json())
      .then(data => {
        setBrief(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Daily brief error:", err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBrief();
  }, []);

  const Section = ({ title, color, items }) => (
    <div className="mb-6">
      <h3 className={`font-semibold mb-3 ${color}`}>
        {title}
      </h3>

      {items.length === 0 && (
        <p className="text-gray-500 text-sm">No items</p>
      )}

      {items.map((item, index) => (
        <div
          key={index}
          className="p-2 bg-[#0f0f1a] rounded mb-2 text-sm"
        >
          {item}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-80 bg-[#1a1a2e] p-6 flex flex-col text-white">

      <h2 className="text-xl font-bold mb-1">
        Daily Focus
      </h2>

      <button
        onClick={fetchBrief}
        className="mb-4 bg-purple-600 px-3 py-1 rounded text-sm"
      >
        Refresh
      </button>

      <p className="text-gray-400 text-sm mb-6">
        {today}
      </p>

      {loading && (
        <p className="text-gray-400 text-sm">
          Generating AI brief...
        </p>
      )}

      {error && (
        <p className="text-red-400 text-sm">
          Failed to load AI ranking
        </p>
      )}

      {!loading && !error && (
        <>
          <Section
            title="🔴 Urgent"
            color="text-red-400"
            items={brief.urgent}
          />

          <Section
            title="🟡 Important"
            color="text-yellow-400"
            items={brief.important}
          />

          <Section
            title="🟢 Later"
            color="text-green-400"
            items={brief.later}
          />
        </>
      )}

      <div className="mt-auto pt-4 border-t border-gray-700 text-sm text-gray-400">
        LLM-powered intelligent ranking
      </div>

    </div>
  );
}