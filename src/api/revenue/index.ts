import { request } from "@/api/utils/request.ts"
import type { RevenueSearch } from "@/api/revenue/type.ts"
import { cleanParams } from "@/tools/helpers.ts"

/* 業者營業額 api（僅業者可呼叫，只計已付款訂單） */
export const getRevenueApi = async (params: RevenueSearch) => {
    return request.get("/end/revenue", {params: cleanParams(params)})
}
