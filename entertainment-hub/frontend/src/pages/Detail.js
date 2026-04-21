import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"
import { addToWatchlist, removeFromWatchlist, isInWatchlist, IMG_URL } from "../api"

const API_KEY = "0841d635c10f90f92d5823d412c990b3"
const BG_URL = "https://image.tmdb.org/t/p/original"

function SkeletonDetail() {
  return (
    <div className="min-h-screen">
      <div className="relative h-screen bg-gray-900 animate-pulse flex items-end px-12 pb-16">
        <div className="flex gap-8 items-end w-full max-w-4xl">
          <div className="w-44 h-64 bg-gray-700 rounded-xl flex-shrink-0 hidden md:block" style={{ marginBottom: "-2rem" }} />
          <div className="flex-1 space-y-4 pb-8">
            <div className="h-3 w-28 bg-gray-700 rounded" />
            <div className="h-14 w-96 bg-gray-700 rounded" />
            <div className="h-3 w-40 bg-gray-700 rounded" />
            <div className="h-3 w-full bg-gray-700 rounded" />
            <div className="h-3 w-3/4 bg-gray-700 rounded" />
            <div className="h-12 w-40 bg-gray-700 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

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
    setItem(null)
    setCast([])

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

  if (!item) return <SkeletonDetail />

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
  const genres = item.genres?.map(g => g.name).join(" · ")

  return (
    <div className="min-h-screen animate-fade-in">
      {/* ── Full-viewport backdrop with overlaid info ── */}
      <div className="relative min-h-screen flex items-end">
        {item.backdrop_path ? (
          <img
            src={BG_URL + item.backdrop_path}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-800" />
        )}

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-950/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 z-10 flex items-center gap-2 text-white hover:text-yellow-400 transition-colors font-medium text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          ← Back
        </button>

        {/* Info block at bottom of backdrop */}
        <div className="relative z-10 w-full px-8 md:px-12 pb-12 flex gap-8 items-end">
          {/* Poster — overlaps into content area */}
          {item.poster_path && (
            <img
              src={IMG_URL + item.poster_path}
              alt={title}
              className="w-44 rounded-xl shadow-2xl object-cover flex-shrink-0 hidden md:block"
              style={{ marginBottom: "-3rem" }}
            />
          )}

          <div className="flex-1 pb-2">
            {genres && (
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-3">{genres}</p>
            )}
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-4 drop-shadow-lg">
              {title}
            </h1>
            <div className="flex items-center gap-4 mb-5 flex-wrap">
              <span className="text-yellow-400 font-bold text-xl">
                ★ {item.vote_average?.toFixed(1)}
              </span>
              {year && <span className="text-gray-300">{year}</span>}
              <span className="text-gray-500 text-sm">
                {item.vote_count?.toLocaleString()} votes
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-2xl mb-6 line-clamp-3">
              {item.overview || "No overview available."}
            </p>
            <button
              onClick={toggleWatchlist}
              className={`px-7 py-3 font-bold rounded-lg transition-colors shadow-lg ${
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

      {/* ── Cast ── */}
      {cast.length > 0 && (
        <div className="px-8 md:px-12 pt-16 pb-16 animate-fade-in">
          <h2 className="text-2xl font-bold mb-8">Cast</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-5">
            {cast.map(c => (
              <div key={c.id} className="text-center group">
                <div className="overflow-hidden rounded-xl mb-2">
                  {c.profile_path ? (
                    <img
                      src={IMG_URL + c.profile_path}
                      alt={c.name}
                      className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center text-3xl">
                      👤
                    </div>
                  )}
                </div>
                <p className="text-white text-xs font-semibold truncate">{c.name}</p>
                <p className="text-gray-400 text-xs truncate">{c.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
