<script setup lang="ts">
import { useRouter } from "vue-router"

/* 導航 */
const router = useRouter()

const backToHome = () => {
  router.push({ name: 'frontRestaurant' })
}
</script>

<template>
  <div class="not-found flex flex-col items-center justify-center gap-6 text-center px-5">
    <h1 class="code">404</h1>
    <p class="text-xl text-gray-600">抱歉，此頁面尚不存在</p>
    <el-button type="primary" size="large" @click="backToHome">返回首頁</el-button>
  </div>
</template>

<style scoped>
.not-found {
  min-height: calc(100vh - var(--header-height));
  margin-top: var(--header-height);
}

.code {
  font-size: clamp(4rem, 12vw, 8rem);
  font-weight: 700;
  line-height: 1;
  color: #d1d5db;
}
</style>
