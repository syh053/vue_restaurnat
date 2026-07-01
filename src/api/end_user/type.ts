export interface User {
    id: string
    name: string
    email: string
    is_admin: boolean
}

export interface UserSearch {
    name?: string | null
    email?: string | null
    is_admin?: boolean | null
    current_page: number
    page_size: number
}

export const userStatusOptions = Object.freeze([
    { value: true, label: '是管理員' },
    { value: false, label: '不是管理員' }
])
