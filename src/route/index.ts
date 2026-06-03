import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'


const routes: RouteRecordRaw[] = [
    {
        path: "/",
        redirect: "/user/logIn"
    },
    {
        path: "/user",
        component: () => import("@/view/user/AuthLayout.vue"),
        children: [
            {
                path: 'signUp',
                name: 'signUp',
                component: () => import('@/view/user/components/SignUpUser.vue')
            },    {
                path: 'logIn',
                name: 'logIn',
                component: () => import('@/view/user/components/LogIn.vue')
            },
        ],
        redirect: "/user/logIn"
    },
    {
        path: '/front/restaurant',
        name: 'frontRestaurant',
        component: () => import('@/view/front/FrontRestaurant.vue')
    },
    {
        path: '/end/restaurant',
        name: 'endRestaurant',
        component: () => import('@/view/end/EndRestaurant.vue'),
        children: [
            {
                path: 'all',
                name: 'endRestaurantAll',
                component: () => import('@/view/end/EndRestaurantAll.vue')
            },
            {
                path: 'add',
                name: 'endRestaurantAdd',
                component: () => import('@/view/end/EndRestaurantCRUD.vue')
            }
        ]
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
