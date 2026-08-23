<script setup lang="ts">
import { getEmailExistedCheckApi, getUserExistedCheckApi, postUserApi } from "@/api/user"
import type { UserPost } from "@/api/user/tpye.ts"
import type { FormInstance, FormRules } from "element-plus"
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"

/* 導航 */
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

/* Floating label focus 狀態 */
const nameFocused = ref(false)
const emailFocused = ref(false)
const passwordFocused = ref(false)
const confirmPasswordFocused = ref(false)

// 檢查使用者名稱是否已註冊
const validateUsername = (_rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('請輸入使用者名稱'))
  }

  getUserExistedCheckApi(value)
      .then((res) => {
        if (!res.data) {
          callback(new Error('該名稱已被註冊'))
        } else {
          callback() // 驗證成功
        }
      })
      .catch((error) => {
        console.error(error)
        callback(new Error('伺服器連線失敗，無法驗證名稱'))
      })
}

const validateEmail = (_rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('請輸入 email'))
  }

  getEmailExistedCheckApi(value)
      .then(res => {
        if (!res.data) {
          callback(new Error('該信箱已被註冊'))
        } else {
          callback()  // 驗證成功
        }
      })
      .catch((error) => {
        console.error(error)
        callback(new Error('伺服器連線失敗，無法驗證信箱'))
      })
}

const rules = reactive<FormRules<UserPost>>({
  name: [
    {required: true, message: "請輸入名稱", trigger: "change"},
    {validator: validateUsername, trigger: "blur"}
  ],
  email: [
    {required: true, message: "請輸入 email", trigger: "change"},
    {type: "email", message: "輸入格式錯誤", trigger: "blur"},
    {validator: validateEmail, trigger: "blur"}
  ],
  password: [{required: true, message: "請輸入密碼", trigger: "change"}],
  confirm_password: [
    {required: true, message: "請輸入確認密碼", trigger: "change"},
    {validator: checkPassword, message: "與密碼不一致", trigger: "blur"}
  ],
})


/* 註冊 */
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        await postUserApi(form)
        await router.push({name: "logIn"})
      } catch (error) {
        console.log('API 送出失敗：', error)
      }
    } else {
      console.log('錯誤的驗證!', fields)
    }
  })
}

/* 登入 */
const jumpSignIn = async () => {
  await router.push({name: "logIn"})
}
</script>

<template>
  <!-- 表單 -->
    <div class="px-5 my-5 w-full max-w-3xl mx-auto md:bg-white">
    <h3 class="mt-10 text-2xl font-bold text-center">註冊</h3>

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

      <el-form-item prop="email">
        <div class="floating-field">
          <el-input
              v-model="form.email"
              placeholder=""
              @focus="emailFocused = true"
              @blur="emailFocused = false"
          />
          <label class="floating-label" :class="{ 'is-float': emailFocused || form.email }">email</label>
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

      <el-form-item prop="confirm_password">
        <div class="floating-field">
          <el-input
              type="password"
              v-model="form.confirm_password"
              placeholder=""
              show-password
              @focus="confirmPasswordFocused = true"
              @blur="confirmPasswordFocused = false"
          />
          <label class="floating-label" :class="{ 'is-float': confirmPasswordFocused || form.confirm_password }">確認密碼</label>
        </div>
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
