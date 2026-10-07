import type { RoleValue } from "@/enums/user_access.ts"

export interface UserPost {
    name: string
    email: string
    password: string
    confirm_password: string
    role: "user" | "owner"
}


export interface UserLogIn {
    name: string
    password: string
}

export interface UserInfo {
    id: string
    name: string
    email: string
    image: string
    role: RoleValue
}

export interface UserInfoUpdate {
    name: string
    email: string
}
