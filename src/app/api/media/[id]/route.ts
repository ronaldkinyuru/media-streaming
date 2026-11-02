
import { getMediaLibrary } from "@/lib/media";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const media = await getMediaLibrary();
    const item = media.find((video) => video.id === id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Media not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      media: item,
    });
  } catch (error) {
    console.error("Failed to retrieve media:", error);

    return NextResponse.json(
      { success: false, error: "Unable to retrieve media" },
      { status: 500 },
    );
  }
}
