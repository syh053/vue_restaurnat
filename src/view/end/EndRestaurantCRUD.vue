<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { EndRestaurantAdd, EndRestaurantList } from "@/api/end_restaurant/type.ts"

const showDialog = defineModel<boolean>({default: false})

const props = withDefaults(
    defineProps<{
      showTitle: string
      formData?: EndRestaurantList
      disabled?: boolean
    }>(),
    {
      disabled: false,
    }
)


const formInline = reactive<EndRestaurantAdd>({
  name: '',
  tel: '',
  openingHours: null,
  address: '',
  description: '',
})


const newModel = computed(() => {
  return props.formData ?? formInline
})

const formType = computed(() =>
  props.showTitle.includes('編輯') ? '編輯' : '建立'
)


const onSubmit = () => {
  console.log('submit!')
}

const onCancel = () => {
  showDialog.value = false
}
</script>

<template>
  <el-dialog v-model="showDialog" :title="props.showTitle" width="500" center>
    <el-form :inline="true" :model="newModel" class="demo-form-inline" label-width="100px">
      <el-form-item label="名稱 :" class="pe-5" style="width: 100%">
        <el-input v-model="newModel.name" placeholder="輸入餐廳名稱" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item label="電話 :" class="pe-5" style="width: 100%">
        <el-input v-model="newModel.tel" placeholder="輸入電話" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item label="營業時間 :" class="pe-5" style="width: 100%">
        <el-input v-model="newModel.openingHours" placeholder="輸入營業時間" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item label="地址 :" class="pe-5" style="width: 100%">
        <el-input v-model="newModel.address" placeholder="輸入地址" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item label="備註 :" class="pe-5" style="width: 100%">
        <el-input v-model="newModel.description" placeholder="輸入備註" clearable :disabled="props.disabled" />
      </el-form-item>
      <el-form-item class="w-full">
        <div class="flex justify-end w-full">
          <el-button v-if="!props.disabled" type="primary" @click="onSubmit">{{ formType }}</el-button>
          <el-button @click="onCancel">返回</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>

</style>
