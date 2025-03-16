import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, children, customStyle = {} }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose} // Clicking outside closes modal
    >
      <div
        className="bg-white rounded-3xl shadow-xl overflow-hidden relative"
        style={customStyle}
        onClick={(e) => e.stopPropagation()} // Prevents close when clicking inside
      >
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10" 
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default Modal;