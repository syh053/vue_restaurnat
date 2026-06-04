<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { Icon } from '@iconify/vue'
import { ref } from "vue"
import EndRestaurantCrud from "@/view/end/EndRestaurantCRUD.vue"

/* 導航 */
const router = useRouter()

/* 讀取當前路由資訊 */
const route = useRoute()
console.log('current route:', route.fullPath)
console.log('matched:', route.matched)

/* 切換至後台餐廳列表 */
const handleToRestaurantList = async () => {
  await router.push({name: 'endRestaurantAll'})
}

/* 新增餐廳 */
const showDialog = ref<boolean>(false)
const dialogTitle = ref<string>('')

const handleToRestaurantAdd = async () => {
  dialogTitle.value = '新增餐廳'
  showDialog.value = true
}

const updatedData = async () => {
  showDialog.value = false
}


</script>

<template>
  <el-container class="layout-container-demo h-screen">
    <el-aside class="border-r border-gray-200 pt-5" width="200px">
      <el-menu>
        <el-menu-item class="justify-center" index="1" @click="handleToRestaurantList">
          <Icon icon="material-symbols:restaurant" width="24" height="24" />
          後台餐廳列表
        </el-menu-item>
        <el-menu-item class="justify-center" index="2" @click="handleToRestaurantAdd">
          <Icon icon="material-symbols:add" width="24" height="24" />
          新增餐廳
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <div>
        <router-view />
      </div>
    </el-main>
  </el-container>


  <EndRestaurantCrud
      v-if="showDialog"
      v-model="showDialog"
      :show-title="dialogTitle"
      @update="updatedData"
  />
</template>

<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.el-menu-item {
  border-bottom: 1px solid #e5e7eb;
}
</style>
