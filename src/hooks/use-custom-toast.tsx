import Link from "next/link";
import { toast } from "./use-toast";
import { buttonVariants } from "@/components/ui/Button";

export const useCustomToast = () => {
  const loginToast = () => {
    // dismiss 用來關閉 toast
    const { dismiss } = toast({
      title: "Login required.",
      description: "You need to be logged in to do that.",
      variant: "destructive",
      action: (
        <Link
          href="/sign-in"
          // 點擊 Link 後調用 dismiss function 關閉 toast
          onClick={() => dismiss()}
          className={buttonVariants({ variant: "outline" })}
        >
          Login
        </Link>
      ),
    });
  };

  return { loginToast };
};
