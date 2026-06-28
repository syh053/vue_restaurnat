<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { Category, EndRestaurantAdd, EndRestaurantList } from "@/api/end_restaurant/type.ts"
import { get_categoryApi, postEndRestaurantApi, updateEndRestaurantApi } from "@/api/end_restaurant"
import { type FormInstance, type FormRules, type UploadFile } from "element-plus"
import { Plus } from "@element-plus/icons-vue"

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
      formData: () => ({
        id: '',
        name: '',
        tel: '',
        openingHours: 0,
        address: '',
        description: '',
        image: '',
        category_id: null,
        category_name: null
      }),
      disabled: false
    }
)

/* 表單類別 */
const formType = computed(() =>
    props.showTitle.includes('編輯') ? '編輯' : '建立'
)

/* Emits */
const emit = defineEmits(['update'])

/* 表單驗證 */
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<EndRestaurantList>>({
  name: {required: true, message: '未輸入名稱', trigger: 'blur'},
  openingHours: {required: true, message: '未輸入營業時長', trigger: 'blur'},
  address: {required: true, message: '未輸入地址', trigger: 'blur'},
})

// 統一使用一個表單物件，避免多個 ref 同步錯亂
const formModel = ref<any>({
  id: '',
  name: '',
  tel: '',
  openingHours: 0,
  address: '',
  description: '',
  image: '',
  category_id: null,
  category_name: null
})

const categoryData = ref<Category[]>([])
const rawFile = ref<File | null>(null)

// 監聽 Dialog 開啟或傳入資料變化，初始化表單
watch(
    () => showDialog.value,
    async (isOpen) => {
      if (isOpen) {
        // 1. 獲取分類資料
        try {
          const res = await get_categoryApi()
          categoryData.value = res.data
        } catch (error) {
          console.error('獲取後端資料失敗:', error)
        }

        // 2. 根據是「新增」還是「編輯」初始化表單內容
        if (props.showTitle.includes('新增')) {
          formModel.value = {
            id: '',
            name: '',
            tel: '',
            openingHours: '',
            address: '',
            description: '',
            image: '',
            category_id: null,
            category_name: null
          }
          rawFile.value = null
        } else {
          // 編輯或查看：深拷貝傳進來的資料
          formModel.value = {...props.formData}
          rawFile.value = null
        }
      }
    },
    {immediate: true}
)

/* 圖片預覽邏輯 */
const displayImage = computed(() => {
  const imgPath = formModel.value.image
  if (!imgPath) {
    return 'https://sansalife.tw/wp-content/uploads/2023/04/caesarmetro-restaurant-14_%E7%BB%93%E6%9E%9C-jpg.webp'
  }
  if (imgPath.startsWith('data:') || imgPath.startsWith('http')) {
    return imgPath
  }
  return `http://localhost:8888${imgPath}`
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

/* 提交按鈕 */
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (valid) {
      const payload: EndRestaurantAdd = {
        name: formModel.value.name,
        address: formModel.value.address,
        tel: formModel.value.tel || undefined,
        description: formModel.value.description || undefined,
        category_id: formModel.value.category_id || null,
        openingHours: formModel.value.openingHours ? Number(formModel.value.openingHours) : null, // 確保將 string 轉為 number，若為空或無法轉換則轉為 null
        image: rawFile.value // 確保傳過去的是 File 物件或 null
      }

      try {
        if (props.showTitle.includes('新增')) {
          await postEndRestaurantApi(payload)
          emit('update')
        } else if (props.showTitle.includes('編輯')) {
          await updateEndRestaurantApi(props.formData.name, payload)
          emit('update')
        }
      } catch (error) {
        console.error('API 請求失敗:', error)
      }

    } else {
      console.log('表單驗證失敗!')
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
            alt="餐廳圖片"
            class="restaurant-img"
            :class="{ 'cursor-pointer hover:opacity-80': !props.disabled }"
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
        <el-input v-model="formModel.name" placeholder="輸入餐廳名稱" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item label="類別 :" prop="category_id" class="pe-5" style="width: 100%">
        <el-select v-model="formModel.category_id" placeholder="尚未分類" :disabled="props.disabled">
          <el-option
              v-for="category in categoryData"
              :key="category.id"
              :label="category.name"
              :value="category.id"
          >
            {{ category.name }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="電話 :" class="pe-5" style="width: 100%">
        <el-input v-model="formModel.tel" placeholder="輸入電話" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item label="營業時間 :" prop="openingHours" class="pe-5" style="width: 100%">
        <el-input v-model="formModel.openingHours" placeholder="輸入營業時間" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item label="地址 :" prop="address" class="pe-5" style="width: 100%">
        <el-input v-model="formModel.address" placeholder="輸入地址" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item label="備註 :" class="pe-5" style="width: 100%">
        <el-input v-model="formModel.description" placeholder="輸入備註" clearable :disabled="props.disabled" />
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
