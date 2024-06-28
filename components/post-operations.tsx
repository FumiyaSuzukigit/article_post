"use client";

import { Post } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Icon } from "./icon";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

async function deletePost(postId: string) {
  try {
    const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("failed");
    }

    return true;
  } catch (error) {
    toast({
      title: "問題が発生しました。",
      description: "記事の削除ができませんでした。もう一度お試しください。",
      variant: "destructive",
    });
  }
}

async function togglePublishPost(postId: string, published: boolean) {
  try {
    const response = await fetch(`/api/posts/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: postId, published }),
    });
    if (!response.ok) {
      throw new Error("failed");
    }

    toast({
      description: `投稿が${published ? "公開" : "非公開"}になりました。`,
    });

    return true;
  } catch (error) {
    toast({
      title: "問題が発生しました。",
      description:
        "公開状態の切り替えができませんでした。もう一度お試しください。",
      variant: "destructive",
    });
  }
}

// async function getPost(postId: string) {
//   try {
//     const response = await fetch(`/api/posts/${postId}`, {
//       method: "GET",
//     });
//     if (!response.ok) {
//       throw new Error("failed");
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     toast({
//       title: "問題が発生しました。",
//       description: "記事が取得できませんでした。",
//       variant: "destructive",
//     });
//     console.error("Error fetching post:", error);
//   }
// }

interface PostOperationsProps {
  post: Pick<Post, "id" | "title" | "published">;
}

export default function PostOperations({ post }: PostOperationsProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [isPublishLoading, setIsPublishLoading] = useState<boolean>(false);
  const router = useRouter();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Icon.ellipsis className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="w-full">
            <Link href={`/editor/${post.id}`}>編集</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              setIsPublishLoading(true);
              const toggled = await togglePublishPost(post.id, !post.published);
              if (toggled) {
                setIsPublishLoading(false);
                router.refresh();
              }
            }}
          >
            {isPublishLoading && (
              <Icon.spinner className="w-4 h-4 mr-2 animate-spin" />
            )}
            {post.published ? "非公開にする" : "公開にする"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive cursor-pointer focus:text-destructive"
            onClick={() => setShowDeleteAlert(true)}
          >
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本当にこの記事を削除しますか?</AlertDialogTitle>
            <AlertDialogDescription>
              この操作はキャンセルできません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (e) => {
                e.preventDefault();
                setIsDeleteLoading(true);
                const deleted = await deletePost(post.id);
                if (deleted) {
                  setShowDeleteAlert(false);
                  setIsDeleteLoading(false);
                  router.refresh();
                }
              }}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleteLoading ? (
                <Icon.spinner className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Icon.trash className="w-4 h-4 mr-2" />
              )}
              記事を削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
