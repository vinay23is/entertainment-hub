import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getTrendingMovies, getTrendingShows, getTopAlbums, IMG_URL } from "../api"
import { GAMES, STEAM_IMG } from "../data/games"

const API_KEY = "0841d635c10f90f92d5823d412c990b3"

function Card({ item, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
    >
      {item.poster ? (
        <img src={IMG_URL + item.poster} alt={item.title} className="w-full h-48 object-cover" />
      ) : item.image ? (
        <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="bg-gray-700 h-48 flex items-center justify-center text-5xl">
          {item.emoji || "🎬"}
        </div>
      )}
      <div className="p-3">
        <h3 className="font-semibold text-white truncate">{item.title}</h3>
        <p className="text-gray-400 text-sm truncate">{item.subtitle}</p>
        {item.rating != null && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-yellow-400">★</span>
            <span className="text-white font-bold">{item.rating}</span>
            <span className="text-gray-400 text-sm">/10</span>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, items, onCardClick, viewAllPath, navigate }) {
  return (
    <div className="px-8 mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {viewAllPath && (
          <button
            onClick={() => navigate(viewAllPath)}
            className="text-yellow-400 hover:text-yellow-300 text-sm"
          >
            View all →
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map(item => (
          <Card key={item.id} item={item} onClick={() => onCardClick && onCardClick(item)} />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [movies, setMovies] = useState([])
  const [shows, setShows] = useState([])
  const [albums, setAlbums] = useState([])
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getTrendingMovies().then(setMovies).catch(() => {})
    getTrendingShows().then(setShows).catch(() => {})
    getTopAlbums().then(data => setAlbums(data.slice(0, 5))).catch(() => {})
  }, [])

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

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-20 px-4">
        <h2 className="text-5xl font-bold mb-4">Your Entertainment Universe</h2>
        <p className="text-gray-400 text-lg mb-8">
          Discover, review, and save Movies, Music & Games
        </p>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search movies, shows, games..."
          className="w-full max-w-xl px-6 py-3 rounded-full bg-gray-800 text-white outline-none border border-gray-700 focus:border-yellow-400"
        />
      </div>

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
          />
          <Section
            title="📺 Trending TV Shows"
            items={shows.slice(0, 5).map(s => toMovieCard(s, "tv"))}
            onCardClick={item => navigate(`/tv/${item.id}`)}
            viewAllPath="/browse/tv"
            navigate={navigate}
          />
          <Section
            title="🎵 Top Albums"
            items={albums.map(toAlbumCard)}
            onCardClick={item => navigate(`/music/${item.id}`, { state: { album: albums.find(a => a.id === item.id) } })}
            viewAllPath="/music"
            navigate={navigate}
          />
          <Section
            title="🎮 Popular Games"
            items={GAMES.slice(0, 5).map(toGameCard)}
            onCardClick={item => navigate(`/games/${item.id}`)}
            viewAllPath="/games"
            navigate={navigate}
          />
        </>
      )}
    </div>
  )
}
