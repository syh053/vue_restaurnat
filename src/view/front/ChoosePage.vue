<script setup lang="ts">
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user.ts"
import { Icon } from "@iconify/vue"

/* 導航 */
const router = useRouter()

/* 初始化 Store */
const userStore = useUserStore()

// 取得圖片前綴
const API_BASE_URL = import.meta.env.VITE_API_URL

/* 前往餐廳評論頁面 */
const handleToReview = async () => {
  await router.push({ name: 'frontRestaurantAll' })
}

/* 前往餐廳點餐頁面 */
const handleToOrder = async () => {
  await router.push({ name: 'frontRestaurantMenuAll' })
}

/* 平台特色 */
const features = [
  {
    icon: 'material-symbols:rate-review-outline',
    title: '真實評論',
    desc: '看看其他饕客怎麼說，找到值得一試的口袋名單',
  },
  {
    icon: 'material-symbols:menu-book-outline',
    title: '多樣菜單',
    desc: '各店家菜色一次瀏覽，價格、品項清楚呈現',
  },
  {
    icon: 'material-symbols:shopping-cart-outline',
    title: '線上點餐',
    desc: '加入購物車、線上完成付款，輕鬆享用美食',
  },
]
</script>

<template>
  <el-main class="choose-page h-screen w-full overflow-auto">
    <!-- 歡迎橫幅 -->
    <section class="hero">
      <div class="hero-content">
        <el-avatar
            v-if="userStore.userInfo"
            :size="64"
            class="hero-avatar"
            :src="userStore.userInfo?.image ? API_BASE_URL + userStore.userInfo.image
              : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
        />
        <p class="hero-eyebrow">歡迎回來</p>
        <h1 class="hero-title">{{ userStore.userInfo?.name || '訪客' }}，今天想從哪裡開始？</h1>
        <p class="hero-subtitle">瀏覽餐廳評論，或直接線上點餐，體驗一站式的餐廳服務</p>
      </div>
    </section>

    <div class="choose-inner">
      <!-- 兩大主要入口 -->
      <section class="entry-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <el-card class="entry-card !rounded-[50px]" shadow="hover" @click="handleToReview">
          <div class="entry-image-wrap review-bg">
            <img src="https://cdn-icons-png.flaticon.com/512/3081/3081342.png" alt="餐廳評論圖片" />
          </div>
          <div class="entry-body">
            <h2>餐廳評論</h2>
            <p>瀏覽餐廳資訊、查看其他使用者的真實評論，找到你的下一間口袋名單</p>
            <div class="flex">
              <el-button class="ml-auto" type="primary" round>
                前往瀏覽
                <Icon icon="ep:arrow-right" width="16" height="16" class="ml-1" />
              </el-button>
            </div>
          </div>
        </el-card>

        <el-card class="entry-card !rounded-[50px]" shadow="hover" @click="handleToOrder">
          <div class="entry-image-wrap order-bg">
            <img src="https://cdn-icons-png.freepik.com/512/1046/1046747.png" alt="餐廳點餐圖片" />
          </div>
          <div class="entry-body">
            <h2>餐廳點餐</h2>
            <p>挑選喜歡的店家與餐點，線上加入購物車、完成付款，輕鬆享用美食</p>
            <div class="flex">
              <el-button class="ml-auto" type="primary" round>
                開始點餐
                <Icon icon="ep:arrow-right" width="16" height="16" class="ml-1" />
              </el-button>
            </div>
          </div>
        </el-card>
      </section>

      <!-- 平台特色 -->
      <section class="features">
        <h2 class="features-title">為什麼選擇我們</h2>
        <div class="features-grid grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          <div class="feature-item" v-for="feature in features" :key="feature.title">
            <div class="feature-icon">
              <Icon :icon="feature.icon" width="28" height="28" />
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
          </div>
        </div>
      </section>

      <footer class="choose-footer">
        <p>餐廳論壇與點餐系統 · 個人作品集專案</p>
      </footer>
    </div>
  </el-main>
</template>

<style scoped lang="scss">
.choose-page {
  /* 保留 App.vue 固定 Header 需要的頂部間距，其餘留白交給內層區塊自己控制，讓橫幅可以左右滿版 */
  padding: 60px 0 0 0 !important;
}

/* ==============================
   歡迎橫幅
============================== */
.hero {
  position: relative;
  padding: 3rem 1.25rem;
  background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.75)),
      url("https://hips.hearstapps.com/hmg-prod/images/486cec61-814b-4c76-a41c-f19efa80a688-686e5b6b1ccb5.jpg") center / cover no-repeat;

  @media (min-width: 768px) {
    padding: 5rem 2.5rem;
  }
}

.hero-content {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero-avatar {
  margin-bottom: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.hero-eyebrow {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
}

.hero-title {
  color: #fff;
  font-size: clamp(1.5rem, 3.2vw, 2.4rem);
  font-weight: 700;
  line-height: 1.4;
  margin: 0.4rem 0 0.6rem;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: clamp(0.9rem, 1.4vw, 1.05rem);
}

/* ==============================
   內容容器（置中並限制最大寬度）
============================== */
.choose-inner {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;

  @media (min-width: 768px) {
    padding: 3rem 2rem 4rem;
  }
}

/* ==============================
   兩大主要入口卡片
============================== */
.entry-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.entry-image-wrap {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    height: 240px;
  }

  img {
    max-width: 45%;
    max-height: 55%;
    object-fit: contain;
    filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.2));
  }
}

.review-bg {
  background: linear-gradient(135deg, #ff9966, #ff5e62);
}

.order-bg {
  background: linear-gradient(135deg, #38ef7d, #11998e);
}

.entry-body {
  padding: 1.25rem 1.5rem 1.5rem;
  text-align: left;

  h2 {
    color: var(--text-h);
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    min-height: 2.9em;
  }
}

/* ==============================
   平台特色
============================== */
.features {
  margin-top: 3.5rem;
}

.features-title {
  color: var(--text-h);
  text-align: center;
  font-size: clamp(1.2rem, 2vw, 1.6rem);
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 16px;
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin-bottom: 0.75rem;
  color: var(--el-color-primary);
  background: color-mix(in srgb, var(--el-color-primary) 12%, transparent);
}

.feature-item h3 {
  color: var(--text-h);
  font-size: 1.05rem;
  margin-bottom: 0.4rem;
}

.feature-item p {
  color: var(--text);
  font-size: 0.85rem;
  line-height: 1.6;
}

/* ==============================
   頁尾
============================== */
.choose-footer {
  margin-top: 3.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  text-align: center;

  p {
    color: var(--text);
    font-size: 0.8rem;
  }
}
</style>
