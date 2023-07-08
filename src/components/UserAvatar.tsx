import { User } from "next-auth";
import React, { FC } from "react";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import Image from "next/image";
import { Icons } from "./Icons";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div>
          <Image
            fill
            src={user.image}
            alt="profile picture"
            // 什麼是 Referer-Policy ： https://www.maxlist.xyz/2020/08/03/chrome-85-referer-policy/
            // 因為有時候 google 會給你一些 forbidden errors ， referrerPolicy 設定成 "no-referrer" 可以避免掉那些 google 給你的錯誤
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          {/* sr-only 在視覺上隱藏元素而不向屏幕閱讀器隱藏它 */}
          {/* What is a screen reader? 主要由視力障礙人士使用。它將文本、按鈕、圖像和其他屏幕元素轉換為語音 https://axesslab.com/what-is-a-screen-reader/ */}
          <span className="sr-only">{user?.name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
