<script setup lang="ts">

import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { ElMessage, ElMessageBox } from "element-plus"
import { useCartStore } from "@/stores/cart.ts"
import { useUserStore } from "@/stores/user.ts"
import type { CartItem } from "@/api/cart/type.ts"

/* 導航 */
const router = useRouter()

/* 初始化 Store */
const cartStore = useCartStore()
const userStore = useUserStore()

/* 狀態 */
const loading = ref<boolean>(true)

/* 取得圖片前綴 */
const API_BASE_URL = import.meta.env.VITE_API_URL

const FALLBACK_IMG = 'https://sansalife.tw/wp-content/uploads/2023/04/caesarmetro-restaurant-14_%E7%BB%93%E6%9E%9C-jpg.webp'

const imageSrc = (item: CartItem) => item.image ? API_BASE_URL + item.image : FALLBACK_IMG

/* 返回上一頁 */
const handleBack = () => {
  router.back()
}

/* 去點餐 */
const goOrder = () => {
  router.push({ name: 'frontRestaurantMenuAll' })
}

/* 修改數量（el-input-number 已限制 >= 1） */
const handleQuantityChange = async (item: CartItem, quantity: number | undefined) => {
  if (!quantity) return
  try {
    await cartStore.updateItem({ id: item.id, quantity })
  } catch (err: any) {
    ElMessage.error(err?.response?.data?.message || '數量更新失敗')
    // 還原成後端實際數量
    await cartStore.fetchCart()
  }
}

/* 移除品項 */
const handleRemove = async (item: CartItem) => {
  try {
    await ElMessageBox.confirm(`確定要將『${item.name}』從購物車移除嗎?`, '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await cartStore.removeItem(item.id)
    ElMessage.success('已從購物車移除')
  } catch (err: any) {
    // 使用者取消不處理；其餘顯示錯誤
    if (err !== 'cancel' && err !== 'close') {
      ElMessage.error(err?.response?.data?.message || '移除失敗')
    }
  }
}

/* 清空購物車 */
const handleClear = async () => {
  try {
    await ElMessageBox.confirm('確定要清空整個購物車嗎?', '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await cartStore.clearCart()
    ElMessage.success('購物車已清空')
  } catch (err: any) {
    if (err !== 'cancel' && err !== 'close') {
      ElMessage.error(err?.response?.data?.message || '清空失敗')
    }
  }
}

onMounted(async () => {
  // 查看購物車前需驗證使用者是否是登入狀態
  if (!userStore.userInfo) {
    await ElMessageBox.alert('尚未登入無法查看購物車', '提示', {
      confirmButtonText: '返回'
    })
    await router.push({ name: 'logIn' })
    return
  }

  try {
    await cartStore.fetchCart()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <el-main class="cart-page overflow-auto">
    <div class="cart-inner">
      <div class="cart-titlebar">
        <h2 class="text-2xl font-serif">購物車</h2>
        <el-button @click="handleBack">返回</el-button>
      </div>

      <p v-if="loading" class="cart-hint">載入中...</p>

      <div v-else-if="cartStore.items.length === 0" class="cart-empty">
        <p class="cart-hint">購物車是空的</p>
        <el-button type="primary" @click="goOrder">去點餐</el-button>
      </div>

      <template v-else>
        <!-- 桌面版：表格 -->
        <div class="cart-table-wrap hidden lg:block">
          <el-table :data="cartStore.items" style="width: 100%">
            <el-table-column label="餐點" min-width="240">
              <template #default="{ row }">
                <div class="flex items-center gap-3">
                  <img :src="imageSrc(row)" alt="餐點圖片" class="cart-thumb" />
                  <div class="min-w-0">
                    <p class="truncate font-medium">{{ row.name }}</p>
                    <p class="cart-sub">{{ row.restaurant_name || '—' }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="單價" width="110" align="right">
              <template #default="{ row }">NT$ {{ row.price }}</template>
            </el-table-column>

            <el-table-column label="數量" width="150" align="center">
              <template #default="{ row }">
                <el-input-number
                    :model-value="row.quantity"
                    :min="1"
                    size="small"
                    @change="(val: number | undefined) => handleQuantityChange(row, val)"
                />
              </template>
            </el-table-column>

            <el-table-column label="小計" width="120" align="right">
              <template #default="{ row }">NT$ {{ row.subtotal }}</template>
            </el-table-column>

            <el-table-column label="操作" width="100" align="center">
              <template #default="{ row }">
                <el-button type="danger" link @click="handleRemove(row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 手機 / 平板版：卡片清單 -->
        <ul class="cart-list lg:hidden">
          <li v-for="row in cartStore.items" :key="row.id" class="cart-list__item">
            <div class="cart-list__row">
              <img :src="imageSrc(row)" alt="餐點圖片" class="cart-thumb" />
              <div class="min-w-0 flex-1 text-left">
                <p class="truncate font-medium">{{ row.name }}</p>
                <p class="cart-sub">{{ row.restaurant_name || '—' }}</p>
              </div>
            </div>

            <div class="cart-list__row">
              <span class="cart-sub">單價 NT$ {{ row.price }}</span>
              <span class="font-semibold">小計 NT$ {{ row.subtotal }}</span>
            </div>

            <div class="cart-list__row">
              <el-input-number
                  :model-value="row.quantity"
                  :min="1"
                  size="small"
                  @change="(val: number | undefined) => handleQuantityChange(row, val)"
              />
              <el-button type="danger" link @click="handleRemove(row)">移除</el-button>
            </div>
          </li>
        </ul>

        <div class="cart-footer">
          <span class="cart-total">總計 NT$ {{ cartStore.total }}</span>
          <div class="cart-actions">
            <el-button @click="handleClear">清空購物車</el-button>
            <el-button type="primary" disabled title="結帳功能開發中">結帳</el-button>
          </div>
        </div>
      </template>
    </div>
  </el-main>
</template>

<style scoped lang="scss">
/* el-main 本身維持滿版：它在 App.vue 的縱向 el-container 裡是 flex item，
   直接對它下 margin: 0 auto 會作用在交叉軸、覆蓋 stretch，導致寬度縮成內容寬。
   置中改由內層 .cart-inner 負責。 */
.cart-page {
  height: 100vh;
}

.cart-inner {
  margin: 0 auto;
  /* lg 以下（含平板）：接近滿版，只留 el-main 預設左右 padding */
}

/* lg 以上（表格版面）：收斂寬度並置中，欄位才不會被拉太散 */
@media (min-width: 1024px) {
  .cart-inner {
    max-width: 1200px;
  }
}

.cart-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.cart-table-wrap {
  overflow-x: auto;
}

/* 手機版品項卡片 */
.cart-list__item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color);
}

.cart-list__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.cart-thumb {
  height: 56px;
  width: 56px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.cart-sub {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.cart-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color);
}

.cart-total {
  font-size: 1.25rem;
  font-weight: 600;
}

.cart-actions {
  display: flex;
  gap: 12px;
}

.cart-empty {
  margin-top: 40px;
  text-align: center;

  .cart-hint {
    margin-bottom: 16px;
  }
}

.cart-hint {
  margin-top: 40px;
  text-align: center;
  font-size: 14px;
  color: var(--el-text-color-placeholder);
}

/* 手機版：底部列改垂直堆疊、按鈕撐滿 */
@media (max-width: 1024px) {
  .cart-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .cart-actions {
    flex-direction: column;
  }

  /* 直排時清掉 Element Plus 相鄰按鈕的左邊距 */
  .cart-actions :deep(.el-button + .el-button) {
    margin-left: 0;
  }
}
</style>
