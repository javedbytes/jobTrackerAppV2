# Notion-Style Job Applications (React)

A lightweight React + Vite app that mimics the Notion table shown in your screenshot. It includes:

- All Applications table with sorting and search
- Grouped views: By Stage, By Verdict, and By Due Dates
- Clean, compact styling and colored tag pills

## Google Drive BYOD Sync

Optional sync using Google Drive's hidden `appDataFolder`.

### Google Cloud Setup
- Create a project in Google Cloud Console.
- Enable "Google Drive API".
- OAuth Consent Screen: External; add scope `https://www.googleapis.com/auth/drive.appdata`; add your email as Test User.
- Create OAuth 2.0 Client ID (Web). Add `http://localhost:5173` to Authorized JavaScript origins. Copy the Client ID.

### Local Setup
- Create a `.env` file in the project root with:

```ini
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

### Sync Behavior
- On login:
	- If Drive has `job_applications.json` in `appDataFolder`, it downloads and overwrites UI (Drive is master).
	- If not, it creates the file and uploads current local data.
- On edits: updates LocalStorage instantly and patches Drive in background.
- Token expiry (~1h): If saves fail with 401, login again.

## Quick start

```zsh
# from the workspace root
cd "notion-job-tracker"

# install deps (uses pnpm if available, else npm)
if command -v pnpm >/dev/null; then pnpm i; else npm i; fi

# run dev server
npm run dev
# or: pnpm dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Project structure

- `src/App.tsx` — main UI, views and grouping
- `src/components/Table.tsx` — table rendering + sorting
- `src/components/Tag.tsx` — colored badge component
- `src/data.ts` — seed dataset and color maps
- `src/types.ts` — TypeScript types
- `src/styles.css` — simple Notion-like styling

## Notes

- The dataset is static for now. If you want, I can wire up localStorage for persistence or add a small JSON backend.
- Colors and labels are easy to tweak in `src/data.ts`.
