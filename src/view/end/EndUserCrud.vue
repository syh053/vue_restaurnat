<script setup lang="ts">

import { Icon } from "@iconify/vue"
import Aside from "@/view/end/components/Aside.vue"
import { useRouter } from "vue-router"
import { onMounted, reactive, ref } from "vue"
import { getUserApi } from "@/api/end_user"
import { type User, type UserSearch, userStatusOptions } from "@/api/end_user/type.ts"
import type { ComponentSize } from "element-plus"

/* 導航 */
const router = useRouter()

/* 切換至後台餐廳列表 */
const handleToRestaurantList = async () => {
  await router.push({name: 'endRestaurantAll'})
}

/* 資訊 */
const userList = ref<User[]>([])

onMounted(async () => {
  const res = await getUserApi(formInline)
  userList.value = res.data[0]
  total.value = res.data[1]
})

/* 查詢 */
const formInline = reactive<UserSearch>({
  name: '',
  email: '',
  is_admin: null,
  current_page: 1,
  page_size: 10,
})

const onSubmit = async () => {
  formInline.current_page = 1
  const res = await getUserApi(formInline)
  userList.value = res.data[0]
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
  const res = await getUserApi(formInline)
  userList.value = res.data[0]
  total.value = res.data[1]
}

const handleCurrentChange = async (val: number) => {
  formInline.current_page = val
  const res = await getUserApi(formInline)
  userList.value = res.data[0]
  total.value = res.data[1]
}
</script>


<template>
  <el-container>
    <Aside>
      <template #default>
        <el-menu>
          <el-menu-item class="justify-center" index="1" @click="handleToRestaurantList">
            <Icon icon="material-symbols:restaurant" width="24" height="24" />
            後台餐廳列表
          </el-menu-item>
        </el-menu>
      </template>
    </Aside>

    <el-main>
      <h3 class="pt-5 text-2xl font-serif">後台使用者列表</h3>

      <div class="w-full max-w-6xl border-2 rounded-xl m-6 mx-auto overflow-hidden">
        <div class="form-table border-b p-5 flex items-center">
          <el-form :inline="true" :model="formInline" class="demo-form-inline flex flex-wrap gap-x-5 gap-y-3">
            <el-form-item label=名稱>
              <el-input v-model="formInline.name" placeholder="模糊查詢" clearable />
            </el-form-item>
            <el-form-item label=信箱>
              <el-input v-model="formInline.email" placeholder="模糊查詢" clearable />
            </el-form-item>
            <el-form-item label="類別 :" style="width: 150px">
              <el-select v-model="formInline.is_admin" placeholder="請選擇" clearable>
                <el-option
                    v-for="item in userStatusOptions"
                    :key="String(item.value)"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="flex gap-2">
                <el-button type="primary" @click="onSubmit">查詢</el-button>
                <el-button type="danger" @click="">刪除</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <el-table
            :data="userList"
            @selection-change=""
            @cell-contextmenu=""
            style="width: 100%"
        >
          <el-table-column type="index" width="90" align="center" />
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="名稱" width="250" />
          <el-table-column prop="email" label="信箱" width="350" />
          <el-table-column label="是否為管理員">
            <template #default="scope">
              <el-tag :type="scope.row.is_admin ? 'success' : 'danger'">
                {{ scope.row.is_admin ? '是管理員' : '不是管理員' }}
              </el-tag>
            </template>
          </el-table-column>
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
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
