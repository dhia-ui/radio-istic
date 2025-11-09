import { NextRequest } from "next/server";
import { createReadStream, statSync, existsSync } from "node:fs";
import { join } from "node:path";

export const dynamic = 'force-dynamic'

// Simple audio streaming with Range support from public/audio
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const file = searchParams.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "file query is required" }), { status: 400 });
    }

    // Prevent path traversal
    const safe = file.replace(/\\|\/+|\.{2,}/g, "");
    const audioPath = join(process.cwd(), "public", "audio", safe);
    if (!existsSync(audioPath)) {
      return new Response(JSON.stringify({ error: "File not found" }), { status: 404 });
    }

    const stat = statSync(audioPath);
    const range = req.headers.get("range");
    if (!range) {
      // Return whole file
      const headers = new Headers();
      headers.set("Content-Type", "audio/mpeg");
      headers.set("Content-Length", String(stat.size));
      return new Response(createReadStream(audioPath) as any, { headers, status: 200 });
    }

    // Parse Range: bytes=start-end
    const match = /bytes=(\d+)-(\d+)?/.exec(range);
    const start = match && match[1] ? parseInt(match[1], 10) : 0;
    const end = match && match[2] ? parseInt(match[2], 10) : stat.size - 1;

    // Validate bounds
    if (start >= stat.size || end >= stat.size) {
      const headers = new Headers();
      headers.set("Content-Range", `bytes */${stat.size}`);
      return new Response(null, { status: 416, headers });
    }

    const chunkSize = end - start + 1;
    const stream = createReadStream(audioPath, { start, end });

    const headers = new Headers();
    headers.set("Content-Range", `bytes ${start}-${end}/${stat.size}`);
    headers.set("Accept-Ranges", "bytes");
    headers.set("Content-Length", String(chunkSize));
    headers.set("Content-Type", "audio/mpeg");

    return new Response(stream as any, { status: 206, headers });
  } catch (e) {
    console.error("[API] audio stream error", e);
    return new Response(JSON.stringify({ error: "Stream failed" }), { status: 500 });
  }
}
