import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // 使用 SubredditValidator 的 parse 方法來驗證 body 物件是否符合 SubredditValidator 的模式。
    // 如果 body 物件符合模式，parse 方法將返回一個包含驗證後的屬性的物件。
    // 這裡使用解構賦值將 name 從返回的物件中提取出來，這裡假設 name 是 body 物件的一個屬性。
    // 如果驗證失敗，可能會拋出 ZodError 錯誤
    const { name } = SubredditValidator.parse(body);

    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (subredditExists) {
      return new Response("Subreddit already exists", { status: 409 });
    }

    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    // 如果你是創建 subreddit 的人那你就一定要訂閱這個 subreddit
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });

    return new Response(subreddit.name);
  } catch (error) {
    // 這是一個條件判斷，檢查 error 是否是 z.ZodError 的實例。
    // z.ZodError 是 Zod 庫定義的一個錯誤型別，表示 Zod 驗證時的錯誤。
    if (error instanceof z.ZodError) {
      // 如果 error 是 z.ZodError 的實例，則創建一個新的 Response 物件，並將錯誤訊息作為回應主體。
      // 這裡使用了 HTTP 狀態碼 422 表示請求的內容無效或無法處理。
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create subreddit", { status: 500 });
  }
}
