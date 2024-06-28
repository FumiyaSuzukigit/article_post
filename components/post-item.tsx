import { Post } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { CheckCircleIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import PostOperations from "./post-operations";

interface PostItemProps {
  post: Pick<Post, "id" | "title" | "published" | "createdAt">;
}

export default function PostItem({ post }: PostItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/editor/${post.id}`}
          className="font-semibold hover:underline"
        >
          {post.title}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {format(post.createdAt, "yyyy-MM-dd")}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        {post.published ? (
          <CheckCircleIcon className="h-6 w-6 mr-2 text-green-500" />
        ) : (
          <EyeSlashIcon className="h-6 w-6 mr-2 text-red-500" />
        )}
        <PostOperations post={post} />
      </div>
    </div>
  );
}
