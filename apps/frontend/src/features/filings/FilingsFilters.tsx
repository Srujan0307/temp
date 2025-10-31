export function FilingsFilters() {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-300 rounded-lg px-4 py-2"
      />
      <select className="border border-gray-300 rounded-lg px-4 py-2">
        <option>Client</option>
      </select>
      <select className="border border-gray-300 rounded-lg px-4 py-2">
        <option>Vehicle</option>
      </select>
      <select className="border border-gray-300 rounded-lg px-4 py-2">
        <option>Assignee</option>
      </select>
      <select className="border border-gray-300 rounded-lg px-4 py-2">
        <option>SLA</option>
      </select>
    </div>
  );
}
