'use client'
import axios from "axios";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const requestApi = axios.create({
    baseURL: String(process.env.NEXT_PUBLIC_API_URL)
});

const getAuthStore = () => {
    if (typeof window !== 'undefined') {
        const { useAuthStore } = require('@/stores/auth-store');
        return useAuthStore.getState();
    }
    return null;
};

requestApi.interceptors.request.use(function (config) {
    let token = Cookies.get('token');

    if (!token) {
        const authStore = getAuthStore();
        token = authStore?.token || null;
    }


    if (!token && typeof window !== 'undefined') {
        const sessionName = process.env.NEXT_PUBLIC_SESSION_NAME || 'avalidacao';
        const tokenData = localStorage.getItem(`token_${sessionName}`);
        if (tokenData) {
            try {
                const parsedData = JSON.parse(tokenData);
                token = parsedData.access_token;
            } catch (error) {
                console.error('Erro ao parsear token do localStorage:', error);
            }
        }
    }

    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
        config.headers['Module'] = '';
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});

requestApi.interceptors.response.use(function (response) {
    if (response.config.method == 'post') {
        toast.success(response.data.message, { position: "top-right", closeOnClick: true, pauseOnHover: true });
    }
    if (response.config.method == 'put') {
        toast.success(response.data.message, { position: "top-right", closeOnClick: true, pauseOnHover: true });
    }

    if (response.config.method == 'delete') {
        toast.success(response.data.message, { position: "top-right", closeOnClick: true, pauseOnHover: true });
    }

    return response.data;
}, function (error) {
    if (error.response?.status === 401) {
        const authStore = getAuthStore();
        if (authStore?.logout) {
            authStore.logout();
        } else {
            Cookies.remove('token');
            Cookies.remove('tcn');

            if (typeof window !== 'undefined') {
                const sessionName = process.env.NEXT_PUBLIC_SESSION_NAME || 'avalidacao';
                localStorage.removeItem(`token_${sessionName}`);

                if (!window.location.pathname.includes('/')) {
                    window.location.href = '/';
                }
            }
        }
    }

    // Exibir toast de erro para todos os status que não sejam 200 ou 401
    if (error.response && error.response.status !== 200 && error.response.status !== 401) {
        const message = error.response?.data?.message;
        if (message) {
            if (Array.isArray(message)) {
                message.forEach((item: string) => {
                    toast.error(item, { position: "top-right", closeOnClick: true, pauseOnHover: true });
                });
            } else if (typeof message === 'string') {
                toast.error(message, { position: "top-right", closeOnClick: true, pauseOnHover: true });
            }
        }
    }
    return Promise.reject(error);
});

export default requestApi;
export { default as dashboardService } from './dashboard-service';