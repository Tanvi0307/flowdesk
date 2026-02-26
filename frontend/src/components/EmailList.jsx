export default function EmailList({ emails, onSelect }) {
  return (
    <div className="border-r border-gray-700 w-1/2">
      {emails.map(email => (
        <div
          key={email.id}
          onClick={() => onSelect(email)}
          className="p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800"
        >
          <h3 className="font-semibold">{email.subject}</h3>
          <p className="text-sm text-gray-400">{email.preview}</p>
        </div>
      ))}
    </div>
  );
}