<script setup lang="ts">
import {useRouter} from "vue-router";
import PageSwiper from "@/components/PageSwiper.vue"
import { SwiperSlide } from 'swiper/vue'

/* 導航 */
const router = useRouter()

/* 路由切換 */
const handleToFrontRestaurantAll = async () => {
  await router.push({name: 'frontRestaurantAll'})
}

const handleToFrontRestaurantMenu = async () => {
  await router.push({name: 'frontRestaurantMenuAll'})
}
</script>

<template>
  <el-container class="box">
    <p class="hint">請拖曳畫面到想抵達的頁面後，點選一下</p>
    <PageSwiper>
        <swiper-slide>
          <div class="flex-child" @click="handleToFrontRestaurantAll">
            <h3>餐廳評論</h3>
            <img src="https://cdn-icons-png.flaticon.com/512/3081/3081342.png" alt="餐廳評論圖片">
          </div>
        </swiper-slide>

        <swiper-slide>
          <div class="flex-child" @click="handleToFrontRestaurantMenu">
            <h3>餐廳菜單</h3>
            <img src="https://cdn-icons-png.freepik.com/512/1046/1046747.png" alt="餐廳菜單圖片">
          </div>
        </swiper-slide>

    </PageSwiper>
  </el-container>
</template>

<style scoped lang="scss">
.box {
  flex-direction: column;
  padding: 50px;
  margin-top: var(--header-height);
}

/* 進入畫面後淡入，顯示 3 秒後淡出（動畫結束停在 opacity: 0，保留原本佔位避免版面跳動） */
.hint {
  opacity: 0;
  animation: hint-fade 6s ease-in-out forwards;
}

@keyframes hint-fade {
  0% { opacity: 0; }
  25% { opacity: 1; }   /* 1.5 秒淡入 */
  75% { opacity: 1; }   /* 維持 3 秒 */
  100% { opacity: 0; }  /* 1.5 秒淡出 */
}

@media (prefers-reduced-motion: reduce) {
  .hint {
    animation: none;
    opacity: 1;
  }
}

.flex-child {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
  background-color: darkgray;
}

.flex-child > h3 {
  font-size: clamp(1.5rem, 2vw, 2.2rem);
  color: #000;
  margin: 20px 0;
}

.flex-child > img {
  flex: 1;
  min-height: 0;       /* 關鍵：解除 flex item 的 auto 最小高度，才能縮進容器 */
  max-width: 100%;
  object-fit: contain; /* 等比例縮放塞進配到的空間，不裁切也不變形 */
  padding-bottom: 30px;
}
</style>
