import { request } from "@/api/utils/request.ts"


export const getRestaurantApi = async () => {
    return request.get("/front/restaurant/all")
}
