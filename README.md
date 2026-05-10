# Sergio / Lifts

Olympic weightlifting training log. Static React + Vite site that embeds videos from YouTube.

## Develop

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve dist/ locally
```

## Adding a video

1. Upload the video to YouTube. Set visibility to **Unlisted** (only people with the link can view; not in search results).
2. Copy the video ID from the URL — it's the `v=` parameter, or the part after `youtu.be/` or `youtube.com/shorts/`:
   - `https://www.youtube.com/watch?v=`**`PesVfzoU3-0`**
   - `https://youtu.be/`**`PesVfzoU3-0`**
   - `https://youtube.com/shorts/`**`PesVfzoU3-0`**`?si=...`
3. Add an entry to [`src/videos.json`](src/videos.json):

```json
{
  "id": "v2",
  "youtubeId": "PesVfzoU3-0",
  "title": "Snatch, top single",
  "date": "2026-05-09",
  "lift": "snatch",
  "weight": 92,
  "tags": ["heavy", "review"],
  "notes": "Caught it deep, recovered."
}
```

`id` just needs to be unique. `lift` should be one of the keys in `LIFT_LABELS` in `src/App.jsx` — add a new one there if you need a new category.

Set `"vertical": true` for YouTube Shorts (or any 9:16 video). The modal will render a portrait player (capped at 360px wide, centered). Omit the field for normal landscape videos.

## Deploy

The repo includes config for both Netlify and Vercel.

### Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import from Git** → pick the repo.
3. The `netlify.toml` already specifies build command (`npm run build`) and publish dir (`dist`).

### Vercel

1. Push to GitHub.
2. In Vercel: **Add New Project** → import the repo.
3. The framework is auto-detected as Vite. `vercel.json` covers SPA routing.
