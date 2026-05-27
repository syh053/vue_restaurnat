import { request } from "@/api/utils/request.ts"


export const getEndRestaurantApi = async () => {
    return request.get("/end/restaurant/all")
}
