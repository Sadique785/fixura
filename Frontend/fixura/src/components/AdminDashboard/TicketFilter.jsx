import { useState } from "react";

const TicketFilter = ({ setFilters }) => {
  // Local state to store filter values before applying them
  const [localFilters, setLocalFilters] = useState({
    user: "",
    status: "",
    priority: ""
  });

  // Function to handle filter changes
  const handleFilterChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  // Function to apply filters when button is clicked
  const applyFilters = () => {
    setFilters(localFilters);
  };

  return (
    <div className="bg-gray-700 p-4 rounded-md shadow-md mb-6">
      {/* Search bar first */}
      <div className="mb-4">
        <input
          type="text"
          className="bg-gray-800 text-gray-100 border border-gray-600 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by User Email"
          value={localFilters.user}
          onChange={(e) => handleFilterChange("user", e.target.value)}
        />
      </div>
      
      {/* Filters and apply button */}
      <div className="flex gap-4 items-center">
        <select
          className="bg-gray-800 text-gray-100 border border-gray-600 p-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={localFilters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          className="bg-gray-800 text-gray-100 border border-gray-600 p-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={localFilters.priority}
          onChange={(e) => handleFilterChange("priority", e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        
        <button
          onClick={applyFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Apply 
        </button>
      </div>
    </div>
  );
};

export default TicketFilter;