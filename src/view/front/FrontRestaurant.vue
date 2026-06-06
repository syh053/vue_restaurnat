<script setup lang="ts">
import { onMounted, ref } from "vue"
import { getFrontRestaurantApi } from "@/api/front_restaurant"
import Aside from "@/view/front/components/Aside.vue"

const data = ref<string>('')

onMounted(async () => {
  const res = await getFrontRestaurantApi()

  data.value = res.data
})
</script>

<template>
  <el-container>
    <Aside>
      <template #default>
        <el-menu>
          <el-menu-item class="justify-center" index="1" @click="">
            餐廳列表
          </el-menu-item>
          <el-menu-item class="justify-center" index="2" @click="">
            新增餐廳
          </el-menu-item>
        </el-menu>
      </template>
    </Aside>
    <el-main class="h-screen w-full">
      <div>
        <p>{{ data }}</p>
        <p>123456</p>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
