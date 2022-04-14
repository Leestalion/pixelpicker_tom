import axios from "axios";



const baseService = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    withCredentials: true,
});


const authService = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    withCredentials: true,
})

authService.interceptors.request.use(function (config) {
    const token = localStorage.getItem('jwtToken');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});


export { baseService, authService };