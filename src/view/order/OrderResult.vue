<script setup lang="ts">

import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { getOrderDetailApi } from "@/api/order"
import type { Order } from "@/api/order/type.ts"

/* 導航 */
const router = useRouter()

/* 狀態 */
const loading = ref<boolean>(true)
const order = ref<Order | null>(null)
const errorMessage = ref<string>('')

const STATUS_TEXT: Record<string, string> = {
  pending: '付款處理中，請稍後重新查詢',
  paid: '付款成功',
  failed: '付款失敗',
  cancelled: '訂單已取消',
}

const statusText = (status: string) => STATUS_TEXT[status] ?? status

const resultIcon = (status: string) => {
  if (status === 'paid') return 'success'
  if (status === 'failed') return 'error'
  return 'info'
}

/* 查詢結帳後建立的訂單狀態（訂單 id 於結帳時存入 sessionStorage） */
const fetchResult = async () => {
  const orderId = sessionStorage.getItem('pendingOrderId')
  if (!orderId) {
    errorMessage.value = '找不到訂單資訊'
    loading.value = false
    return
  }

  loading.value = true
  try {
    const res = await getOrderDetailApi(orderId)
    order.value = res.data.data
  } catch (err: any) {
    if (err?.response?.status === 401) {
      await router.push({ name: 'logIn' })
      return
    }
    errorMessage.value = err?.response?.data?.message || '查詢訂單失敗'
  } finally {
    loading.value = false
  }
}

/* 繼續點餐 */
const goOrder = () => {
  router.push({ name: 'frontRestaurantMenuAll' })
}

/* 回購物車 */
const goCart = () => {
  router.push({ name: 'frontCart' })
}

onMounted(fetchResult)
</script>

<template>
  <el-main class="result-page overflow-auto">
    <div class="result-inner">
      <p v-if="loading" class="result-hint">查詢中...</p>

      <el-result
          v-else-if="order"
          :icon="resultIcon(order.status)"
          :title="statusText(order.status)"
          :sub-title="`訂單編號：${order.merchant_trade_no}`"
      >
        <template #extra>
          <p class="mb-4">應付金額 NT$ {{ order.total_amount }}</p>
          <el-button v-if="order.status === 'pending'" @click="fetchResult">重新查詢付款狀態</el-button>
          <el-button type="primary" @click="goOrder">繼續點餐</el-button>
        </template>
      </el-result>

      <el-result v-else icon="warning" :title="errorMessage || '查無訂單資訊'">
        <template #extra>
          <el-button type="primary" @click="goCart">前往購物車</el-button>
        </template>
      </el-result>
    </div>
  </el-main>
</template>

<style scoped lang="scss">
.result-page {
  height: 100vh;
}

.result-inner {
  margin: 0 auto;
  max-width: 640px;
}

.result-hint {
  margin-top: 40px;
  text-align: center;
  font-size: 14px;
  color: var(--el-text-color-placeholder);
}
</style>
