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
        <p className="text-gray-300 mb-4">{ticket.description}</p>
        
        {/* Assigned Users Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">Assigned Users</h3>
          {ticket.assigned_users && ticket.assigned_users.length > 0 ? (
            <ul className="text-gray-300">
              {ticket.assigned_users.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No one assigned to this ticket</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDescriptionModal;