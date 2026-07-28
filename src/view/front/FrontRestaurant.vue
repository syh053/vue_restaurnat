<script setup lang="ts">

import { Icon } from "@iconify/vue"
import Aside from "@/view/front/components/Aside.vue"
import { useRouter } from "vue-router"

/* 導航 */
const router = useRouter()

/* 切換至餐廳列表 */
const handleToRestaurantList = async () => {
  await router.push({name: 'frontRestaurant'})
}
</script>

<template>
  <el-container>
    <Aside>
      <template #default>
        <el-menu class="custom-menu">
          <el-menu-item class="justify-center" index="1" @click="handleToRestaurantList">
            <Icon icon="material-symbols:restaurant" width="24" height="24" />
            餐廳列表
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
