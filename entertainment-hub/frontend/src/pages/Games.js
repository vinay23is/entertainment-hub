import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GAMES, STEAM_IMG } from "../data/games"

const GENRES = ["All", ...Array.from(new Set(GAMES.map(g => g.genre)))]

export default function Games() {
  const [genre, setGenre] = useState("All")
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const filtered = GAMES.filter(g => {
    const matchGenre = genre === "All" || g.genre === genre
    const matchQuery =
      !query ||
      g.title.toLowerCase().includes(query.toLowerCase()) ||
      g.developer.toLowerCase().includes(query.toLowerCase()) ||
      g.genre.toLowerCase().includes(query.toLowerCase())
    return matchGenre && matchQuery
  })

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-20 px-4">
        <h2 className="text-5xl font-bold mb-4">🎮 Games</h2>
        <p className="text-gray-400 text-lg mb-8">
          Discover critically acclaimed games across all genres
        </p>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search games, developers..."
          className="w-full max-w-xl px-6 py-3 rounded-full bg-gray-800 text-white outline-none border border-gray-700 focus:border-yellow-400"
        />
      </div>

      {/* Genre Filters */}
      <div className="px-8 mb-8 flex flex-wrap gap-2">
        {GENRES.map(g => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              genre === g
                ? "bg-yellow-400 text-black"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="px-8 mb-12">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No games found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(game => (
              <div
                key={game.id}
                onClick={() => navigate(`/games/${game.id}`)}
                className="relative rounded-xl overflow-hidden cursor-pointer group h-64 bg-gray-800"
              >
                <img
                  src={STEAM_IMG(game.steamId)}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={e => { e.target.style.display = "none" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="absolute top-3 right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-base">+</div>
                  <h3 className="font-bold text-white text-sm leading-tight">{game.title}</h3>
                  <p className="text-gray-300 text-xs mt-0.5">{game.genre} · {game.year}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-white text-xs font-bold">{game.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
