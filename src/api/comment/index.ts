import { request } from "@/api/utils/request.ts"

export const getRestaurantCommentApi = async (restaurant_id: string) => {
    return request('/comment/restaurant', {params: {restaurant_id}})
}
