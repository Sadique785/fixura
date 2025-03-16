import { useEffect, useState } from "react";
import axios from "axios";
import TicketDescriptionModal from "./TicketDescriptionModal"; // Import new modal


const TicketTable = ({ filters, setSelectedTicket }) => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: "Cannot access dashboard",
      description:'Hey this description of id 1',
      user_email: "jane.doe@example.com",
      status: "in_progress",
      priority: "high",
    },
    {
      id: 2,
      title: "Bug in payment gateway",
      description:'Hey this description of id 2',
      user_email: "john.smith@example.com",
      status: "open",
      priority: "medium",
    },
  ]);

  const [clickedTicket, setClickedTicket] = useState(null); 


  // Commented out backend call for now (Uncomment when API is ready)
  // useEffect(() => {
  //   const fetchTickets = async () => {
  //     try {
  //       let query = `?status=${filters.status}&priority=${filters.priority}&user=${filters.user}`;
  //       const response = await axios.get(`http://127.0.0.1:8000/tickets/${query}`);
  //       setTickets(response.data);
  //     } catch (error) {
  //       console.error("Error fetching tickets:", error);
  //     }
  //   };
  //   fetchTickets();
  // }, [filters]);

  return (
    <div className="bg-gray-700 p-6 rounded-md shadow-md">
      {tickets.length === 0 ? (
        <p className="text-gray-300">No tickets found.</p>
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
            {tickets.map((ticket) => (
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
