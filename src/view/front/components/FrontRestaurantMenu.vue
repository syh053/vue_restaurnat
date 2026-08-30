<script setup lang="ts">

import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { ElMessageBox } from "element-plus"
import { Icon } from "@iconify/vue"
import Aside from "@/components/Aside.vue"
import { getFrontMenuApi } from "@/api/menu"
import type { MenuItem } from "@/api/menu/type.ts"

/* 導航 */
const route = useRoute()
const router = useRouter()

/* 路由參數 */
const restaurantId = route.params.id as string
const restaurantName = (route.query.name as string) || '餐廳'

/* 資料 */
const menuList = ref<MenuItem[]>([])
const loading = ref<boolean>(true)

/* 依分區分組（後端已依 section, name 排序） */
const grouped = computed(() => {
  const map: Record<string, MenuItem[]> = {}
  for (const item of menuList.value) {
    const key = item.section || '未分類'
    ;(map[key] ??= []).push(item)
  }
  return map
})

/* 分區名稱清單（順序與下方 section 迴圈一致） */
const sectionKeys = computed(() => Object.keys(grouped.value))

/* 取得圖片前綴 */
const API_BASE_URL = import.meta.env.VITE_API_URL

const FALLBACK_IMG = 'https://sansalife.tw/wp-content/uploads/2023/04/caesarmetro-restaurant-14_%E7%BB%93%E6%9E%9C-jpg.webp'

const imageSrc = (item: MenuItem) => item.image ? API_BASE_URL + item.image : FALLBACK_IMG

/* 返回上一頁 */
const handleBack = () => {
  router.back()
}

/* 左側分區導覽 */
const activeSection = ref<string>('0')

/* 點擊分區：捲動並立即高亮 */
const scrollToSection = (index: number) => {
  activeSection.value = String(index)
  document
    .getElementById(`section-${index}`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* 依捲動位置更新高亮（scrollspy） */
const onScroll = (e: Event) => {
  const el = e.currentTarget as HTMLElement

  const threshold = el.getBoundingClientRect().top + 80
  let current = '0'
  sectionKeys.value.forEach((_, index) => {
    const node = document.getElementById(`section-${index}`)
    if (node && node.getBoundingClientRect().top <= threshold) {
      current = String(index)
    }
  })
  activeSection.value = current
}

onMounted(async () => {
  try {
    const res = await getFrontMenuApi(restaurantId)
    menuList.value = res.data || []
  } catch (err) {
    await ElMessageBox.alert('尚未登入無法查看菜單', '提示', {
      confirmButtonText: '返回'
    })
    await router.push({ name: 'logIn' })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <el-container class="menu-page h-screen overflow-hidden">
    <Aside v-if="!loading && sectionKeys.length > 0">
      <el-menu class="section-menu" :default-active="activeSection">
        <el-menu-item
            class="flex justify-center"
            v-for="(section, index) in sectionKeys"
            :key="section"
            :index="String(index)"
            @click="scrollToSection(index)"
        >
          <Icon icon="material-symbols:label-outline" width="18" height="18" />
          <span class="ml-1">{{ section }}</span>
        </el-menu-item>
      </el-menu>
    </Aside>

    <el-main class="menu-page__main overflow-auto" @scroll="onScroll">
      <div class="menu-titlebar">
        <h2 class="text-2xl font-serif">{{ restaurantName }} — 菜單</h2>
        <el-button @click="handleBack">返回</el-button>
      </div>

      <p v-if="loading" class="menu-hint">載入中...</p>

      <p v-else-if="menuList.length === 0" class="menu-hint">
        此餐廳尚未提供菜單
      </p>

      <template v-else>
        <section
            v-for="(items, section, index) in grouped"
            :id="`section-${index}`"
            :key="section"
            class="menu-section"
        >
          <h3 class="menu-section__title">{{ section }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <el-card v-for="item in items" :key="item.id" class="w-full">
              <template #header>
                <div class="flex justify-between items-center gap-2">
                  <span class="truncate font-medium">{{ item.name }}</span>
                  <span class="text-primary whitespace-nowrap">NT$ {{ item.price }}</span>
                </div>
              </template>
              <img :src="imageSrc(item)" alt="餐點圖片" class="menu-card__img" />
              <template #footer>
                <span class="menu-card__desc">{{ item.description || '無' }}</span>
              </template>
            </el-card>
          </div>
        </section>
      </template>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
@use "@/common" as common;

/* 錨點捲動時預留頂部固定 header 的高度，避免分區標題被蓋住 */
.menu-page__main {
  scroll-padding-top: 80px;
}

.section-menu {
  @include common.no-border-right;
}

.menu-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.menu-section {
  margin-bottom: 32px;
}

.menu-section__title {
  font-size: 1.25rem;
  font-weight: 600;
  padding-bottom: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color);
}

.menu-card__img {
  height: 200px;
  width: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.menu-card__desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.menu-hint {
  margin-top: 40px;
  text-align: center;
  font-size: 14px;
  color: var(--el-text-color-placeholder);
}
</style>
