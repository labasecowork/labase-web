import { API_BASE_URL } from "@/config/env";
import axios from "axios";

if (!API_BASE_URL) {
  throw new Error(
    "La variable de entorno PUBLIC_API_BASE_URL no está definida.",
  );
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default apiClient;
