export interface MenuItem {
    id: string
    restaurant_id?: string
    restaurant_name?: string | null
    name: string
    price: number
    section?: string | null
    description?: string | null
    image?: string | null
    created_at: string
    updated_at: string
}

export interface MenuSearch {
    name?: string
    section?: string
    restaurant_id?: string
    current_page: number
    page_size: number
}

export interface MenuAdd {
    restaurant_id: string
    name: string
    price: number
    section?: string | null
    description?: string | null
    image?: File | null
}
