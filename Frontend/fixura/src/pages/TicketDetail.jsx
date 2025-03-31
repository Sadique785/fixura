import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaUserCircle, FaComment, FaHistory, FaTrash } from "react-icons/fa";
import Header from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import { gradients } from "../styles/gradient";
import axiosInstance from "../axios/axiosInstance";
import TicketDetailShimmer from "../components/Shimmers/TicketDetailShimmer";
import TicketEditModal from "../components/Dashboard/TicketEditModal";
import DeleteConfirmationModal from "../components/Dashboard/DeleteConfirmationModal";




const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/tickets/${id}`);
        console.log(response);
        setTicket(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching ticket data:", err);
        setError("Failed to load ticket data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicketData();
    }
  }, [id]);

  const handleTicketUpdate = async (updatedTicket) => {
    try {
      // The API call is now handled in TicketEditModal
      // Just update the state with the returned data
      setTicket(updatedTicket);
    } catch (err) {
      console.error("Error updating ticket:", err);
    }
  };

  const handleDeleteTicket = async () => {
    try {
      setIsDeleting(true);
      const response = await axiosInstance.delete(`/tickets/delete/${id}/`);
      
      if (response.status === 200 || response.status === 204) {
        navigate('/dashboard');
      } else {
        setError("Failed to delete ticket. Please try again later.");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error("Error deleting ticket:", err);
      setError("Failed to delete ticket. Please try again later.");
      setIsDeleting(false);
    } finally {
      setShowDeleteModal(false);
    }
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

  // Function to determine icon for activity type
  const getActivityIcon = (action) => {
    if (action.toLowerCase().includes("created")) {
      return <FaHistory className="text-white text-sm" />;
    } else if (action.toLowerCase().includes("updated") || action.toLowerCase().includes("changed")) {
      return <FaEdit className="text-white text-sm" />;
    } else {
      return <FaComment className="text-white text-sm" />;
    }
  };

  // Function to determine background color for activity icon
  const getActivityIconBg = (action) => {
    if (action.toLowerCase().includes("created")) {
      return "bg-[#238636]";
    } else if (action.toLowerCase().includes("updated") || action.toLowerCase().includes("changed")) {
      return "bg-[#388bfd]";
    } else {
      return "bg-[#6e7681]";
    }
  };


  

  if (error) {
    return (
      <div className="flex flex-col min-h-screen text-[#c9d1d9]" style={{ background: gradients.mainGradient }}>
        <Header isLogged={true} />
        <main className="flex-grow p-6 flex items-center justify-center">
          <div className="text-xl text-red-500">{error || "Ticket not found"}</div>
        </main>
        <Footer className="bg-[#161b22] bg-opacity-70 border-t border-[#30363d]" />
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col min-h-screen text-[#c9d1d9]"
      style={{ background: gradients.mainGradient }}
    >
      <Header isLogged={true} />
      {loading ? (
        <TicketDetailShimmer/>
      )
      
      : (
              <main className="flex-grow p-6">
              <div className="container mx-auto max-w-4xl">
                {/* Ticket Header */}
                <div className="bg-[#161b22] bg-opacity-70 border border-[#30363d] rounded-md p-6 mb-6 shadow">
                  {/* Title and ID */}
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-white">
                      {ticket.title} <span className="text-[#8b949e] text-2xl">#{ticket.id}</span>
                    </h1>
                    <div className="flex gap-2">
                    <button 
                      className="bg-[#f85149] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#ff6b63] transition-colors"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <FaTrash /> Delete
                    </button>
      
      
                      <button 
                        className="bg-[#238636] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#2ea043] transition-colors"
                        onClick={() => setShowEditModal(true)}
                      >
                        <FaEdit /> Edit
                      </button>
                    </div>
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
                    {ticket.type && (
                      <div className="inline-block px-4 py-1 text-white rounded-md text-sm font-medium bg-[#6e40c9]">
                        TYPE: {ticket.type.toUpperCase()}
                      </div>
                    )}
                  </div>
      
                  {/* Separator */}
                  <hr className="border-t border-[#30363d] my-4" />
      
                  {/* User Info & Description */}
                  <div className="flex gap-4 items-start">
                    <FaUserCircle className="text-[#8b949e] text-5xl" />
                    <div className="border border-[#30363d] p-4 rounded-md flex-1 bg-[#0d1117] bg-opacity-60">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-bold text-white">{ticket.username}</span>
                          <span className="text-sm text-[#8b949e] ml-2">({ticket.user_email})</span>
                        </div>
                        <span className="text-sm text-[#8b949e]">
                          Created: {new Date(ticket.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-[#8b949e]">
                          Last updated: {new Date(ticket.updated_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[#c9d1d9]">{ticket.description}</p>
                    </div>
                  </div>
                </div>
      
                {/* Activity Section - Now displays activities from ticket data */}
                <div className="bg-[#161b22] bg-opacity-70 border border-[#30363d] rounded-md p-6 shadow">
                  <h3 className="text-lg font-semibold mb-4 text-white">Activity History</h3>
                  
                  {ticket.activities && ticket.activities.length > 0 ? (
                    <div className="space-y-4">
                      {ticket.activities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3">
                          {/* Activity Icon */}
                          <div className="mt-1">
                            <span className={`p-1 rounded-full ${getActivityIconBg(activity.action)}`}>
                              {getActivityIcon(activity.action)}
                            </span>
                          </div>
                          
                          {/* Activity Content */}
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-x-2 text-sm">
                              <span className="font-medium text-white">{activity.user}</span>
                              <span className="text-[#8b949e]">{activity.action}</span>
                              <span className="text-[#8b949e]">{activity.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[#8b949e] italic">No activity recorded yet.</div>
                  )}
                </div>
              </div>
            </main>
      )
      
      }


      <Footer className="bg-[#161b22] bg-opacity-70 border-t border-[#30363d]" />

      <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteTicket}
                isDeleting={isDeleting}
              />

      {/* Edit Modal */}
      {ticket && (
        <TicketEditModal 
          isOpen={showEditModal} 
          onClose={() => setShowEditModal(false)} 
          ticket={ticket}
          onTicketUpdate={handleTicketUpdate}
        />
      )}
    </div>
  );
};

export default TicketDetail;