import { request } from "@/api/utils/request.ts"


export const getFrontRestaurantApi = async () => {
    return request.get("/front/restaurant/all")
}
