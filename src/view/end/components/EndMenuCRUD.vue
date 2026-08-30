<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { type FormInstance, type FormRules, type UploadFile } from "element-plus"
import { Plus } from "@element-plus/icons-vue"
import type { MenuAdd, MenuItem } from "@/api/menu/type.ts"
import { postMenuApi, updateMenuApi } from "@/api/menu"
import { MenuSectionOptions } from "@/enums/menu_section.ts"

/* Dialog */
const showDialog = defineModel<boolean>({ default: false })

/* Props */
const props = withDefaults(
    defineProps<{
      showTitle: string
      restaurantId: string
      formData?: MenuItem
      disabled?: boolean
    }>(),
    {
      disabled: false
    }
)

/* Emits */
const emit = defineEmits(['update'])

/* 表單類別 */
const formType = computed(() =>
    props.showTitle.includes('編輯') ? '編輯' : '建立'
)

/* 表單驗證 */
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: { required: true, message: '未輸入餐點名稱', trigger: 'blur' },
  price: { required: true, message: '未輸入價格', trigger: 'blur' },
})

/* 統一表單物件 */
const formModel = ref<any>({
  id: '',
  name: '',
  price: 0,
  section: '',
  description: '',
  image: ''
})

const rawFile = ref<File | null>(null)

/* 監聽 Dialog 開啟，初始化表單 */
watch(
    () => showDialog.value,
    (isOpen) => {
      if (!isOpen) return

      if (props.showTitle.includes('新增')) {
        formModel.value = {
          id: '',
          name: '',
          price: '',
          section: '',
          description: '',
          image: ''
        }
      } else {
        formModel.value = { ...props.formData }
      }
      rawFile.value = null
    },
    { immediate: true }
)

/* 圖片預覽邏輯 */
const API_BASE_URL = import.meta.env.VITE_API_URL

const displayImage = computed(() => {
  const imgPath = formModel.value.image
  if (!imgPath) {
    return 'https://sansalife.tw/wp-content/uploads/2023/04/caesarmetro-restaurant-14_%E7%BB%93%E6%9E%9C-jpg.webp'
  }
  if (imgPath.startsWith('data:') || imgPath.startsWith('http')) {
    return imgPath
  }
  return `${API_BASE_URL}${imgPath}`
})

const handleImageChange = (uploadFile: UploadFile) => {
  if (!uploadFile.raw) return

  const isJPGorPNG = uploadFile.raw.type === 'image/jpeg' || uploadFile.raw.type === 'image/png'
  const isLt10M = uploadFile.raw.size / 1024 / 1024 < 10

  if (!isJPGorPNG || !isLt10M) return false

  rawFile.value = uploadFile.raw

  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    formModel.value.image = reader.result as string
  }
}

/* 提交 */
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (!valid) return

    const payload: MenuAdd = {
      restaurant_id: props.restaurantId,
      name: formModel.value.name,
      price: Number(formModel.value.price) || 0,
      section: formModel.value.section || null,
      description: formModel.value.description || undefined,
      image: rawFile.value
    }

    try {
      if (props.showTitle.includes('編輯')) {
        await updateMenuApi(props.formData!.id, payload)
      } else {
        await postMenuApi(payload)
      }
      emit('update')
    } catch (error) {
      console.error('API 請求失敗:', error)
    }
  })
}

const onCancel = () => {
  showDialog.value = false
}
</script>

<template>
  <el-dialog v-model="showDialog" :title="props.showTitle" width="500" center>
    <div class="mb-5 flex flex-col items-center">
      <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :auto-upload="false"
          :disabled="props.disabled"
          :on-change="handleImageChange"
      >
        <img
            v-if="displayImage"
            :src="displayImage"
            alt="餐點圖片"
            class="restaurant-img"
            :class="{ 'hover:opacity-80': !props.disabled }"
            style="max-height: 350px;"
        >
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
      <small v-if="!props.disabled" class="text-gray-400 mt-2">點擊圖片可更換新照片</small>
    </div>

    <el-form
        ref="ruleFormRef"
        :model="formModel"
        :rules="rules"
        class="demo-form-inline"
        label-width="80px"
    >
      <el-form-item label="名稱 :" prop="name" class="pe-5" style="width: 100%">
        <el-input v-model="formModel.name" placeholder="輸入餐點名稱" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item label="價格 :" prop="price" class="pe-5" style="width: 100%">
        <el-input v-model.number="formModel.price" type="number" placeholder="輸入價格 (新台幣)" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item label="分區 :" class="pe-5" style="width: 100%">
        <el-select
            v-model="formModel.section"
            placeholder="未分類"
            filterable
            allow-create
            default-first-option
            clearable
            :disabled="props.disabled"
        >
          <el-option v-for="option in MenuSectionOptions" :key="option" :label="option" :value="option" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述 :" class="pe-5" style="width: 100%">
        <el-input v-model="formModel.description" type="textarea" placeholder="輸入餐點描述" :disabled="props.disabled" />
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
