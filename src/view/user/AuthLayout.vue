<script setup lang="ts">

</script>

<template>



  <div class="w-full min-h-screen flex flex-col md:flex-row">

    <!-- 登入頁面圖片：手機時在表單上方（垂直排列），桌面時在左側且高度減半並垂直置中 -->
    <div class="flex w-full h-56 md:w-1/2 md:h-1/2 md:self-center items-center justify-center md:px-10">
      <div
          class="w-full h-full bg-[url(https://hips.hearstapps.com/hmg-prod/images/486cec61-814b-4c76-a41c-f19efa80a688-686e5b6b1ccb5.jpg)] bg-cover bg-center"></div>
    </div>

    <!-- 圖片與表單的分隔線：置於兩欄正中間 -->
    <hr class="hidden md:block" style="height: 100%; border: 0.5px solid #ddd;">

    <div class="w-full flex-1 md:flex-none md:w-1/2 flex items-center justify-center md:px-10">
      <router-view />
    </div>
  </div>
</template>

<style scoped>

</style>
