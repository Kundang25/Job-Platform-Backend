import api from "@/lib/axios";

export const getApplications = () => api.get("/applications");
export const applyJob = (jobId) => api.post(`/applications/apply/${jobId}`);
export const createApplication = (data) => api.post("/applications", data); // keep for backward compatibility