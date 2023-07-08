import { z } from "zod";

// 這行程式碼定義了一個名為 SubredditValidator 的常數，它是一個 Zod 物件模式。
// z.object() 創建了一個空的物件模式，並使用物件的屬性名稱和對應的值模式進行配置。
// 在這個例子中，SubredditValidator 的模式期望一個包含 name 屬性的物件，並且該屬性值必須是字串類型且長度在 3 到 21 之間。
export const SubredditValidator = z.object({
  name: z.string().min(3).max(21),
});

// 這行程式碼定義了一個名為 SubredditSubscriptionValidator 的常數，它也是一個 Zod 物件模式。
// SubredditSubscriptionValidator 的模式期望一個包含 subredditId 屬性的物件，並且該屬性值必須是字串類型。
export const SubredditSubscriptionValidator = z.object({
  subredditId: z.string(),
});

// 這行程式碼定義了一個型別 CreateSubredditPayload，它是透過 z.infer 從 SubredditValidator 推斷出來的型別。
// 也就是說，CreateSubredditPayload 的型別將與 SubredditValidator 的模式結構相對應。
export type CreateSubredditPayload = z.infer<typeof SubredditValidator>;

// 這行程式碼定義了一個型別 SubscribeToSubredditPayload，它是透過 z.infer 從 SubredditSubscriptionValidator 推斷出來的型別。
// 也就是說，SubscribeToSubredditPayload 的型別將與 SubredditSubscriptionValidator 的模式結構相對應。
export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator
>;
