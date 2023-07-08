import { NextAuthOptions, getServerSession } from "next-auth";

// https://next-auth.js.org/v3/adapters/prisma
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";

// https://next-auth.js.org/providers/google#example
import GoogleProvider from "next-auth/providers/google";

import { nanoid } from "nanoid";

export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/options#adapter
  // https://next-auth.js.org/v3/adapters/prisma
  adapter: PrismaAdapter(db),

  // https://next-auth.js.org/configuration/options#session
  session: {
    strategy: "jwt",
  },

  // https://next-auth.js.org/configuration/options#pages
  pages: {
    signIn: "/sign-in",
  },

  // https://next-auth.js.org/configuration/options#providers
  providers: [
    // https://next-auth.js.org/providers/google#example
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // https://next-auth.js.org/configuration/options#callbacks
  callbacks: {
    // 當 session 被創建的時候會調用下面這個 session 回調函數
    async session({ session, token, user }) {
      // console.log(
      //   "next-auth session callback is invoked and session is: ",
      //   session
      // );
      // console.log(
      //   "next-auth session callback is invoked and token is: ",
      //   token
      // );

      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      return session;
    },

    // 定義我們想放在 jwt 的值
    async jwt({ token, user }) {
      // console.log("next-auth jwt callback is invoked and token is: ", token);
      // db.user.findFirst({ ... })：這是一個使用 Prisma Client 提供的 findFirst 方法的查詢操作，它用於查詢符合指定條件的第一個結果。
      // where: { email: token.email }：這是查詢操作的條件部分，指定了要查詢的條件。在這裡，它指定了要找到 email 屬性與 token.email 相符的用戶。
      // await：await 關鍵字用於等待 findFirst 方法的執行結果，這樣可以在獲取結果後再繼續執行後續的程式碼。
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user.id;
        return token;
      }

      if (!dbUser.username) {
        // db.user.update({ ... })：這是一個使用 Prisma Client 提供的 update 方法的更新操作，它用於更新符合指定條件的記錄。
        // where: { id: dbUser.id }：這是更新操作的條件部分，指定了要更新的記錄的條件。在這裡，它指定了要更新的用戶的 id 屬性等於 dbUser.id。
        // data: { username: nanoid(10) }：這是要更新的數據部分，指定了要更新的屬性和值。在這裡，它指定了將 username 屬性更新為一個長度為 10 的隨機字符串，使用了 nanoid(10) 函數生成。
        // await：await 關鍵字用於等待 update 方法的執行結果，這樣可以在更新完成後再繼續執行後續的程式碼。
        // 總結來說，這段代碼的目的是在 user 表格中根據條件 id 等於 dbUser.id，將該用戶的 username 屬性更新為一個隨機生成的長度為 10 的字符串。
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: nanoid(10),
          },
        });
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      };
    },

    redirect() {
      return "/";
    },
  },
};

// https://next-auth.js.org/configuration/nextjs#in-app-directory
export const getAuthSession = () => getServerSession(authOptions);
