<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { deleteEndRestaurantApi, get_categoryApi, getEndRestaurantApi } from "@/api/end_restaurant"
import { useRouter } from "vue-router"
import { type ComponentSize, ElMessageBox } from "element-plus"
import type { Category, EndRestaurantList, EndRestaurantSearch } from "@/api/end_restaurant/type.ts"
import EndRestaurantCRUD from "@/view/end/components/EndRestaurantCRUD.vue"


/* 導航 */
const router = useRouter()

/* Dialog */
const showDialog = ref<boolean>(false)
const showTitle = ref<string>('')

/* 右鍵選單 */
const showMenu = ref<boolean>(false)
const editType = ref<boolean>(false)
const menuPos = reactive({x: 0, y: 0})
const rowData = ref<EndRestaurantList>({
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

const handleRightClick = (row: any, _column: any, _cell: any, event: PointerEvent) => {
  rowData.value = {
    id: row?.id ?? '',
    name: row?.name ?? '',
    tel: row?.tel ?? '',
    openingHours: row?.openingHours ?? null,
    address: row?.address ?? '',
    description: row?.description ?? '',
    image: row?.image ?? '',
    category_id: row?.category_id ?? '',
    category_name: row?.category_name ?? null,
  }

  event.preventDefault()
  event.stopPropagation()

  menuPos.x = event.clientX
  menuPos.y = event.clientY

  showMenu.value = true
}

const closeMenu = () => {
  showMenu.value = false
}

// 監聽滑鼠左鍵點擊，點擊任何地方就隱藏選單
onMounted(() => {
  window.addEventListener('click', closeMenu)
})

// 組件銷毀時移除監聽
onUnmounted(() => {
  window.removeEventListener('click', closeMenu)
})

const handleView = () => {
  showDialog.value = true
  showTitle.value = '查看餐廳'
  editType.value = true
}

const handleUpdate = () => {
  showDialog.value = true
  showTitle.value = '編輯餐廳'
  editType.value = false
}

/* 查詢 */
const categoryData = ref<Category[]>([])

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

const onSubmit = async () => {
  formInline.current_page = 1
  const res = await getEndRestaurantApi(formInline)
  tableData.value = res.data[0]
  total.value = res.data[1]
  currentPage.value = 1
}

/* 分頁 */
const currentPage = ref(1)
const pageSize = ref(10)
const size = ref<ComponentSize>('default')
const total = ref<number>(0)

const handleSizeChange = async (val: number) => {
  formInline.page_size = val
  const res = await getEndRestaurantApi(formInline)
  tableData.value = res.data[0]
  total.value = res.data[1]
}
const handleCurrentChange = async (val: number) => {
  formInline.current_page = val
  const res = await getEndRestaurantApi(formInline)
  tableData.value = res.data[0]
}

/* Table */
const tableData = ref<EndRestaurantList[]>([])
const showTable = ref<boolean>(false)
const multipleSelection = ref<string[]>([])

onMounted(async () => {
  try {
    const res = await getEndRestaurantApi(formInline)
    tableData.value = res.data[0]
    total.value = res.data[1]
    showTable.value = true

    const category_res = await get_categoryApi()
    categoryData.value = category_res.data
  } catch (err) {
    await ElMessageBox.alert('無權限訪問後台', '提示', {
      confirmButtonText: '返回'
    })
    await router.push({name: 'frontRestaurant'})
  }
})

const updatedData = async () => {
  const res = await getEndRestaurantApi(formInline)
  tableData.value = res.data[0]
  total.value = res.data[1]
  showDialog.value = false
}

const isSelected = ref(false)

const handleSelectionChange = (restaurantList: EndRestaurantList[]) => {
  multipleSelection.value = restaurantList.map((restaurant: EndRestaurantList) => restaurant.name)
  isSelected.value = true
}

const handleDelete = async () => {
  if (isSelected.value) {
    await deleteEndRestaurantApi(multipleSelection.value)
  } else {
    await deleteEndRestaurantApi([rowData.value.name])
  }

  const res = await getEndRestaurantApi(formInline)
  tableData.value = res.data[0]
  total.value = res.data[1]
}
</script>

<template>
  <div v-if="showTable">
    <h3 class="pt-5 text-2xl font-serif">後台餐廳全部列表</h3>
    <div class="w-full max-w-6xl border-2 rounded-xl m-6 mx-auto overflow-hidden">
      <div class="form-table border-b p-5 flex items-center">
        <el-form :inline="true" :model="formInline" class="demo-form-inline flex flex-wrap gap-x-5 gap-y-3">
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
            <el-input v-model="formInline.openingHours" placeholder="模糊查詢" clearable />
          </el-form-item>
          <el-form-item label=地址>
            <el-input v-model="formInline.address" placeholder="模糊查詢" clearable />
          </el-form-item>
          <el-form-item label=備註>
            <el-input v-model="formInline.description" placeholder="模糊查詢" clearable />
          </el-form-item>
          <el-form-item>
            <div class="flex gap-2">
              <el-button type="primary" @click="onSubmit">查詢</el-button>
              <el-button type="danger" @click="handleDelete">刪除</el-button>
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
        <el-table-column type="index" width="90" align="center" />
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="名稱" width="350" />
        <el-table-column prop="category_name" label="分類" width="150" />
        <el-table-column prop="tel" label="電話" width="200" />
        <el-table-column prop="address" label="地址" />
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

    <EndRestaurantCRUD
        v-if="showDialog"
        v-model="showDialog"
        :show-title="showTitle"
        :form-data="rowData"
        :disabled="editType"
        @update="updatedData"
    />
  </div>

  <div class="context-menu" v-if="showMenu" v-show="showMenu"
       :style="{ left: menuPos.x + 'px', top: menuPos.y + 'px' }">
    <ul>
      <li @click="handleView">查看</li>
      <el-divider style="margin: 4px 0" />
      <li @click="handleUpdate">編輯</li>
      <el-divider style="margin: 4px 0" />
      <li @click="handleDelete">刪除</li>
    </ul>
  </div>
</template>

<style scoped>
.form-table {
  * {
    margin: 0;
  }
}

.context-menu {
  position: fixed;
  z-index: 3000;
  background-color: white;
  border: 1px solid #e4e7ed;
  border-radius: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 5px 0;
  min-width: 120px;
}

.context-menu li {
  padding: 8px 16px;
  font-size: 14px;
  color: #4A4AFF;
  cursor: pointer;
}

.context-menu li:hover {
  background-color: #f5f7fa;
  color: #409eff;
}
</style>
