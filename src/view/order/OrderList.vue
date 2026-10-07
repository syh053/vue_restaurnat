<script setup lang="ts">

import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { ElMessage, ElMessageBox } from "element-plus"
import dayjs from "dayjs"
import { useUserStore } from "@/stores/user.ts"
import { getOrderListApi } from "@/api/order"
import type { Order } from "@/api/order/type.ts"

/* 導航 */
const router = useRouter()

/* 初始化 Store */
const userStore = useUserStore()

/* 狀態 */
const loading = ref<boolean>(true)
const orders = ref<Order[]>([])
const activeNames = ref<string[]>([])

const STATUS_TEXT: Record<string, string> = {
  pending: '付款處理中',
  paid: '付款成功',
  failed: '付款失敗',
  cancelled: '訂單已取消',
}

const statusText = (status: string) => STATUS_TEXT[status] ?? status

const statusTagType = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
  if (status === 'paid') return 'success'
  if (status === 'failed') return 'danger'
  if (status === 'cancelled') return 'info'
  return 'warning' // pending
}

const formatDate = (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm')

/* 返回上一頁 */
const handleBack = () => {
  router.back()
}

/* 去點餐 */
const goOrder = () => {
  router.push({ name: 'frontRestaurantMenuAll' })
}

/* 查詢我的訂單列表 */
const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await getOrderListApi()
    orders.value = res.data.data
  } catch (err: any) {
    if (err?.response?.status === 401) {
      await router.push({ name: 'logIn' })
      return
    }
    ElMessage.error(err?.response?.data?.message || '查詢訂單列表失敗')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // 查看訂單前需驗證使用者是否是登入狀態
  if (!userStore.userInfo) {
    await ElMessageBox.alert('尚未登入無法查看訂單', '提示', {
      confirmButtonText: '返回'
    })
    await router.push({ name: 'logIn' })
    return
  }

  await fetchOrders()
})
</script>

<template>
  <el-main class="order-list-page overflow-auto">
    <div class="order-list-inner">
      <div class="order-list-titlebar">
        <h2 class="text-2xl font-serif">我的訂單</h2>
        <el-button @click="handleBack">返回</el-button>
      </div>

      <p v-if="loading" class="order-list-hint">載入中...</p>

      <div v-else-if="orders.length === 0" class="order-list-empty">
        <p class="order-list-hint">目前還沒有任何訂單</p>
        <el-button type="primary" @click="goOrder">去點餐</el-button>
      </div>

      <el-collapse v-else v-model="activeNames">
        <el-collapse-item v-for="order in orders" :key="order.id" :name="order.id">
          <template #title>
            <div class="order-summary">
              <div class="order-summary__main">
                <span class="font-medium">訂單編號 {{ order.merchant_trade_no }}</span>
                <span class="order-sub">{{ formatDate(order.created_at) }}</span>
              </div>
              <div class="order-summary__meta">
                <el-tag :type="statusTagType(order.status)" size="small">{{ statusText(order.status) }}</el-tag>
                <span class="font-semibold">NT$ {{ order.total_amount }}</span>
              </div>
            </div>
          </template>

          <ul class="order-items">
            <li v-for="item in order.items" :key="item.id" class="order-items__row">
              <span>{{ item.name }} x {{ item.quantity }}</span>
              <span>NT$ {{ item.subtotal }}</span>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-main>
</template>

<style scoped lang="scss">
.order-list-page {
  height: 100vh;
}

.order-list-inner {
  margin: 0 auto;
  max-width: 900px;
}

.order-list-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 16px 0;
}

.order-summary {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-right: 12px;
  flex-wrap: wrap;
}

.order-summary__main,
.order-summary__meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-sub {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-items__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.order-list-empty {
  margin-top: 40px;
  text-align: center;

  .order-list-hint {
    margin-bottom: 16px;
  }
}

.order-list-hint {
  margin-top: 40px;
  text-align: center;
  font-size: 14px;
  color: var(--el-text-color-placeholder);
}
</style>
