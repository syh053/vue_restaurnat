export interface UserPost {
    name: string
    email: string
    password: string
    confirm_password: string
}


export interface UserLogIn {
    name: string
    password: string
}

export interface UserInfo {
    id: string
    name: string
    email: string
    is_admin: boolean
}
