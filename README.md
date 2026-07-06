# EntertainHub

A single-page entertainment discovery app that lets you browse movies, TV shows, music, and games, and save any of them to a personal watchlist.

**Live Demo:** [entertainment-hub-cyan.vercel.app](https://entertainment-hub-cyan.vercel.app)

## What problem does this solve?

Most people bounce between four different apps to decide what to watch, listen to, or play next — a movie database, a music app, a games storefront, and whatever notes app they use to remember what they wanted to check out later. EntertainHub pulls three different content domains (movies/TV, music, games) into one browsing experience with a shared watchlist, so "things I want to check out" lives in one place instead of scattered across services. It's also a project built to prove out working with multiple third-party APIs with very different data shapes (TMDb's structured JSON, iTunes' RSS-flavored feed, and a hand-curated static dataset for games) behind one consistent UI.

## Tech Stack
- **Frontend:** React 19, React Router, Tailwind CSS
- **Backend/Database:** Firebase Authentication (email/password) + Firestore (per-user watchlist storage)
- **External APIs:** TMDb API (movies/TV — trending, top rated, now playing, upcoming, search, detail data), iTunes Search/RSS API (top albums, album search, track previews — no key required)
- **Data:** a curated static dataset (`entertainment-hub/frontend/src/data/games.js`) of 15 games with Steam CDN artwork, since there's no free games API with the same reliability as TMDb
- **Infra/Deployment:** Vercel, with `entertainment-hub/vercel.json` pointing the build at the `entertainment-hub/frontend/` subfolder (`cd frontend && npm install && npm run build`) and an SPA rewrite rule so client-side routes resolve correctly on refresh

## Architecture

- `App.js` sets up all routes (Home, Browse, Detail, Music, MusicDetail, Games, GameDetail, Watchlist, Auth) under a single shared `Navbar`, which subscribes to Firebase's `onAuthStateChanged` to show the right nav state.
- `api.js` is the single integration layer: it wraps TMDb calls (trending movies/shows, hardcoded API key in source for this hobby project), iTunes calls (top albums via RSS, search via the iTunes Search API, track lookups for previews), and the Firestore watchlist CRUD helpers (`addToWatchlist`, `removeFromWatchlist`, `getWatchlist`, `isInWatchlist`) — all normalized into the same shape the UI expects regardless of which upstream API they came from.
- Watchlist items are stored per-user in Firestore at `watchlists/{userId}/items/{itemId}`, so a movie, show, or game all live in the same subcollection structure and the "is this saved?" check is a single doc read.
- Games have no live API backing them — they're a static array in `src/data/games.js`, with Steam's CDN used directly for cover art (`STEAM_IMG`/`STEAM_HERO` helpers built from each game's Steam app ID).
- Music previews use the iTunes track lookup response directly (each track includes a 30-second preview URL) — no extra audio infrastructure required.

## Key Features
- Movies & TV: trending, top rated, now playing, and upcoming categories, full detail pages (cast, ratings, overview, backdrop), and search
- Music: live top-albums chart from iTunes, album detail pages with full track listings and 30-second audio previews, artist/album search
- Games: 15 curated titles with genre filtering and detail pages (tags, description, rating)
- Cross-category watchlist backed by Firestore, so saved items persist across devices and sessions
- Email/password authentication via Firebase Auth gating the watchlist feature

## Interesting Engineering Decisions
- Three completely different data sources (TMDb JSON, iTunes RSS/JSON, and a static dataset) are normalized into one common shape in `api.js` so every page component (`Detail.js`, `MusicDetail.js`, `GameDetail.js`) can render items the same way regardless of where the data came from.
- The Firestore watchlist schema (`watchlists/{userId}/items/{itemId}`) is deliberately domain-agnostic — a movie ID and a game ID land in the same collection shape, which is what makes a single `Watchlist.js` page work across all three content types instead of needing three separate saved-items views.
- Deployment is configured for a monorepo-style layout: `entertainment-hub/vercel.json` builds from the `frontend/` subdirectory rather than the repo root, since the actual project lives one folder down from the repo root.

## Running Locally
```bash
cd entertainment-hub/frontend
npm install
npm start
```
The app runs at `http://localhost:3000`. You'll need a [TMDb API key](https://www.themoviedb.org/settings/api) and a Firebase project (Authentication + Firestore enabled) — for local development these currently live directly in `src/api.js` and `src/firebase.js`; for a production fork, move them into environment variables (`REACT_APP_TMDB_KEY`, `REACT_APP_FIREBASE_API_KEY`, etc.).

## License
MIT
