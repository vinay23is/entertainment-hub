import { useState } from "react"
import { auth } from "../firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  async function handleSubmit() {
    setError("")
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      navigate("/")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {isLogin ? "Login to your EntertainHub account" : "Join EntertainHub today"}
        </p>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-700 text-white outline-none border border-gray-600 focus:border-yellow-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-700 text-white outline-none border border-gray-600 focus:border-yellow-400"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </div>

        <p className="text-gray-400 text-center mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-yellow-400 hover:text-yellow-300 ml-2"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  )
}