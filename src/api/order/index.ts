import { request } from "@/api/utils/request.ts"

/* 購物車結帳，建立訂單 api */
export const checkoutApi = async () => {
    return request.post("/front/order")
}

/* 查詢訂單列表 api */
export const getOrderListApi = async () => {
    return request.get("/front/order")
}

/* 查詢訂單明細 api */
export const getOrderDetailApi = async (order_id: string) => {
    return request.get(`/front/order/${order_id}`)
}
