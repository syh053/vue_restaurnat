import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'


const routes: RouteRecordRaw[] = [
    {
        path: '/user/signUp',
        name: 'signUp',
        component: () => import('@/view/user/SignUpUser.vue')
    },
    {
        path: '/user/logIn',
        name: 'logIn',
        component: () => import('@/view/user/LogIn.vue')
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
