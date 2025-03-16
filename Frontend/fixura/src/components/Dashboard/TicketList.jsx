import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";

const TicketList = ({ filters }) => {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: "Login authentication not working",
      status: "open",
      priority: "high",
      created_at: "2025-03-10T09:45:21Z",
      user: {
        name: "John Smith",
        email: "john.smith@example.com"
      }
    },
    {
      id: 2,
      title: "Dashboard UI elements not loading correctly",
      status: "in_progress",
      priority: "medium",
      created_at: "2025-03-14T16:30:00Z",
      user: {
        name: "Sarah Johnson",
        email: "sarah.j@example.com"
      }
    }
  ]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let query = `?status=${filters.status}&priority=${filters.priority}`;
        const response = await axios.get(`http://127.0.0.1:8000/tickets/${query}`);
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    // Comment out the API call for now to display dummy data
    // fetchTickets();
  }, [filters]);

  // Function to determine the status icon and color
  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <span className="inline-block w-4 h-4 rounded-full bg-[#238636] mr-2"></span>;
      case "in_progress":
        return <span className="inline-block w-4 h-4 rounded-full bg-[#9e6a03] mr-2"></span>;
      case "resolved":
        return <span className="inline-block w-4 h-4 rounded-full bg-[#8957e5] mr-2"></span>;
      case "closed":
        return <span className="inline-block w-4 h-4 rounded-full bg-[#8b949e] mr-2"></span>;
      default:
        return <span className="inline-block w-4 h-4 rounded-full bg-[#8b949e] mr-2"></span>;
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="divide-y divide-[#30363d]">
      {tickets.length === 0 ? (
        <div className="p-4 text-[#8b949e] text-center">
          No tickets found matching your criteria.
        </div>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket.id} className="p-4 hover:bg-[#1c2128] transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="pt-1">
                  {getStatusIcon(ticket.status)}
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 
                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                    className="font-medium text-white cursor-pointer">
                      {ticket.title}
                    </h3>
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-opacity-20 bg-[#58a6ff] text-[#58a6ff]">
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="text-xs text-[#8b949e] mt-1">
                    #{ticket.id} opened by {ticket.user.name} • {ticket.user.email}
                  </div>
                </div>
              </div>
              <div className="text-xs text-[#8b949e]">
                Created on {formatDate(ticket.created_at)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TicketList;