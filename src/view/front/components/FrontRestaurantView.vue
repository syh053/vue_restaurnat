<script setup lang="ts">
import type { EndRestaurantList } from "@/api/end_restaurant/type.ts"
import { ref, watch } from "vue"
import { getRestaurantCommentApi, postRestaurantCommentApi } from "@/api/comment"
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw' // 匯入繁體中文語言包
import relativeTime from 'dayjs/plugin/relativeTime'
import type { restaurantCommentAdd } from "@/api/comment/type.ts"


/* 設定時間區域 */
dayjs.extend(relativeTime)
dayjs.locale('zh-tw')

const formatRelativeTime = (date: string) => {
  return dayjs(date).fromNow()
}

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

/* 關閉餐廳詳細察看畫面 */
const closeDialog = () => {
  // 更新網址
  window.history.pushState({}, '', `/front/restaurant/all`)

  showDialog.value = false
}

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

  comments.value = await getCommentData(props.restaurant!.id)

  // 清除輸入欄
  clearCommentInput()
}
</script>

<template>
  <el-dialog class="dialog-box" v-model="showDialog" width="80%" :show-close="false" :before-close="closeDialog">
    <div class="feature-container">
      <div class="feature-left">
        <img
            :src="props.restaurant?.image ? 'http://localhost:8888' + props.restaurant.image : 'https://sansalife.tw/wp-content/uploads/2023/04/caesarmetro-restaurant-14_%E7%BB%93%E6%9E%9C-jpg.webp'"
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
          <div class="comments" v-for="comment in comments">
            <p class="comment-block">
              <a class="user-name"><strong>{{ comment.user_name }}</strong></a>
              <span>{{ comment.comment }}</span>
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
</style>
