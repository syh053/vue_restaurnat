<script setup lang="ts">

import { computed, onMounted, reactive, ref } from "vue"
import type { Category, EndRestaurantList, EndRestaurantSearch } from "@/api/end_restaurant/type.ts"

import { ElMessageBox } from "element-plus"
import { getFrontRestaurantApi } from "@/api/front_restaurant"
import { get_categoryApi } from "@/api/end_restaurant"
import { useRouter } from "vue-router"

/* 導航 */
const router = useRouter()

/* 查詢條件 */
const formInline = reactive<EndRestaurantSearch>({
  name: '',
  category_name: '',
  address: '',
  current_page: 1,
  page_size: 10,
})

/* 分類選項 */
const categoryData = ref<Category[]>([])

/* 資料與狀態 */
const tableData = ref<EndRestaurantList[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)

// 計算是否已經載入完所有資料
const noMore = computed(() => tableData.value.length >= total.value && total.value > 0)

// 是否禁用無限捲動（載入中或沒有更多資料時禁用）
const disabled = computed(() => loading.value || noMore.value)

/* 核心載入函式（累加下一頁） */
const loadData = async () => {
  if (disabled.value) return

  loading.value = true
  try {
    const res = await getFrontRestaurantApi(formInline)
    const newList = res.data[0] || []
    total.value = res.data[1] || 0

    // 將新資料「累加」到現有的陣列中，而不是覆蓋
    tableData.value.push(...newList)

    // 成功載入後，將頁碼準備好給下一次呼叫
    formInline.current_page++
  } catch (err) {
    await ElMessageBox.alert('尚未登入無法查看餐廳', '提示', {
      confirmButtonText: '返回'
    })
    await router.push({name: 'logIn'})
  } finally {
    loading.value = false
  }
}

/* 查詢：清空結果並從第一頁重載 */
const handleSearch = async () => {
  tableData.value = []
  total.value = 0
  formInline.current_page = 1
  await loadData()
}

/* 進入該餐廳菜單頁開始點餐 */
const goMenu = (item: EndRestaurantList) => {
  router.push({
    name: 'frontRestaurantMenu',
    params: { id: item.id },
    query: { name: item.name }
  })
}

// 初始化時載入分類選項與第一頁餐廳資料
onMounted(async () => {
  const category_res = await get_categoryApi()
  categoryData.value = category_res.data

  await loadData()
})

// 取得圖片前綴
const API_BASE_URL = import.meta.env.VITE_API_URL
</script>

<template>
  <el-main class="h-screen w-full overflow-auto"
           v-infinite-scroll="loadData"
           :infinite-scroll-disabled="disabled"
           :infinite-scroll-distance="20">
    <!-- 搜尋面板 -->
    <el-form :inline="true" :model="formInline" class="flex flex-wrap gap-x-5 gap-y-3 mt-6">
      <el-form-item label="餐廳名稱">
        <el-input v-model="formInline.name" placeholder="模糊查詢" clearable @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item label="分類">
        <el-select v-model="formInline.category_name" placeholder="全部" clearable class="w-40">
          <el-option
              v-for="category in categoryData"
              :key="category.id"
              :label="category.name"
              :value="category.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="formInline.address" placeholder="模糊查詢" clearable @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查詢</el-button>
      </el-form-item>
    </el-form>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
      <el-card
          class="w-full clickable-card" v-for="(item) in tableData" :key="item.id" @click="goMenu(item)"
          body-class="flex flex-row gap-4"
      >
        <img
            :src="item.image ?
            API_BASE_URL + item.image
            : 'https://sansalife.tw/wp-content/uploads/2023/04/caesarmetro-restaurant-14_%E7%BB%93%E6%9E%9C-jpg.webp'"
            alt="圖片"
            style="width: 45%; height: 200px; object-fit: cover;"
        />
        <div class="flex flex-col justify-start items-start gap-2 min-w-0">
          <span class="font-bold truncate">{{ item.name }}</span>
          <span class="text-sm text-gray-500">{{ item.address }}</span>
          <span class="text-sm text-gray-500">{{ item.description || '無' }}</span>
        </div>
      </el-card>
    </div>

    <div class="text-center mt-6 mb-6 text-gray-400 text-sm">
      <p v-if="loading">載入中...</p>
      <p v-else-if="total === 0">查無符合條件的餐廳</p>
      <p v-else-if="noMore">沒有更多餐廳了</p>
    </div>
  </el-main>
</template>

<style lang="scss" scoped>
.clickable-card {
  cursor: pointer;
  transition: transform 0.6s ease;;

  &:hover {
    transform: translateY(-2px) scale(1.015);
  }
}
</style>
