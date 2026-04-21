import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "../api"
import { GAMES, STEAM_IMG, STEAM_HERO } from "../data/games"

export default function GameDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [inWatchlist, setInWatchlist] = useState(false)

  const game = GAMES.find(g => g.id === parseInt(id))
  const watchlistId = game ? `game-${game.id}` : null

  useEffect(() => {
    if (!game) return
    const unsub = onAuthStateChanged(auth, async u => {
      setUser(u)
      if (u) {
        const inList = await isInWatchlist(u.uid, watchlistId)
        setInWatchlist(inList)
      }
    })
    return unsub
  }, [game, watchlistId])

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-gray-400 text-xl">Game not found.</p>
        <button onClick={() => navigate("/games")} className="text-yellow-400 hover:text-yellow-300">
          ← Back to Games
        </button>
      </div>
    )
  }

  function toggleWatchlist() {
    if (!user) { navigate("/auth"); return }
    if (inWatchlist) {
      setInWatchlist(false)
      removeFromWatchlist(user.uid, watchlistId).catch(() => setInWatchlist(true))
    } else {
      setInWatchlist(true)
      addToWatchlist(user.uid, {
        id: watchlistId,
        type: "game",
        title: game.title,
        poster: STEAM_IMG(game.steamId),
        rating: game.rating,
        genre: game.genre,
      }).catch(() => setInWatchlist(false))
    }
  }

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={STEAM_HERO(game.steamId)}
          alt={game.title}
          className="w-full h-full object-cover opacity-50"
          onError={e => { e.target.style.display = "none" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
      </div>

      <div className="px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="text-yellow-400 hover:text-yellow-300 mb-6 block text-lg"
        >
          ← Back
        </button>

        <div className="flex gap-8">
          <img
            src={STEAM_IMG(game.steamId)}
            alt={game.title}
            className="w-72 h-36 rounded-xl shadow-2xl object-cover flex-shrink-0"
            onError={e => { e.target.style.display = "none" }}
          />

          <div className="flex-1">
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">
              {game.genre} · {game.developer}
            </p>
            <h1 className="text-4xl font-bold text-white">{game.title}</h1>
            <p className="text-gray-500 mt-1">{game.year}</p>

            <div className="flex items-center gap-2 mt-4">
              <span className="text-yellow-400 text-3xl">★</span>
              <span className="text-white text-3xl font-bold">{game.rating}</span>
              <span className="text-gray-400 text-lg">/10</span>
            </div>

            <p className="text-gray-300 mt-4 text-lg leading-relaxed max-w-2xl">
              {game.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {game.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={toggleWatchlist}
              className={`mt-6 px-6 py-3 font-bold rounded-lg transition ${
                inWatchlist
                  ? "bg-gray-700 text-white hover:bg-red-900"
                  : "bg-yellow-400 text-black hover:bg-yellow-300"
              }`}
            >
              {inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
