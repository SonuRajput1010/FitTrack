import axiosClient from "./axiosClient";

export const userApi = {
  getUserById: async (userId) => {
    const response = await axiosClient.get(`/api/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await axiosClient.put(`/api/users/${userId}`, userData);
    return response.data;
  },

  patchUser: async (userId, userData) => {
    const response = await axiosClient.patch(`/api/users/${userId}`, userData);
    return response.data;
  },

  registerUser: async (userData) => {
    const response = await axiosClient.post("/api/users/register", userData);
    return response.data;
  },

  validateUser: async (userId) => {
    const response = await axiosClient.get(`/api/users/${userId}/validate`);
    return response.data;
  },
};