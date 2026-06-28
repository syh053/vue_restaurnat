<script setup lang="ts">
import { useRouter } from "vue-router"
import { Icon } from '@iconify/vue'
import { ref } from "vue"
import EndRestaurantCrud from "@/view/end/components/EndRestaurantCRUD.vue"
import Aside from "@/view/end/components/Aside.vue"


/* 導航 */
const router = useRouter()

/* 切換至後台餐廳列表 */
const handleToRestaurantList = async () => {
  await router.push({name: 'endRestaurantAll'})
}

const handleToRestaurantAdd = async () => {
  dialogTitle.value = '新增餐廳'
  showDialog.value = true
}


/* 新增餐廳 */
const showDialog = ref<boolean>(false)
const dialogTitle = ref<string>('')


const updatedData = async () => {
  showDialog.value = false
  window.location.reload()
}


</script>

<template>
  <el-container>
    <Aside>
      <template #default>
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
      </template>
    </Aside>

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

</style>
