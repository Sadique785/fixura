import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../axios/axiosInstance";


const TicketEditModal = ({ isOpen, onClose, ticket, onTicketUpdate }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "open",
      user: ""
    }
  });

  // Set form values when ticket data changes
  useEffect(() => {
    if (isOpen && ticket) {
      setValue("title", ticket.title);
      setValue("description", ticket.description);
      setValue("priority", ticket.priority);
      setValue("status", ticket.status);
      setValue("user", ticket.user_email);
    }
  }, [isOpen, ticket, setValue]);

  const onSubmit = async (data) => {
    try {
      // Make PUT request to update the ticket
      const response = await axiosInstance.put(`/tickets/${ticket.id}/`, data);
      
      // Pass the complete response data to the parent component
      onTicketUpdate(response.data);
      
      onClose();
      alert("Ticket updated successfully!");
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] p-6 rounded-lg shadow-lg w-96 relative">
        <button 
          className="absolute top-2 right-3 text-[#8b949e] hover:text-white" 
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white">Edit Ticket #{ticket?.id}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Title"
              className="bg-[#0d1117] border border-[#30363d] p-2 w-full rounded-md text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p className="text-[#f85149] text-xs mt-1">{errors.title.message}</p>}
          </div>
          
          <div>
            <textarea
              placeholder="Description"
              className="bg-[#0d1117] border border-[#30363d] p-2 w-full rounded-md text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none min-h-24"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <p className="text-[#f85149] text-xs mt-1">{errors.description.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm mb-1">Priority</label>
            <select
              className="bg-[#0d1117] border border-[#30363d] p-2 w-full rounded-md text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none"
              {...register("priority")}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              className="bg-[#0d1117] border border-[#30363d] p-2 w-full rounded-md text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none opacity-70 cursor-not-allowed"
              {...register("status")}
              disabled
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <p className="text-xs text-[#8b949e] mt-1 italic">Status can only be updated by admin</p>
          </div>
          
          <div>
            <input
              type="text"
              readOnly={true}
              placeholder="User Email"
              className="bg-[#0d1117] border border-[#30363d] p-2 w-full rounded-md text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none"
              {...register("user", { 
                required: "User is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.user && <p className="text-[#f85149] text-xs mt-1">{errors.user.message}</p>}
          </div>
          
          <div className="flex space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="bg-[#21262d] hover:bg-[#30363d] text-white px-4 py-2 rounded-md w-full transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md w-full transition-colors"
            >
              Update Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketEditModal;