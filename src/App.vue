<script setup lang="ts">
import { Avatar, Plus } from "@element-plus/icons-vue"
</script>

<template>
  <div
      class="bg-[url(https://hips.hearstapps.com/hmg-prod/images/486cec61-814b-4c76-a41c-f19efa80a688-686e5b6b1ccb5.jpg)] bg-cover bg-center aspect-video w-[65%] mx-auto" />

  <div class="flex gap-10 justify-center mx-auto w-[50%] mt-5">
    <el-button plain>
      <router-link class="link-lg" :to="{name: 'logIn'}">
        登入
        <el-icon>
          <Avatar />
        </el-icon>
      </router-link>
    </el-button>

    <el-button plain>
      <router-link class="link-lg" :to="{name: 'signUp'}">
        註冊
        <el-icon class="el-icon--right">
          <Plus />
        </el-icon>
      </router-link>
    </el-button>
  </div>

  <router-view />

</template>


<style scoped>
.link-lg {
  font-size: 18px;
  line-height: 1.5;
}
</style>
