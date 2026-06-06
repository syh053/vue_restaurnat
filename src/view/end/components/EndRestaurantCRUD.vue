<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { EndRestaurantList } from "@/api/end_restaurant/type.ts"
import { postEndRestaurantApi, updateEndRestaurantApi } from "@/api/end_restaurant"
import type { FormInstance, FormRules } from "element-plus"

/* Dialog */
const showDialog = defineModel<boolean>({default: false})

/* Props */
const props = withDefaults(
    defineProps<{
      showTitle: string
      formData?: EndRestaurantList
      disabled?: boolean
    }>(),
    {
      disabled: false,
      formData: () => ({
        id: '',
        name: '',
        tel: '',
        openingHours: null,
        address: '',
        description: '',
      })
    }
)

/* Emits */
const emit = defineEmits(['update'])

/* 表單驗證 */
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<EndRestaurantList>>({
  name: {required: true, message: '未輸入名稱', trigger: 'change'},
  openingHours: {required: true, message: '未輸入營業時長', trigger: 'change'},
  address: {required: true, message: '未輸入地址', trigger: 'change'},
})

/* 資訊 */
const updatedForm = ref<EndRestaurantList>({
  ...props.formData
})

watch(
    () => props.formData,
    (newVal) => {
      if (newVal) {
        updatedForm.value = JSON.parse(JSON.stringify(newVal)) // 或者使用結構賦值：{ ...newVal }
      }
    },
    { immediate: true, deep: true } // immediate 確保一開始組件建立時就會執行一次
)

const formType = computed(() =>
    props.showTitle.includes('編輯') ? '編輯' : '建立'
)

/* 按鈕 */
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (valid) {
      if (props.showTitle.includes('新增')) {
        console.log("準備建立...")
        await postEndRestaurantApi(updatedForm.value)
        emit('update')

      } else if (props.showTitle.includes('編輯')) {
        await updateEndRestaurantApi(props.formData.name, updatedForm.value)
        emit('update')
      }

    } else {
      console.log('錯誤的提交!')
    }
  })
}

const onCancel = () => {
  showDialog.value = false
}
</script>

<template>
  <el-dialog v-model="showDialog" :title="props.showTitle" width="500" center>
    <el-form
        ref="ruleFormRef"
        :model="updatedForm"
        :rules="rules"
        class="demo-form-inline"
        label-width="100px"
    >
      <el-form-item label="名稱 :" prop="name" class="pe-5" style="width: 100%">
        <el-input v-model="updatedForm.name" placeholder="輸入餐廳名稱" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item label="電話 :" class="pe-5" style="width: 100%">
        <el-input v-model="updatedForm.tel" placeholder="輸入電話" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item label="營業時間 :" prop="openingHours" class="pe-5" style="width: 100%">
        <el-input v-model="updatedForm.openingHours" placeholder="輸入營業時間" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item label="地址 :" prop="address" class="pe-5" style="width: 100%">
        <el-input v-model="updatedForm.address" placeholder="輸入地址" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item label="備註 :" class="pe-5" style="width: 100%">
        <el-input v-model="updatedForm.description" placeholder="輸入備註" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item class="w-full">
        <div class="flex justify-end w-full">
          <el-button v-if="!props.disabled" type="primary" @click="onSubmit(ruleFormRef)">{{ formType }}</el-button>
          <el-button @click="onCancel">返回</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>

</style>
