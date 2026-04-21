import { useEffect, useState } from "react"
import { auth } from "../firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom"

const BG_URL = "https://image.tmdb.org/t/p/original"
const API_KEY = "0841d635c10f90f92d5823d412c990b3"

function MailIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function InputField({ type, placeholder, value, onChange, icon }) {
  const [focused, setFocused] = useState(false)
  return (
    <div className="relative">
      <span
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
        style={{ color: focused ? "#facc15" : "#6b7280" }}
      >
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/70 text-white outline-none border transition-all duration-200 placeholder-gray-500"
        style={{
          borderColor: focused ? "#facc15" : "#374151",
          boxShadow: focused ? "0 0 0 3px rgba(250,204,21,0.18)" : "none",
        }}
      />
    </div>
  )
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [backdrop, setBackdrop] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
      .then(r => r.json())
      .then(d => {
        const pick = d.results?.find(m => m.backdrop_path)
        if (pick) setBackdrop(BG_URL + pick.backdrop_path)
      })
      .catch(() => {})
  }, [])

  async function handleGoogle() {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      navigate("/")
    } catch (err) {
      const messages = {
        "auth/operation-not-allowed": "Google sign-in is not enabled. Go to Firebase Console → Authentication → Sign-in methods → Google → Enable.",
        "auth/popup-blocked": "Popup was blocked by your browser. Please allow popups for this site and try again.",
        "auth/popup-closed-by-user": "Sign-in cancelled.",
        "auth/cancelled-popup-request": "Sign-in cancelled.",
      }
      setError(messages[err.code] || err.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      navigate("/")
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(auth.*?\)\.?/, "").trim())
    }
  }

  return (
    <div className="min-h-screen flex animate-fade-in">

      {/* ── LEFT: Cinematic panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden border-l-4 border-yellow-400">
        {/* Backdrop image */}
        {backdrop ? (
          <img src={backdrop} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gray-900" />
        )}

        {/* Lighter overlay — brighter image */}
        <div className="absolute inset-0 bg-gray-950/40" />

        {/* Content */}
        <div className="relative z-10 text-center px-14">
          <h1 className="text-7xl font-black text-yellow-400 tracking-tight drop-shadow-lg mb-5">
            EntertainHub
          </h1>
          <p className="text-gray-100 text-xl leading-relaxed mb-8">
            Discover, save, and explore<br />
            <span className="text-yellow-400 font-semibold">Movies, Music & Games</span>
          </p>

          {/* Divider */}
          <div className="h-px mx-10 mb-8" style={{ background: "linear-gradient(90deg, transparent, rgba(250,204,21,0.5), transparent)" }} />

          {/* Category pills */}
          <div className="flex justify-center gap-3">
            {[["🎬", "Movies"], ["🎵", "Music"], ["🎮", "Games"]].map(([icon, label]) => (
              <span
                key={label}
                className="px-4 py-2 rounded-full text-sm text-gray-300 cursor-default transition-all duration-200 hover:bg-yellow-400/20 hover:text-yellow-400 border border-transparent hover:border-yellow-400/30"
              >
                {icon} {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form panel ── */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center px-8 border-t-4 border-yellow-400"
        style={{ background: "linear-gradient(160deg, #0a0a1a 0%, #0e0e22 50%, #111128 100%)" }}
      >
        <div className="w-full max-w-sm">

          {/* Mobile-only logo */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-3xl font-black text-yellow-400">EntertainHub</h1>
          </div>

          <h2 className="text-3xl font-black text-white mb-1">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            {isLogin ? "Sign in to continue to EntertainHub" : "Join EntertainHub — it's free"}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm leading-snug">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<MailIcon />}
            />

            <div className="flex flex-col gap-1">
              <InputField
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<LockIcon />}
              />
              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-gray-400 hover:text-yellow-400 transition-colors py-1"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-shine w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-all duration-200 mt-1"
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 18px 4px rgba(250,204,21,0.35)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-gray-700/80" />
            <span className="text-gray-500 text-xs tracking-wide">or continue with</span>
            <div className="flex-1 h-px bg-gray-700/80" />
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full py-3 bg-white/5 text-gray-200 font-medium rounded-lg border border-gray-700 hover:bg-white/10 hover:border-gray-500 transition-all duration-200 flex items-center justify-center gap-3 text-sm"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="text-gray-500 text-center mt-8 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError("") }}
              className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
