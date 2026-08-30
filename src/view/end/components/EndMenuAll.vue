<script setup lang="ts">
import { reactive, ref, useTemplateRef } from "vue"
import { useRoute, useRouter } from "vue-router"
import { ElMessageBox } from "element-plus"
import PageTable, { type ContextMenuOption } from "@/components/PageTable.vue"
import EndMenuCRUD from "@/view/end/components/EndMenuCRUD.vue"
import { deleteMenuApi, getEndMenuApi } from "@/api/menu"
import type { MenuItem, MenuSearch } from "@/api/menu/type.ts"
import { MenuSectionOptions } from "@/enums/menu_section.ts"

/* 導航 */
const route = useRoute()
const router = useRouter()

/* 路由參數 */
const restaurantId = route.params.restaurantId as string
const restaurantName = (route.query.name as string) || '餐廳'

/* 取得圖片前綴 */
const API_BASE_URL = import.meta.env.VITE_API_URL

const tableRef = useTemplateRef('pageTable')

/* 查詢資料 */
const formInline = reactive<MenuSearch>({
  name: '',
  section: '',
  restaurant_id: restaurantId,
  current_page: 1,
  page_size: 10,
})

/* Dialog 控制 */
const showDialog = ref<boolean>(false)
const showTitle = ref<string>('')
const editType = ref<boolean>(false)
const activeRow = ref<MenuItem>()

/* 多選資料 */
const multipleSelection = ref<string[]>([])

const handleSelectionChange = (list: MenuItem[]) => {
  multipleSelection.value = list.map(item => item.id)
}

/* 刪除（單筆右鍵 / 批量） */
const handleDelete = async (row?: MenuItem) => {
  let targets: string[] = []
  let confirmMessage = ''

  if (row && row.id) {
    targets = [row.id]
    confirmMessage = `確定要刪除餐點「${row.name}」嗎？`
  } else {
    if (multipleSelection.value.length === 0) {
      await ElMessageBox.alert('請先勾選要刪除的餐點', '提示', { type: 'warning' })
      return
    }
    targets = multipleSelection.value
    confirmMessage = `確定要刪除這 ${targets.length} 筆餐點嗎？`
  }

  try {
    await ElMessageBox.confirm(confirmMessage, '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteMenuApi(targets)
    tableRef.value?.refresh()

    if (!row) {
      multipleSelection.value = []
    }
  } catch {
    // 使用者取消刪除
  }
}

/* 右鍵選單 */
const menuConfigs = ref<ContextMenuOption[]>([
  {
    label: '查看',
    action: (row) => {
      activeRow.value = { ...row }
      showDialog.value = true
      showTitle.value = '查看餐點'
      editType.value = true
    }
  },
  {
    label: '編輯',
    divided: true,
    action: (row) => {
      activeRow.value = { ...row }
      showDialog.value = true
      showTitle.value = '編輯餐點'
      editType.value = false
    }
  },
  {
    label: '刪除',
    divided: true,
    action: (row) => {
      handleDelete(row)
    }
  }
])

/* 新增餐點 */
const handleAdd = () => {
  activeRow.value = undefined
  showTitle.value = '新增餐點'
  editType.value = false
  showDialog.value = true
}

/* 返回後台餐廳列表 */
const handleBack = () => {
  router.push({ name: 'endRestaurantAll' })
}

/* CRUD 成功後更新資料 */
const onCrudUpdated = () => {
  showDialog.value = false
  tableRef.value?.refresh()
}
</script>

<template>
  <PageTable
      ref="pageTable"
      v-model="formInline"
      :get-form-data-api="getEndMenuApi"
      :table-title="`${restaurantName} — 菜單管理`"
      :context-menu-options="menuConfigs"
      @selection-change="handleSelectionChange"
      @batch-delete="handleDelete"
  >
    <template #toolbar>
      <div class="flex gap-2">
        <el-button type="primary" @click="handleAdd">新增餐點</el-button>
        <el-button @click="handleBack">返回餐廳列表</el-button>
      </div>
    </template>

    <template #searchList>
      <el-form-item label="餐點名稱">
        <el-input v-model="formInline.name" placeholder="模糊查詢" clearable />
      </el-form-item>
      <el-form-item label="分區 :" style="width: 180px">
        <el-select v-model="formInline.section" placeholder="全部" clearable filterable>
          <el-option v-for="option in MenuSectionOptions" :key="option" :label="option" :value="option" />
        </el-select>
      </el-form-item>
    </template>

    <template #default>
      <el-table-column type="index" width="90" align="center" />
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="名稱" width="220" />
      <el-table-column prop="price" label="價格" width="120">
        <template #default="{ row }">NT$ {{ row.price }}</template>
      </el-table-column>
      <el-table-column prop="section" label="分區" width="120" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="圖片" width="120">
        <template #default="{ row }">
          <el-image
              v-if="row.image"
              :src="API_BASE_URL + row.image"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 6px;"
          />
          <span v-else class="text-gray-400">無</span>
        </template>
      </el-table-column>
    </template>
  </PageTable>

  <EndMenuCRUD
      v-if="showDialog"
      v-model="showDialog"
      :show-title="showTitle"
      :restaurant-id="restaurantId"
      :form-data="activeRow"
      :disabled="editType"
      @update="onCrudUpdated"
  />
</template>

<style scoped>
</style>
