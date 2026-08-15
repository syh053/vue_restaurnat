import { userLogInApi } from '@/api/user'
import type { UserInfo } from "@/api/user/tpye.ts"; // 替換為你的 API 匯入路徑
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const userInfo = ref<UserInfo | null>(null)

    // 登入 Action
    async function login(formData: any) {
        const res = await userLogInApi(formData)

        if (res.status === 200) {

            // 更新 Pinia 狀態
            userInfo.value = res.data

            return res
        } else {
            throw new Error('登入失敗')
        }
    }

    return {
        userInfo,
        login,
    }
}, {
    // 請在 tsconfig.app.json -> compilerOptions -> types 中加入 "pinia-plugin-persistedstate"
    persist: true
})
