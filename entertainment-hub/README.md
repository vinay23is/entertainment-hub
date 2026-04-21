# EntertainHub

A full-featured entertainment discovery app for Movies, TV Shows, Music, and Games — built with React and Firebase.

## Features

**Movies & TV Shows**
- Trending, Top Rated, Now Playing, and Upcoming categories
- Full detail pages with cast, ratings, overview, and backdrop
- Search across all movies and shows

**Music**
- Top albums pulled live from the iTunes charts
- Album detail pages with full track listings
- 30-second audio previews per track
- Search artists and albums

**Games**
- Curated collection of 15 critically acclaimed titles
- Genre filtering (RPG, Horror, Puzzle, Co-op, and more)
- Game detail pages with tags, descriptions, and ratings

**Watchlist**
- Save any movie, show, or game to your personal watchlist
- Backed by Firestore — persists across devices
- Remove items with one click

**Auth**
- Email/password sign up and login via Firebase Authentication

## Tech Stack

- **React 19** — UI and routing via React Router
- **Tailwind CSS** — styling
- **Firebase** — Authentication + Firestore database
- **TMDb API** — movies and TV data
- **iTunes Search API** — music data (no key required)
- **Steam CDN** — game cover images

## Getting Started

### Prerequisites
- Node.js 18+
- A [TMDb API key](https://www.themoviedb.org/settings/api)
- A Firebase project with Authentication and Firestore enabled

### Install & Run

```bash
cd frontend
npm install
npm start
```

The app runs at `http://localhost:3000`.

### Configuration

The TMDb API key and Firebase config are currently in the source files. For production, move them to environment variables:

```
REACT_APP_TMDB_KEY=your_key_here
REACT_APP_FIREBASE_API_KEY=your_key_here
...
```

## Project Structure

```
frontend/src/
├── pages/
│   ├── Home.js          # Landing page with all four sections
│   ├── Browse.js        # Full movie / TV browse with category tabs
│   ├── Detail.js        # Movie & TV detail + watchlist
│   ├── Music.js         # Top albums + search
│   ├── MusicDetail.js   # Album detail + track previews
│   ├── Games.js         # Games grid + genre filter
│   ├── GameDetail.js    # Game detail + watchlist
│   ├── Watchlist.js     # Saved items
│   └── Auth.js          # Login / Sign up
├── data/
│   └── games.js         # Curated games dataset
├── api.js               # TMDb, iTunes, and Firestore helpers
├── firebase.js          # Firebase init
└── App.js               # Routes + Navbar
```

## License

MIT
