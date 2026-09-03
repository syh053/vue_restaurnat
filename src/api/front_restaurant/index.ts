import { request } from "@/api/utils/request.ts"
import type { EndRestaurantSearch } from "@/api/end_restaurant/type.ts"
import { cleanParams } from "@/tools/helpers.ts"


export const getFrontRestaurantApi = async (params: EndRestaurantSearch) => {
    return request.get("/front/restaurant/all", {params: cleanParams(params)})
}
