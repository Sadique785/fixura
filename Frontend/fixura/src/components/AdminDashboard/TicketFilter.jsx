// TicketFilter.jsx
const TicketFilter = ({ setFilters }) => {
    return (
      <div className="bg-gray-700 p-4 rounded-md shadow-md mb-6 flex gap-4">
        <select
          className="bg-gray-800 text-gray-100 border border-gray-600 p-2 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
  
        <select
          className="bg-gray-800 text-gray-100 border border-gray-600 p-2 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
  
        <input
          type="text"
          className="bg-gray-800 text-gray-100 border border-gray-600 p-2 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by User Email"
          onChange={(e) => setFilters((prev) => ({ ...prev, user: e.target.value }))}
        />
      </div>
    );
  };
  
  export default TicketFilter;