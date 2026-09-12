import Link from "next/link";
import { notFound } from "next/navigation";
import media from "@/data/media.json";

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = media.find((video) => video.id === id);

  if (!item) notFound();

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <Link href="/" className="text-blue-400 hover:text-blue-300">
        ← Back to library
      </Link>

      <h1 className="mt-8 text-4xl font-bold">{item.title}</h1>
      <p className="mt-2 text-slate-400">{item.description}</p>

      <video
        className="mt-8 aspect-video w-full rounded-xl bg-black"
        controls
        preload="metadata"
      >
        <source src={`/api/stream/${item.id}`} type="video/mp4" />
        Your browser does not support video playback.
      </video>
    </main>
  );
}
