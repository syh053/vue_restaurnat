<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue"
import Aside from "@/view/front/components/Aside.vue"
import type { EndRestaurantList, EndRestaurantSearch } from "@/api/end_restaurant/type.ts"

import { ElMessageBox } from "element-plus"
import { useRouter } from "vue-router"
import { Icon } from "@iconify/vue"
import { getFrontRestaurantApi } from "@/api/front_restaurant"

/* 導航 */
const router = useRouter()

/* 切換至餐廳列表 */
const handleToRestaurantList = async () => {
  await router.push({name: 'frontRestaurant'})
}

/* 查詢 */
const formInline = reactive<EndRestaurantSearch>({
  id: '',
  name: '',
  tel: '',
  openingHours: null,
  address: '',
  description: '',
  current_page: 1,
  page_size: 10,
})

/* 資料與狀態 */
const tableData = ref<EndRestaurantList[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)

// 計算是否已經載入完所有資料
const noMore = computed(() => tableData.value.length >= total.value && total.value > 0)
// 是否禁用無限捲動（載入中或沒有更多資料時禁用）
const disabled = computed(() => loading.value || noMore.value)

/* 核心載入函式 */
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

// 初始化時直接執行第一次載入
onMounted(() => {
  loadData()
})
</script>

<template>
  <el-container>
    <Aside>
      <template #default>
        <el-menu>
          <el-menu-item class="justify-center" index="1" @click="handleToRestaurantList">
            <Icon icon="material-symbols:restaurant" width="24" height="24" />
            餐廳列表
          </el-menu-item>
        </el-menu>
      </template>
    </Aside>
    <el-main class="h-screen w-full overflow-auto"
             v-infinite-scroll="loadData"
             :infinite-scroll-disabled="disabled"
             :infinite-scroll-distance="20">
      <div class="grid grid-cols-[repeat(auto-fit,minmax(700px,1fr))] gap-4 mt-6">
        <el-card class="w-full" v-for="(item, index) in tableData" :key="index">
          <template #header>
            <div class="card-header">
              <span class="truncate w-50 inline-block h-full">{{ item.name }}</span>
            </div>
          </template>
          <img
              :src="item.image ? 'http://localhost:8888' + item.image : 'https://sansalife.tw/wp-content/uploads/2023/04/caesarmetro-restaurant-14_%E7%BB%93%E6%9E%9C-jpg.webp'"
              alt="圖片"
              style="height: 350px; width: 100%; object-fit: cover;"
          />
          <div class="grid grid-cols-[100px_1fr] gap-y-2 p-3">
            <span class="text-left">電話：</span>
            <span>{{ item.tel }}</span>

            <span class="text-left">營業時長：</span>
            <span>{{ item.openingHours }}</span>

            <span class="text-left">地址：</span>
            <span>{{ item.address }}</span>
          </div>
          <template #footer>{{ item.description || '無' }}</template>
        </el-card>
      </div>

      <div class="text-center mt-6 mb-6 text-gray-400 text-sm">
        <p v-if="loading">載入中...</p>
        <p v-if="noMore">沒有更多餐廳了</p>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
