<script setup lang="ts">
import type { EndRestaurantList } from "@/api/end_restaurant/type.ts"
import { ref, watch } from "vue"
import { deleteRestaurantCommentApi, getRestaurantCommentApi, postRestaurantCommentApi } from "@/api/comment"
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw' // 匯入繁體中文語言包
import relativeTime from 'dayjs/plugin/relativeTime'
import type { restaurantCommentAdd, restaurantCommentDelete } from "@/api/comment/type.ts"
import { useUserStore } from "@/stores/user.ts"
import { ElMessageBox } from "element-plus"
import { useRouter } from "vue-router"


/* 設定時間區域 */
dayjs.extend(relativeTime)
dayjs.locale('zh-tw')

const formatRelativeTime = (date: string) => {
  return dayjs(date).fromNow()
}

/* 初始化 Store */
const userStore = useUserStore()

/* 導航 */
const router = useRouter()

/* Props */
const props = defineProps<{
  restaurant?: EndRestaurantList
}>()

/* 資料 */
const comments = ref<any[]>([])

/* 取得評論資料 */
const getCommentData = async (restaurantId: string) => {
  const response = await getRestaurantCommentApi(restaurantId)
  return response.data
}

/* 監控餐廳資料變化 */
watch(
    () => props.restaurant?.id,
    async (restaurantId) => {

      if (!restaurantId) return

      comments.value = await getCommentData(restaurantId)
    },
    {immediate: true}
)


/* Dialog */
const showDialog = defineModel<boolean>({default: false})

/* 前往餐廳菜單頁面 */
const goMenu = () => {
  router.push({
    name: 'frontRestaurantMenu',
    params: { id: props.restaurant!.id },
    query: { name: props.restaurant!.name }
  })
}

/* 關閉餐廳詳細察看畫面 */
const closeDialog = () => {
  // 更新網址
  router.back()

  showDialog.value = false
}

/* 取得圖片前綴 */
const API_BASE_URL = import.meta.env.VITE_API_URL

/* 餐廳評論功能 */
const inputText = ref<string>('')

const clearCommentInput = () => {
  inputText.value = ''
}

const onSubmit = async () => {
  const data: restaurantCommentAdd = {
    text: inputText.value,
    restaurant_id: props.restaurant!.id
  }

  await postRestaurantCommentApi(data)

  // 重整評論資料
  comments.value = await getCommentData(props.restaurant!.id)

  // 清除輸入欄
  clearCommentInput()
}

/* 刪除餐廳評論功能 */
const handleDeleteComment = async (comment: any) => {
  try {
    await ElMessageBox.confirm(`確定要出刪除『${comment.name}』的評論嗎?`, '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 執行刪除請求
    const deleteParams: restaurantCommentDelete = {restaurant_id: props.restaurant!.id, comment_id: comment.comment_id}
    await deleteRestaurantCommentApi(deleteParams)

    // 重整評論資料
    comments.value = await getCommentData(props.restaurant!.id)
  } catch (error) {
    if (error instanceof Error) {
      console.error("發生錯誤：", error.message)
    } else {
      console.error("發生未知錯誤：", error)
    }
  } finally {
    console.log("處理完成")
  }
}
</script>

<template>
  <el-dialog class="dialog-box" v-model="showDialog" width="80%" :show-close="false" :before-close="closeDialog">
    <div class="feature-container">
      <div class="feature-left">
        <img
            :src="props.restaurant?.image
            ? API_BASE_URL + restaurant?.image
            : 'https://sansalife.tw/wp-content/uploads/2023/04/caesarmetro-restaurant-14_%E7%BB%93%E6%9E%9C-jpg.webp'"
            alt="餐廳圖片">
      </div>

      <div class="feature-right">
        <div class="header">
          <h2>{{ props.restaurant?.name }}</h2>
          <p>{{ props.restaurant?.category_name }}</p>
        </div>

        <div class="body">
          <p>營業時間 : {{ props.restaurant?.openingHours }} 小時</p>
          <p>餐廳電話 : {{ props.restaurant?.tel }}</p>
          <p>餐廳地址 : {{ props.restaurant?.address }}</p>

          <hr>

          <p> {{ props.restaurant?.description }} </p>
        </div>

        <hr>

        <div class="comment-container">
          <div class="comments" v-for="comment in comments" :key="comment.id">
            <p class="comment-block">
              <a><strong>{{ comment.user_name }}</strong></a>
              <span>{{ comment.comment }}</span>
              <el-button class="delete-btn" v-if="userStore.userInfo?.is_admin" type="danger" link
                         @click="handleDeleteComment(comment)">刪除
              </el-button>
            </p>
            <p>{{ formatRelativeTime(comment.created_at) }}</p>
          </div>
        </div>

        <hr>

        <el-form class="comment-input">
          <el-form-item class="input">
            <input id="comment-input" name="comment" v-model="inputText" placeholder="請輸入評論..." />
          </el-form-item>
          <el-form-item class="button">
            <el-button type="primary" plain @click="goMenu">查看菜單</el-button>
            <button class="btn btn-ghost" @click.prevent="onSubmit">送出</button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.el-dialog__header.show-close {
  display: none;
}

.header {
  display: flex;
  flex-direction: row;

  h2 {
    flex: 1;
    text-align: left;
  }
}

.feature-container {
  height: 75vh;
  flex: 1;
  display: flex;
  flex-direction: row;
}

.feature-left {
  flex: 2;

  /* 控制圖片最大高度與縮放 */
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: #000;
    border-radius: 8px;
  }
}

.feature-left > p:first-of-type {
  padding-top: 1.5em;
}

.feature-right {
  display: flex;
  flex-direction: column;
  flex: 1.5;
  padding-left: 1em;
}

hr {
  margin: 2em 0;
}

.btn-position {
  text-align: left;
}

p {
  text-align: left;
  font-size: 1.5em;
}

/* 留言區 */
.comment-container {
  flex: 1;
}

.comments {
  text-align: left;
  padding: 0.5em 0;

  p:nth-of-type(2) {
    font-size: 1.2em;
    margin-top: 0.5em;
  }
}


.comment-block {
  display: flex;
  flex-direction: row;

  > a:first-of-type {
    margin-right: 0.5em;
  }

  > span {
    flex: 1;
  }
}

.user-name {
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}

/* 留言輸入框 */
.comment-input {
  display: flex;
  flex-direction: row;

  .input {
    flex: 1;
    margin-right: 0.5em;

    &:focus-within {
      outline: none;
      box-shadow: none;
      border-color: transparent;
    }
  }
}

#comment-input {
  font-size: 1.3em;
}

/* 刪除按鈕 */
.delete-btn {
  font-size: 1em;
}

/* 手機尺寸用 */
@media (max-width: 1024px) {
  .feature-container {
    height: auto;
    flex-direction: column;
  }

  .feature-left {
    flex: none;

    img {
      height: 200px;
    }
  }

  .feature-right {
    flex: none;
    padding-left: 0;
    padding-top: 1em;
  }

  p {
    font-size: 1.1em;
  }

  hr {
    margin: 1em 0;
  }
}
</style>
