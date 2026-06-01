<script setup lang="ts">
import { onMounted, ref } from "vue"
import { getFrontRestaurantApi } from "@/api/front_restaurant"

const data = ref<string>('')

onMounted(async () => {
  const res = await getFrontRestaurantApi()

  data.value = res.data
})
</script>

<template>
  <el-container class="layout-container-demo h-screen">
    <el-aside class="border-r border-gray-200" width="200px">
      <el-menu>
        <el-menu-item class="justify-center" index="1" @click="handleToRestaurantList">
          餐廳列表
        </el-menu-item>
        <el-menu-item class="justify-center" index="2" @click="handleToRestaurantAdd">
          新增餐廳
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <div>
        <p>{{ data }}</p>
        <p>123456</p>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
