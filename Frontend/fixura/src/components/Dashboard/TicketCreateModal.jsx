import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axiosInstance from "../../axios/axiosInstance";

const TicketCreateModal = ({ isOpen, onClose, onTicketCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "open",
      user: ""
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await axiosInstance.post("/tickets/create/", data);
      toast.success("Ticket created successfully!");
      reset();
      onClose();
      onTicketCreated();
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsSubmitting(false);

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
        <h2 className="text-2xl font-bold mb-4 text-white">Create a Ticket</h2>
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
              {...register("priority", { required: "Priority is required" })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                className="bg-[#0d1117] border border-[#30363d] p-2 w-full rounded-md text-[#c9d1d9] opacity-70 cursor-not-allowed"
                value="open"
                disabled
                {...register("status")}
              >
                <option value="open">Open</option>
              </select>
              <p className="text-xs text-[#8b949e] mt-1">New tickets are always created with Open status</p>
            </div>
          
          <div>
            <input
              type="text"
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
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md w-full transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Ticket"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketCreateModal;