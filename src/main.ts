import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import './style.css'
import App from '@/App.vue'
import { router } from "@/route"
import { createPinia } from "pinia"


createApp(App)
    .use(router)
    .use(createPinia())
    .mount('#app')
