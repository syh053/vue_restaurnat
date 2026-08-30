import { request } from "@/api/utils/request.ts"
import type { MenuAdd, MenuSearch } from "@/api/menu/type.ts"
import { cleanParams } from "@/tools/helpers.ts"


/* 前台：取得指定餐廳的菜單（後端已排序，不分頁） */
export const getFrontMenuApi = async (restaurant_id: string) => {
    return request.get("/front/menu", { params: { restaurant_id } })
}

/* 後台：菜單列表查詢（回傳 [list, total]） */
export const getEndMenuApi = async (params: MenuSearch) => {
    const new_params = cleanParams(params)

    return request.get("/end/menu/all", { params: new_params })
}

/* 後台：新增餐點 */
export const postMenuApi = async (data: MenuAdd) => {
    const formData = new FormData()

    formData.append('restaurant_id', data.restaurant_id)
    formData.append('name', data.name)
    formData.append('price', String(data.price))
    if (data.section) formData.append('section', data.section)
    if (data.description) formData.append('description', data.description)
    if (data.image instanceof File) formData.append('image', data.image)

    return request.post("/end/menu", formData)
}

/* 後台：編輯餐點 */
export const updateMenuApi = async (menu_item_id: string, data: MenuAdd) => {
    const formData = new FormData()

    formData.append('menu_item_id', menu_item_id)
    formData.append('restaurant_id', data.restaurant_id)
    formData.append('name', data.name)
    formData.append('price', String(data.price))
    if (data.section) formData.append('section', data.section)
    if (data.description) formData.append('description', data.description)
    if (data.image instanceof File) formData.append('image', data.image)

    return request.put("/end/menu", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

/* 後台：刪除餐點（可批量） */
export const deleteMenuApi = async (id_list: string[]) => {
    return request.delete("/end/menu", {
        params: { id_list },
        paramsSerializer: {
            indexes: null // 不加上索引值
        }
    })
}
