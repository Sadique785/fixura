import React, {useState, useEffect} from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-hot-toast"; 
import { useForm } from "react-hook-form";


const RegisterForm = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      
      // Map the form data to match the backend's expected field names
      const formData = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        mobile: data.phone,
        password: data.password,
        company: data.company || "" // Ensure company is sent even if empty
      };
      
      const response = await axios.post(`${backendUrl}/register/`, formData);
      
      if (response.status === 201) { // Using strict equality
        console.log('So registration successfull')
        const username = response.data?.user?.first_name || "User";
        toast.success(`Welcome, ${username}! Registration successful. Please login.`);
        onClose(); 
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.response?.data) {
        // Handle field-specific errors
        const errorData = error.response.data;
        
        if (typeof errorData === 'object') {
          if (errorData.email?.includes('user with this email already exists')) {
            toast.error("An account with this email already exists. Please login instead.");
          } else {
            const errorMessages = [];
            Object.entries(errorData).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                // Format field names for display (e.g., first_name -> First Name)
                const formattedField = field.replace(/_/g, ' ')
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                errorMessages.push(`${formattedField}: ${messages.join(', ')}`);
              }
            });
            
            if (errorMessages.length > 0) {
              toast.error(errorMessages.join('. '), { autoClose: 6000 });
            } else {
              toast.error("Registration failed. Please check your information and try again.");
            }
          }
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } else {
        toast.error("Unable to connect to server. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 px-10 w-full max-h-[85vh] overflow-y-auto">
      <h2 className="text-4xl font-bold mb-6 text-center">
        Try <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Fixura</span> for free
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First and Last Name */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input 
              {...register("firstName", { required: "First name is required" })}
              className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John" 
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input 
              {...register("lastName", { required: "Last name is required" })}
              className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Doe" 
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>
        
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            {...register("email", { 
              required: "Email is required", 
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            type="email"
            className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john.doe@example.com" 
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input 
            {...register("phone", { 
              required: "Phone number is required",
              pattern: {
                value: /^[0-9+-\s()]*$/,
                message: "Invalid phone number"
              }
            })}
            className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (123) 456-7890" 
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        
        {/* Company Name (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name (Optional)
          </label>
          <input 
            {...register("company")}
            className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Acme Inc." 
          />
        </div>
        
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
            type="password"
            className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••" 
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 px-4 mt-6 rounded-md font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : "Try it free"}
            </button>
        
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account? <span className="text-blue-600 cursor-pointer font-medium" onClick={onClose}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;