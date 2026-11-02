    
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { Readable } from "stream";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getMediaLibrary } from "@/lib/media";

const MEDIA_DIRECTORY =
  process.env.MEDIA_DIRECTORY ||
  path.join(process.cwd(), "storage", "media");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Only accept generated video IDs.
    if (!/^video-[a-f0-9]{16}$/.test(id)) {
      return NextResponse.json(
      { error: "Invalid video ID" },
      { status: 400 },
    );
  }

  try {
    // Find the original filename using the generated ID.
    const media = await getMediaLibrary();
    const item = media.find((video) => video.id === id);

    if (!item) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 },
      );
    }

    const filePath = path.join(MEDIA_DIRECTORY, item.filename);
    const file = await stat(filePath);

    if (!file.isFile()) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 },
      );
    }

    const range = request.headers.get("range");

    if (!range) {
      const stream = createReadStream(filePath);

      return new NextResponse(
        Readable.toWeb(stream) as unknown as BodyInit,
        {
          headers: {
            "Content-Type": "video/mp4",
            "Content-Length": file.size.toString(),
            "Accept-Ranges": "bytes",
          },
        },
      );
    }

    const match = /^bytes=(\d*)-(\d*)$/.exec(range);

    if (!match || (!match[1] && !match[2])) {
      return new NextResponse(null, {
        status: 416,
        headers: {
          "Content-Range": `bytes */${file.size}`,
          "Accept-Ranges": "bytes",
        },
      });
    }

    let start: number;
    let end: number;

    if (!match[1]) {
      const suffixLength = Number(match[2]);

      if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            "Content-Range": `bytes */${file.size}`,
          },
        });
      }

      start = Math.max(file.size - suffixLength, 0);
      end = file.size - 1;
    } else {
      start = Number(match[1]);
      end = match[2] ? Number(match[2]) : file.size - 1;
    }

    if (
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start < 0 ||
      start >= file.size ||
      end < start
    ) {
      return new NextResponse(null, {
        status: 416,
        headers: {
          "Content-Range": `bytes */${file.size}`,
          "Accept-Ranges": "bytes",
        },
      });
    }

    end = Math.min(end, file.size - 1);

    const stream = createReadStream(filePath, { start, end });

    return new NextResponse(
      Readable.toWeb(stream) as unknown as BodyInit,
      {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${file.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": (end - start + 1).toString(),
          "Content-Type": "video/mp4",
        },
      },
    );
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code === "ENOENT" || code === "ENOTDIR") {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 },
      );
    }

    console.error("Video streaming error:", error);

    return NextResponse.json(
      { error: "Unable to stream video" },
      { status: 500 },
    );
  }
}
