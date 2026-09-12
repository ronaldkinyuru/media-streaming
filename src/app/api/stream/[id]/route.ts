import { stat, createReadStream } from "fs";
import path from "path";
import { promisify } from "util";
import { NextRequest, NextResponse } from "next/server";

const getStat = promisify(stat);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), "storage", "media", `${id}.mp4`);

  try {
    const file = await getStat(filePath);
    const range = request.headers.get("range");

    if (!range) {
      const stream = createReadStream(filePath);
      return new NextResponse(stream as any, {
        headers: {
          "Content-Type": "video/mp4",
          "Content-Length": file.size.toString(),
        },
      });
    }

    const [startText, endText] = range.replace("bytes=", "").split("-");
    const start = Number(startText);
    const end = endText ? Number(endText) : file.size - 1;
    const stream = createReadStream(filePath, { start, end });

    return new NextResponse(stream as any, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${file.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": (end - start + 1).toString(),
        "Content-Type": "video/mp4",
      },
    });
  } catch {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }
}
