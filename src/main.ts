import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style.css'
import App from '@/App.vue'
import { router } from "@/route"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useThemeStore } from '@/stores/theme'


const app = createApp(App)
    .use(router)
    .use(createPinia().use(piniaPluginPersistedstate))

// 掛載前先套用主題，避免深色使用者重新整理時閃一下淺色畫面
useThemeStore().applyTheme()

app.mount('#app')
