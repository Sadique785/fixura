const TicketDescriptionModal = ({ ticket, onClose }) => {
    if (!ticket) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-gray-100 relative">
          
          {/* Close Button */}
          <button 
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-200 text-xl" 
            onClick={onClose}
          >
            ❌
          </button>
  
          <h2 className="text-2xl font-bold mb-4 text-blue-400">{ticket.title}</h2>
          <p className="text-gray-300">{ticket.description}</p>
        </div>
      </div>
    );
  };
  
  export default TicketDescriptionModal;
  