
import { readdir, stat } from "fs/promises";
import path from "path";
import { createHash } from "crypto";

export interface MediaItem {
  id: string;
  filename: string;
  title: string;
  description: string;
  type: "video";
  duration: string;
  size: number;
}

const MEDIA_DIRECTORY =
  process.env.MEDIA_DIRECTORY ||
  path.join(process.cwd(), "storage", "media");

function generateMediaId(filename: string): string {
  const hash = createHash("sha256")
    .update(filename)
    .digest("hex")
    .slice(0, 16);

  return `video-${hash}`;
}

export async function getMediaLibrary(): Promise<MediaItem[]> {
  const files = await readdir(MEDIA_DIRECTORY);

  const videoFiles = files
    .filter((file) => file.toLowerCase().endsWith(".mp4"))
    .sort((a, b) => a.localeCompare(b));

  const videos = await Promise.all(
    videoFiles.map(async (file) => {
      const filePath = path.join(MEDIA_DIRECTORY, file);
      const fileStats = await stat(filePath);

      if (!fileStats.isFile()) {
        return null;
      }

      return {
        id: generateMediaId(file),
        filename: file,
        title: path.parse(file).name,
        description: "No description available.",
        type: "video" as const,
        duration: "Unknown",
        size: fileStats.size,
      };
    }),
  );

  return videos.filter((video) => video !== null);
}
