import { addCartItemApi, clearCartApi, deleteCartItemApi, getCartApi, updateCartItemApi } from '@/api/cart'
import type { CartItem, CartItemAdd, CartItemUpdate } from '@/api/cart/type.ts'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * 購物車 store
 */
export const useCartStore = defineStore('cart', () => {
    const items = ref<CartItem[]>([])
    const total = ref(0)

    /* 所有品項數量加總 */
    const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

    /* 用後端回應（{ code, message, data: { items, total } }）同步本地 state */
    function applyCartResp(res: { data: { data: { items: CartItem[]; total: number } } }) {
        items.value = res.data.data.items
        total.value = res.data.data.total
    }

    /**
     * 取得購物車內容。
     */
    async function fetchCart() {
        try {
            const res = await getCartApi()
            applyCartResp(res)
        } catch {
            reset()
        }
    }

    /**
     * 加入購物車
     *
     * @param data - 餐點 id 與數量
     * @param clearExisting - 是否先清空原有（其他餐廳）品項；預設 false
     */
    async function addItem(data: CartItemAdd, clearExisting = false) {
        const res = await addCartItemApi(data, clearExisting)
        applyCartResp(res)
        return res
    }

    /**
     * 修改購物車品項數量
     */
    async function updateItem(data: CartItemUpdate) {
        const res = await updateCartItemApi(data)
        applyCartResp(res)
        return res
    }

    /**
     * 移除單一購物車品項
     */
    async function removeItem(cartItemId: string) {
        const res = await deleteCartItemApi(cartItemId)
        applyCartResp(res)
        return res
    }

    /**
     * 清空購物車
     */
    async function clearCart() {
        const res = await clearCartApi()
        applyCartResp(res)
        return res
    }

    /**
     * 清空本地 state（登出時呼叫，不打 API）
     */
    function reset() {
        items.value = []
        total.value = 0
    }

    return {
        items,
        total,
        count,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        reset,
    }
})
