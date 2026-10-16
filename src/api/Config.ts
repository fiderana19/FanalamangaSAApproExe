import axios, { AxiosError } from "axios";
import { HttpStatus } from "@/constants/Http_status";
import { BASE_URL } from "@/config/appConfig";

const axiosAuthInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

axiosAuthInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => Promise.reject(error)
)

const PUBLIC_PATHS = ["/", "/forgot-password", "/unauthorized"];
const CHANGE_PASSWORD_PATH = "/auth/profile/password";

axiosAuthInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const status = error.response?.status;
        const url = error.config?.url ?? "";
        const estPagePublique = PUBLIC_PATHS.includes(window.location.pathname);

        if(status === HttpStatus.UNAUTHORIZED) {
            if(estPagePublique) {
                localStorage.removeItem("token");
                return Promise.reject(error);
            }
            if(url.includes(CHANGE_PASSWORD_PATH)) {
                return Promise.reject(error);
            }
            localStorage.removeItem("token");
            window.location.replace("/");
        }

        if(!status || estPagePublique) {
            return Promise.reject(error);
        }

        if(status === HttpStatus.FORBIDDEN) {
            window.location.replace("/unauthorized");
        }

        return Promise.reject(error);
    }
)

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

export const axiosMutlipartFormDataInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "multipart/form-data"
    }
})

export default axiosAuthInstance;