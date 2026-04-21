import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"
import { getTrendingMovies, getTrendingShows, getTopAlbums, addToWatchlist, removeFromWatchlist, isInWatchlist, IMG_URL } from "../api"
import { GAMES, STEAM_IMG } from "../data/games"

const API_KEY = "0841d635c10f90f92d5823d412c990b3"
const BG_URL = "https://image.tmdb.org/t/p/original"

function SkeletonCard() {
  return <div className="rounded-xl h-64 skeleton" />
}

function SkeletonHero() {
  return (
    <div className="h-screen bg-gray-900 flex items-end px-12 pb-24">
      <div className="max-w-2xl w-full animate-pulse space-y-4">
        <div className="h-3 w-32 bg-gray-700 rounded" />
        <div className="h-16 w-96 bg-gray-700 rounded" />
        <div className="h-3 w-full bg-gray-700 rounded" />
        <div className="h-3 w-3/4 bg-gray-700 rounded" />
        <div className="flex gap-4 pt-2">
          <div className="h-12 w-36 bg-gray-700 rounded-lg" />
          <div className="h-12 w-36 bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function Card({ item, onClick }) {
  const imgSrc = item.poster ? IMG_URL + item.poster : item.image || null
  return (
    <div
      onClick={onClick}
      className="relative rounded-xl overflow-hidden cursor-pointer group h-64 bg-gray-800 flex-shrink-0"
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-700">
          {item.emoji || "🎬"}
        </div>
      )}

      {/* Always-on bottom fade so title is slightly legible */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="absolute top-3 right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-base shadow-lg">
          +
        </div>
        <h3 className="font-bold text-white text-sm leading-tight">{item.title}</h3>
        {item.subtitle && <p className="text-gray-300 text-xs mt-0.5">{item.subtitle}</p>}
        {item.rating != null && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-white text-xs font-bold">{item.rating}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, items, onCardClick, viewAllPath, navigate, loading }) {
  return (
    <div className="px-8 mb-12 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {viewAllPath && (
          <button
            onClick={() => navigate(viewAllPath)}
            className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
          >
            View all →
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading
          ? Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : items.map(item => (
            <Card key={item.id} item={item} onClick={() => onCardClick && onCardClick(item)} />
          ))
        }
      </div>
    </div>
  )
}

export default function Home() {
  const [movies, setMovies] = useState([])
  const [shows, setShows] = useState([])
  const [albums, setAlbums] = useState([])
  const [moviesLoading, setMoviesLoading] = useState(true)
  const [showsLoading, setShowsLoading] = useState(true)
  const [albumsLoading, setAlbumsLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [user, setUser] = useState(null)
  const [heroInWatchlist, setHeroInWatchlist] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getTrendingMovies()
      .then(data => { setMovies(data); setMoviesLoading(false) })
      .catch(() => setMoviesLoading(false))
    getTrendingShows()
      .then(data => { setShows(data); setShowsLoading(false) })
      .catch(() => setShowsLoading(false))
    getTopAlbums()
      .then(data => { setAlbums(data.slice(0, 5)); setAlbumsLoading(false) })
      .catch(() => setAlbumsLoading(false))
  }, [])

  useEffect(() => {
    return onAuthStateChanged(auth, async u => {
      setUser(u)
      if (u && movies[0]) {
        const inList = await isInWatchlist(u.uid, `movie-${movies[0].id}`)
        setHeroInWatchlist(inList)
      }
    })
  }, [movies])

  async function handleSearch(e) {
    const value = e.target.value
    setQuery(value)
    if (value.length < 2) {
      setSearchResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(value)}`
    )
    const data = await res.json()
    setSearchResults(data.results?.filter(r => r.media_type !== "person") || [])
  }

  function toggleHeroWatchlist() {
    if (!user) { navigate("/auth"); return }
    const hero = movies[0]
    if (!hero) return
    if (heroInWatchlist) {
      setHeroInWatchlist(false)
      removeFromWatchlist(user.uid, `movie-${hero.id}`).catch(() => setHeroInWatchlist(true))
    } else {
      setHeroInWatchlist(true)
      addToWatchlist(user.uid, {
        id: `movie-${hero.id}`,
        type: "movie",
        title: hero.title,
        poster: hero.poster_path ? IMG_URL + hero.poster_path : null,
        rating: hero.vote_average?.toFixed(1),
        genre: null,
      }).catch(() => setHeroInWatchlist(false))
    }
  }

  const toMovieCard = (m, type) => ({
    id: m.id,
    title: m.title || m.name,
    subtitle: m.release_date?.split("-")[0] || m.first_air_date?.split("-")[0],
    rating: m.vote_average?.toFixed(1),
    poster: m.poster_path,
    type,
  })

  const toAlbumCard = (a) => ({
    id: a.id,
    title: a.title,
    subtitle: a.artist,
    rating: null,
    image: a.image,
    type: "music",
  })

  const toGameCard = (g) => ({
    id: g.id,
    title: g.title,
    subtitle: `${g.genre} · ${g.year}`,
    rating: g.rating,
    image: STEAM_IMG(g.steamId),
    type: "game",
  })

  const hero = movies[0]

  return (
    <div>
      {/* ── HERO ── */}
      {!searching && (
        <>
          {moviesLoading || !hero ? (
            <SkeletonHero />
          ) : (
            <div className="relative h-screen min-h-[600px] flex items-end animate-fade-in">
              {/* Backdrop */}
              <img
                src={BG_URL + hero.backdrop_path}
                alt={hero.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-gray-950/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/30 to-transparent" />

              {/* Search — floats top-right inside hero */}
              <div className="absolute top-8 right-8 z-10">
                <input
                  type="text"
                  value={query}
                  onChange={handleSearch}
                  placeholder="Search movies, shows, games..."
                  className="w-72 px-5 py-2.5 rounded-full bg-black/50 backdrop-blur-md text-white text-sm outline-none border border-white/20 focus:border-yellow-400 transition-colors placeholder-gray-400"
                />
              </div>

              {/* Hero content */}
              <div className="relative z-10 px-12 pb-24 max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-0.5 bg-yellow-400 text-black text-xs font-black rounded uppercase tracking-widest">
                    Featured
                  </span>
                  <span className="text-gray-300 text-sm">
                    {hero.release_date?.split("-")[0]}
                  </span>
                </div>

                <h1 className="text-6xl font-black text-white leading-none mb-4 drop-shadow-lg">
                  {hero.title}
                </h1>

                <div className="flex items-center gap-3 mb-5">
                  <span className="text-yellow-400 font-bold text-lg">★ {hero.vote_average?.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({hero.vote_count?.toLocaleString()} votes)</span>
                </div>

                <p className="text-gray-300 text-base leading-relaxed mb-8 line-clamp-3">
                  {hero.overview}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(`/movie/${hero.id}`)}
                    className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors shadow-lg"
                  >
                    View Details
                  </button>
                  <button
                    onClick={toggleHeroWatchlist}
                    className={`px-8 py-3 font-bold rounded-lg transition-colors border backdrop-blur-sm ${
                      heroInWatchlist
                        ? "bg-white/20 text-white border-white/40 hover:bg-red-900/50"
                        : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                    }`}
                  >
                    {heroInWatchlist ? "✓ In Watchlist" : "+ Watchlist"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Search bar (visible when not in hero) ── */}
      {searching && (
        <div className="px-8 pt-8 pb-4">
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search movies, shows, games..."
            className="w-full max-w-xl px-6 py-3 rounded-full bg-gray-800 text-white outline-none border border-gray-700 focus:border-yellow-400 transition-colors"
          />
        </div>
      )}

      {/* ── Content ── */}
      <div className="pt-12">
        {searching ? (
          <Section
            title="🔍 Search Results"
            items={searchResults.slice(0, 10).map(r => toMovieCard(r, r.media_type))}
            onCardClick={item => navigate(`/${item.type}/${item.id}`)}
            navigate={navigate}
          />
        ) : (
          <>
            <Section
              title="🎬 Trending Movies"
              items={movies.slice(0, 5).map(m => toMovieCard(m, "movie"))}
              onCardClick={item => navigate(`/movie/${item.id}`)}
              viewAllPath="/browse/movies"
              navigate={navigate}
              loading={moviesLoading}
            />
            <Section
              title="📺 Trending TV Shows"
              items={shows.slice(0, 5).map(s => toMovieCard(s, "tv"))}
              onCardClick={item => navigate(`/tv/${item.id}`)}
              viewAllPath="/browse/tv"
              navigate={navigate}
              loading={showsLoading}
            />
            <Section
              title="🎵 Top Albums"
              items={albums.map(toAlbumCard)}
              onCardClick={item => navigate(`/music/${item.id}`, { state: { album: albums.find(a => a.id === item.id) } })}
              viewAllPath="/music"
              navigate={navigate}
              loading={albumsLoading}
            />
            <Section
              title="🎮 Popular Games"
              items={GAMES.slice(0, 5).map(toGameCard)}
              onCardClick={item => navigate(`/games/${item.id}`)}
              viewAllPath="/games"
              navigate={navigate}
              loading={false}
            />
          </>
        )}
      </div>
    </div>
  )
}
