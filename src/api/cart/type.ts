/* 購物車單一品項（後端回應） */
export interface CartItem {
    id: string                       // 購物車品項 id
    menu_item_id: string             // 餐點 id
    name: string                     // 餐點名稱
    price: number                    // 單價
    quantity: number                 // 數量
    subtotal: number                 // 小計 : price * quantity
    image?: string | null            // 餐點圖片
    restaurant_id: string            // 餐廳 id
    restaurant_name?: string | null  // 餐廳名稱
    created_at: string
    updated_at: string
}

/* 整個購物車項目內容 */
export interface CartResp {
    items: CartItem[]
    total: number // 總金額 = 所有項目加總
}

/* 加入購物車 */
export interface CartItemAdd {
    menu_item_id: string
    quantity: number
}

/* 修改購物車品項數量 */
export interface CartItemUpdate {
    id: string  // 購物車品項 id
    quantity: number
}
