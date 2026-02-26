import { useEffect, useState } from "react";

export default function DailyBrief() {
  const today = new Date().toDateString();

  const [brief, setBrief] = useState({
    urgent: [],
    important: [],
    later: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBrief = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/ai/daily-brief");
      const data = await res.json();

      if (!data.ai_raw_output) {
        throw new Error("Invalid AI response");
      }

      // Try strict JSON parsing
      let parsed;
      try {
        parsed = JSON.parse(data.ai_raw_output);
      } catch {
        // If LLM adds extra text, extract JSON manually
        const jsonMatch = data.ai_raw_output.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not parse AI JSON");
        }
      }

      setBrief({
        urgent: parsed.urgent || [],
        important: parsed.important || [],
        later: parsed.later || [],
      });

    } catch (err) {
      console.error("Daily brief error:", err);
      setError("AI ranking failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, []);

  const renderSection = (title, styles, items) => (
    <div className="mb-6">
      <h3 className={`font-semibold mb-3 ${styles.title}`}>
        {title}
      </h3>

      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className={`${styles.card} p-3 rounded-lg hover:opacity-90 cursor-pointer transition`}
            >
              <p className="text-sm font-medium leading-snug">
                {item}
              </p>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500">No items</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-[#1a1a2e] p-6 flex flex-col text-white border-l border-[#2a2a3e]">

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Daily Focus</h2>
        <button
          onClick={fetchBrief}
          className="text-xs text-purple-400 hover:text-purple-300"
        >
          Refresh
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-6">{today}</p>

      {loading && (
        <p className="text-gray-400 text-sm animate-pulse">
          Generating AI brief...
        </p>
      )}

      {error && (
        <p className="text-red-400 text-sm mb-4">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {renderSection("🔴 Urgent", {
            title: "text-red-400",
            card: "bg-red-500/10 border border-red-500/30"
          }, brief.urgent)}

          {renderSection("🟡 Important", {
            title: "text-yellow-400",
            card: "bg-yellow-500/10 border border-yellow-500/30"
          }, brief.important)}

          {renderSection("🟢 Later", {
            title: "text-green-400",
            card: "bg-green-500/10 border border-green-500/30"
          }, brief.later)}
        </>
      )}

      <div className="mt-auto pt-4 border-t border-gray-700 text-xs text-gray-400">
        LLM-powered intelligent ranking
      </div>

    </div>
  );
}