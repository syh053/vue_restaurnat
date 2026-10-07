import { Role, type RoleValue } from "@/enums/user_access.ts"

export interface User {
    id: string
    name: string
    email: string
    role: RoleValue
}

export interface UserSearch {
    name?: string | null
    email?: string | null
    role?: RoleValue | null
    current_page: number
    page_size: number
}

export interface UpdateUser {
    id: string
    role: RoleValue
}

export const userRoleOptions = Object.freeze([
    { value: Role.USER, label: '一般使用者' },
    { value: Role.OWNER, label: '業者' },
    { value: Role.SUPER_ADMIN, label: '超級管理員' }
])
