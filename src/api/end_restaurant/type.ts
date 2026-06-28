export interface EndRestaurantList {
    id: string
    name: string
    tel?: string
    openingHours: number
    address: string
    description?: string
    image?: string
    category_id?: string | null
    category_name?: string | null
}

export interface EndRestaurantSearch {
    id?: string
    name?: string
    category_name?: string | null
    tel?: string
    openingHours?: number | null
    address: string
    description?: string
    current_page: number
    page_size: number
}

export interface EndRestaurantAdd {
    name: string
    tel?: string
    openingHours?: number | null
    address: string
    description?: string
    image?: File | null
    category_id? : string | null
}

export interface Category {
    id: string
    name: string
}
