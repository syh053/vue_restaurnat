import {updateUserInfoApi, userLogInApi} from '@/api/user'
import type {UserInfo, UserInfoUpdate} from "@/api/user/tpye.ts"; // 替換為你的 API 匯入路徑
import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useUserStore = defineStore('user', () => {
    const userInfo = ref<UserInfo | null>(null)

    /**
     * 使用者登入
     *
     * @param formData - 登入的帳密參數
     */
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

    /**
     * 更新使用者資訊
     *
     * @param data - 要更新的使用者資訊
     */
    async function userInfoUpdate(data: UserInfoUpdate) {
        const res = await updateUserInfoApi(data)

        if (res.status === 200) {

            // 更新 Pinia 狀態
            userInfo.value!.name = data.name
            userInfo.value!.email = data.email
        } else {
            throw new Error('使用者資訊修改失敗')
        }
    }

    return {
        userInfo,
        login,
        userInfoUpdate,
    }
}, {
    // 請在 tsconfig.app.json -> compilerOptions -> types 中加入 "pinia-plugin-persistedstate"
    persist: true
})
