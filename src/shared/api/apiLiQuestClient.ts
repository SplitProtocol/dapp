import axiosInstance from "axios";

export const apiLiQuestClient = axiosInstance.create({
  baseURL: "https://li.quest/v1",
});
