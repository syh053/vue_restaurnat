export interface OrderItem {
    id: string
    menu_item_id: string | null
    name: string
    unit_price: number
    quantity: number
    subtotal: number
}

export interface Order {
    id: string
    restaurant_id: string | null
    status: string
    total_amount: number
    merchant_trade_no: string
    ecpay_trade_no: string | null
    payment_date: string | null
    items: OrderItem[]
    created_at: string
    updated_at: string
}

export interface CheckoutResp {
    order: Order
    pay_url: string
}
