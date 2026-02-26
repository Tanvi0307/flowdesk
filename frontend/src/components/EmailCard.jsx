export default function EmailCard({ email, onClick }) {
  return (
    <div
      onClick={() => onClick(email)}
      className={`p-4 rounded-lg mb-3 cursor-pointer transition-all hover:shadow-lg 
      ${email.urgent ? "border-l-4 border-red-500 bg-[#1a1a2e]" : "border-l-4 border-gray-600 bg-[#1a1a2e]"}`}
    >
      <div className="flex justify-between">
        <h3 className="font-semibold">{email.from}</h3>
        <span className="text-xs text-gray-400">{email.time}</span>
      </div>

      <p className="text-sm font-medium mt-1">{email.subject}</p>
      <p className="text-sm text-gray-400 mt-1">{email.preview}</p>
    </div>
  );
}