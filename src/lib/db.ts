// https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices#solution
import { PrismaClient } from "@prisma/client";
import "server-only";

/*
使用 declare global 來擴展全局作用域，並聲明了一個全局變數 cachedPrisma，類型為 PrismaClient。這樣可以在全局範圍內訪問和使用這個變數。

接著，定義一個名為 prisma 的變數，類型為 PrismaClient。根據環境變數 NODE_ENV 的值，初始化 prisma 變數的內容。如果環境變數的值是 "production"，則在生產環境下創建一個新的 PrismaClient 實例並賦值給 prisma 變數。否則，在非生產環境下檢查全局變數 cachedPrisma 是否已經存在。如果 cachedPrisma 不存在，則創建一個新的 PrismaClient 實例並賦值給 cachedPrisma。最後，將 cachedPrisma 賦值給 prisma 變數。

最後，將 prisma 變數導出為 db，以便在應用程式的其他地方使用。這樣可以在其他模組中導入 db，並使用 db 來操作和管理數據庫。

總結來說，這段代碼用於建立一個全局的 PrismaClient 實例，並根據環境變數來初始化該實例。它使用全局變數 cachedPrisma 來保存和共享 PrismaClient 實例，以避免重複創建實例和減少資源消耗。最終，導出了一個名為 db 的變數，用於在應用程式中訪問和使用 PrismaClient。
*/

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;
