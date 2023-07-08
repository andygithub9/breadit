// 代碼用於擴展 next-auth 和 next-auth/jwt 模組中的類型定義。

// 這樣做的目的是為了在 next-auth 和 next-auth/jwt 模組的類型定義中添加自定義的屬性，以滿足特定的業務需求或擴展功能。通過擴展這些模組中的類型定義，可以在應用程式中正確地使用這些類型，並在編譯期間進行類型檢查。

// 使用 import 關鍵字導入 Session 和 User 類型從 "next-auth" 模組，以及 JWT 類型從 "next-auth/jwt" 模組。這些類型是由 next-auth 模組提供的，用於描述驗證和會話相關的資料。
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

// 使用 type 關鍵字定義了一個名為 UserId 的自定義類型，該類型是 string 的別名。
type UserId = string;

// 使用 declare module 來擴展 next-auth/jwt 模組中的 JWT 類型定義。在擴展的部分，定義了一個新的屬性 id，類型為 UserId。同時，還定義了一個可選的屬性 username，類型為 string 或 null。
declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    username?: string | null;
  }
}

// 使用 declare module 來擴展 next-auth 模組中的 Session 類型定義。在擴展的部分，定義了一個新的屬性 user，類型為 User 和 { id: UserId; username?: string | null; } 的組合。這表示 user 是一個複合類型，包含 User 的屬性以及額外的 id 和 username 屬性。
declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
      username?: string | null;
    };
  }
}

