import { request } from "@/api/utils/request.ts"
import type { UserLogIn, UserPost } from "@/api/user/tpye.ts"

export const getUserApi = async (data: UserLogIn) => {
    return request.post("/user/login", data)
}

export const postUserApi = async (data: UserPost) => {
    return request.post("/user/signup", data)
}
