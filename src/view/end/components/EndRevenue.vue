<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue"
import { getRevenueApi } from "@/api/revenue"
import { getEndRestaurantApi } from "@/api/end_restaurant"
import type { Revenue, RevenueSearch } from "@/api/revenue/type.ts"
import type { EndRestaurantList } from "@/api/end_restaurant/type.ts"

/* 查詢條件 */
const dateRange = ref<[string, string] | null>(null)
const form = reactive<RevenueSearch>({restaurant_id: null})

/* 業者名下餐廳（供篩選） */
const restaurants = ref<EndRestaurantList[]>([])

const revenue = ref<Revenue>({total_revenue: 0, total_orders: 0, daily: [], restaurants: []})
const loading = ref(false)

/* 客單價 */
const average = computed(() =>
    revenue.value.total_orders ? Math.round(revenue.value.total_revenue / revenue.value.total_orders) : 0
)

const money = (value: number) => `NT$ ${value.toLocaleString()}`

/* 查詢營業額 */
const fetchRevenue = async () => {
  loading.value = true
  try {
    const res = await getRevenueApi({
      ...form,
      start_date: dateRange.value?.[0],
      end_date: dateRange.value?.[1],
    })
    revenue.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const res = await getEndRestaurantApi({address: '', current_page: 1, page_size: 100})
  restaurants.value = res.data[0]
  await fetchRevenue()
})
</script>

<template>
  <div class="p-3">
    <h3 class="text-2xl font-bold mb-4">營業額統計</h3>

    <el-form inline>
      <el-form-item label="日期區間">
        <el-date-picker v-model="dateRange" type="daterange" value-format="YYYY-MM-DD"
                        start-placeholder="起始日期" end-placeholder="結束日期" />
      </el-form-item>
      <el-form-item label="餐廳">
        <el-select v-model="form.restaurant_id" placeholder="全部餐廳" clearable style="width: 200px">
          <el-option v-for="item in restaurants" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="fetchRevenue">查詢</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="16" class="mb-4">
      <el-col :xs="24" :sm="8"><el-statistic title="總營業額" :value="revenue.total_revenue" prefix="NT$" /></el-col>
      <el-col :xs="24" :sm="8"><el-statistic title="總訂單數" :value="revenue.total_orders" /></el-col>
      <el-col :xs="24" :sm="8"><el-statistic title="平均客單價" :value="average" prefix="NT$" /></el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <h4 class="font-bold my-2">依日期</h4>
        <el-table :data="revenue.daily" v-loading="loading" empty-text="沒有已付款訂單">
          <el-table-column prop="date" label="日期" />
          <el-table-column prop="order_count" label="訂單數" />
          <el-table-column label="營業額">
            <template #default="{row}">{{ money(row.revenue) }}</template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :xs="24" :lg="12">
        <h4 class="font-bold my-2">各餐廳小計</h4>
        <el-table :data="revenue.restaurants" v-loading="loading" empty-text="沒有已付款訂單">
          <el-table-column prop="restaurant_name" label="餐廳" />
          <el-table-column prop="order_count" label="訂單數" />
          <el-table-column label="營業額">
            <template #default="{row}">{{ money(row.revenue) }}</template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
