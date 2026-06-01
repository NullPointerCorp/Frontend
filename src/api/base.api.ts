import axios from 'axios'
import router from '@/router'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const createAPI = (path: string) => {
    const instance = axios.create({ baseURL: `${API_BASE}${path}` })

    instance.interceptors.request.use(config => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/login')
            throw new Error('No token')
        }
        config.headers.Authorization = `Bearer ${token}`
        return config
    })

    instance.interceptors.response.use(
        response => response,
        error => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                router.push('/login')
            }
            return Promise.reject(error)
        }
    )

    return instance
}
