import { getMediaLibrary } from "@/lib/media";

export async function GET() {
  try {
    const media = await getMediaLibrary();

    return Response.json({
      success: true,
      count: media.length,
      media,
    });
  } catch (error) {
    console.error("Failed to load media library:", error);

    return Response.json(
      {
        success: false,
        error: "Unable to load media library",
      },
      { status: 500 },
    );
  }
}
