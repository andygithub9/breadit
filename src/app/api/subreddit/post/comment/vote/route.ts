import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentVoteValidator } from "@/lib/validators/vote";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { commentId, voteType } = CommentVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session?.user.id,
        commentId,
      },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
        });
        return new Response("OK");
      } else {
        await db.commentVote.update({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
          data: {
            type: voteType,
          },
        });
      }

      // 記得 return new Response 不然會繼續執行下面的 db.commentVote.create
      // 會報錯 Invalid `prisma.commentVote.create()` invocation: Unique constraint failed on the (not available)
      // 因為 commentVote 用 userId 和 commentId 作為聯合主鍵，主鍵不能重複，如果繼續執行 db.commentVote.create 會用一樣的 userId 和 commentId 作為主鍵創建一筆資料就會報錯 Unique constraint failed ，唯一性限制失敗
      return new Response("OK");
    }

    await db.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
      },
    });

    return new Response("OK");
  } catch (error) {
    console.error(error);

    // 這是一個條件判斷，檢查 error 是否是 z.ZodError 的實例。
    // z.ZodError 是 Zod 庫定義的一個錯誤型別，表示 Zod 驗證時的錯誤。
    if (error instanceof z.ZodError) {
      // 如果 error 是 z.ZodError 的實例，則創建一個新的 Response 物件，並將錯誤訊息作為回應主體。
      // 這裡使用了 HTTP 狀態碼 422 表示請求的內容無效或無法處理。
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not register your vote, please try again.", {
      status: 500,
    });
  }
}
