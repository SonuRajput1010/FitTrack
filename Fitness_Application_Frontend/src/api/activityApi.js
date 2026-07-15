import axiosClient from "./axiosClient";

export const activityApi = {
  createActivity: async (activityData) => {
    const response = await axiosClient.post("/api/activities", activityData);
    return response.data;
  },

  getUserActivities: async () => {
    const response = await axiosClient.get("/api/activities");
    return response.data;
  },

  getActivityById: async (activityId) => {
    const response = await axiosClient.get(`/api/activities/${activityId}`);
    return response.data;
  },

  updateActivity: async (activityId, activityData) => {
    const response = await axiosClient.put(
      `/api/activities/${activityId}`,
      activityData,
    );
    return response.data;
  },

  deleteActivity: async (activityId) => {
    const response = await axiosClient.delete(`/api/activities/${activityId}`);
    return response.data;
  },

  regenerateRecommendation: async (activityId) => {
    const response = await axiosClient.post(
      `/api/activities/${activityId}/regenerate-recommendation`,
    );
    return response.data;
  },
};
