import useAuthStore from '@/stores/useAuthStore';
import axios from 'axios';


const api = axios.create({
    baseURL:
        import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : '/api',
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const { acessToken } = useAuthStore.getState();

    if (acessToken) {
        config.headers.Authorization = `Bearer ${acessToken}`;
    }

    return config;
})

//Tự động gọi refresh Token khi access Token hết hạn
api.interceptors.response.use((res) => res,
    async (error) => {
        const originalRequest = error.config;

        //Loai bo nhung end point khong check
        if (originalRequest.url.includes("/auth/signin") ||
            originalRequest.url.includes("/auth/signup") ||
            originalRequest.url.includes("/auth/refresh")) {
            return Promise.reject(error);
        }

        if (error.response?.status === 403) {
            try {
                const res = await api.post('auth/refresh', { withCredentials: true });

                const newAccessToken = res.data.accessToken;

                useAuthStore.getState().setAcessToken(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (error) {
                useAuthStore.getState().clearState();
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
)

export default api;