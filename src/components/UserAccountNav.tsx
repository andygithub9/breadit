'use client'
import { User } from "next-auth";
import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { signOut } from "next-auth/react";

// 在 UserAccountNavProps 中，有一個屬性 user，其類型為 Pick<User, "name" | "image" | "email">。Pick 是 TypeScript 中的一個工具類型，用於從給定的類型中挑選指定的屬性。
// User 是一個接口，它包含了使用者相關的屬性，例如 name（名稱）、image（圖像）和 email（電子郵件）等。
// 因此，UserAccountNavProps 的 user 屬性指定了一個使用者物件，該物件只包含了 name、image 和 email 這三個屬性。這意味著當使用 UserAccountNavProps 這個介面的時候，必須傳遞一個符合該結構的使用者物件，並且該物件必須包含這三個屬性。這樣可以在編譯時期進行類型檢查，確保正確傳遞和使用使用者帳戶導航組件所需的屬性。
interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  // https://ui.shadcn.com/docs/components/dropdown-menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="h-8 w-8"
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 list-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* 
        當 asChild 設置為時true，Radix 將不會渲染默認的 DOM 元素，而是克隆該組件的子元素並向其傳遞該組件的 props 和行為。

        可以通過瀏覽器觀察 DOM 發現沒有 asChild 屬性的結果會是
        <div role="menuitem" class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">
          <a href="/">Feed</a>
        </div>

        可以通過瀏覽器觀察 DOM 發現有 asChild 屬性的結果會是
        <a role="menuitem" class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50" tabindex="-1" data-orientation="vertical" data-radix-collection-item="" href="/">Feed</a>

        參考：https://www.radix-ui.com/docs/primitives/guides/composition#composing-multiple-primitives
        */}
        <DropdownMenuItem asChild>
          <Link href="/">Feed</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/r/create">Create community</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            signOut({ callbackUrl: `${window.location.origin}/sign-in` });
          }}
          className="cursor-pointer"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
