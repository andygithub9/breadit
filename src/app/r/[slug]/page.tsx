import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug } = params;

  const session = await getAuthSession();

  // 具体来说，通过 include 嵌套的方式可以实现以下效果：
  // include: { posts: { ... } }：这一层嵌套的 include 表示希望获取与指定 subreddit 相关的 posts 字段的数据。
  // include: { author: true, votes: true, comments: true, subreddit: true }：这一层嵌套的 include 表示希望获取每个帖子的作者、投票、评论和所属的 subreddit 的数据。
  // 通过这种嵌套的方式，一次查询就可以获取到所需的完整数据，避免了后续需要针对每个帖子进行额外的查询操作。这样可以减少数据库访问次数，提高查询的效率，并且简化了代码逻辑。
  const subreddit = await db.subreddit.findFirst({
    // 这行代码指定了查询条件，即通过 name 字段来匹配 slug 变量的值。
    // 查询将返回与指定的 slug 值匹配的 subreddit。
    where: { name: slug },
    // 这行代码指定了需要包含的关联数据，以展开查询结果中的相关字段。
    // 在这个例子中，我们希望包含 subreddit 的 posts 字段的相关数据。
    include: {
      // 这行代码指定了要包含的 posts 字段的相关数据。
      // 在这个例子中，我们希望包含 posts 字段的关联数据。
      posts: {
        // 这行代码指定了要包含的具体字段。
        // 在这个例子中，我们希望包含 posts 中的 author、votes、comments 和 subreddit 字段的相关数据。
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        // just change this to desc to avoid post duplicated
        // 因為這裡會抓一次 posts 作為 initialPosts ，在 src/components/PostFeed.tsx 會打 /api/posts 再拿一次 posts ， /api/posts 的 posts 是 orderBy createdAt: "desc" ，所以這裡也要保持一致，否則會出現一開始 posts 是 orderBy createdAt: "asc" ，等到 /api/posts 回應時 posts 變成 orderBy createdAt: "desc" ，造成前端畫面一開始 post 是 asc 排列，過段時間後變成 desc 排列
        // src/components/PostFeed.tsx 中 const posts = data?.pages.flatMap((page) => page) ?? initialPosts; 會在 /api/posts 還沒回應的時候先拿 initialPosts ，在 /api/posts 回應後用 api 回應的 data
        orderBy: {
          createdAt: "desc",
        },

        // 这行代码指定了查询结果的限制数量。
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  if (!subreddit) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
};

export default page;
