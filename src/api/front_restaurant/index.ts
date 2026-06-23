import { request } from "@/api/utils/request.ts"
import type { EndRestaurantSearch } from "@/api/end_restaurant/type.ts"


export const getFrontRestaurantApi = async (params: EndRestaurantSearch) => {
    return request.get("/front/restaurant/all", {params})
}
