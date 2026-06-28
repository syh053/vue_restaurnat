import { request } from "@/api/utils/request.ts"
import type { EndRestaurantAdd, EndRestaurantSearch } from "@/api/end_restaurant/type.ts"


export const getEndRestaurantApi = async (params: EndRestaurantSearch) => {
    return request.get("/end/restaurant/all", {params})
}

export const get_categoryApi = async () => {
    return request.get("/end/restaurant/category")
}

export const postEndRestaurantApi = async (data: EndRestaurantAdd) => {
    const formData = new FormData()

    // 1. 附加基本 Form 欄位
    formData.append('name', data.name)
    formData.append('category_id', data.category_id ?? '')
    if (data.openingHours !== null && data.openingHours !== undefined) {
        formData.append('opening_hours', data.openingHours.toString())
    }
    formData.append('address', data.address)
    if (data.tel) formData.append('tel', data.tel)
    if (data.description) formData.append('description', data.description)

    // 2. 附加檔案欄位 (對應 FastAPI 的 photo)
    if (data.image instanceof File) {
        formData.append('image', data.image)
    }

    return request.post("/end/restaurant", formData)
}

export const updateEndRestaurantApi = async (original_name: string, data: EndRestaurantAdd) => {
    const formData = new FormData()

    // 1. 附加基本 Form 欄位
    formData.append('original_name', original_name)
    formData.append('name', data.name)
    formData.append('category_id', data.category_id ?? '')
    if (data.tel) formData.append('tel', data.tel)
    if (data.openingHours !== null && data.openingHours !== undefined) {
        formData.append('opening_hours', data.openingHours.toString())
    }
    formData.append('address', data.address)
    if (data.description) formData.append('description', data.description)

    // 2. 附加檔案欄位 (對應 FastAPI 的 photo)
    if (data.image instanceof File) {
        formData.append('image', data.image)
    }

    return request.put("/end/restaurant", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const deleteEndRestaurantApi = async (name_list: string[]) => {
    const params = new URLSearchParams()
    name_list.forEach(name => params.append('name_list', name))
    return request.delete("/end/restaurant", {params})
}
