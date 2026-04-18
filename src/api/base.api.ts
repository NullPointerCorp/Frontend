import axios from 'axios'
import router from '@/router'

export const createAPI = (baseURL: string) => {
    const instance = axios.create({ baseURL })

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
