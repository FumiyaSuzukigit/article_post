import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import PostsList from "@/components/posts-list";

export default async function IndexPage() {
  return (
    <>
      <section className="pt-6 md:pt-10 lg:py-32 pb-8 md:pb-12">
        <div className="container text-center flex flex-col items-center gap-4 max-w-[64rem]">
          <h1 className="font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            {siteConfig.name}
          </h1>
          <p className="text-muted-foreground sm:text-xl leading-normal max-w-[42rem]">
            ユーザーは自由に記事投稿することができます。投稿を始めましょう！
          </p>
          <div className="space-x-4">
            <Link
              href={"/login"}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              ログインして投稿する
            </Link>
          </div>
        </div>
      </section>

      <section
        className="container mb-8 py-8 md:py-12 lg:py-24 bg-slate-50"
        id="post"
      >
        <div className="max-w-[52rem] mx-auto flex flex-col gap-2">
          <div>
            <div className="space-y-4">
              <h1 className="font-extrabold text-4xl lg:text-5xl tracking-tight">
                投稿記事
              </h1>
            </div>
          </div>
          <hr className="my-2" />
          <PostsList allList={false} />
        </div>
      </section>
    </>
  );
}
