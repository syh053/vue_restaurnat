export interface restaurantCommentAdd {
    text: string
    restaurant_id: string
}

export interface restaurantCommentDelete {
    restaurant_id: string
    comment_id: string
}
