<script setup lang="ts">
import { reactive, ref } from "vue"
import { userLogInApi } from "@/api/user"
import type { FormInstance, FormRules } from "element-plus"
import type { UserLogIn } from "@/api/user/tpye.ts"
import { useRouter } from "vue-router"

/* 導航 */
const router = useRouter()


/* 表單相關 */
const form = reactive<UserLogIn>({
  name: '',
  password: '',
})

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules<UserLogIn>>({
  name: [{required: true, message: "請輸入名稱", trigger: "change"}],
  password: [{required: true, message: "請輸入密碼", trigger: "change"}],
})

/* 登入 */
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await userLogInApi(form)
      if (res.status === 200) {
        await router.push({ name: "frontRestaurant" })
      }
    } else {
      console.log('錯誤的使用者名稱或密碼', fields)
    }
  })
}

/* 跳轉到註冊頁 */
const jumpSignUp = async () => {
  await router.push({ name: "signUp" })
}
</script>

<template>
  <!-- 表單 -->
  <div class="px-5 my-5 md:bg-white">
    <h3 class="mt-10 text-2xl font-bold text-center">登入</h3>

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

      <el-form-item label="密碼" prop="password" required>
        <el-input type="password" v-model="form.password" placeholder="輸入密碼" show-password />
      </el-form-item>

      <el-form-item>
        <div class="flex gap-5 justify-end w-full text-right">
          <el-button type="primary" @click="onSubmit(ruleFormRef)">登入</el-button>
          <el-link type="primary" @click="jumpSignUp">註冊頁面</el-link>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>
