import {request} from "@/api/utils/request.ts"
import type {UserInfoUpdate, UserLogIn, UserPost} from "@/api/user/tpye.ts"

export const getUserInfoApi = async () => {
    return request.get("/user/info")
}

export const updateUserInfoImageApi = async (img: File) => {
    const formData = new FormData()
    formData.append('image', img)

    return request.put("/user/info/img", formData)
}

export const updateUserInfoApi = async (data: UserInfoUpdate) => {
    return request.put("/user/info", data)
}

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
    return request.get("/user/check_name_existed", {
        params: {name}
    })
}

export const getEmailExistedCheckApi = async (email: string) => {
    return request.get("/user/check_email_existed", {
        params: {email}
    })
}
