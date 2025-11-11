import api from '@/lib/axios';

const authService = {
    signUp: async (username: string, password: string, firstName: string, lastName: string, email: string) => {
        const res = await api.post('auth/register',
            { username, password, firstName, lastName, email },
            { withCredentials: true });

        return res.data;
    },

    login: async (username: string, password: string) => {
        const res = await api.post('auth/login',
            { username, password },
            { withCredentials: true });
        return res.data;
    },

    logout: async () => {
        await api.post('auth/logout', {}, { withCredentials: true });
    },

    fetchMe: async () => {
        const res = await api.get('users/me', { withCredentials: true });
        return res.data.user;
    },

    refresh: async () => {
        const res = await api.post('auth/refresh', {}, { withCredentials: true });
        return res.data.accessToken;
    },
}

export default authService;