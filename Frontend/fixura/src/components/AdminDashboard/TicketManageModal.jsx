import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../axios/axiosInstance";
import toast from "react-hot-toast";

// Debounce utility function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const TicketManageModal = ({ ticket, onClose, onTicketUpdated }) => {
  if (!ticket) return null;

  const [status, setStatus] = useState(ticket.status);
  const [assignedUsers, setAssignedUsers] = useState(
    ticket.assigned_users ? 
    (Array.isArray(ticket.assigned_users) ? ticket.assigned_users : [ticket.assigned_users].filter(Boolean)) : 
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Search for users based on the debounced search term
  const searchUsers = useCallback(async (term) => {
    if (!term || term.length < 2) {
      setUserSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/users/search/?query=${term}`);
      // Filter out users who are already assigned
      const filteredUsers = response.data.filter(
        user => !assignedUsers.includes(user.email)
      );
      setUserSuggestions(filteredUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Failed to search users");
      setUserSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [assignedUsers]);

  // Effect to trigger search when debounced search term changes
  useEffect(() => {
    searchUsers(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchUsers]);

  const handleUserSelect = (email) => {
    if (!assignedUsers.includes(email)) {
      setAssignedUsers([...assignedUsers, email]);
    }
    setSearchTerm("");
    setUserSuggestions([]);
  };

  const handleRemoveUser = (email) => {
    setAssignedUsers(assignedUsers.filter(user => user !== email));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      await axiosInstance.put(`tickets/admin/${ticket.id}/`, { 
        status, 
        assigned_users: assignedUsers 
      });
      
      // Call the callback to notify parent component that data changed
      if (onTicketUpdated) {
        onTicketUpdated();
      }
      
      toast.success("Ticket updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const initiateDelete = () => {
    setIsDeleting(true);
  };

  const cancelDelete = () => {
    setIsDeleting(false);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleteLoading(true);
      await axiosInstance.delete(`tickets/delete/${ticket.id}/`);
  
      if (onTicketUpdated) {
        onTicketUpdated();
      }
  
      toast.success("Ticket deleted successfully!");
      onClose();
    } catch (error) {
      console.error("Error deleting ticket:", error);
  
      const errorMessage = error.response?.data?.detail || "Failed to delete ticket. Please try again.";
  
      toast.error(errorMessage); 
      setIsDeleteLoading(false);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-gray-100 relative">
        <button 
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-200 text-xl" 
          onClick={onClose}
        >
          ❌
        </button>
        
        {isDeleting ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-red-400">Delete Ticket</h2>
            <p className="text-center mb-6">Are you sure you want to delete this ticket?</p>
            <div className="flex justify-center gap-4">
              <button 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition duration-200"
                onClick={cancelDelete}
                disabled={isDeleteLoading}
              >
                Cancel
              </button>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200"
                onClick={confirmDelete}
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? "Processing..." : "Delete"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Manage Ticket</h2>

            <label className="block mb-2">Status:</label>
            <select 
              className="bg-gray-700 border border-gray-600 p-2 w-full rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <label className="block mt-4 mb-2">Assigned Users:</label>
            
            {/* Display currently assigned users */}
            {assignedUsers.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Currently assigned:</p>
                <div className="flex flex-wrap gap-2">
                  {assignedUsers.map(email => (
                    <div 
                      key={email} 
                      className="bg-blue-900 text-blue-100 px-2 py-1 rounded-md flex items-center"
                    >
                      <span className="truncate max-w-[180px]">{email}</span>
                      <button 
                        className="ml-2 text-blue-300 hover:text-white"
                        onClick={() => handleRemoveUser(email)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Search input for adding new users */}
            <div className="relative mb-4">
              <input 
                className="bg-gray-700 border border-gray-600 p-2 w-full rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                type="text" 
                value={searchTerm} 
                onChange={handleSearchChange} 
                placeholder="Search users to assign"
              />
              
              {isLoading && (
                <div className="absolute right-3 top-3">
                  <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
              
              {userSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  {userSuggestions.map((user) => (
                    <li 
                      key={user.email} 
                      onClick={() => handleUserSelect(user.email)}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                    >
                      {user.email}
                    </li>
                  ))}
                </ul>
              )}
              
              {debouncedSearchTerm && userSuggestions.length === 0 && !isLoading && (
                <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg p-2">
                  No matching users found
                </div>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200"
                onClick={initiateDelete}
              >
                Delete
              </button>
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-200" 
                onClick={handleUpdate}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketManageModal; 