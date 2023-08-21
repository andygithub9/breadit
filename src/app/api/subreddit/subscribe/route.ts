import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (subscriptionExists) {
      return new Response("You are already subscribed to this subreddit.", {
        status: 400,
      });
    }

    await db.subscription.create({
      data: {
        subredditId,
        userId: session.user.id,
      },
    });

    return new Response(subredditId);
  } catch (error) {
    // 這是一個條件判斷，檢查 error 是否是 z.ZodError 的實例。
    // z.ZodError 是 Zod 庫定義的一個錯誤型別，表示 Zod 驗證時的錯誤。
    if (error instanceof z.ZodError) {
      // 如果 error 是 z.ZodError 的實例，則創建一個新的 Response 物件，並將錯誤訊息作為回應主體。
      // 這裡使用了 HTTP 狀態碼 422 表示請求的內容無效或無法處理。
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not subscribe, please try again later", {
      status: 500,
    });
  }
}
