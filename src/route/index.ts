import {createWebHistory, createRouter, type RouteRecordRaw} from 'vue-router'


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
            },
            {
                path: 'logIn',
                name: 'logIn',
                component: () => import('@/view/user/components/LogIn.vue')
            }
        ],
        redirect: "/user/logIn"
    },
    {
        path: '/user/info',
        name: 'userInfo',
        component: () => import('@/view/user_info/UserInfo.vue')
    },
    {
        path: '/user/info-update',
        name: 'userInfoUpdate',
        component: () => import('@/view/user_info/UserInfoUpdate.vue')
    },
    {
        path: '/choose-page',
        name: 'choosePage',
        component: () => import('@/view/front/ChoosePage.vue')
    },
    {
        path: '/front/restaurant',
        name: 'frontRestaurant',
        component: () => import('@/view/front/FrontRestaurant.vue'),
        children: [
            {
                path: 'all',
                name: 'frontRestaurantAll',
                component: () => import('@/view/front/components/FrontRestaurantAll.vue')
            },
            {
                path: 'menu-all',
                name: 'frontRestaurantMenuAll',
                component: () => import('@/view/front/components/FrontRestaurantMenuAll.vue')
            },
            {
                path: 'detail/:id',
                name: 'frontRestaurantDetail',
                component: () => import('@/view/front/components/FrontRestaurantView.vue')
            },
            {
                path: 'menu/:id',
                name: 'frontRestaurantMenu',
                component: () => import('@/view/front/components/FrontRestaurantMenu.vue')
            },
        ],
        redirect: "/front/restaurant/all"

    },
    {
        path: '/end/restaurant',
        name: 'endRestaurant',
        component: () => import('@/view/end/EndRestaurant.vue'),
        children: [
            {
                path: 'all',
                name: 'endRestaurantAll',
                component: () => import('@/view/end/components/EndRestaurantAll.vue')
            },
            {
                path: 'add',
                name: 'endRestaurantAdd',
                component: () => import('@/view/end/components/EndRestaurantCRUD.vue')
            },
            {
                path: 'menu/:restaurantId',
                name: 'endRestaurantMenu',
                component: () => import('@/view/end/components/EndMenuAll.vue')
            }
        ]
    },
    {
        path: '/end/user',
        name: 'endUserAdmin',
        component: () => import('@/view/end/EndUserCrud.vue')
    },
    {
        path: '/404',
        name: 'notFound',
        component: () => import('@/view/NotFound.vue')
    },
    {
        // 未匹配的路徑一律導向 404
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
