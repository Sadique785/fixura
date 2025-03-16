import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUser } from "../../axios/authApi";
import { login } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const LoginForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data.email, data.password);
      
      dispatch(login({ user: response.user, accessToken: response.access }));

      toast.success("Login successful!");
      navigate('/dashboard')
      onClose();
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        setError("password", { type: "manual", message: "Invalid email or password" });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };


  return (
    <div className="py-6 px-8 w-full">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Login to <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Fixura</span>
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            {...register("password", { required: "Password is required" })}
            type="password"
            className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••" 
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        
        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Forgot password?</a>
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full py-3 px-4 mt-6 rounded-md font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Login
        </button>
        
        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account? <span className="text-blue-600 cursor-pointer font-medium" onClick={onClose}>Register</span>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;