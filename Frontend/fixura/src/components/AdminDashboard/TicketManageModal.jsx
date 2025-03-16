// TicketManageModal.jsx
import { useState } from "react";
import axios from "axios";

const TicketManageModal = ({ ticket, onClose }) => {
  if (!ticket) return null;

  const [status, setStatus] = useState(ticket.status);
  const [assignedUser, setAssignedUser] = useState("");

  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/tickets/${ticket.id}/`, { status, assignedUser });
      alert("Ticket updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/tickets/${ticket.id}/`);
      alert("Ticket deleted successfully!");
      onClose();
    } catch (error) {
      console.error("Error deleting ticket:", error);
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

        <label className="block mt-4 mb-2">Assign User (Email):</label>
        <input 
          className="bg-gray-700 border border-gray-600 p-2 w-full rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          type="email" 
          value={assignedUser} 
          onChange={(e) => setAssignedUser(e.target.value)} 
        />

        <div className="flex justify-between mt-4">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200" onClick={handleDelete}>Delete</button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-200" onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default TicketManageModal;