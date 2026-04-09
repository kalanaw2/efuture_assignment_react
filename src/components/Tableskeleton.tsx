export default function TableSkeleton() {
  return (
    <div>
      {/* Search bar skeleton */}
      <div className="skeleton h-11 w-full mb-5 rounded-[10px]" />

      {/* Table skeleton */}
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border)",
          }}
          className="grid grid-cols-[2.5rem_1fr_1fr_1fr_1fr] px-4 py-3 gap-4"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-3 rounded" style={{ opacity: i === 0 ? 0 : 1 }} />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 8 }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid grid-cols-[2.5rem_1fr_1fr_1fr_1fr] px-4 py-4 gap-4"
            style={{ borderBottom: rowIdx < 7 ? "1px solid var(--border)" : "none" }}
          >
            <div className="skeleton h-4 w-4 rounded-full mx-auto" />
            <div className="flex items-center gap-2">
              <div className="skeleton h-7 w-7 rounded-full flex-shrink-0" />
              <div className="skeleton h-3 rounded flex-1" />
            </div>
            <div className="skeleton h-3 rounded w-3/4" />
            <div className="skeleton h-3 rounded w-2/3" />
            <div className="skeleton h-3 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}