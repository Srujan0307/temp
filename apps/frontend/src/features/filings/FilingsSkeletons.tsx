export function FilingsSkeletons() {
  return (
    <div className="grid grid-cols-7 gap-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="bg-gray-100 p-4 rounded-lg">
          <div className="bg-gray-200 h-6 w-1/2 mb-4 rounded-lg" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="bg-gray-200 h-4 w-3/4 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
