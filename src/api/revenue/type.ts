export interface RevenueSearch {
    start_date?: string | null
    end_date?: string | null
    restaurant_id?: string | null
}

export interface DailyRevenue {
    date: string
    order_count: number
    revenue: number
}

export interface RestaurantRevenue {
    restaurant_id: string
    restaurant_name: string
    order_count: number
    revenue: number
}

export interface Revenue {
    total_revenue: number
    total_orders: number
    daily: DailyRevenue[]
    restaurants: RestaurantRevenue[]
}
