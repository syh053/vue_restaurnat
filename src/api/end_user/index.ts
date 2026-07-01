import { request } from "@/api/utils/request.ts"
import type { UserSearch } from "@/api/end_user/type.ts"


export const getUserApi = async (params: UserSearch) => {
    return request.get("/end/user/all", {params})
}
