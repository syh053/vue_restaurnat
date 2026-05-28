<script setup lang="ts">
import { userLogOutApi } from "@/api/user"
import { useRoute, useRouter } from "vue-router"
import { computed } from "vue"

const router = useRouter()
const headerRoute = useRoute()

/* 是否顯示 Header */
const showHeader = computed(() => {
  return headerRoute.name !== 'logIn' && headerRoute.name !==  'signUp'
})

const logOut = async () => {
  await userLogOutApi()
  await router.push({name: 'logIn'})
}
</script>

<template>
  <div v-if="showHeader" class="fixed top-0 left-0 right-0 h-(--header-height) z-9999">
    <el-menu
        class="el-menu-demo flex justify-end"
        mode="horizontal"
    >

      <el-sub-menu index="2">
        <template #title>
          <el-avatar
              :size="32"
              class="mr-3"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
        </template>
        <el-menu-item index="2" @click="logOut">
          登出
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>

  <router-view />
</template>


<style scoped>

</style>
