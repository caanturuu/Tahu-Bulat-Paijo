import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = (process.env.BACKEND_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

async function proxyToBackend(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const search = new URL(req.url).search;
  const targetUrl = `${BACKEND_BASE}/api/${path.join("/")}${search}`;

  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  const authorization = req.headers.get("authorization");
  if (contentType) headers.set("content-type", contentType);
  if (authorization) headers.set("authorization", authorization);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  try {
    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseText = await backendRes.text();
    const resHeaders = new Headers();
    const resType = backendRes.headers.get("content-type");
    if (resType) resHeaders.set("content-type", resType);

    return new NextResponse(responseText, {
      status: backendRes.status,
      headers: resHeaders,
    });
  } catch {
    return NextResponse.json(
      { detail: "Server backend FastAPI (http://localhost:8000) belum aktif." },
      { status: 503 }
    );
  }
}

export const GET = proxyToBackend;
export const POST = proxyToBackend;
export const PUT = proxyToBackend;
export const PATCH = proxyToBackend;
export const DELETE = proxyToBackend;
