import media from  "@/data/media.json";


export default function Home() {
  return (
     <main className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="mb-2 text-4xl font-bold">Local Media Library</h1>
      <p className="mb-8 text-slate-400">
        Your private streaming library
      </p>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {media.map((item) => (
          <article key={item.id} className="rounded-xl bg-slate-900 p-4">
            <div className="mb-4 flex aspect-video items-center justify-center rounded-lg bg-slate-800 text-4xl">
              ▶
            </div>
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{item.description}</p>
            <a
              href={`/watch/${item.id}`}
              className="mt-4 inline-block text-blue-400 hover:text-blue-300"
            >
              Watch video →
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
