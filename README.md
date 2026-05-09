# Sergio / Lifts

Olympic weightlifting training log. Static React + Vite site that embeds videos straight from Google Drive.

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

1. Upload the file to Google Drive.
2. Right-click the file in Drive → **Share** → set link access to **Anyone with the link**. Without this, the embed will not load.
3. Copy the file ID from the share URL — it's the long string between `/d/` and `/view`:
   - `https://drive.google.com/file/d/`**`1A2B3C…XYZ`**`/view?usp=sharing`
4. Add an entry to [`src/videos.json`](src/videos.json):

```json
{
  "id": "v11",
  "driveId": "1A2B3C…XYZ",
  "title": "Snatch, top single",
  "date": "2026-05-09",
  "lift": "snatch",
  "weight": 92,
  "tags": ["heavy", "review"],
  "notes": "Caught it deep, recovered."
}
```

`id` just needs to be unique. `lift` should be one of the keys in `LIFT_LABELS` in `src/App.jsx` — add a new one there if you need a new category.

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
