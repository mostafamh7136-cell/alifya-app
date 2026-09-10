import { NextRequest } from "next/server";

const ALLOWED_HOST = "upload.wikimedia.org";
const ALLOWED_PREFIX = "/wikipedia/commons/";

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src");
  if (!src) return new Response("Missing src", { status: 400 });
  let url: URL;
  try { url = new URL(src); } catch { return new Response("Invalid src", { status: 400 }); }
  if (url.protocol !== "https:" || url.hostname !== ALLOWED_HOST || !url.pathname.startsWith(ALLOWED_PREFIX)) {
    return new Response("Audio source not allowed", { status: 403 });
  }

  const headers = new Headers();
  const range = request.headers.get("range");
  if (range) headers.set("range", range);
  headers.set("user-agent", "Alifya/1.0 (Arabic learning platform)");
  headers.set("accept", "audio/ogg,audio/wav,audio/*;q=0.9,*/*;q=0.5");

  const upstream = await fetch(url, { headers, redirect: "follow", cache: "force-cache" });
  if (!upstream.ok && upstream.status !== 206) return new Response(`Upstream audio unavailable (${upstream.status})`, { status: 502 });

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type") || "application/octet-stream";
  const length = upstream.headers.get("content-length");
  const contentRange = upstream.headers.get("content-range");
  responseHeaders.set("content-type", contentType);
  if (length) responseHeaders.set("content-length", length);
  if (contentRange) responseHeaders.set("content-range", contentRange);
  responseHeaders.set("accept-ranges", "bytes");
  responseHeaders.set("cache-control", "public, max-age=31536000, immutable");
  responseHeaders.set("access-control-allow-origin", "*");
  return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
}
