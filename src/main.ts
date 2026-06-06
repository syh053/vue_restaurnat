import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import './style.css'
import App from '@/App.vue'
import { router } from "@/route"


createApp(App)
    .use(router)
    .mount('#app')
