import Link from "next/link";
import { db } from "@/lib/db";

interface PostsListProps {
  allList: boolean;
}

export default async function PostsList({ allList }: PostsListProps) {
  const posts = await db.post.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const displayedPosts = allList ? posts : posts.slice(0, 3);

  return (
    <div className="max-w-[50rem]">
      {displayedPosts.map((post) => (
        <div key={post.id}>
          <Link
            href={`/post/${post.id}`}
            className="truncate underline text-blue-500 hover:text-blue-800"
          >
            {post.title}
          </Link>
          <p className="text-muted-foreground text-sm mt-2">
            {new Date(post.updatedAt).toLocaleDateString()}
          </p>
          <hr className="my-2" />
        </div>
      ))}
      {!allList && posts.length > 3 && (
        <div className="text-center">
          <Link
            href="/post/postList"
            className="underline text-blue-500 hover:text-blue-800"
          >
            記事一覧ページへ
          </Link>
        </div>
      )}
    </div>
  );
}
