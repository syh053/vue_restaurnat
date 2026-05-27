<script setup lang="ts">
import { ref } from 'vue'
import { userLogOutApi } from "@/api/user"
import { useRouter } from "vue-router"

const router = useRouter()

/* header */
const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const logOut = async () => {
  await userLogOutApi()
  await router.push({name: 'logIn'})
}
</script>

<template>
  <div class="fixed top-0 left-0 right-0 h-(--header-height) z-9999">
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo flex justify-end"
        mode="horizontal"
        @select="handleSelect"
    >
      <el-menu-item index="1">
        <router-link :to="{ name: 'logIn' }">登入</router-link>
      </el-menu-item>
      <el-menu-item index="2" @click="logOut">
        登出
      </el-menu-item>
    </el-menu>
  </div>

  <router-view />
</template>


<style scoped>

</style>
