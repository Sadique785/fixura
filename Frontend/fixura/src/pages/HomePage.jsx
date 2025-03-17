import React, { useState, useEffect } from "react";

import Header from '../components/Home/Header';
import HomeMid from '../components/Home/HomeMid';
import Footer from '../components/Home/Footer';
import Modal from "../components/Form/Modal";
import LoginForm from "../components/Form/LoginForm";
import RegisterForm from "../components/Form/RegisterForm";

function HomePage() {


  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);




  // Custom styles for different modals
  const registerModalStyle = {
    width: "60%", 
    margin: "0 20%",
    height: "85vh",
    maxHeight: "85vh"
  };
  
  const loginModalStyle = {
    width: "450px",
    maxWidth: "90%"
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header 
      setShowLogin={setShowLogin}
      setShowRegister={setShowRegister}
         />
      <HomeMid setShowLogin={setShowLogin} setShowRegister={setShowRegister} />
      <Footer />

      {/* Login Modal with smaller size */}
      <Modal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        customStyle={loginModalStyle}
      >
        <LoginForm
          onClose={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      </Modal>

      {/* Register Modal with larger size */}
      <Modal 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)}
        customStyle={registerModalStyle}
      >
        <RegisterForm
          onClose={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      </Modal>
    </div>
  );
}

export default HomePage;