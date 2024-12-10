
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const generateExcelTemplate = async (data) => {
  try {
    const response = await API.post("/excel/exportwb", data, { responseType: "blob" });
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template.xlsx";
    link.click();
  } catch (error) {
    console.error("Error generating Excel template:", error.response?.data || error.message);
    throw error;
  }
};

export default API;
