import React, { useState } from "react";
import Header from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import TicketTable from "../components/AdminDashboard/TicketTable";
import TicketFilter from "../components/AdminDashboard/TicketFilter";
import TicketManageModal from "../components/AdminDashboard/TicketManageModal";

const AdminPanel = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filters, setFilters] = useState({ status: "", priority: "", user: "" });

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      {/* Header with isLoggedIn set to true */}
      <Header isLogged={true} />

      <main className="flex-grow bg-gray-800 p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Admin Ticket Management</h1>

          {/* Filters */}
          <TicketFilter setFilters={setFilters} />

          {/* Ticket Table */}
          <TicketTable filters={filters} setSelectedTicket={setSelectedTicket} />
        </div>
      </main>

      {/* Ticket Manage Modal */}
      <TicketManageModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminPanel;