import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { name } = UsernameValidator.parse(body);

    const username = await db.user.findFirst({
      where: {
        username: name,
      },
    });

    if (username) {
      return new Response("Username is taken", { status: 409 });
    }

    // update username
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      },
    });

    return new Response("OK");
  } catch (error) {
    // 這是一個條件判斷，檢查 error 是否是 z.ZodError 的實例。
    // z.ZodError 是 Zod 庫定義的一個錯誤型別，表示 Zod 驗證時的錯誤。
    if (error instanceof z.ZodError) {
      // 如果 error 是 z.ZodError 的實例，則創建一個新的 Response 物件，並將錯誤訊息作為回應主體。
      // 這裡使用了 HTTP 狀態碼 422 表示請求的內容無效或無法處理。
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not update username, please try again later", {
      status: 500,
    });
  }
}
