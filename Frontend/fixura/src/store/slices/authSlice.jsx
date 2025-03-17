import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isAdmin:false,
  userData: {
    email: null,
    first_name: null,
    last_name: null,
    mobile: null,
    user_id: null,
    username: null, 
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      // Store access token
      state.accessToken = action.payload.access;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.isAdmin
      
      // Store user data from payload
      state.userData = {
        email: action.payload.email,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        mobile: action.payload.mobile,
        user_id: action.payload.user_id,
        // Create username from first_name and last_name
        username: `${action.payload.first_name} ${action.payload.last_name}`.trim(),
      };
      
      // For backward compatibility, keep the user field
      state.user = state.userData;
      
      console.log('Current state', state);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.userData = {
        email: null,
        first_name: null,
        last_name: null,
        mobile: null,
        user_id: null,
        username: null,
      };
    },
    updateUser: (state, action) => {
      // Update userData with new values
      state.userData = { ...state.userData, ...action.payload };
      
      // If first_name or last_name is updated, recalculate username
      if (action.payload.first_name || action.payload.last_name) {
        state.userData.username = `${state.userData.first_name || ''} ${state.userData.last_name || ''}`.trim();
      }
      
      // Keep user field updated for backward compatibility
      state.user = state.userData;
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;