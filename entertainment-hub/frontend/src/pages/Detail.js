import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"
import { addToWatchlist, removeFromWatchlist, isInWatchlist, IMG_URL } from "../api"

const API_KEY = "0841d635c10f90f92d5823d412c990b3"
const BG_URL = "https://image.tmdb.org/t/p/original"

export default function Detail() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [cast, setCast] = useState([])
  const [user, setUser] = useState(null)
  const [inWatchlist, setInWatchlist] = useState(false)

  useEffect(() => {
    if (!type || !id) return
    window.scrollTo(0, 0)

    fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`)
      .then(r => r.json())
      .then(setItem)

    fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${API_KEY}`)
      .then(r => r.json())
      .then(d => setCast(d.cast?.slice(0, 8) || []))
  }, [type, id])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      setUser(u)
      if (u && id) {
        const inList = await isInWatchlist(u.uid, `${type}-${id}`)
        setInWatchlist(inList)
      }
    })
    return unsub
  }, [type, id])

  function toggleWatchlist() {
    if (!user) { navigate("/auth"); return }
    if (!item) return
    const watchlistId = `${type}-${id}`
    if (inWatchlist) {
      setInWatchlist(false)
      removeFromWatchlist(user.uid, watchlistId).catch(() => setInWatchlist(true))
    } else {
      setInWatchlist(true)
      addToWatchlist(user.uid, {
        id: watchlistId,
        type,
        title: item.title || item.name,
        poster: item.poster_path ? IMG_URL + item.poster_path : null,
        rating: item.vote_average?.toFixed(1),
        genre: item.genres?.[0]?.name || null,
      }).catch(() => setInWatchlist(false))
    }
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400 text-xl">Loading...</p>
      </div>
    )
  }

  if (item.success === false) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-gray-400 text-xl">Could not load this item.</p>
        <button onClick={() => navigate("/")} className="text-yellow-400 hover:text-yellow-300">
          ← Go Home
        </button>
      </div>
    )
  }

  const title = item.title || item.name
  const year = (item.release_date || item.first_air_date)?.split("-")[0]
  const genres = item.genres?.map(g => g.name).join(", ")

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-72 overflow-hidden">
        {item.backdrop_path ? (
          <img
            src={BG_URL + item.backdrop_path}
            alt={title}
            className="w-full h-full object-cover opacity-50"
          />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <button onClick={() => navigate(-1)} className="text-yellow-400 hover:text-yellow-300 mb-6 block text-lg">
          ← Back
        </button>

        <div className="flex gap-8">
          {item.poster_path ? (
            <img
              src={IMG_URL + item.poster_path}
              alt={title}
              className="w-48 h-72 rounded-xl shadow-2xl object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-48 h-72 bg-gray-800 rounded-xl flex items-center justify-center text-5xl flex-shrink-0">
              🎬
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 mt-2 text-lg">{year} · {genres}</p>

            <div className="flex items-center gap-2 mt-4">
              <span className="text-yellow-400 text-3xl">★</span>
              <span className="text-white text-3xl font-bold">{item.vote_average?.toFixed(1)}</span>
              <span className="text-gray-400 text-lg">/10</span>
              <span className="text-gray-500 text-sm ml-2">({item.vote_count?.toLocaleString()} votes)</span>
            </div>

            <p className="text-gray-300 mt-4 text-lg leading-relaxed max-w-2xl">
              {item.overview || "No overview available."}
            </p>

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

        {cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">🎭 Cast</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {cast.map(c => (
                <div key={c.id} className="text-center">
                  {c.profile_path ? (
                    <img
                      src={IMG_URL + c.profile_path}
                      alt={c.name}
                      className="w-full h-32 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="bg-gray-700 h-32 rounded-xl flex items-center justify-center text-3xl">
                      👤
                    </div>
                  )}
                  <p className="text-white text-sm mt-2 truncate">{c.name}</p>
                  <p className="text-gray-400 text-xs truncate">{c.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
