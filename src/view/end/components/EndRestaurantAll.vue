<script setup lang="ts">
import PageTable, { type ContextMenuOption } from "@/components/PageTable.vue"
import { deleteEndRestaurantApi, get_categoryApi, getEndRestaurantApi } from "@/api/end_restaurant"
import EndRestaurantCRUD from "@/view/end/components/EndRestaurantCRUD.vue"
import type { Category, EndRestaurantList, EndRestaurantSearch } from "@/api/end_restaurant/type.ts"
import { onMounted, reactive, ref, useTemplateRef } from "vue"
import { ElMessageBox } from "element-plus"

const tableRef = useTemplateRef('pageTable')

/* 查詢 */
const categoryData = ref<Category[]>([])

onMounted(async () => {
  const category_res = await get_categoryApi()
  categoryData.value = category_res.data
})

/* Dialog 控制 */
const showDialog = ref<boolean>(false)
const showTitle = ref<string>('')
const editType = ref<boolean>(false)
const activeRow = ref<EndRestaurantList>({
  id: '',
  name: '',
  tel: '',
  openingHours: 0,
  address: '',
  description: '',
  image: '',
  category_id: '',
  category_name: ''
})

/* 查詢資料 */
const formInline = reactive<EndRestaurantSearch>({
  id: '',
  name: '',
  category_name: '',
  tel: '',
  openingHours: null,
  address: '',
  description: '',
  current_page: 1,
  page_size: 10,
})

/* 多選資料 */
const multipleSelection = ref<string[]>([])

/* 勾選變更 */
const handleSelectionChange = (list: EndRestaurantList[]) => {
  multipleSelection.value = list.map(item => item.name)
}

/* 💡 宣告右鍵功能配置陣列 */
const handleDelete = async (row?: EndRestaurantList) => {
  let targets: string[] = []
  let confirmMessage = ''

  if (row && row.name) {
    // 狀況 A：從右鍵選單點擊（單筆刪除）
    targets = [row.name]
    confirmMessage = `確定要刪除餐廳「${row.name}」嗎？`
  } else {
    // 狀況 B：從頂部按鈕點擊（批量刪除）
    if (multipleSelection.value.length === 0) {
      await ElMessageBox.alert('請先勾選要刪除的餐廳', '提示', {type: 'warning'})
      return
    }
    targets = multipleSelection.value
    confirmMessage = `確定要刪除這 ${targets.length} 間餐廳嗎？`
  }

  // 執行刪除與提示
  try {
    await ElMessageBox.confirm(confirmMessage, '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 呼叫 API（不論單筆或多選，API 接收的都是陣列）
    await deleteEndRestaurantApi(targets)

    // 重新整理表格
    tableRef.value?.refresh()

    // 如果是批量刪除，成功後清空勾選紀錄
    if (!row) {
      multipleSelection.value = []
    }
  } catch {
    // 使用者取消刪除
  }
}

const menuConfigs = ref<ContextMenuOption[]>([
  {
    label: '查看',
    action: (row) => {
      activeRow.value = {...row}
      showDialog.value = true
      showTitle.value = '查看餐廳'
      editType.value = true
    }
  },
  {
    label: '編輯',
    divided: true, // 在上方加上分割線
    action: (row) => {
      activeRow.value = {...row}
      showDialog.value = true
      showTitle.value = '編輯餐廳'
      editType.value = false
    }
  },
  {
    label: '刪除',
    divided: true, // 在上方加上分割線
    action: (row) => {
      handleDelete(row)
    }
  }
])

// CRUD 成功後更新資料
const onCrudUpdated = () => {
  showDialog.value = false
  tableRef.value?.refresh()
}
</script>

<template>
  <PageTable
      ref="pageTable"
      v-model="formInline"
      :get-form-data-api="getEndRestaurantApi"
      tableTitle="後台餐廳列表"
      :contextMenuOptions="menuConfigs"
      @selection-change="handleSelectionChange"
      @batch-delete="handleDelete"
  >
    <template #searchList>
      <el-form-item label=餐廳名稱>
        <el-input v-model="formInline.name" placeholder="模糊查詢" clearable />
      </el-form-item>
      <el-form-item label="類別 :" style="width: 150px">
        <el-select v-model="formInline.category_name" placeholder="尚未分類" clearable>
          <el-option
              v-for="category in categoryData"
              :key="category.id"
              :label="category.name"
              :value="category.name"
          >
            {{ category.name }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label=電話號碼>
        <el-input v-model="formInline.tel" placeholder="模糊查詢" clearable />
      </el-form-item>
      <el-form-item label=營業時長>
        <el-input v-model.number="formInline.openingHours" placeholder="模糊查詢sss" clearable />
      </el-form-item>
      <el-form-item label=地址>
        <el-input v-model="formInline.address" placeholder="模糊查詢" clearable />
      </el-form-item>
      <el-form-item label=備註>
        <el-input v-model="formInline.description" placeholder="模糊查詢" clearable />
      </el-form-item>
    </template>

    <template #default>
      <el-table-column type="index" width="90" align="center" />
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="名稱" width="350" />
      <el-table-column prop="category_name" label="分類" width="150" />
      <el-table-column prop="tel" label="電話" width="200" />
      <el-table-column prop="address" label="地址" />
    </template>
  </PageTable>

  <EndRestaurantCRUD
      v-if="showDialog"
      v-model="showDialog"
      :show-title="showTitle"
      :form-data="activeRow"
      :disabled="editType"
      @update="onCrudUpdated"
  />
</template>

<style scoped>

</style>
