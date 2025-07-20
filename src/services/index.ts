import axios from "axios";

const baseURL = import.meta.env.PUBLIC_API_BASE_URL;

if (!baseURL) {
  throw new Error(
    "La variable de entorno PUBLIC_API_BASE_URL no está definida.",
  );
}

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default apiClient;
