export interface EndRestaurantList {
    id: string
    name: string
    tel?: string
    openingHours: number | null
    address: string
    description?: string
    image?: string
}

export interface EndRestaurantSearch {
    id?: string
    name?: string
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
}
