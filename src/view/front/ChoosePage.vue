<script setup lang="ts">
import {useRouter} from "vue-router";

/* 導航 */
const router = useRouter()

/* 路由切換 */
const handleToFrontRestaurantAll = async () => {
  await router.push({name: 'frontRestaurantAll'})
}

const handleToFrontRestaurantMenu = async () => {
  await router.push({name: 'notFound'})
}
</script>

<template>
  <el-container class="box">
    <div class="flex-child" @click="handleToFrontRestaurantAll">
      <h3>餐廳評論</h3>
      <img src="https://cdn-icons-png.flaticon.com/512/3081/3081342.png" width="300" alt="餐廳評論圖片">
    </div>

    <div class="flex-child" @click="handleToFrontRestaurantMenu">
      <h3>餐廳菜單</h3>
      <img src="https://cdn-icons-png.freepik.com/512/1046/1046747.png" width="300" alt="餐廳菜單圖片">
    </div>
  </el-container>
</template>

<style scoped lang="scss">
.box {
  display: flex;
  padding: 50px;
  margin-top: var(--header-height);
}

.flex-child {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
  background-color: darkgray;
  margin: 20px;
  transition: transform 0.5s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
}

.flex-child h3 {
  font-size: clamp(2rem, 3.1vw, 3.5rem);
  color: #000;
}

@media (max-width: 1024px) {
  .box {
    flex-direction: column;
  }
}
</style>