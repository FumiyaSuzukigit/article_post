import { db } from "@/lib/db";
import { Post } from ".prisma/client";

export async function getPost(postId: Post["id"]) {
  const post = await db.post.findFirst({
    where: {
      id: postId,
    },
  });

  return post;
}
