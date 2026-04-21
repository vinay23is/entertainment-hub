import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"
import { getWatchlist, removeFromWatchlist } from "../api"

function typeIcon(type) {
  if (type === "game") return "🎮"
  if (type === "music") return "🎵"
  return "🎬"
}

function itemPath(item) {
  if (item.type === "game") return `/games/${item.id.replace("game-", "")}`
  return `/${item.type}/${item.id}`
}

export default function Watchlist() {
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      setUser(u)
      if (u) {
        const list = await getWatchlist(u.uid)
        setItems(list.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)))
      }
      setLoading(false)
    })
    return unsub
  }, [])

  function handleRemove(e, item) {
    e.stopPropagation()
    if (!user) return
    // Optimistic: remove from UI immediately, revert if Firestore fails
    setItems(prev => prev.filter(i => i.id !== item.id))
    removeFromWatchlist(user.uid, String(item.id)).catch(() => {
      setItems(prev => [...prev, item].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)))
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400 text-xl">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-gray-400 text-xl">Sign in to see your watchlist.</p>
        <button
          onClick={() => navigate("/auth")}
          className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="px-8 py-8">
      <h1 className="text-4xl font-bold mb-1">My Watchlist</h1>
      <p className="text-gray-400 mb-8">
        {items.length} {items.length === 1 ? "item" : "items"}
      </p>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl mb-4">Your watchlist is empty.</p>
          <button onClick={() => navigate("/")} className="text-yellow-400 hover:text-yellow-300">
            Browse content →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-xl overflow-hidden transition-transform hover:scale-105 cursor-pointer relative"
            >
              <div onClick={() => navigate(itemPath(item))}>
                {item.poster ? (
                  <img src={item.poster} alt={item.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="bg-gray-700 h-48 flex items-center justify-center text-5xl">
                    {typeIcon(item.type)}
                  </div>
                )}
              </div>

              {/* Remove button — always visible */}
              <button
                onClick={e => handleRemove(e, item)}
                className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition text-xs font-bold"
                title="Remove from watchlist"
              >
                ✕
              </button>

              <div onClick={() => navigate(itemPath(item))} className="p-3">
                <p className="text-xs text-gray-500 capitalize mb-0.5">
                  {typeIcon(item.type)} {item.type}
                </p>
                <h3 className="font-semibold text-white truncate">{item.title}</h3>
                {item.genre && (
                  <p className="text-gray-400 text-sm truncate">{item.genre}</p>
                )}
                {item.rating != null && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-bold">{item.rating}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
