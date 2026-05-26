import axios from 'axios'

export const request = axios.create({
    baseURL: '/api/front',   // 對應 proxy 的前綴
    timeout: 5000
})
