import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession();

  // https://youtu.be/mSUKMfmLAt0?t=27542
  // 我們評論的結構只有兩層，最上層的評論和回覆他的評論（屬於他的子評論）
  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null, // 這條評論沒有 replyToId 表示他是最上層的評論
    },
    include: {
      author: true,
      votes: true,
      // join 回覆給最上層的評論的子評論
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });
  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />

      <CreateComment postId={postId} />

      <div className="flex flex-col gap-y-6 mt-4">
        {comments
          .filter((comment) => !comment.replyToId) // 過濾 replyToId 不為 null 的評論，也就是只要最上層的評論
          .map((topLevelComment) => {
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                if (vote.type === "DOWN") return acc - 1;
                return acc;
              },
              0
            );

            // 取得當前用戶對最上層評論的投票， topLevelCommentVote 可以是 undefined ，因為用戶不必登入也能看評論
            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id
            );

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    postId={postId}
                    votesAmt={topLevelCommentVotesAmt}
                    currentVote={topLevelCommentVote}
                    comment={topLevelComment}
                  />
                </div>

                {/* render replies (第二層 comment) */}
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === "UP") return acc + 1;
                      if (vote.type === "DOWN") return acc - 1;
                      return acc;
                    }, 0);

                    // 取得當前用戶對最上層評論的投票， topLevelCommentVote 可以是 undefined ，因為用戶不必登入也能看評論
                    const replyVote = reply.votes.find(
                      (vote) => vote.userId === session?.user.id
                    );

                    return (
                      <div
                        key={reply.id}
                        className="ml-2 py-2 pl-4 border-l-2 border-zinc-200"
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                          postId={postId}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
