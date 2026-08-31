<script setup lang="ts">
import { ref } from "vue"
import { Icon } from "@iconify/vue"

/* 手機版抽屜選單開關 */
const drawerVisible = ref(false)
</script>

<template>
  <!-- 桌面版固定側欄 -->
  <el-aside class="aside hidden lg:block h-full pt-15" width="200px">
    <slot />
  </el-aside>

  <!-- 手機版漢堡選單按鈕 -->
  <button
      class="button-hamburger lg:hidden fixed left-3 top-(--header-height) mt-3 z-50 flex items-center justify-center w-10 h-10 rounded-lg shadow"
      aria-label="開啟選單"
      @click="drawerVisible = true"
  >
    <Icon icon="material-symbols:menu-rounded" width="22" height="22" />
  </button>

  <!-- 手機版抽屜選單，點選項目後自動關閉 -->
  <el-drawer v-model="drawerVisible" direction="ltr" size="200px" :with-header="false">
    <div class="pt-15" @click="drawerVisible = false">
      <slot />
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
/* 隨主題切換的顏色，一律用 src/style.css 定義的 CSS 變數（見 src/stores/theme.ts），不寫死色碼 */
.aside {
  background-color: var(--bg);
  border-right: 1px solid var(--border);
}

.button-hamburger {
  background-color: var(--bg);
  color: var(--text-h);
  transition: transform 200ms ease-out 100ms;

  &:hover {
    cursor: pointer;
    transform: scale(1.2);
  }
}

</style>
