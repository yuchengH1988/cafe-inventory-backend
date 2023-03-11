# Cafe Inventory Back End

這是一個物料使用量誤差後台系統，根據實際使用量與估計使用量計算出每天的物料差異值。

## 資料庫結構

使用者(User)、商品(Products)、物料(Ingredients)、成分表(Compositions)、核銷紀錄(Records)

![資料庫結構](pics/ERD.jpg)

## 環境建置( prerequisites )

- Express 4.17.1
- Node.js 10.15.0
- Mongoose 5.12.14
- Mongodb
- passport 0.4.1

## 本地專案初始化( local install )

### 1.下載專案並安裝套件

  ```text
  git clone https://github.com/yuchengH1988/cafe-inventory-back-end
  npm install
  ```

### 2.建立.env檔

```text
JWT_SECRET=your_JWT_SECRET
IMGUR_CLIENT_ID=your_client_id
MONGODB_URI=mongodb://localhost/cafe-inventory
PORT=3000
```

### 3.建立腳本

```jsx
// 建立 Users,Ingredients,Products,Compositions
npm run seed
```

```jsx
//建立紀錄 Records
npm run fakeRecord
```

### 4.執行專案

```jsx
npm run dev
```

## 開發人員

[Calvin Huang](https://github.com/yuchengH1988/twitter-api-2020)

## API

- 除了登入之外，其餘皆需在header的Authorization帶上Bearer +  token
- response皆包含http status code & message (說明成功狀態或是失敗原因)
- 可使用下列的使用者帳號於系統登入

| 權限  | 帳號( account ) | 密碼 (password) |
| ----- | --------------- | ---------------- |
| Admin | admin           | 1234             |
| User  | a0001           | 1234             |
| User  | a0002           | 1234             |

假紀錄建立於使用者 **a0001** 2021/04/01 ~2021/06/05

## API 路由文件

[Google 文件](https://docs.google.com/spreadsheets/d/12BCdMNRJ5ZTX3S2K_OVcSepJK3ziaQC7d5HEzipm_rg/edit?usp=sharing)
