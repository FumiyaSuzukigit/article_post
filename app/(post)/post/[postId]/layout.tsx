import { getPost } from "./lib";

export async function generateMetadata({
  params,
}: {
  params: { postId: string };
}) {
  const post = await getPost(params.postId);

  if (!post) {
    return {
      title: "Post Not Found | Site Name",
      description: "Post not found",
    };
  }

  const title = post.title || "No title available";
  const contentSnippet = post.content
    ? String(post.content).slice(0, 160)
    : title;

  return {
    title: `${title} | Site Name`,
    description: contentSnippet,
    openGraph: {
      title: title,
      description: contentSnippet,
      url: `https://example.com/post/${params.postId}`,
      images: [
        {
          url: `https://example.com/og.jpg`,
          width: 1200,
          height: 630,
          alt: `${title} Open Graph Image`,
        },
      ],
    },
    twitter: {
      title: title,
      description: contentSnippet,
      images: [`https://example.com/og.jpg`],
    },
  };
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto grid items-center gap-10 py-8">
      {children}
    </div>
  );
}
