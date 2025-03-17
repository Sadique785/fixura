
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6 max-w-md w-full">
        <div className="flex items-center mb-4 text-[#f85149]">
          <FaExclamationTriangle className="mr-2 text-xl" />
          <h3 className="text-xl font-bold">Delete Ticket</h3>
        </div>
        
        <p className="text-[#c9d1d9] mb-6">
          Are you sure you want to delete this ticket? This action cannot be undone.
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 border border-[#30363d] rounded-md text-[#c9d1d9] hover:bg-[#30363d]"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#f85149] text-white rounded-md hover:bg-[#ff6b63] disabled:opacity-50"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;