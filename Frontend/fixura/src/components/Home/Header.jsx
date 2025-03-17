import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import axiosInstance from '../../axios/axiosInstance'; 
import { toast } from 'react-hot-toast'; 

const Header = ({ setShowLogin, setShowRegister }) => {
  const { isAuthenticated, userData } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get username from userData, fallback to "User" if not available
  const username = userData?.username || "User";
  
  const handleLogout = async () => {
    try {
      setIsSubmitting(true);

      const response = await axiosInstance.post('/logout/');
      
      if (response.status === 200) {

        dispatch(logout());
        
        toast.success("Logged out successfully");
        
        navigate('/',{ replace: true });

      } else {

        toast.error(response.data.message || "Logout failed");

      }
    } catch (error) {
      toast.error("Something went wrong during logout");
      
      // Force logout on frontend even if backend fails
      // Comment this out if you want to prevent logout on backend failure
      dispatch(logout());
      navigate('/');
    } finally {
      setIsSubmitting(false);
    }

  
  };

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
        {isAuthenticated ? (
          <div className="flex items-center">
            <span className="mr-3">Hi {username}</span>
            <button 
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white mx-3"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
            <button 
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white disabled:bg-gray-500 disabled:cursor-not-allowed"
              onClick={handleLogout}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging out...
                </span>
              ) : (
                "Logout"
              )}
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