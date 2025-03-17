import { useState } from "react";

const TicketFilter = ({ setFilters }) => {
  // Local state to store filter values before applying them
  const [localFilters, setLocalFilters] = useState({
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
    <div className="flex gap-4 items-center">
      <select
        className="bg-[#0d1117] text-[#c9d1d9] border border-[#30363d] p-2 rounded-md w-1/2 focus:border-[#58a6ff] focus:outline-none"
        onChange={(e) => handleFilterChange("status", e.target.value)}
      >
        <option value="">All Status</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <select
        className="bg-[#0d1117] text-[#c9d1d9] border border-[#30363d] p-2 rounded-md w-1/2 focus:border-[#58a6ff] focus:outline-none"
        onChange={(e) => handleFilterChange("priority", e.target.value)}
      >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      
      <button
        onClick={applyFilters}
        className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md ml-2"
      >
        Apply
      </button>
    </div>
  );
};

export default TicketFilter;