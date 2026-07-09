import { request } from "@/api/utils/request.ts"
import type { UserLogIn, UserPost } from "@/api/user/tpye.ts"

export const userLogInApi = async (data: UserLogIn) => {
    return request.post("/user/login", data)
}

export const userLogOutApi = async () => {
    return request.post("/user/logout")
}

export const postUserApi = async (data: UserPost) => {
    return request.post("/user/signup", data)
}

export const getUserExistedCheckApi = async (name: string) => {
    return request.get("/user/check_existed", {
        params: {name}
    })
}

export const getEmailExistedCheckApi = async (email: string) => {
    return request.get("/user/check_email_existed", {
        params: {email}
    })
}
