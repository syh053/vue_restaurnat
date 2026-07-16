<script setup lang="ts">

import PageTable, { type ContextMenuOption } from "@/components/PageTable.vue"
import { useRouter } from "vue-router"
import { deleteUserApi, getUserApi, updateUserAccessApi } from "@/api/end_user"
import Aside from "@/view/front/components/Aside.vue"
import { reactive, ref, useTemplateRef } from "vue"
import { type UpdateUser, type User, type UserSearch, userStatusOptions } from "@/api/end_user/type.ts"
import { ElMessageBox } from "element-plus"

/* 導航 */
const router = useRouter()

/* 切換至後台餐廳列表 */
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

const handleDelete = async (singleId?: string) => {
  console.log("觸發刪除按鈕")
  console.log('singleId :', singleId)
  console.log('multipleSelection :', multipleSelection.value)

  const ids = singleId ? [singleId] : multipleSelection.value

  if (!ids || ids.length === 0 || ids[0] === '') {
    await ElMessageBox.alert('請先選取要刪除的資料', '提示', {type: 'warning'})
    return
  }

  ElMessageBox.confirm(
      "確定要刪除使用者嗎？",
      "使用者刪除",
      {
        confirmButtonText: "刪除",
        cancelButtonText: "取消",
      }
  )
      .then(async () => {
        await deleteUserApi(ids)

        // 重新整理表格
        tableRef.value?.refresh()

        // ElMessage.success("刪除成功")
        await ElMessageBox.alert('刪除成功', '提示', {type: 'warning'})
      })
      .catch(() => {
        // ElMessage.info("已取消刪除")
        ElMessageBox.alert('已取消刪除', '提示', {type: 'warning'})
      })
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
