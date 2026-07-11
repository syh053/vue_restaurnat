# Restaurant

一個以 `Vue 3`、`TypeScript` 與 `Vite` 建置的餐廳管理系統前端專案。

專案目前包含三個主要使用情境：

- 前台餐廳瀏覽
- 使用者登入與註冊
- 後台餐廳與使用者管理

## 功能

- 使用者登入、登出與註冊
- 前台餐廳頁面瀏覽
- 後台餐廳資料管理
- 後台使用者資料管理
- 以路由區分前台、後台與帳號頁面

## 技術棧

- `Vue 3`
- `TypeScript`
- `Vite`
- `Vue Router`
- `Axios`
- `Element Plus`
- `Tailwind CSS`
- `daisyUI`

## 專案結構

- `src/main.ts`：應用程式入口
- `src/App.vue`：全域版型與導覽列
- `src/route/`：路由設定
- `src/api/`：API 請求封裝
- `src/view/user/`：登入與註冊頁面
- `src/view/front/`：前台餐廳頁面
- `src/view/end/`：後台管理頁面

## 開發環境需求

- `Node.js`
- `pnpm`

## 安裝與啟動

1. 安裝相依套件

```bash
pnpm install
2.
啟動開發伺服器
pnpm dev
3.
建置正式版本
pnpm build
4.
預覽建置結果
pnpm preview
API 設定
目前前端 API 預設連線到：
http://localhost:8888
設定位置：src/api/utils/request.ts
如果你的後端位址不同，請修改該檔案中的 baseURL。
路由說明

/user/logIn：登入頁

/user/signUp：註冊頁

/front/restaurant：前台餐廳頁

/end/restaurant/all：後台餐廳列表

/end/restaurant/add：新增或編輯餐廳資料

/end/user：後台使用者管理
注意事項

專案使用 withCredentials: true 與後端溝通，後端需正確設定 Cookie 與 CORS。

首頁會自動導向 /user/logIn。

未登入時，請先完成登入流程再進入後台頁面。
