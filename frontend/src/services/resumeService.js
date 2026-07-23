import api from "@/lib/axios";

export const getResume = () => api.get("/resume");

export const uploadResume = (formData) =>
  api.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });