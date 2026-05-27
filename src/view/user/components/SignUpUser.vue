<script setup lang="ts">
import { reactive, ref } from "vue"
import { postUserApi } from "@/api/user"
import type { FormInstance, FormRules } from "element-plus"
import type { UserPost } from "@/api/user/tpye.ts"
import { useRouter } from "vue-router"


const router = useRouter()

/* 表單相關 */
const checkPassword = (_rule: any, value: any, cb: any) => {
  if (value !== form.password) {
    cb(new Error("密碼不一致"))
  } else {
    cb()
  }
}

const form = reactive<UserPost>({
  name: '',
  email: '',
  password: '',
  confirm_password: '',
})

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules<UserPost>>({
  name: [{required: true, message: "請輸入名稱", trigger: "change"}],
  email: [
    {required: true, message: "請輸入 email", trigger: "change"},
    {type: "email", message: "輸入格式錯誤", trigger: "blur"}],
  password: [{required: true, message: "請輸入密碼", trigger: "change"}],
  confirm_password: [
    {required: true, message: "請輸入確認密碼", trigger: "change"},
    {validator: checkPassword, message: "與密碼不一致", trigger: "blur"}
  ],
})

/* 註冊 */
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await postUserApi(form)
    } else {
      console.log('錯誤的驗證!', fields)
    }
  })
}

/* 登入 */
const jumpSignIn = async () => {
  await router.push({ name: "logIn" })
}
</script>

<template>
  <!-- 表單 -->
  <div class="px-5 my-5 md:bg-white">
    <h3 class="mt-10 text-2xl font-bold text-center">註冊</h3>

    <el-form
        class="mx-auto mt-5"
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        label-width="auto"
        style="max-width: 600px"
    >
      <el-form-item label="使用者名稱" prop="name" required>
        <el-input v-model="form.name" placeholder="輸入名稱" />
      </el-form-item>

      <el-form-item label="email" prop="email" required>
        <el-input v-model="form.email" placeholder="輸入信箱" />
      </el-form-item>

      <el-form-item label="密碼" prop="password" required>
        <el-input type="password" v-model="form.password" placeholder="輸入密碼" show-password />
      </el-form-item>

      <el-form-item label="確認密碼" prop="confirm_password" required>
        <el-input type="password" v-model="form.confirm_password" placeholder="確認密碼" show-password />
      </el-form-item>

      <el-form-item>
        <div class="flex gap-5 justify-end w-full text-right">
          <el-button type="primary" @click="onSubmit(ruleFormRef)">建立</el-button>
          <el-link type="primary" @click="jumpSignIn">登入頁面</el-link>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>
