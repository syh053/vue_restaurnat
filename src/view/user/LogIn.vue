<script setup lang="ts">
import { reactive, ref } from "vue"
import { getUserApi } from "@/api/user"
import type { FormInstance, FormRules } from "element-plus"
import type { UserLogIn } from "@/api/user/tpye.ts"

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

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await getUserApi(form)
    } else {
      console.log('錯誤的使用者名稱或密碼', fields)
    }
  })
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
        <div class="w-full text-right">
          <el-button type="primary" @click="onSubmit(ruleFormRef)">Create</el-button>
          <el-button>Cancel</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>
