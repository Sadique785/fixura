import React, { useState } from "react";
import Header from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import TicketTable from "../components/AdminDashboard/TicketTable";
import TicketFilter from "../components/AdminDashboard/TicketFilter";
import TicketManageModal from "../components/AdminDashboard/TicketManageModal";

const AdminPanel = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filters, setFilters] = useState({ status: "", priority: "", user: "" });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleTicketUpdated = () => {
    // Increment the refreshTrigger to force table to reload data
    setRefreshTrigger(prev => prev + 1);
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">

      <Header  />

      <main className="flex-grow bg-gray-800 p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Admin Ticket Management</h1>

          <TicketFilter setFilters={setFilters} />

          <TicketTable 
            filters={filters} 
            setSelectedTicket={setSelectedTicket} 
            refreshTrigger={refreshTrigger}
          />
          
        </div>
      </main>

      <TicketManageModal 
        ticket={selectedTicket} 
        onClose={() => setSelectedTicket(null)}
        onTicketUpdated={handleTicketUpdated}
      />

      <Footer />
    </div>
  );
};

export default AdminPanel;