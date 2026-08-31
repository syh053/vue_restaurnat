import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

/** 主題模式：淺色 / 深色 */
export type ThemeMode = 'light' | 'dark';

export const useThemeStore = defineStore('theme', () => {
    // 第一次造訪一律淺色，之後由原使用者選擇
    const mode = ref<ThemeMode>('light');

    /**
     * 把目前主題套用到 <html>
     *
     * - `dark` class：給 Element Plus 深色 css-vars（選擇器為 `html.dark`）與 Tailwind class 策略
     * - `data-theme`：給 daisyUI v5
     */
    function applyTheme() {
        const el = document.documentElement;
        el.classList.toggle('dark', mode.value === 'dark');
        el.dataset.theme = mode.value;
    }

    /**
     * 切換淺色 / 深色
     */
    function toggleTheme() {
        mode.value = mode.value === 'dark' ? 'light' : 'dark';
    }

    // mode 變動（含 persist 還原後）即同步到 DOM
    watch(mode, applyTheme, { immediate: true });

    return {
        mode,
        toggleTheme,
        applyTheme,
    };
}, {
    // 型別與 plugin 已在 tsconfig.app.json / main.ts 就緒
    persist: true,
});
