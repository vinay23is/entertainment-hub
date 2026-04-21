import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { IMG_URL } from "../api"

const API_KEY = "0841d635c10f90f92d5823d412c990b3"
const BASE = "https://api.themoviedb.org/3"

const CONFIG = {
  movies: {
    label: "Movies",
    emoji: "🎬",
    type: "movie",
    tabs: [
      { label: "Trending", url: `${BASE}/trending/movie/week?api_key=${API_KEY}` },
      { label: "Top Rated", url: `${BASE}/movie/top_rated?api_key=${API_KEY}` },
      { label: "Now Playing", url: `${BASE}/movie/now_playing?api_key=${API_KEY}` },
      { label: "Upcoming", url: `${BASE}/movie/upcoming?api_key=${API_KEY}` },
    ],
  },
  tv: {
    label: "TV Shows",
    emoji: "📺",
    type: "tv",
    tabs: [
      { label: "Trending", url: `${BASE}/trending/tv/week?api_key=${API_KEY}` },
      { label: "Top Rated", url: `${BASE}/tv/top_rated?api_key=${API_KEY}` },
      { label: "On The Air", url: `${BASE}/tv/on_the_air?api_key=${API_KEY}` },
      { label: "Popular", url: `${BASE}/tv/popular?api_key=${API_KEY}` },
    ],
  },
}

export default function Browse() {
  const { category } = useParams() // "movies" or "tv"
  const config = CONFIG[category]
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [items, setItems] = useState([])
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!config) return
    setLoading(true)
    setItems([])
    fetch(config.tabs[activeTab].url)
      .then(r => r.json())
      .then(d => setItems(d.results || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [config, activeTab])

  async function handleSearch(e) {
    const value = e.target.value
    setQuery(value)
    if (value.length < 2) {
      setSearchResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    const mediaType = config.type
    const res = await fetch(
      `${BASE}/search/${mediaType}?api_key=${API_KEY}&query=${encodeURIComponent(value)}`
    )
    const data = await res.json()
    setSearchResults(data.results || [])
  }

  if (!config) {
    navigate("/")
    return null
  }

  const displayItems = searching ? searchResults : items

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-16 px-4">
        <h2 className="text-5xl font-bold mb-4">
          {config.emoji} {config.label}
        </h2>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder={`Search ${config.label.toLowerCase()}...`}
          className="w-full max-w-xl px-6 py-3 rounded-full bg-gray-800 text-white outline-none border border-gray-700 focus:border-yellow-400"
        />
      </div>

      {/* Tabs */}
      {!searching && (
        <div className="px-8 mb-6 flex gap-2 flex-wrap">
          {config.tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => { setActiveTab(i); setQuery("") }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeTab === i
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="px-8 mb-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl h-64 skeleton" />
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <p className="text-gray-400">{searching ? "No results found." : "Nothing to show."}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayItems.map(item => {
              const title = item.title || item.name
              const year = (item.release_date || item.first_air_date)?.split("-")[0]
              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/${config.type}/${item.id}`)}
                  className="relative rounded-xl overflow-hidden cursor-pointer group h-64 bg-gray-800"
                >
                  {item.poster_path ? (
                    <img
                      src={IMG_URL + item.poster_path}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-5xl">
                      {config.emoji}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="absolute top-3 right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-base">+</div>
                    <h3 className="font-bold text-white text-sm leading-tight">{title}</h3>
                    <p className="text-gray-300 text-xs mt-0.5">{year}</p>
                    {item.vote_average > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-white text-xs font-bold">{item.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
