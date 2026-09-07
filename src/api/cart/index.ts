import { request } from "@/api/utils/request.ts"
import type { CartItemAdd, CartItemUpdate } from "@/api/cart/type.ts"

/* 前台：查看購物車（回傳 { code, message, data: { items, total } }） */
export const getCartApi = async () => {
    return request.get("/front/cart")
}

/* 前台：加入購物車；clear_existing=true 會先清空原有（其他餐廳）品項再加入 */
export const addCartItemApi = async (data: CartItemAdd, clear_existing = false) => {
    return request.post("/front/cart", data, { params: { clear_existing } })
}

/* 前台：修改購物車品項數量 */
export const updateCartItemApi = async (data: CartItemUpdate) => {
    return request.put("/front/cart", data)
}

/* 前台：移除單一購物車品項 */
export const deleteCartItemApi = async (cart_item_id: string) => {
    return request.delete("/front/cart", { params: { cart_item_id } })
}

/* 前台：清空購物車 */
export const clearCartApi = async () => {
    return request.delete("/front/cart/cart_drop")
}
