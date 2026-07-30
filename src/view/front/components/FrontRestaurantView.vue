<script setup lang="ts">
import type { EndRestaurantList } from "@/api/end_restaurant/type.ts"
import { ref, watch } from "vue"
import { getRestaurantCommentApi } from "@/api/comment"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'


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

/* 監控餐廳資料變化 */
watch(
    () => props.restaurant?.id,
    async (restaurantId) => {

      if (!restaurantId) return

      const response = await getRestaurantCommentApi(restaurantId)

      comments.value = response.data

      console.log('此餐廳的評論 :', comments)
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
const formText = ref<string>('')

const onSubmit = async () => {
  console.log('此餐廳的評論 :', props.restaurant!.id)
}
</script>

<template>
  <el-dialog class="dialog-box" v-model="showDialog" @close="closeDialog" width="60%" style="padding: 2em;">
    <div class="header">
      <h2>{{ props.restaurant?.name }}</h2>
      <p>{{ props.restaurant?.category_name }}</p>
    </div>

    <div class="feature-container">
      <div class="feature-left">
        <img
            :src="props.restaurant?.image ? 'http://localhost:8888' + props.restaurant.image : 'https://sansalife.tw/wp-content/uploads/2023/04/caesarmetro-restaurant-14_%E7%BB%93%E6%9E%9C-jpg.webp'"
            alt="餐廳圖片">
        <p>營業時間 : {{ props.restaurant?.openingHours }} 小時</p>
        <p>餐廳電話 : {{ props.restaurant?.tel }}</p>
        <p>餐廳地址 : {{ props.restaurant?.address }}</p>
      </div>

      <div class="feature-right">
        <p>
          {{ props.restaurant?.description }}
        </p>
      </div>

    </div>

    <hr>

    <div>
      <p class="mb-3">評論區</p>
      <div class="comments" v-for="comment in comments">
        <span>{{ comment.user_name }} : {{ comment.comment }} {{formatRelativeTime(comment.created_at)}}</span>
      </div>
    </div>

    <hr>

    <el-form label-position="top" size="large">
      <el-form-item label="留下餐廳評論">
        <el-input v-model="formText" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">送出</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

    <hr>

    <div class="btn-position">
      <button class="btn border-2 border-emerald-700" @click="closeDialog">返回</button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.dialog-box) {
  height: 700px;
  display: flex;
  flex-direction: column;

  // 讓內部 body 滿格並把超出部分設為自動滾動或隱藏
  .el-dialog__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
}

.header {
  margin-bottom: 2em;

  h2 {
    text-align: left;
  }
}

.feature-container {
  flex: 1;
  display: flex;
  flex-direction: row;
}

.feature-left {
  flex: 1.5;

  /* 控制圖片最大高度與縮放 */
  img {
    width: 100%;
    height: 250px; /* 給圖片一個固定上限高度 */
    object-fit: cover; /* 保持比例並填滿，不會拉伸變形 */
    border-radius: 8px;
  }
}

.feature-left > p:first-of-type {
  padding-top: 1.5em;
}

.feature-right {
  flex: 2;
  padding-left: 3em;
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
.comments {
  text-align: left;
}

:deep(.el-form-item__label) {
  font-size: 1.5em;
}
</style>
