<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getEndRestaurantApi } from "@/api/end_restaurant"
import { useRouter } from "vue-router"
import { type ComponentSize, ElMessageBox } from "element-plus"
import type { EndRestaurantList, EndRestaurantSearch } from "@/api/end_restaurant/type.ts"

/* 導航 */
const router = useRouter()

/* 查詢 */
const formInline = reactive<EndRestaurantSearch>({
  id: '',
  name: '',
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

onMounted(async () => {
  try {
    const res = await getEndRestaurantApi(formInline)
    tableData.value = res.data[0]
    total.value = res.data[1]
    showTable.value = true
  } catch (err) {
    await ElMessageBox.alert('無權限訪問後台', '提示', {
      confirmButtonText: '返回'
    })
    await router.push({name: 'frontRestaurant'})
  }
})
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
            <el-button type="primary" @click="onSubmit">查詢</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData">
        <el-table-column type="index" width="70" align="center" />
        <el-table-column prop="name" label="名稱" width="320" />
        <el-table-column prop="tel" label="電話" width="180" />
        <el-table-column prop="openingHours" label="開店時間" sortable width="120" />
        <el-table-column prop="address" label="地址" width="300" />
        <el-table-column prop="description" label="備註" />
      </el-table>
    </div>

    <div class="demo-pagination-block flex justify-end">
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
</template>

<style scoped>
.form-table {
  * {
    margin: 0;
  }
}
</style>
