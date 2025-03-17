import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import TicketDescriptionModal from "./TicketDescriptionModal";

const TicketTable = ({ filters, setSelectedTicket, refreshTrigger }) => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickedTicket, setClickedTicket] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("tickets/admin/list/");
        setTickets(response.data);
        setFilteredTickets(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, [shouldRefresh, refreshTrigger]); 

  useEffect(() => {
    if (!filters || (!filters.status && !filters.priority && !filters.user)) {
      setFilteredTickets(tickets);
      return;
    }
  
    const filtered = tickets.filter(ticket => {
      const statusMatch = !filters.status || ticket.status === filters.status;
      
      const priorityMatch = !filters.priority || ticket.priority === filters.priority;
      
      const userMatch = !filters.user || 
        ticket.user_email.toLowerCase().includes(filters.user.toLowerCase());
      
      return statusMatch && priorityMatch && userMatch;
    });
  
    setFilteredTickets(filtered);
  }, [filters, tickets]);

  const handleRefresh = () => {
    setShouldRefresh(prev => !prev);
  };

  return (
    <div className="bg-gray-700 p-6 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-200 text-xl">Tickets</h2>
        <button 
          onClick={handleRefresh}
          className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-md transition duration-200"
          title="Refresh tickets"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
        </button>
      </div>
      
      {loading ? (
        <p className="text-gray-300">Loading tickets...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : filteredTickets.length === 0 ? (
        <p className="text-gray-300">No tickets found matching your criteria.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-600">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-600 p-2 text-gray-200">Title</th>
              <th className="border border-gray-600 p-2 text-gray-200">User</th>
              <th className="border border-gray-600 p-2 text-gray-200">Status</th>
              <th className="border border-gray-600 p-2 text-gray-200">Priority</th>
              <th className="border border-gray-600 p-2 text-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="text-center text-gray-100">
                <td 
                  className="border border-gray-600 p-2 cursor-pointer hover:underline text-blue-300" 
                  onClick={() => setClickedTicket(ticket)}
                >
                  {ticket.title}
                </td>
                
                <td className="border border-gray-600 p-2">{ticket.user_email}</td>
                <td className="border border-gray-600 p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      ticket.status === "open"
                        ? "bg-blue-600"
                        : ticket.status === "in_progress"
                        ? "bg-yellow-600"
                        : ticket.status === "resolved"
                        ? "bg-green-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="border border-gray-600 p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      ticket.priority === "high"
                        ? "bg-red-600"
                        : ticket.priority === "medium"
                        ? "bg-yellow-600"
                        : "bg-green-600"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </td>
                <td className="border border-gray-600 p-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition duration-200"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <TicketDescriptionModal ticket={clickedTicket} onClose={() => setClickedTicket(null)} />
    </div>
  );
};

export default TicketTable;