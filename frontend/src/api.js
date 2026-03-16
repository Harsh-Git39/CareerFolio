const BASE = "http://localhost:5000/api";

async function req(method, path, body, isForm = false) {
  const opts = { method, headers: {} };
  if (body && !isForm) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
  if (body && isForm) opts.body = body;
  const res = await fetch(BASE + path, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  login: (email, password) => req("POST", "/auth/login", { email, password }),
  getAchievements: (params = {}) => req("GET", "/achievements?" + new URLSearchParams(params).toString()),
  submitAchievement: (formData) => req("POST", "/achievements", formData, true),
  verifyAchievement: (id, status, facultyId) => req("PATCH", `/achievements/${id}`, { status, facultyId }),
  deleteAchievement: (id) => req("DELETE", `/achievements/${id}`),
  getBatches: (params = {}) => req("GET", "/batches?" + new URLSearchParams(params).toString()),
  createBatch: (data) => req("POST", "/batches", data),
  assignFaculty: (batchId, facultyId) => req("PATCH", `/batches/${batchId}/assign`, { facultyId }),
  getStudents: (params = {}) => req("GET", "/students?" + new URLSearchParams(params).toString()),
  getAdminStats: () => req("GET", "/admin/stats"),
};
