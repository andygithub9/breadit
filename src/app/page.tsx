import CustomFeed from "@/components/CustomFeed";
import GeneralFeed from "@/components/GeneralFeed";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <>
      <h1 className=" font-bold text-3xl md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* 因為 server component 加上 async 後返回的 type 是 'Promise<Element>' 所以會出現錯誤 type 'Promise<Element>' is not a valid JSX element. 用註解 supress ts error */}
        {/* @ts-expect-error server component */}
        {session ? <CustomFeed /> : <GeneralFeed />}
        {/* subreddit info */}
        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
          <div className="bg-emerald-100 px-6 py-4">
            <p className=" font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="w-4 h-4" />
              Home
            </p>
          </div>

          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal Bredit homepage. Come here to check in with your
                favorite communites.
              </p>
            </div>

            <Link
              className={buttonVariants({ className: "w-full mt-4 mb-6" })}
              href="/r/create"
            >
              Create Community
            </Link>
          </dl>
        </div>
      </div>
    </>
  );
}
