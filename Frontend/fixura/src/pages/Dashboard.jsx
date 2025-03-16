import React, { useState } from "react";
import Header from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import TicketList from "../components/Dashboard/TicketList";
import TicketFilter from "../components/Dashboard/TicketFilter";
import TicketCreateModal from "../components/Dashboard/TicketCreateModal";
import { gradients } from "../styles/gradient"; 

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ status: "", priority: "" });

  return (
    <div 
      className="flex flex-col min-h-screen text-[#c9d1d9]"
      style={{ 
        background: gradients.mainGradient
      }}
    >
      <Header isLogged={true} />

      {/* Main Dashboard Section */}
      <main className="flex-grow p-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Your Tickets</h1>
            <button
              className="bg-[#238636] text-white px-6 py-2 rounded-md hover:bg-[#2ea043] transition-colors"
              onClick={() => setShowModal(true)}
            >
              + Create Ticket
            </button>
          </div>

          {/* Filters Section */}
          <div className="bg-[#161b22] bg-opacity-70 border border-[#30363d] rounded-md p-4 mb-6">
            <TicketFilter setFilters={setFilters} />
          </div>

          {/* Ticket List */}
          <div className="bg-[#161b22] bg-opacity-70 border border-[#30363d] rounded-md shadow">
            <TicketList filters={filters} />
          </div>

          {/* Create Ticket Modal */}
          <TicketCreateModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
      </main>

      {/* Footer */}
      <Footer className="bg-[#161b22] bg-opacity-70 border-t border-[#30363d]" />
    </div>
  );
};

export default Dashboard;