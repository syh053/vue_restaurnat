<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { EndRestaurantList } from "@/api/end_restaurant/type.ts"
import { postEndRestaurantApi, updateEndRestaurantApi } from "@/api/end_restaurant"
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
      disabled: false,
      formData: () => ({
        id: '',
        name: '',
        tel: '',
        openingHours: null,
        address: '',
        description: '',
        image: ''
      })
    }
)

const formType = computed(() =>
    props.showTitle.includes('編輯') ? '編輯' : '建立'
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

/* 圖片 */
const rawFile = ref<File | null>(null)

const displayImage = computed(() => {
  const imgPath = updatedForm.value.image
  if (!imgPath) {
    // 預設圖片
    return 'https://sansalife.tw/wp-content/uploads/2023/04/caesarmetro-restaurant-14_%E7%BB%93%E6%9E%9C-jpg.webp'
  }
  // 如果已經是剛選好的 Base64 或是滿版的 URL，就直接回傳
  if (imgPath.startsWith('data:') || imgPath.startsWith('http')) {
    return imgPath
  }
  // 如果是後端給的相對路徑，才幫它補上網域
  return `http://localhost:8888${imgPath}`
})

const handleImageChange = (uploadFile: UploadFile) => {
  if (!uploadFile.raw) return

  // 限制圖片格式與大小
  const isJPGorPNG = uploadFile.raw.type === 'image/jpeg' || uploadFile.raw.type === 'image/png'
  const isLt10M = uploadFile.raw.size / 1024 / 1024 < 10

  if (!isJPGorPNG) {
    // ElMessage.error('圖片只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt10M) {
    // ElMessage.error('圖片大小不能超過 2MB!')
    return false
  }

  // 儲存實體檔案，供送出 API 時使用
  rawFile.value = uploadFile.raw

  // 轉成 Base64 為了讓 displayImage 畫面可以即時預覽
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    updatedForm.value.image = reader.result as string
  }
}

/* 按鈕 */
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (valid) {
      const submitData = {
        ...updatedForm.value,
        image: rawFile.value // 將真正的 File 物件傳過去，如果沒換圖片就是 null
      }
      if (props.showTitle.includes('新增')) {
        await postEndRestaurantApi(submitData)
        emit('update')

      } else if (props.showTitle.includes('編輯')) {
        await updateEndRestaurantApi(props.formData.name, submitData)
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
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
      <small v-if="!props.disabled" class="text-gray-400 mt-2">點擊圖片可更換新照片</small>
    </div>

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
