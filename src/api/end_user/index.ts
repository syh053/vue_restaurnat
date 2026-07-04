import { request } from "@/api/utils/request.ts"
import type { UpdateUser, UserSearch } from "@/api/end_user/type.ts"


export const getUserApi = async (params: UserSearch) => {
    return request.get("/end/user/all", {params})
}

export const updateUserAccessApi = async (data: UpdateUser) => {
    return request.put("/end/user/update_access", data)
}
