import { db } from "./firebase"
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore"

const API_KEY = "0841d635c10f90f92d5823d412c990b3"
const BASE_URL = "https://api.themoviedb.org/3"
export const IMG_URL = "https://image.tmdb.org/t/p/w500"

export async function getTrendingMovies() {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
  const data = await res.json()
  return data.results
}

export async function getTrendingShows() {
  const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`)
  const data = await res.json()
  return data.results
}

// Music — iTunes RSS + Search API (no key required)
export async function getTopAlbums() {
  const res = await fetch("https://itunes.apple.com/us/rss/topalbums/limit=20/json")
  const data = await res.json()
  return (data.feed?.entry || []).map((e, i) => ({
    id: e.id.attributes["im:id"],
    title: e["im:name"].label,
    artist: e["im:artist"].label,
    image: e["im:image"]?.[2]?.label?.replace("170x170bb", "600x600bb") || "",
    genre: e.category?.attributes?.label || "Music",
    rank: i + 1,
    link: e.link?.attributes?.href || "",
  }))
}

export async function searchMusic(query) {
  const res = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=album&limit=20`
  )
  const data = await res.json()
  return (data.results || []).map(r => ({
    id: String(r.collectionId),
    title: r.collectionName,
    artist: r.artistName,
    image: r.artworkUrl100?.replace("100x100bb", "600x600bb") || "",
    genre: r.primaryGenreName,
    tracks: r.trackCount,
  }))
}

export async function getAlbumTracks(albumId) {
  const res = await fetch(
    `https://itunes.apple.com/lookup?id=${albumId}&entity=song&limit=50`
  )
  const data = await res.json()
  const results = data.results || []
  const albumInfo = results.find(r => r.wrapperType === "collection") || null
  const tracks = results.filter(r => r.wrapperType === "track")
  return { albumInfo, tracks }
}

// Watchlist — Firestore
export async function addToWatchlist(userId, item) {
  const ref = doc(db, "watchlists", userId, "items", String(item.id))
  await setDoc(ref, { ...item, addedAt: new Date().toISOString() })
}

export async function removeFromWatchlist(userId, itemId) {
  const ref = doc(db, "watchlists", userId, "items", String(itemId))
  await deleteDoc(ref)
}

export async function getWatchlist(userId) {
  const ref = collection(db, "watchlists", userId, "items")
  const snap = await getDocs(ref)
  return snap.docs.map(d => d.data())
}

export async function isInWatchlist(userId, itemId) {
  const ref = doc(db, "watchlists", userId, "items", String(itemId))
  const snap = await getDoc(ref)
  return snap.exists()
}
