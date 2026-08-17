<script setup lang="ts">
import {useUserStore} from "@/stores/user.ts";
import {UserRole} from "@/enums/user_access.ts";
import {reactive} from "vue";
import type {UserInfoUpdate} from "@/api/user/tpye.ts";

/* 取得 userStore */
const userStore = useUserStore()

/* 資訊 */
const userForm = reactive<UserInfoUpdate>({
  name: userStore.userInfo?.name ?? '',
  email: userStore.userInfo?.email ?? '',
})

/* 送出表單 */
const submitForm = async () => {
  await userStore.userInfoUpdate(userForm)
}
</script>

<template>
  <div class="user-container mx-auto mt-(--header-height)" v-cloak>
    <h2 class="my-8"><strong class="me-3">{{ userForm.name }}</strong>的資料編輯畫面</h2>

    <div class="card">
      <label class="mx-auto">姓名 :</label>
      <input type="text" class="input border w-full text-xl" v-model="userForm.name"
             placeholder="My awesome page"/>

      <label class="mx-auto">信箱 :</label>
      <input type="text" class="input border w-full text-xl" v-model="userForm.email"
             placeholder="my-awesome-page"/>

      <label class="mx-auto">權限 :</label>
      <input type="text" class="input border w-full text-xl"
             :value="userStore.userInfo?.is_admin ? UserRole.ADMIN : UserRole.USER" disabled/>


      <button class="btn col-start-2 justify-self-end me-10" @click="submitForm">編輯</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
h2 {
  strong {
    font-family: fangsong;
    font-size: 2em;
    color: darkred;
  }
}
</style>