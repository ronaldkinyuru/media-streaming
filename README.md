# 🎬 Media Streaming Server

**Your personal video library. Hosted locally. Built for streaming.**

A self-hosted media server built with Next.js that lets you browse a video library and play locally stored videos through a web interface. The long-term goal is to serve video content through a MikroTik hotspot login page.

---

## ✨ Features

- 🎞️ **Video library** — browse available media from the homepage.
- ▶️ **Dedicated watch pages** — open a video by its ID and play it in the browser.
- 📡 **Video streaming API** — serve local MP4 files to the video player.
- 🔎 **Media API** — retrieve the complete media list or an individual video's details.
- 💚 **Health endpoint** — check whether the server is responding.
- ⚙️ **Settings page** — a starting point for future server configuration.

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Web application and API routes |
| React 19 | User interface |
| TypeScript | Safer, more predictable code |
| Tailwind CSS 4 | Styling and layout |
| Node.js 24 | JavaScript runtime |

## 🚀 Getting Started

### Prerequisites

Install **Node.js 24** and npm. You can check your versions with:

```bash
node --version
npm --version
```

### 1. Get the project

If you have already cloned the repository, open its folder in your terminal.

Otherwise:

```bash
git clone https://github.com/ronaldkinyuru/media-streaming.git
cd media-streaming
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

To stop the server, press `Ctrl+C` in the terminal.

## 📂 Project Structure

```text
media-streaming/
├── storage/
│   └── media/
│       └── sample-video.mp4
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/
│   │   │   │   └── route.ts
│   │   │   ├── media/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── stream/
│   │   │       └── [id]/
│   │   │           └── route.ts
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── watch/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── data/
│       └── media.json
├── package.json
└── README.md
```

## 🧠 How the Code Works

| File | Responsibility |
|---|---|
| `src/app/page.tsx` | Displays the media library homepage. |
| `src/app/layout.tsx` | Provides the shared layout and page metadata. |
| `src/app/globals.css` | Contains the application's global styles. |
| `src/app/watch/[id]/page.tsx` | Displays the selected video's watch page and player. |
| `src/app/settings/page.tsx` | Displays the initial settings page. |
| `src/app/api/health/route.ts` | Returns a health-check response. |
| `src/app/api/media/route.ts` | Returns the media list as JSON. |
| `src/app/api/media/[id]/route.ts` | Returns one video's metadata by ID. |
| `src/app/api/stream/[id]/route.ts` | Serves the corresponding local video file. |
| `src/data/media.json` | Stores the current media catalogue and its metadata. |
| `storage/media/` | Holds local video files. |

### The video playback flow

1. A visitor opens the homepage.
2. The homepage displays videos listed in `media.json`.
3. The visitor opens a video's watch page.
4. The browser's video player requests the file through `/api/stream/[id]`.
5. The server serves the local video to the browser.

**Important:** The media catalogue and video files must correspond. A catalogue entry alone does not guarantee that its video file exists.

## 🔌 API Reference

### Health check

```http
GET /api/health
```

Returns the server's health-check information.

### List media

```http
GET /api/media
```

Returns the available media entries and their count.

### Get one media item

```http
GET /api/media/sample-video
```

Returns the metadata for the requested video. Unknown IDs should return `404 Not Found`.

### Stream a video

```http
GET /api/stream/sample-video
```

Requests
