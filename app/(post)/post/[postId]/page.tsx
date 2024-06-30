import { Post } from ".prisma/client";
import PostPage from "@/components/post-page";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PostProps {
  params: { postId: string };
}

export async function getPost(postId: Post["id"]) {
  const post = await db.post.findFirst({
    where: {
      id: postId,
    },
  });

  return post;
}

export default async function PostPageWrapper({ params }: PostProps) {
  const postId = params.postId;
  const post = await getPost(postId);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <PostPage
        post={{
          id: post?.id,
          title: post?.title,
          content: post?.content,
          published: post?.published,
        }}
      />
      <div className="text-center">
        <Link
          href="/post/postList"
          className="underline text-blue-500 hover:text-blue-800"
        >
          記事一覧ページへ
        </Link>
      </div>
    </div>
  );
}
