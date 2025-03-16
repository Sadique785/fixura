import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ isLogged = false, setShowLogin, setShowRegister }) => {
  // Mock authentication state (you would replace this with your actual auth logic)
  const [isLoggedIn, setIsLoggedIn] = useState(isLogged);
  const [username, setUsername] = useState('JohnDoe');
  const navigate = useNavigate();

  return (
    <header className="bg-black text-white p-4 shadow-md flex items-center justify-between">
      <div className="flex items-center">
        <img 
          src="/images/grandfinal2.png" 
          alt="Fixura Logo" 
          className="h-16 w-22 mr-3 ml-10 cursor-pointer"
          onClick={() => navigate('/')}
        />
      </div>

      <div className="mr-10">
        {isLoggedIn ? (
          <div className="flex items-center">
            <span className="mr-3">Hi {username}</span>
            <button 
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white mx-3"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
            <button 
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white"
              onClick={() => setIsLoggedIn(false)}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-3">
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button className="border border-gray-500 hover:bg-gray-800 px-4 py-2 rounded" onClick={() => setShowRegister(true)}>
              Signup
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;