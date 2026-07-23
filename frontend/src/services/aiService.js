import api from "@/lib/axios";

export const getResumeScore = () => api.get("/ai/resume-score");