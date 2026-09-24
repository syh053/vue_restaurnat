<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { Icon } from '@iconify/vue'
import { computed, ref, useTemplateRef } from "vue"
import EndRestaurantCrud from "@/view/end/components/EndRestaurantCRUD.vue"
import Aside from "@/components/Aside.vue"


/* 導航 */
const route = useRoute()
const router = useRouter()

/* 子頁面（router-view）元件實例，用來呼叫子頁面自身暴露的新增方法 */
interface ChildViewExposed {
  openAddDialog?: () => void
}
const childView = useTemplateRef<ChildViewExposed>('childView')

/* 目前是否位於菜單管理頁，決定 Aside 新增按鈕的文字與行為 */
const isMenuPage = computed(() => route.name === 'endRestaurantMenu')

/* 路由切換 */
const handleToRestaurantList = async () => {
  await router.push({name: 'endUserAdmin'})
}

/* 菜單管理頁時新增餐點，其餘頁面新增餐廳 */
const handleToRestaurantAdd = () => {
  if (isMenuPage.value) {
    childView.value?.openAddDialog?.()
    return
  }

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
        <el-menu class="custom-menu">
          <el-menu-item class="justify-center" index="1" @click="handleToRestaurantList">
            <Icon icon="subway:admin" width="24" height="24" />
            後台使用者
          </el-menu-item>
          <el-menu-item class="justify-center" index="2" @click="handleToRestaurantAdd">
            <Icon icon="material-symbols:add" width="24" height="24" />
            {{ isMenuPage ? '新增餐點' : '新增餐廳' }}
          </el-menu-item>
        </el-menu>
      </template>
    </Aside>

    <el-main>
      <div>
        <router-view v-slot="{ Component }">
          <component :is="Component" ref="childView" />
        </router-view>
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

<style scoped lang="scss">
@use "@/common" as common;

.custom-menu {
  @include common.no-border-right;
}
</style>
