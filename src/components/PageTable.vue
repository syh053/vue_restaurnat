<script setup lang="ts" generic="T extends BaseQueryPage">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from "vue-router"
import { type ComponentSize, ElMessageBox } from "element-plus"
import type { EndRestaurantList } from "@/api/end_restaurant/type.ts"

/* 定義一個基礎的分頁查詢介面 */
export interface BaseQueryPage {
  current_page?: number
  page_size?: number

  [key: string]: any // 允許其他自訂的查詢欄位
}

/* 定義右鍵選項的介面 */
export interface ContextMenuOption {
  label: string
  action: (row: any) => void
  divided?: boolean
}

/* Model */
const formInline = defineModel<T>({
  required: true,
})

/* Props */
const props = withDefaults(defineProps<{
      getFormDataApi: (params: T) => Promise<any>
      tableTitle?: string
      contextMenuOptions?: ContextMenuOption[]
    }>(),
    {
      tableTitle: '預設表格',
      contextMenuOptions: () => []
    })

/* 讓父組件知道勾選狀態與刪除操作 */
const emit = defineEmits<{
  (e: 'selection-change', value: any[]): void
  (e: 'batch-delete'): void
}>()

/* 導航 */
const router = useRouter()

/* 右鍵選單 */
const showMenu = ref<boolean>(false)
const menuPos = reactive({x: 0, y: 0})
const currentRow = ref<any>(null) // 儲存目前右鍵點擊的那行資料


const handleRightClick = (row: any, _column: any, _cell: any, event: PointerEvent) => {
  // 如果父組件沒有傳入任何右鍵設定，就不顯示選單
  if (!props.contextMenuOptions || props.contextMenuOptions.length === 0) return

  event.preventDefault()
  event.stopPropagation()

  currentRow.value = row
  menuPos.x = event.clientX
  menuPos.y = event.clientY
  showMenu.value = true
}

const closeMenu = () => {
  showMenu.value = false
}

/* 點擊選項時的處理函式 */
const handleOptionClick = (option: ContextMenuOption) => {
  if (option.action) {
    option.action(currentRow.value) // 將當前這一行的資料傳回給父組件的 action
  }
  closeMenu()
}

// 監聽滑鼠左鍵點擊，點擊任何地方就隱藏選單
onMounted(() => {
  window.addEventListener('click', closeMenu)
})

// 組件銷毀時移除監聽
onUnmounted(() => {
  window.removeEventListener('click', closeMenu)
})

const onSubmit = async () => {
  // // 若未輸入營業時間，自動補 null
  // if (!formInline.openingHours) {
  //   formInline.openingHours = null
  // }

  formInline.value.current_page = 1
  const res = await props.getFormDataApi(formInline.value)
  tableData.value = res.data[0]
  total.value = res.data[1]
  currentPage.value = 1
}

/* Table */
const tableData = ref<EndRestaurantList[]>([])
const showTable = ref<boolean>(false)
const total = ref<number>(0)

const fetchTableData = async () => {
  try {
    const res = await props.getFormDataApi(formInline.value)
    tableData.value = res.data[0]
    total.value = res.data[1]
    showTable.value = true


  } catch (err) {
    await ElMessageBox.alert('無權限訪問後台', '提示', {
      confirmButtonText: '返回'
    })
    await router.push({name: 'frontRestaurant'})
  }
}

/* 分頁 */
const currentPage = ref(1)
const pageSize = ref(10)
const size = ref<ComponentSize>('default')

const handleSizeChange = async (val: number) => {
  formInline.value.page_size = val
  await fetchTableData()
}
const handleCurrentChange = async (val: number) => {
  formInline.value.current_page = val
  await fetchTableData()
}

onMounted(async () => {
  await fetchTableData()
  showTable.value = true
})

// 暴露刷新表格的方法給父組件呼叫
defineExpose({
  refresh: fetchTableData
})

const handleSelectionChange = (val: any[]) => {
  emit('selection-change', val)
}

/* 點擊頂部刪除按鈕時觸發 */
const handleBatchDeleteClick = () => {
  emit('batch-delete')
}
</script>

<template>
  <div v-if="showTable">
    <h3 class="pt-5 text-2xl font-serif">{{ props.tableTitle }}</h3>
    <div class="w-full max-w-6xl border-2 rounded-xl m-6 mx-auto overflow-hidden">
      <div class="form-table border-b p-5 flex items-center">
        <el-form :inline="true" :model="formInline" class="demo-form-inline flex flex-wrap gap-x-5 gap-y-3">
          <slot name="searchList"/>
          <el-form-item>
            <div class="flex gap-2">
              <el-button type="primary" @click="onSubmit">查詢</el-button>
              <el-button type="danger" @click="handleBatchDeleteClick">刪除</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <el-table
          :data="tableData"
          @selection-change="handleSelectionChange"
          @cell-contextmenu="handleRightClick"
          style="width: 100%"
      >
        <slot name="default"/>
      </el-table>

      <div class="demo-pagination-block flex justify-end border-t py-3">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20, 30]"
            :size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>

  <div class="context-menu" v-if="showMenu" v-show="showMenu"
       :style="{ left: menuPos.x + 'px', top: menuPos.y + 'px' }">
    <ul>
      <template v-for="(option, index) in props.contextMenuOptions" :key="index">
        <!-- 如果設定了 divided，就在選項上方加上 Element Plus 的分割線 -->
        <el-divider v-if="option.divided && index !== 0" />
        <li @click="handleOptionClick(option)">
          {{ option.label }}
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped>
.form-table {
  * {
    margin: 0;
  }
}

/* 右鍵選單容器本體 */
.context-menu {
  position: fixed;
  z-index: 3000;
  background-color: white;
  border: 1px solid #e4e7ed;
  border-radius: 12px; /* 稍微修圓一點更現代 */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  min-width: 120px;
}

/* 💡 使用 :deep() 穿透到插槽內的 ul, li 與 divider */
.context-menu :deep(ul) {
  list-style: none;
  margin: 0;
  padding: 0;
}

.context-menu :deep(li) {
  padding: 8px 16px;
  font-size: 14px;
  color: #4a4aff;
  cursor: pointer;
  transition: all 0.2s ease; /* 加上平滑過渡 */
}

.context-menu :deep(li:hover) {
  background-color: #f5f7fa;
  color: #409eff;
}

/* 讓 Element Plus 的分割線在選單裡更好看 */
.context-menu :deep(.el-divider) {
  margin: 4px 0 !important;
}
</style>
