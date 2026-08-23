<script setup lang="ts">
import type { UserLogIn } from "@/api/user/tpye.ts"
import { useUserStore } from "@/stores/user.ts"
import type { FormInstance, FormRules } from "element-plus"
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"

/* 導航 */
const router = useRouter()

/* 初始化 Store */
const userStore = useUserStore()

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

/* Floating label focus 狀態 */
const nameFocused = ref(false)
const passwordFocused = ref(false)

/* 登入 */
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  try {
    await formEl.validate()

    await userStore.login(form)

    await router.push({ name: "frontRestaurant" })
  } catch (fields) {
    console.log("驗證失敗", fields)
  }
}

/* 跳轉到註冊頁 */
const jumpSignUp = async () => {
  await router.push({ name: "signUp" })
}
</script>

<template>
  <!-- 表單 -->
  <div class="px-5 my-5 w-full max-w-3xl mx-auto md:bg-white">
    <h3 class="mt-10 text-2xl font-bold text-center">登入</h3>

    <el-form
        class="mx-auto mt-5 w-full"
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        label-width="auto"
    >
      <el-form-item prop="name">
        <div class="floating-field">
          <el-input
              v-model="form.name"
              placeholder=""
              @focus="nameFocused = true"
              @blur="nameFocused = false"
          />
          <label class="floating-label" :class="{ 'is-float': nameFocused || form.name }">使用者名稱</label>
        </div>
      </el-form-item>

      <el-form-item prop="password">
        <div class="floating-field">
          <el-input
              type="password"
              v-model="form.password"
              placeholder=""
              show-password
              @focus="passwordFocused = true"
              @blur="passwordFocused = false"
          />
          <label class="floating-label" :class="{ 'is-float': passwordFocused || form.password }">密碼</label>
        </div>
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
.floating-field {
  position: relative;
  width: 100%;
  margin-top: 14px;
}

.floating-label {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #a8abb2;
  pointer-events: none;
  transition: all 0.15s ease;
}

.floating-label.is-float {
  top: -20px;
  left: 0;
  transform: translateY(0);
  font-size: 12px;
  color: var(--el-color-primary);
}
</style>
