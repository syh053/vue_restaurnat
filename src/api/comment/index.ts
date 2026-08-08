import { request } from "@/api/utils/request.ts"
import type { restaurantCommentAdd, restaurantCommentDelete } from "@/api/comment/type.ts"

export const getRestaurantCommentApi = async (restaurant_id: string) => {
    return request.get('/comment/restaurant', {params: {restaurant_id}})
}

export const postRestaurantCommentApi = async (data: restaurantCommentAdd) => {
    return request.post('/comment/restaurant', data)
}

export const deleteRestaurantCommentApi = async (params: restaurantCommentDelete) => {
    return request.delete('/comment/restaurant', {params})
}
