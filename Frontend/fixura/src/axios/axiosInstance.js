import axios from "axios";
import Cookies from "js-cookie";
import { store } from "../store/store";
import { login, logout } from "../store/slices/authSlice";
import { persistor } from "../store/store";
import { toast } from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// **Logout Process When Session Expires**
const handleSessionExpiredLogout = async () => {
  try {
    // **1️⃣ Backend Logout Request**
    try {
      await axios.post(
        `${backendUrl}/logout/`,
        {},
        {
          withCredentials: true,
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
        }
      );
    } catch (error) {
      console.error("Backend logout failed:", error);
    }

    // **2️⃣ Clear Redux State**
    store.dispatch(logout());

    // **3️⃣ Clear Persisted Storage**
    try {
      await persistor.purge();
    } catch (err) {
      console.error("Error purging persistor: ", err);
    }

    // **4️⃣ Notify & Redirect**
    toast.error("Session expired. Please login again.");
    window.location.href = "/";
  } catch (error) {
    console.error("Error during session expired logout:", error);
    window.location.href = "/";
  }
};

// **Request Interceptor** (Adds Tokens to Every Request)
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const { accessToken } = state.auth;
    const csrfToken = Cookies.get("csrftoken");

    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// **Response Interceptor** (Handles Expired Tokens)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // **If Not 401 or Refresh Request Failed → Reject**
    if (error.response?.status !== 401 || originalRequest.url.includes("/token/refresh/")) {
      return Promise.reject(error);
    }

    // **Only One Refresh Request at a Time**
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${backendUrl}/token/refresh/`,
          {},
          {
            withCredentials: true,
            headers: { "X-CSRFToken": Cookies.get("csrftoken") },
          }
        );

        const { access: newAccessToken } = response.data;
        store.dispatch(login({ accessToken: newAccessToken })); // Update token in Redux
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        await handleSessionExpiredLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      })
      .catch((err) => Promise.reject(err));
  }
);

export default axiosInstance;
