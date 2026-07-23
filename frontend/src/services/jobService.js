import api from "@/lib/axios";

export const getJobs = () => api.get("/jobs");
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const saveJob = (jobId) => api.post(`/jobs/save/${jobId}`);