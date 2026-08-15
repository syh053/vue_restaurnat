import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import './style.css'
import App from '@/App.vue'
import { router } from "@/route"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


createApp(App)
    .use(router)
    .use(createPinia().use(piniaPluginPersistedstate))
    .mount('#app')
