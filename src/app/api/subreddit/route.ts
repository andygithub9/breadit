import { getAuthSession } from "@/lib/auth";
import { SubredditValidator } from "@/lib/validators/subreddit";

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
  } catch (error) {}
}
