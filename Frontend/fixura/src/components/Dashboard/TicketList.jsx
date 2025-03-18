import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../axios/axiosInstance";

const TicketList = ({ filters, tickets, setTickets, shouldRefresh }) => {
  const navigate = useNavigate();
  const [originalTickets, setOriginalTickets] = useState([]);




  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get(`/tickets/list/`);
        
        // Initial dummy data
        const initialData = [];
        
        let allTickets = initialData;
        if (response.data && Array.isArray(response.data)) {
          allTickets = [...initialData, ...response.data];
        }
        
        setOriginalTickets(allTickets);
        setTickets(allTickets); // Initially, filtered tickets is same as original
      } catch (error) {
        // Set dummy data if API call fails
        const dummyData = [
          // Your dummy data here
        ];
        setOriginalTickets(dummyData);
        setTickets(dummyData);
      }
    };

    fetchTickets();
  }, [shouldRefresh]);

  useEffect(() => {

    
    if (!filters || (!filters.status && !filters.priority)) {
      setTickets(originalTickets);
      return;
    }
  
    // Filter the tickets based on the provided filters
    const filteredTickets = originalTickets.filter(ticket => {
      // Check if ticket matches status filter
      const statusMatch = !filters.status || ticket.status === filters.status;
      // Check if ticket matches priority filter
      const priorityMatch = !filters.priority || ticket.priority === filters.priority;

      
      // Return true if both conditions are met
      return statusMatch && priorityMatch;
    });
  
    setTickets(filteredTickets);
  }, [filters, originalTickets]);


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

  // Function to extract username from email
  const getUserNameFromEmail = (email) => {
    if (!email) return "Unknown User";
    return email.split('@')[0].replace('.', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
                      className="font-medium text-white cursor-pointer hover:text-[#58a6ff]">
                      {ticket.title}
                    </h3>
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-opacity-20 bg-[#58a6ff] text-[#58a6ff]">
                      {ticket.priority}
                    </span>
                    {ticket.type && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-opacity-20 bg-[#f78166] text-[#f78166]">
                        {ticket.type}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#8b949e] mt-1">
                    #{ticket.id} opened by {getUserNameFromEmail(ticket.user_email)} • {ticket.user_email}
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