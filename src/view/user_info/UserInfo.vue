<script setup lang="ts">
import {onMounted, ref} from "vue"
import {getUserInfoApi, updateUserInfoImageApi} from "@/api/user"
import type {EndRestaurantList} from "@/api/end_restaurant/type.ts"
import FrontRestaurantView from "@/view/front/components/FrontRestaurantView.vue"
import {Plus} from "@element-plus/icons-vue"
import {useRouter} from "vue-router";
import {ElMessageBox, type UploadFile} from "element-plus";

/* 導航 */
const router = useRouter()

/* 資訊 */
const userData = ref<any>(null)
const restaurantInfo = ref<EndRestaurantList>()
const loading = ref<boolean>(true)

/* Dialog 控制 */
const showDialog = ref<boolean>(false)

/* DOM 載入完畢後執行 */
onMounted(async () => {
  try {
    const {data} = await getUserInfoApi()
    userData.value = data
  } catch (e) {
    await ElMessageBox.alert('尚未登入無法查看使用者資訊', '提示', {
      confirmButtonText: '返回'
    })
    await router.push({name: 'logIn'})
  } finally {
    loading.value = false
  }
})

/* 顯示餐廳詳細頁面 */
const handleToDetail = (restaurant: EndRestaurantList) => {
  showDialog.value = true
  restaurantInfo.value = restaurant

  // 更新網址
  window.history.pushState({}, '', `/front/restaurant?id=${restaurant.id}`)
}

/* 前往使用者編輯頁面 */
const updateUserInfo = () => {
  disabled.value = !disabled.value

  router.push({name: 'userInfoUpdate'})
}

/* 圖片功能 */
const disabled = ref<boolean>(false)
const handleImageChange = async (uploadFile: UploadFile) => {
  console.log('更換圖片')
  if (!uploadFile.raw) return

  const isJPGorPNG = uploadFile.raw.type === 'image/jpeg' || uploadFile.raw.type === 'image/png'

  const isLt10M = uploadFile.raw.size / 1024 / 1024 < 10

  if (!isJPGorPNG || !isLt10M) return false

  await updateUserInfoImageApi(uploadFile.raw)

  const {data} = await getUserInfoApi()
  userData.value = data
}

const displayImage = ref<string>('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

// 取得圖片前綴
const API_BASE_URL = import.meta.env.VITE_API_URL
</script>

<template>
  <div class="user-container mx-auto mt-(--header-height)">
    <div class="hero flex flex-col">
      <div class="flex gap-5">

        <div class="">
          <el-upload
              v-if="!loading"
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :auto-upload="false"
              :disabled="disabled"
              :on-change="handleImageChange"
          >
            <img
                v-if="displayImage"
                :src="userData?.image ? API_BASE_URL + userData.image : displayImage"
                alt="使用者封面照"
                class="user-img"
                :class="{ 'hover:opacity-80': !disabled }"
                style="max-height: 350px;"
            >
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </div>

        <div class="flex flex-col justify-center items-start">
          <p class="user-name"><strong>{{ userData?.name }}</strong></p>
          <p>評論餐廳數 : {{ userData?.comments_total }}</p>
        </div>
      </div>

      <div class="w-1/2 mt-5">
        <el-button class="update-info-button w-full sm:w-auto" size="large" @click="updateUserInfo">編輯個人檔案
        </el-button>
      </div>
    </div>

    <div class="card">
      <p>評論餐廳數 : {{ userData?.comments_total }}</p>
      <div class="grid">
        <div class="restaurant-card" v-for="restaurant in userData?.restaurants" :key="restaurant.id"
             @click="handleToDetail(restaurant)">
          <img
              :src="restaurant.image ?
              API_BASE_URL + restaurant.image
              : 'https://sansalife.tw/wp-content/uploads/2023/04/caesarmetro-restaurant-14_%E7%BB%93%E6%9E%9C-jpg.webp'"
              alt="餐廳照片">
        </div>
      </div>
    </div>
  </div>

  <FrontRestaurantView v-if="showDialog" v-model="showDialog" :restaurant="restaurantInfo"/>
</template>

<style scoped lang="scss">
p {
  text-align: left;
  margin: 10px 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-auto-rows: 150px;
  gap: 16px;
}

.hero,
.card {
  background: #ffffff;
  border: 1px solid #dbe3ec;
  border-radius: 16px;
  box-shadow: 0 10px 28px rgb(33 53 71 / 8%);
  box-sizing: border-box;
}

.hero {
  padding: 28px;
  margin-bottom: 24px;
}

.card {
  padding: 24px;
  margin-bottom: 20px;
}

.restaurant-card {
  background: #ffffff;
  border: 1px solid #dbe3ec;
  border-radius: 16px;
  box-shadow: 0 10px 28px rgb(33 53 71 / 8%);
  overflow: hidden; /* 切掉超出圓角的圖片 */

  &:hover {
    cursor: pointer;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 圖片縮放填滿容器，保持比例但裁切 */
    object-position: center; /* 裁切時保留圖片中心點 */
  }
}

/* 手機尺寸用 */
@media (max-width: 640px) {
  .hero, .card {
    padding: 16px;
  }
}
</style>
