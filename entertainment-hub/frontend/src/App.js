import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { auth } from "./firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import Home from "./pages/Home"
import Detail from "./pages/Detail"
import Auth from "./pages/Auth"
import Music from "./pages/Music"
import MusicDetail from "./pages/MusicDetail"
import Games from "./pages/Games"
import GameDetail from "./pages/GameDetail"
import Watchlist from "./pages/Watchlist"
import Browse from "./pages/Browse"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)

  useEffect(() => {
    return onAuthStateChanged(auth, setUser)
  }, [])

  function navClass(path) {
    const active = location.pathname === path || location.pathname.startsWith(path + "/")
    return `transition-colors font-medium ${
      active ? "text-yellow-400" : "text-white hover:text-yellow-400"
    }`
  }

  const homeActive = location.pathname === "/" || location.pathname.startsWith("/browse/")

  return (
    <nav className="bg-gray-950/80 backdrop-blur-md px-8 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-white/10">
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-black text-yellow-400 cursor-pointer select-none tracking-tight"
      >
        EntertainHub
      </h1>

      <div className="flex gap-8">
        <button
          onClick={() => navigate("/")}
          className={`transition-colors font-medium ${homeActive ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}
        >
          Movies
        </button>
        <button onClick={() => navigate("/music")} className={navClass("/music")}>
          Music
        </button>
        <button onClick={() => navigate("/games")} className={navClass("/games")}>
          Games
        </button>
        {user && (
          <button onClick={() => navigate("/watchlist")} className={navClass("/watchlist")}>
            Watchlist
          </button>
        )}
      </div>

      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <span className="text-gray-400 text-sm max-w-40 truncate">{user.email}</span>
            <button
              onClick={() => signOut(auth)}
              className="px-4 py-2 text-white hover:text-yellow-400 transition-colors font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 text-white hover:text-yellow-400 transition-colors font-medium"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-950 min-h-screen text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse/:category" element={<Browse />} />
          <Route path="/music" element={<Music />} />
          <Route path="/music/:id" element={<MusicDetail />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:id" element={<GameDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/:type/:id" element={<Detail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
