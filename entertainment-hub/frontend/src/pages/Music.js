import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getTopAlbums, searchMusic } from "../api"

function AlbumCard({ album, rank, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
    >
      {album.image ? (
        <img src={album.image} alt={album.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="bg-gray-700 h-48 flex items-center justify-center text-5xl">🎵</div>
      )}
      <div className="p-3">
        {rank && <span className="text-xs text-yellow-400 font-bold">#{rank}</span>}
        <h3 className="font-semibold text-white truncate mt-0.5">{album.title}</h3>
        <p className="text-gray-400 text-sm truncate">{album.artist}</p>
        <p className="text-gray-500 text-xs mt-1">{album.genre}</p>
      </div>
    </div>
  )
}

export default function Music() {
  const [topAlbums, setTopAlbums] = useState([])
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getTopAlbums()
      .then(setTopAlbums)
      .catch(() => {})
      .finally(() => setLoading(false))
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
    const results = await searchMusic(value)
    setSearchResults(results)
  }

  const displayAlbums = searching ? searchResults : topAlbums

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-20 px-4">
        <h2 className="text-5xl font-bold mb-4">🎵 Music</h2>
        <p className="text-gray-400 text-lg mb-8">Discover top albums and explore tracks</p>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search artists, albums..."
          className="w-full max-w-xl px-6 py-3 rounded-full bg-gray-800 text-white outline-none border border-gray-700 focus:border-yellow-400"
        />
      </div>

      <div className="px-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">
          {searching ? "🔍 Search Results" : "🔥 Top Albums on iTunes"}
        </h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : displayAlbums.length === 0 ? (
          <p className="text-gray-400">
            {searching ? "No results found." : "Could not load albums."}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                rank={!searching ? album.rank : null}
                onClick={() =>
                  navigate(`/music/${album.id}`, { state: { album } })
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
