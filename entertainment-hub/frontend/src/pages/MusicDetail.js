import { useEffect, useState } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { getAlbumTracks } from "../api"

function formatMs(ms) {
  if (!ms) return ""
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

export default function MusicDetail() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [album, setAlbum] = useState(state?.album || null)
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    let audio = null
    return () => {
      if (audio) audio.pause()
    }
  }, [])

  useEffect(() => {
    getAlbumTracks(id)
      .then(({ albumInfo, tracks: t }) => {
        if (albumInfo) {
          setAlbum(prev => prev || {
            id: String(albumInfo.collectionId),
            title: albumInfo.collectionName,
            artist: albumInfo.artistName,
            image: albumInfo.artworkUrl100?.replace("100x100bb", "600x600bb"),
            genre: albumInfo.primaryGenreName,
            tracks: albumInfo.trackCount,
          })
        }
        setTracks(t.sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0)))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  function playPreview(url) {
    if (preview?.url === url) {
      preview.audio.pause()
      setPreview(null)
      return
    }
    if (preview) preview.audio.pause()
    const audio = new Audio(url)
    audio.play()
    audio.onended = () => setPreview(null)
    setPreview({ url, audio })
  }

  if (!album && loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400 text-xl">Loading...</p>
      </div>
    )
  }

  if (!album && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-gray-400 text-xl">Album not found.</p>
        <button onClick={() => navigate(-1)} className="text-yellow-400 hover:text-yellow-300">← Back</button>
      </div>
    )
  }

  const totalMs = tracks.reduce((sum, t) => sum + (t.trackTimeMillis || 0), 0)

  return (
    <div className="min-h-screen px-8 py-8">
      <button onClick={() => navigate(-1)} className="text-yellow-400 hover:text-yellow-300 mb-6 block text-lg">
        ← Back
      </button>

      {album && (
        <div className="flex gap-8 mb-10">
          {album.image ? (
            <img
              src={album.image}
              alt={album.title}
              className="w-52 h-52 rounded-xl shadow-2xl object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-52 h-52 bg-gray-800 rounded-xl flex items-center justify-center text-6xl flex-shrink-0">🎵</div>
          )}
          <div className="flex flex-col justify-center">
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Album • {album.genre}</p>
            <h1 className="text-4xl font-bold text-white mb-2">{album.title}</h1>
            <p className="text-xl text-gray-300 mb-1">{album.artist}</p>
            <p className="text-gray-500 text-sm">
              {tracks.length > 0 ? `${tracks.length} tracks` : album.tracks ? `${album.tracks} tracks` : ""}
              {totalMs > 0 && ` · ${formatMs(totalMs)}`}
            </p>
          </div>
        </div>
      )}

      {loading && <p className="text-gray-400 mb-6">Loading tracks...</p>}

      {tracks.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-300">Tracks</h2>
          <div className="space-y-0.5 max-w-3xl">
            {tracks.map((track, i) => {
              const isPlaying = preview?.url === track.previewUrl
              return (
                <div
                  key={track.trackId}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition group ${isPlaying ? "bg-gray-700" : "hover:bg-gray-800"}`}
                >
                  <span className="text-gray-500 w-6 text-right text-sm select-none">
                    {isPlaying ? "▶" : i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${isPlaying ? "text-yellow-400" : "text-white"}`}>
                      {track.trackName}
                    </p>
                  </div>
                  <span className="text-gray-400 text-sm flex-shrink-0">
                    {formatMs(track.trackTimeMillis)}
                  </span>
                  {track.previewUrl && (
                    <button
                      onClick={() => playPreview(track.previewUrl)}
                      className={`text-xs px-2 py-1 rounded flex-shrink-0 transition ${isPlaying ? "bg-yellow-400 text-black" : "bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-gray-600"}`}
                    >
                      {isPlaying ? "■ Stop" : "▶ Preview"}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
