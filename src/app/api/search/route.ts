import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");

  if (!q) return new Response("Invalid query", { status: 400 });

  const results = await db.subreddit.findMany({
    where: {
      name: {
        // https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting#filter-conditions-and-operators
        startsWith: q,
      },
    },
    // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#include-a-_count-of-relations
    include: {
      _count: true,
    },
    take: 5,
  });

  return new Response(JSON.stringify(results));
}
