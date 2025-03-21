import axiosInstance from "./axiosInstance";

export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/login/", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};