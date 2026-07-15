import axiosClient from "./axiosClient";

export const recommendationApi = {
  getUserRecommendations: async () => {
    const userId = localStorage.getItem("userId");

    const response = await axiosClient.get(
      `/api/recommendations/user/${userId}`,
    );

    return response.data;
  },

  getActivityRecommendation: async (activityId) => {
    const response = await axiosClient.get(
      `/api/recommendations/activity/${activityId}`,
    );

    return response.data;
  },
};
