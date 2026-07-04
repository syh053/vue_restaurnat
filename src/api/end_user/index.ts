import { request } from "@/api/utils/request.ts"
import type { UpdateUser, UserSearch } from "@/api/end_user/type.ts"


export const getUserApi = async (params: UserSearch) => {
    return request.get("/end/user/all", {params})
}

export const updateUserAccessApi = async (data: UpdateUser) => {
    return request.put("/end/user/update_access", data)
}

export const deleteUserApi = async (delete_list: string[]) => {
    return request.delete("/end/user", {
        params: { delete_list },
        // 告訴 Axios 把陣列轉成 name_list=A&name_list=B 的格式
        paramsSerializer: {
            indexes: null // 不要加上索引值
        }
    })
}
