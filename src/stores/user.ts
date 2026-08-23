import { getUserInfoApi, updateUserInfoApi, userLogInApi, userLogOutApi } from '@/api/user';
import type { UserInfo, UserInfoUpdate, UserLogIn } from "@/api/user/tpye.ts"; // 替換為你的 API 匯入路徑
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
    const userInfo = ref<UserInfo | null>(null)

    /**
     * 使用者登入
     *
     * @param formData - 登入的帳密參數
     */
    async function login(formData: UserLogIn) {
        const res = await userLogInApi(formData)

        // 更新 Pinia 狀態
        userInfo.value = res.data

        return res
    }

    /**
     * 重新取得使用者資訊並同步 Pinia 狀態
     */
    async function fetchUserInfo() {
        const res = await getUserInfoApi()

        // 更新 Pinia 狀態
        userInfo.value = res.data

        return res
    }

    /**
     * 使用者登出
     */
    async function logout() {
        await userLogOutApi()

        // 清空 Pinia 狀態
        userInfo.value = null
    }

    /**
     * 更新使用者資訊
     *
     * @param data - 要更新的使用者資訊
     */
    async function userInfoUpdate(data: UserInfoUpdate) {
        await updateUserInfoApi(data)

        // 更新 Pinia 狀態
        userInfo.value!.name = data.name
        userInfo.value!.email = data.email
    }

    return {
        userInfo,
        login,
        logout,
        fetchUserInfo,
        userInfoUpdate,
    }
}, {
    // 請在 tsconfig.app.json -> compilerOptions -> types 中加入 "pinia-plugin-persistedstate"
    persist: true
})
