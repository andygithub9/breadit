"use client";

import { FC, useState } from "react";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import { useToast } from "@/hooks/use-toast";

/*
定義了一個名為 UserAuthFormProps 的介面（interface）。該介面擴展了 React.HTMLAttributes<HTMLDivElement>。

React.HTMLAttributes<HTMLDivElement> 是 React 中定義的一個泛型介面，它定義了一個 <div> 元素的屬性集合。這些屬性包括標準的 HTML 屬性，如 className、style、onClick，以及其他可能與 <div> 元素相關的屬性。通過擴展這個泛型介面，UserAuthFormProps 繼承了所有這些屬性。

換句話說，UserAuthFormProps 這個介面允許你在 React 組件中使用所有 <div> 元素的屬性，並且還可以添加其他自定義的屬性。

這種方式常用於定義自定義組件的屬性類型，以確保在使用組件時可以正確地傳遞和處理相應的屬性。通過擴展 React.HTMLAttributes<HTMLDivElement>，你可以確保組件可以接收所有 <div> 元素的屬性，並且可以根據需要添加其他自定義的屬性。

在使用 UserAuthFormProps 這個介面的地方，你可以將其當作組件的屬性類型來使用，並在組件中使用對應的屬性。這樣可以在編譯期間進行類型檢查，並確保正確使用組件的屬性。
*/
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      // https://next-auth.js.org/getting-started/client#signin
      await signIn("google");
    } catch (error) {
      // toast notification
      // https://ui.shadcn.com/docs/components/toast
      toast({
        title: "There was a problem.",
        description: "There was an error logging in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button
        onClick={loginWithGoogle}
        isLoading={isLoading}
        size="sm"
        className="w-full"
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
