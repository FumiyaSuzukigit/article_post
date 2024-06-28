import { NextResponse } from "next/server";
import { load } from "cheerio";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { success: 0, error: "URL is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const html = await response.text();
    const data = extractMetadata(html);

    return NextResponse.json({ success: 1, meta: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: 0, error: "Failed to fetch the URL data" },
      { status: 500 }
    );
  }
}

function extractMetadata(html) {
  const $ = load(html);

  const title =
    $("meta[property='og:title']").attr("content") ||
    $("meta[name='twitter:title']").attr("content") ||
    $("title").text();
  const description =
    $("meta[property='og:description']").attr("content") ||
    $("meta[name='twitter:description']").attr("content") ||
    $("meta[name='description']").attr("content");
  const image =
    $("meta[property='og:image']").attr("content") ||
    $("meta[name='twitter:image']").attr("content");

  return {
    title: title || "No title found",
    description: description || "No description found",
    image: {
      url: image || "No image found",
    },
  };
}
