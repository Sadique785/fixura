import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaUserCircle, FaComment } from "react-icons/fa";
import Header from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import TicketEditModal from "../components/Dashboard/TicketEditModal";
import { gradients } from "../styles/gradient";

const TicketDetail = () => {
  const { id } = useParams();
  const [showEditModal, setShowEditModal] = useState(false);

  // State for ticket data
  const [ticket, setTicket] = useState({
    id: id || "101",
    title: "Login Issue - Cannot Reset Password",
    status: "in_progress",
    priority: "medium",
    user_email: "john.doe@example.com",
    created_at: "2025-03-14T10:00:00Z",
    updated_at: "2025-03-15T12:30:00Z",
    description: "I am unable to reset my password. Every time I try, it gives an 'Invalid Token' error.",
  });

  // Single activity for simplicity
  const [activity, setActivity] = useState({
    type: "comment",
    user: "support.agent@example.com",
    timestamp: "2025-03-14T14:35:00Z",
    content: "I'm looking into this issue. Could you please confirm which browser and device you're using when attempting the password reset?"
  });

  // Function to handle ticket updates
  const handleTicketUpdate = (updatedTicket) => {
    setTicket(prev => ({
      ...prev,
      ...updatedTicket,
      updated_at: new Date().toISOString()
    }));

    // Update the activity to reflect the change
    setActivity({
      type: "update",
      user: "support.agent@example.com", // Would be the logged-in user in a real app
      timestamp: new Date().toISOString(),
      content: `updated the ticket (status: ${updatedTicket.status}, priority: ${updatedTicket.priority})`
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "open": return "bg-[#238636]";
      case "in_progress": return "bg-[#db6d28]";
      case "resolved": return "bg-[#388bfd]";
      case "closed": return "bg-[#8b949e]";
      default: return "bg-[#8b949e]";
    }
  };

  return (
    <div 
      className="flex flex-col min-h-screen text-[#c9d1d9]"
      style={{ background: gradients.mainGradient }}
    >
      <Header isLogged={true} />

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="container mx-auto max-w-4xl">
          {/* Ticket Header */}
          <div className="bg-[#161b22] bg-opacity-70 border border-[#30363d] rounded-md p-6 mb-6 shadow">
            {/* Title and ID */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-white">
                {ticket.title} <span className="text-[#8b949e] text-2xl">#{ticket.id}</span>
              </h1>
              <button 
                className="bg-[#238636] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#2ea043] transition-colors"
                onClick={() => setShowEditModal(true)}
              >
                <FaEdit /> Edit
              </button>
            </div>

            {/* Status & Priority Badges */}
            <div className="flex gap-2 mb-4">
              <div className={`inline-block px-4 py-1 text-white rounded-md text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ').toUpperCase()}
              </div>
              <div className={`inline-block px-4 py-1 text-white rounded-md text-sm font-medium
                ${ticket.priority === "high" ? "bg-[#f85149]" : 
                  ticket.priority === "medium" ? "bg-[#db6d28]" : "bg-[#8b949e]"}`}>
                PRIORITY: {ticket.priority.toUpperCase()}
              </div>
            </div>

            {/* Separator */}
            <hr className="border-t border-[#30363d] my-4" />

            {/* User Info & Description */}
            <div className="flex gap-4 items-start">
              <FaUserCircle className="text-[#8b949e] text-5xl" />
              <div className="border border-[#30363d] p-4 rounded-md flex-1 bg-[#0d1117] bg-opacity-60">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-white">{ticket.user_email}</span>
                  <span className="text-sm text-[#8b949e]">
                    Last updated: {new Date(ticket.updated_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-[#c9d1d9]">{ticket.description}</p>
              </div>
            </div>
          </div>

          {/* Activity Section - Simplified to just one activity */}
          <div className="bg-[#161b22] bg-opacity-70 border border-[#30363d] rounded-md p-6 shadow">
            <h3 className="text-lg font-semibold mb-4 text-white">Latest Activity</h3>
            
            <div className="flex items-start gap-3">
              {/* Activity Icon */}
              <div className="mt-1">
                <span className={`p-1 rounded-full ${activity.type === "update" ? "bg-[#388bfd]" : "bg-[#6e7681]"}`}>
                  {activity.type === "update" ? 
                    <FaEdit className="text-white text-sm" /> : 
                    <FaComment className="text-white text-sm" />}
                </span>
              </div>
              
              {/* Activity Content */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-x-2 text-sm">
                  <span className="font-medium text-white">{activity.user}</span>
                  <span className="text-[#8b949e]">{activity.content}</span>
                  <span className="text-[#8b949e]">{new Date(activity.timestamp).toLocaleString()}</span>
                </div>
                
                {activity.type === "comment" && (
                  <div className="mt-2 p-3 border border-[#30363d] rounded-md bg-[#0d1117] bg-opacity-60 text-[#c9d1d9]">
                    {activity.content}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer className="bg-[#161b22] bg-opacity-70 border-t border-[#30363d]" />

      {/* Edit Modal */}
      <TicketEditModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        ticket={ticket}
        onTicketUpdate={handleTicketUpdate}
      />
    </div>
  );
};

export default TicketDetail;