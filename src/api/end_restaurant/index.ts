import { request } from "@/api/utils/request.ts"
import type { EndRestaurantList } from "@/api/end_restaurant/type.ts"


export const getEndRestaurantApi = async (params: EndRestaurantList) => {
    return request.get("/end/restaurant/all", {params})
}
