const TicketFilter = ({ setFilters }) => {
    return (
      <div className="flex gap-4 ">
        <select
          className="bg-[#0d1117] text-[#c9d1d9] border border-[#30363d] p-2  rounded-md w-1/2 focus:border-[#58a6ff] focus:outline-none"
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
  
        <select
          className="bg-[#0d1117] text-[#c9d1d9] border border-[#30363d] p-2 rounded-md w-1/2 focus:border-[#58a6ff] focus:outline-none"
          onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    );
  };
  
  export default TicketFilter;