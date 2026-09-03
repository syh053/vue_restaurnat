<script setup lang="ts">

import { computed } from "vue"
import { useUserStore } from "@/stores/user.ts"

import { Icon } from "@iconify/vue"
import {useRoute, useRouter} from "vue-router"
import Aside from "@/components/Aside.vue"

/* 導航 */
const router = useRouter()
const route = useRoute()

/* 依目前路由決定 Aside 要高亮哪個項目（對應下方 el-menu-item 的 index） */
const activeMenuIndex = computed(() => {
  if (route.name === 'frontRestaurantMenuAll') return '3'
  if (route.name === 'endRestaurantAll') return '2'
  return '1'
})

/* 初始化 Store */
const userStore = useUserStore()

/* 切換至餐廳列表 */
const handleToRestaurantList = async () => {
  await router.push({name: 'frontRestaurant'})
}

/* 切換至後台餐廳列表 */
const handleToEndRestaurantList = async () => {
  await router.push({name: 'endRestaurantAll'})
}

/* 切換至餐廳點餐列表 */
const handleToMenuOrderList = async () => {
  await router.push({name: 'frontRestaurantMenuAll'})
}
</script>

<template>
  <el-container>
    <Aside v-if="!route.path.includes('/front/restaurant/menu/')">
      <template #default>
        <el-menu class="custom-menu" :default-active="activeMenuIndex">
          <el-menu-item class="justify-center" index="1" @click="handleToRestaurantList">
            <Icon icon="material-symbols:restaurant" width="24" height="24" />
            前台餐廳列表
          </el-menu-item>
          <el-menu-item class="justify-center" index="3" @click="handleToMenuOrderList">
            <Icon icon="material-symbols:menu-book-outline" width="24" height="24" />
            餐廳點餐
          </el-menu-item>
          <el-menu-item v-if="userStore.userInfo?.is_admin" class="justify-center" index="2"
                        @click="handleToEndRestaurantList">
            <Icon icon="hugeicons:manager" width="24" height="24" />
            後台餐廳列表
          </el-menu-item>
        </el-menu>
      </template>
    </Aside>

    <router-view />

  </el-container>
</template>

<style scoped lang="scss">
@use "@/common" as common;

.custom-menu {
  @include common.no-border-right;
}
</style>
