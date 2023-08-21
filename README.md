# shadcn UI

https://ui.shadcn.com/docs/installation  
https://ui.shadcn.com/docs/components/button

# tailwind.config.js

container class 定義在 tailwind.config.js 的 theme 屬性中

# Authentication

1. https://next-auth.js.org/configuration/initialization#route-handlers-app
2. https://next-auth.js.org/configuration/options
3. 在 server components 取得 session https://next-auth.js.org/configuration/nextjs#in-app-directory

## DB

1. 登入 https://planetscale.com/
2. 創建一個 db
3. 點擊創建好的 db -> Settings -> Passwords -> New password -> Create password
4. 密碼創建完點擊 Close
5. 點擊 Password 最右邊的 ... -> 點擊 Get connection strings -> Connect with 選擇 Prisma -> 點擊 .env tab 複製內容貼到我們的 .env 文件  
   只能貼到 .env 文件，因為 prisma/schema.prisma 中的 env("DATABASE_URL") 這行代碼只吃得到 .env 文件裡的變數
6. 到終端機輸入指令 `npx prisma db push`

# funtion component interafce extend 函數組建介面擴展

src/components/UserAuthForm.tsx

```tsx
/*
定義了一個名為 UserAuthFormProps 的介面（interface）。該介面擴展了 React.HTMLAttributes<HTMLDivElement>。

React.HTMLAttributes<HTMLDivElement> 是 React 中定義的一個泛型介面，它定義了一個 <div> 元素的屬性集合。這些屬性包括標準的 HTML 屬性，如 className、style、onClick，以及其他可能與 <div> 元素相關的屬性。通過擴展這個泛型介面，UserAuthFormProps 繼承了所有這些屬性。

換句話說，UserAuthFormProps 這個介面允許你在 React 組件中使用所有 <div> 元素的屬性，並且還可以添加其他自定義的屬性。

這種方式常用於定義自定義組件的屬性類型，以確保在使用組件時可以正確地傳遞和處理相應的屬性。通過擴展 React.HTMLAttributes<HTMLDivElement>，你可以確保組件可以接收所有 <div> 元素的屬性，並且可以根據需要添加其他自定義的屬性。

在使用 UserAuthFormProps 這個介面的地方，你可以將其當作組件的屬性類型來使用，並在組件中使用對應的屬性。這樣可以在編譯期間進行類型檢查，並確保正確使用組件的屬性。
*/
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
```

# 移除沒有用到的 import 的快捷鍵

shift + option + o

# 如何定義一個具有自我關聯的模型

要定義一個具有自我關聯的模型，您可以使用 Prisma 的 @relation 指示符來建立關聯。以下是定義一個具有自我關聯的模型的步驟：

在模型中定義自我關聯的字段，並確定關聯字段的類型和名稱。例如，假設我們有一個名為 Node 的模型，並希望每個節點都可以有一個父節點和多個子節點，我們可以定義以下字段：

```prisma
model Node {
  id       Int     @id @default(autoincrement())
  parentId Int?
  children Node[] @relation("ChildNodes")
  parent   Node?   @relation("ChildNodes", fields: [parentId], references: [id], onDelete: NoAction, onUpdate: NoAction)
}
```

1. 使用 @relation 指示符來建立關聯。在上述示例中，我們使用了兩個 @relation 指示符，一個用於 children 字段，另一個用於 parent 字段。這兩個關聯使用了相同的關聯名稱 "ChildNodes"，以區分不同類型的關聯。

   - children Node[] @relation("ChildNodes")：這個關聯建立了一個一對多的關聯，將 Node 模型與它的子節點相關聯。每個節點可以有多個子節點，因此 children 字段是一個 Node 類型的陣列。

   - parent Node? @relation("ChildNodes", fields: [parentId], references: [id])：這個關聯建立了一個一對一的關聯，將 Node 模型與它的父節點相關聯。每個節點只能有一個父節點，因此 parent 字段是一個可選的 Node 類型。

2. 定義完模型後，運行 Prisma 的生成命令以生成 Prisma Client，並使用生成的 Prisma Client 來操作數據庫。

這樣就完成了一個具有自我關聯的模型的定義。您可以根據您的需求和具體情況調整字段名稱、關聯名稱和參數選項。

---

在這個例子中，Node 模型有兩個關聯字段：parent 和 children。由於這是一個自我關聯，它們都指向相同的模型 Node。然而，Prisma 需要一種方法來區分這兩個關聯，以便在查詢中能夠明確指定使用哪個關聯。

如果 Node 模型有兩個關聯字段都指向相同的模型 Node，並且沒有區分它們的關聯名稱，那麼在使用這兩個關聯時可能會產生一些問題：

1. 命名衝突：由於兩個關聯字段指向相同的模型，Prisma 無法區分它們，因此可能會發生命名衝突。這將導致在查詢中無法明確指定要使用的關聯。

2. 錯誤的關聯選擇：如果沒有區分關聯，當你需要使用其中一個關聯時，Prisma 可能無法識別你指的是哪個關聯。這可能導致使用錯誤的關聯，或者無法正確地設置或查詢相關的數據。

3. 代碼可讀性差：沒有明確的關聯名稱，代碼的可讀性將受到影響。其他人閱讀代碼時可能會感到困惑，不清楚哪個關聯字段指向父節點，哪個關聯字段指向子節點。

為了避免這些問題，建議在模型中的每個關聯字段之間使用不同的關聯名稱，即使它們指向相同的模型。這樣可以明確指定要使用的關聯，確保代碼的清晰性和正確性。

通過為 parent 字段指定關聯名稱 "ChildNodes"，以及為 children 字段指定關聯名稱 "ChildNodes"，我們可以明確區分這兩個關聯。

# Prisma Vote 模型使用@@id 指令定义了复合主键保证了一个用户对同一篇帖子只能投票一次

```prisma
model Vote {
  user   User   @relation(fields: [userId], references: [id])
  userId String

  post   Post   @relation(fields: [postId], references: [id])
  postId String

  type VoteType

  @@id([userId, postId])
}
```

在这段代码中，@@id([userId, postId]) 指定了 userId 和 postId 作为组合主键。组合主键意味着这两个字段的值的组合必须是唯一的，也就是说，在 Vote 表中的每一条记录都必须具有唯一的 userId 和 postId 组合。

因此，当一个用户对于同一个帖子进行投票时，会创建一条具有唯一 userId 和 postId 组合的 Vote 记录。由于组合主键的唯一性要求，如果该用户再次对同一个帖子进行投票，将无法创建新的 Vote 记录，因为已经存在具有相同组合主键的记录。

这样的设计意味着一个用户对于同一个帖子只能有一条投票记录，确保了投票的唯一性。

# push prisma schema to database and generate typescript type

1. push prisma schema to database `npx prisma db push`
2. generate typescript type `npx prisma generate`

# next/navigation notFound()

https://nextjs.org/docs/app/api-reference/functions/not-found

# 登入失敗的 troubleshooting

```sh
[next-auth][error][adapter_error_getUserByAccount]
https://next-auth.js.org/errors#adapter_error_getuserbyaccount
Invalid `prisma.account.findUnique()` invocation:


Error querying the database: Server error: `ERROR HY000 (1105): unavailable: unable to connect to branch 5wr4aj35dxmy' {
  message: '\n' +
    'Invalid `prisma.account.findUnique()` invocation:\n' +
    '\n' +
    '\n' +
    "Error querying the database: Server error: `ERROR HY000 (1105): unavailable: unable to connect to branch 5wr4aj35dxmy'",
  stack: 'PrismaClientInitializationError: \n' +
    'Invalid `prisma.account.findUnique()` invocation:\n' +
    '\n' +
    '\n' +
    "Error querying the database: Server error: `ERROR HY000 (1105): unavailable: unable to connect to branch 5wr4aj35dxmy'\n" +
    '    at Rn.handleRequestError (/Users/tvbs/Documents/GitHub/breadit-2/node_modules/@prisma/client/runtime/library.js:174:7601)\n' +
    '    at Rn.handleAndLogRequestError (/Users/tvbs/Documents/GitHub/breadit-2/node_modules/@prisma/client/runtime/library.js:174:6754)\n' +
    '    at /Users/tvbs/Documents/GitHub/breadit-2/node_modules/@prisma/client/runtime/library.js:177:3010\n' +
    '    at async /Users/tvbs/Documents/GitHub/breadit-2/node_modules/@prisma/client/runtime/library.js:177:3225\n' +
    '    at async t._executeRequest (/Users/tvbs/Documents/GitHub/breadit-2/node_modules/@prisma/client/runtime/library.js:177:11403)\n' +
    '    at async getUserByAccount (webpack-internal:///(sc_server)/./node_modules/@next-auth/prisma-adapter/dist/index.js:222:29)',
  name: 'PrismaClientInitializationError'
}
```

可以看到 Error querying the database: Server error: ERROR HY000 (1105): unavailable: unable to connect to branch 5wr4aj35dxmy' 和 Invalid prisma.account.findUnique() 表示沒辦法連接到數據庫，到 https://app.planetscale.com/ 登入之後會發現數據庫顯示 Database sleeping

1. 點擊數據庫
2. 點擊 Wake database
3. 會需要一段時間啟動，啟動完成後再嘗試回我們的網頁登入

# 通過 Prisma Studio 連進數據庫看資料

在終端機下指令 `npx prisma studio` Prisma Studio 會給你一個 url 連進去就可以看到你連接的資料庫的資料了

# 在 upstash 創建一個 redis

1. 到 https://upstash.com/
2. 登入
3. 上方選擇 redis
4. 點擊 create database
5. 輸入 name -> 選擇 Primary Region -> 勾選 TLS (SSL) Enabled -> 點擊 Create
6. 選擇剛剛創建的 db
7. 滾動到 REST API 區塊複製 UPSTASH_REDIS_REST_URL 到 .env 的 REDIS_URL -> 複製 UPSTASH_REDIS_REST_TOKEN 到 .env 的 REDIS_SECRET
8. 滾動到 Connect to your database -> 點擊 @upstash/redis tab
9. 複製程式碼到 src/lib/redis.ts

# TS Generic type

## Generic type

```ts
type Test<T = number> = {
  a: T;
};
const a: Test<string> = {
  a: "test",
};
```

## Generic type default type

```ts
interface Test2<T = number> {
  b: T;
}
const b: Test2 = {
  b: 123,
};
const c: Test2<string> = {
  b: "123",
};
```

# server component 驗證登入流程

import { getAuthSession } from "@/lib/auth"; -> getAuthSession 呼叫 getServerSession(authOptions) 返回值類型為 Promise<Session | null> ，所以需要 await 等待他返回 Session | null 類型的值

# client component 驗證登入流程

```tsx
import { useSession } from "next-auth/react";
const { data: session } = useSession();
```

# zod validation for an array of objects

https://stackoverflow.com/questions/74967542/zod-validation-for-an-array-of-objects

# Deploy

1. run `npm run lint` to see if there is any errors
2. 部署 prisma 到 vercel 需要在 package.json 的 scripts 屬性裡加上 `"postinstall": "prisma generate"`

# 通過 middleware 保護需要登入才能訪問的路徑

src/middleware.ts

```ts
// 保護需要登入才能訪問的路徑
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  // 沒有 token 表示使用者沒有登入， redirect 到 "/sign-in"
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }
}

export const config = {
  // 在 "/r/任何長度字串/submit" 和 "/r/create" 這兩個路徑下執行 middleware function
  matcher: ["/r/:path*/submit", "/r/create"],
};
```

# disable cache

src/app/page.tsx
`export const dynamic = "force-dynamic";`
`export const fetchCache = "force-no-store";`

---

src/app/r/\[slug\]/post/\[postId\]/page.tsx
`export const dynamic = "force-dynamic";`
`export const fetchCache = "force-no-store";`
