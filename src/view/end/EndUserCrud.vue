<script setup lang="ts">

import { Icon } from "@iconify/vue"
import Aside from "@/view/end/components/Aside.vue"
import { useRouter } from "vue-router"
import { onMounted, onUnmounted, reactive, ref } from "vue"
import { deleteUserApi, getUserApi, updateUserAccessApi } from "@/api/end_user"
import { type UpdateUser, type User, type UserSearch, userStatusOptions } from "@/api/end_user/type.ts"
import { type ComponentSize, ElMessage, ElMessageBox } from "element-plus"

/* 導航 */
const router = useRouter()

/* 切換至後台餐廳列表 */
const handleToRestaurantList = async () => {
  await router.push({name: 'endRestaurantAll'})
}

/* 資訊 */
const userList = ref<User[]>([])

/* 更新 table 函式 */
const updatedData = async () => {
  const res = await getUserApi(formInline)
  userList.value = res.data[0]
  total.value = res.data[1]
}

onMounted(async () => {
  await updatedData()
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

/* 編輯使用者權限 */
const handleChangeAdmin = async (row: User) => {
  const updated_data: UpdateUser = {id: row.id, is_admin: row.is_admin}
  await updateUserAccessApi(updated_data)
}

/* 右鍵功能 */
const showMenu = ref<boolean>(false)
const menuPos = reactive({x: 0, y: 0})
const rowData = ref<User>({
  id: '',
  name: '',
  email: '',
  is_admin: false
})

const handleRightClick = (row: any, _column: any, _cell: any, event: PointerEvent) => {
  rowData.value = {
    id: row?.id ?? '',
    name: row?.name ?? '',
    email: row?.email ?? '',
    is_admin: row?.is_admin ?? false,
  }

  event.preventDefault()
  event.stopPropagation()

  menuPos.x = event.clientX
  menuPos.y = event.clientY

  showMenu.value = true
}

const handleDelete = (singleId?: string) => {
  const ids = singleId ? [singleId] : multipleSelection.value

  if (!ids || ids.length === 0 || ids[0] === '') {
    ElMessage.warning("請先選取要刪除的資料")
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
        await updatedData()

        ElMessage.success("刪除成功")
      })
      .catch(() => {
        ElMessage.info("已取消刪除")
      })
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


/* 選擇發生變動 */
const multipleSelection = ref<string[]>([])

const handleSelectionChange = (userList: User[]) => {
  multipleSelection.value = userList.map((user: User) => user.id)
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
                <el-button type="danger" @click="handleDelete()">刪除</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <el-table
            :data="userList"
            @selection-change="handleSelectionChange"
            @cell-contextmenu="handleRightClick"
            style="width: 100%"
        >
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

      <!-- 右鍵功能 -->
      <div class="context-menu" v-if="showMenu" v-show="showMenu"
           :style="{ left: menuPos.x + 'px', top: menuPos.y + 'px' }">
        <ul>
          <li @click="handleDelete(rowData.id)">刪除</li>
        </ul>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
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
