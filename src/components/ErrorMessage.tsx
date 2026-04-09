interface ErrorMessageProps {
  message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-center animate-fade-in"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ background: "rgba(239,68,68,0.1)" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
        Something went wrong
      </p>
      <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
        {message}
      </p>
      
    </div>
  );
}