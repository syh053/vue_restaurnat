<script setup lang="ts">

import PageTable, { type ContextMenuOption } from "@/components/PageTable.vue"
import { useRouter } from "vue-router"
import { deleteUserApi, getUserApi, updateUserAccessApi } from "@/api/end_user"
import Aside from "@/view/front/components/Aside.vue"
import { reactive, ref, useTemplateRef } from "vue"
import { type UpdateUser, type User, type UserSearch, userStatusOptions } from "@/api/end_user/type.ts"
import { ElMessageBox } from "element-plus"
import type { EndRestaurantList } from "@/api/end_restaurant/type.ts"

/* 導航 */
const router = useRouter()

/* 切換至後台使用者列表 */
const handleToRestaurantList = async () => {
  await router.push({name: 'endRestaurantAll'})
}

/* 查詢 */
const formInline = reactive<UserSearch>({
  name: '',
  email: '',
  is_admin: null,
  current_page: 1,
  page_size: 10,
})

/* 編輯使用者權限 */
const handleChangeAdmin = async (row: User) => {
  const updated_data: UpdateUser = {id: row.id, is_admin: row.is_admin}
  await updateUserAccessApi(updated_data)
}

/* 💡 宣告右鍵功能配置陣列 */
const multipleSelection = ref<string[]>([]) // 多選資料
/* 勾選變更 */

const handleSelectionChange = (list: User[]) => {
  multipleSelection.value = list.map(item => item.id)
}

const tableRef = useTemplateRef('pageTable')

const handleDelete = async (row?: EndRestaurantList) => {
  let targets: string[] = []
  let confirmMessage = ''

  if (row && row.id) {
    // 狀況 A：從右鍵選單點擊（單筆刪除）
    targets = [row.id]
    confirmMessage = `確定要刪除使用者「${row.name}」嗎？`
  } else {
    // 狀況 B：從頂部按鈕點擊（批量刪除）
    if (multipleSelection.value.length === 0) {
      await ElMessageBox.alert('請先勾選要刪除的使用者', '提示', {type: 'warning'})
      return
    }
    targets = multipleSelection.value
    confirmMessage = `確定要刪除這 ${targets.length} 個使用者嗎？`
  }

  // 執行刪除與提示
  try {
    await ElMessageBox.confirm(confirmMessage, '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 呼叫 API（不論單筆或多選，API 接收的都是陣列）
    await deleteUserApi(targets)

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
    label: '刪除',
    divided: true, // 在上方加上分割線
    action: (row) => {
      handleDelete(row)
    }
  }
])
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
      <PageTable ref="pageTable" v-model="formInline" :getFormDataApi="getUserApi" tableTitle="後台使用者列表"
                 :contextMenuOptions="menuConfigs" @selection-change="handleSelectionChange"
                 @batch-delete="handleDelete">
        <template #searchList>
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
        </template>

        <template #default>
          <el-table-column type="index" width="90" align="center" />
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="名稱" width="350" />
          <el-table-column prop="email" label="信箱" width="450" />
          <el-table-column prop="is_admin" label="是否為管理員">
            <template #default="{row}">
              <el-switch
                  v-model="row.is_admin"
                  @change="handleChangeAdmin((row))"
                  class="ml-2"
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              />
            </template>
          </el-table-column>
        </template>
      </PageTable>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
