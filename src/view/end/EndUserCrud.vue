<script setup lang="ts">

import PageTable from "@/components/PageTable.vue"
import { useRouter } from "vue-router"
import { getUserApi, updateUserAccessApi } from "@/api/end_user"
import Aside from "@/view/front/components/Aside.vue"
import { reactive } from "vue"
import { type UpdateUser, type User, type UserSearch, userStatusOptions } from "@/api/end_user/type.ts"

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
      <PageTable v-model="formInline" :getFormDataApi="getUserApi" tableTitle="後台使用者列表">
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
