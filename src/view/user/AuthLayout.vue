<script setup lang="ts">

</script>

<template>



  <div class="w-full min-h-screen flex flex-col bg-black">

    <!-- 主內容：lg 以上左右分欄，lg 以下上下堆疊 -->
    <div class="flex-1 flex flex-col lg:flex-row">

      <!-- 圖片區塊：小於 lg 隱藏；lg 以上吃滿剩餘空間並置中 -->
      <div class="hidden lg:flex lg:flex-1 flex-col items-center justify-center px-10">
        <h1 class="title">餐廳論壇與點餐系統</h1>

        <div
            class="w-full h-80 bg-[url(https://hips.hearstapps.com/hmg-prod/images/486cec61-814b-4c76-a41c-f19efa80a688-686e5b6b1ccb5.jpg)] bg-cover bg-center bg-no-repeat"></div>
      </div>

      <!-- 表單區塊：lg 以上固定寬 650px（lg:flex-none），畫面縮小維持不變；小於 lg 時全寬並讓欄位垂直/水平置中 -->
      <div class="w-full flex-1 lg:flex-none lg:w-[650px] flex items-center justify-center bg-olive-900 px-5 lg:px-0 border-l border-gray-600">
        <router-view />
      </div>
    </div>

    <!-- footer：手機與桌面皆顯示，置底顯示 -->
    <footer class="w-full py-6 px-5 text-center text-white/80 text-xs sm:text-sm leading-relaxed space-y-1 border-t border-gray-600">
      <p class="text-white/90 font-medium">餐廳論壇與點餐系統 · 個人作品集專案</p>
      <p>感謝您撥空瀏覽。一般使用者可自行註冊帳號體驗前台</p>
      <p>如需查看後台管理功能，請使用管理員帳號登入：</p>
      <p class="font-mono">帳號 admin　密碼 123</p>
      <p class="text-white/50 text-xs">※ 此帳密僅供展示用途</p>
    </footer>
  </div>
</template>

<style scoped>
  .title {
    font-family: "M PLUS U", sans-serif;
    /* 依視窗寬度動態調整：最小 2rem、理想 4vw、最大 3.5rem */
    font-size: clamp(2rem, 3.1vw, 3.5rem);
    line-height: 1.3;
    background: linear-gradient(to right, #ff0000, #0000ff);
    background-clip: text;
    color: transparent;
    margin-bottom: 0.3em;
  }
</style>
