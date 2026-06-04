import { request } from "@/api/utils/request.ts"
import type { EndRestaurantAdd, EndRestaurantSearch } from "@/api/end_restaurant/type.ts"


export const getEndRestaurantApi = async (params: EndRestaurantSearch) => {
    return request.get("/end/restaurant/all", {params})
}

export const postEndRestaurantApi = async (data: EndRestaurantAdd) => {
    return request.post("/end/restaurant", data)
}

export const updateEndRestaurantApi = async (original_name: string, data: EndRestaurantAdd) => {
    return request.put("/end/restaurant", {
        original_name: original_name,
        restaurant: data
    })
}
