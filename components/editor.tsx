"use client";

import { useRouter } from "next/navigation";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import TextareaAutoSize from "react-textarea-autosize";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import { useCallback, useEffect, useRef, useState } from "react";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Code from "@editorjs/code";
import Quote from "@editorjs/quote";
import { Post } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postPatchSchema, postPatchSchemaType } from "@/lib/validations/post";
import { toast } from "./ui/use-toast";
import { Icon } from "./icon";

interface EditorProps {
  post: Pick<Post, "id" | "title" | "content" | "published">;
}
export default function Editor({ post }: EditorProps) {
  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const router = useRouter();
  const postId = post.id;
  const [published, setPublished] = useState<boolean>(post.published);

  const togglePublished = async () => {
    const response = await fetch("/api/posts/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: postId,
        published: !published,
      }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      setPublished(updatedPost.published);
      toast({
        description: `投稿が${
          updatedPost.published ? "公開" : "非公開"
        }になりました。`,
      });
    } else {
      console.error("Failed to update post");
      toast({
        title: "エラー",
        description: "投稿の更新に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  const initializeEditor = useCallback(async () => {
    const body = postPatchSchema.parse(post);
    const editor = new EditorJS({
      holder: "editor",
      onReady() {
        ref.current = editor;
      },
      placeholder: "ここに記事を書く",
      inlineToolbar: ["link", "bold", "italic"],
      data: body.content,
      tools: {
        header: Header,
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "/api/link-preview",
          },
        },
        list: List,
        code: Code,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: "/api/post-image-upload",
              // byUrl: "/api/post-image-uploadByUrl",
            },
            field: "image",
            types: "image/*",
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: "引用を入力",
            captionPlaceholder: "引用の作者",
          },
        },
      },
    });
  }, [post]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      initializeEditor();
    }
    return () => {
      ref.current?.destroy();
      ref.current = undefined;
    };
  }, [isMounted, initializeEditor]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<postPatchSchemaType>({
    resolver: zodResolver(postPatchSchema),
  });

  const onSubmit = async (data: postPatchSchemaType) => {
    setIsSaving(true);
    const blocks = await ref.current?.save();

    const response = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        content: blocks,
      }),
    });

    setIsSaving(false);

    if (!response.ok) {
      return toast({
        title: "問題が発生しました。",
        description: "記事は保存されませんでした。もう一度お試しください。",
        variant: "destructive",
      });
    }

    router.refresh();

    toast({
      description: "正常に保存されました。",
    });
  };

  const handleLinkClick = (e) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <button
              onClick={handleLinkClick}
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              戻る
            </button>
            <button type="button" onClick={togglePublished} className="text-sm">
              {published ? "非公開" : "公開"}
            </button>
          </div>
          <button className={cn(buttonVariants())} type="submit">
            {isSaving && <Icon.spinner className="w-4 h-4 mr-2 animate-spin" />}
            <span>保存</span>
          </button>
        </div>
        <div className="w-[800px] mx-auto">
          <TextareaAutoSize
            id="title"
            autoFocus
            placeholder="Post Title"
            defaultValue={post.title}
            className="w-full resize-none overflow-hidden bg-transparent text-5xl focus:outline-none font-bold"
            {...register("title")}
          />
        </div>
        <div
          id="editor"
          className="min-h-[500px] bg-white p-4 rounded-lg shadow-md"
        />
      </div>
    </form>
  );
}
