<script setup lang="ts">
import { useUserStore } from "@/stores/user.ts"
import { useThemeStore } from "@/stores/theme.ts"
import { useCartStore } from "@/stores/cart.ts"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Moon, ShoppingCart, Sunny } from "@element-plus/icons-vue"

/* 導航 */
const router = useRouter()
const headerRoute = useRoute()

/* 初始化 Store */
const userStore = useUserStore()
const themeStore = useThemeStore()
const cartStore = useCartStore()

/* 購物車跟隨登入狀態：登入（或重整還原）時載入購物車，登出時清空 */
watch(() => userStore.userInfo, (info) => {
  if (info) {
    cartStore.fetchCart()
  } else {
    cartStore.reset()
  }

}, { immediate: true })

/* 是否顯示 Header */
const showHeader = computed(() => {
  return headerRoute.name !== 'logIn' && headerRoute.name !== 'signUp'
})

const logOut = async () => {
  await userStore.logout()
  await router.push({ name: 'logIn' })
}

const backTOHome = () => {
  router.push({ name: 'frontRestaurant' })
}

/* menu 選單 */
const activeIndex = ref('0')

/* 前往使用者資訊頁面 */
const toUserInfo = async () => {
  await router.push({ name: 'userInfo' })
}

// 取得圖片前綴
const API_BASE_URL = import.meta.env.VITE_API_URL
</script>

<template>
  <el-container class="h-screen w-full">
    <el-header v-if="showHeader" class="fixed top-0 left-0 right-0 h-(--header-height) z-9999">
      <div>
        <el-menu
            class="el-menu-demo flex justify-between"
            :default-active="activeIndex"
            :ellipsis="false"
            mode="horizontal"
        >
          <el-menu-item index="1" @click="backTOHome">
            <img style="height: 50px" src="https://i.urusai.cc/rDCqj.png"
              alt="Element logo" />
          </el-menu-item>

          <div class="flex items-center">
            <el-badge
              :value="cartStore.count"
              :hidden="cartStore.count === 0"
              class="mr-3 self-center"
            >
              <el-button
                circle
                :icon="ShoppingCart"
                title="購物車"
                @click="router.push({ name: 'frontCart' })"
              />
            </el-badge>

            <el-button
              circle
              class="mr-3 self-center"
              :icon="themeStore.mode === 'dark' ? Sunny : Moon"
              :title="themeStore.mode === 'dark' ? '切換為淺色背景' : '切換為深色背景'"
              @click="themeStore.toggleTheme()"
            />

            <el-sub-menu index="2">
              <template #title>
                <el-avatar
                :size="32"
                class="mr-2"
                :src="userStore.userInfo?.image ? API_BASE_URL + userStore.userInfo.image
                  : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                />
                <span class="hidden sm:inline">{{ userStore.userInfo?.name }}</span>
              </template>
              <el-menu-item index="2-1" @click="toUserInfo">
                使用者資訊
              </el-menu-item>
              <el-menu-item index="2-2" @click="logOut">
                登出
              </el-menu-item>
            </el-sub-menu>
          </div>
        </el-menu>
      </div>
    </el-header>

    <router-view />
  </el-container>
</template>


<style scoped></style>
