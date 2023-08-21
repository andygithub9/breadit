"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/Command";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Prisma, Subreddit } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { User } from "lucide-react";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

const SearchBar = () => {
  const [input, setInput] = useState<string>("");

  // 發送 GET 請求用 useQuery
  // 因為我們設置 enabled: false 所以要 fetch request 的時候要調用 refetch function
  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Subreddit & {
        // Prisma.SubredditCountOutputType 類型對應 schema.prisma 裡的 model Subreddit 下的 posts Post[] 和 subscribers Subscription[]
        // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#include-a-_count-of-relations
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    queryKey: ["search-query"], // queryKey: 用於標識這個查詢的關鍵字
    enabled: false, // enabled 參數是 React Query 中用於控制查詢（query）是否在初始化時立即執行的一個布林值選項
  });

  const request = debounce(() => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  const router = useRouter();
  const commandRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  // pathname 改變的時候清空 input state
  useEffect(() => {
    setInput("");
  }, [pathname]);

  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg border max-w-lg z-50 overflow-visible"
    >
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities..."
      />

      {input.length > 0 ? (
        <CommandList className=" absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {/* https://github.com/pacocoursey/cmdk#empty-cmdk-empty */}
          {/* Automatically renders when there are no results for the search query. */}
          {isFetched && <CommandEmpty>No result found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResults?.map((subreddit) => (
                <CommandItem
                  onSelect={(e) => {
                    // https://nextjs.org/docs/app/api-reference/functions/use-router#userouter
                    router.push(`/r/${e}`); // navigate to `/r/${e}`
                    router.refresh(); // 清除快取讓用戶拿到最新的資料
                  }}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <User className="mr-2 h-4 w-4" />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  );
};

export default SearchBar;
