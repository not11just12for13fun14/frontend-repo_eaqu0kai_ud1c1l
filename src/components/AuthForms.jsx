import { useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function AuthForms({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const body = mode === 'login' ? { email, password } : { name, email, password }
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Request failed')

      if (mode === 'login') {
        localStorage.setItem('token', data.access_token)
        const meRes = await fetch(`${baseUrl}/me`, { headers: { Authorization: `Bearer ${data.access_token}` } })
        const me = await meRes.json()
        onAuth({ token: data.access_token, user: me })
      } else {
        // After registration, auto-login
        const loginRes = await fetch(`${baseUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        const loginData = await loginRes.json()
        if (!loginRes.ok) throw new Error(loginData.detail || 'Login failed')
        localStorage.setItem('token', loginData.access_token)
        const meRes = await fetch(`${baseUrl}/me`, { headers: { Authorization: `Bearer ${loginData.access_token}` } })
        const me = await meRes.json()
        onAuth({ token: loginData.access_token, user: me })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">{mode === 'login' ? 'Log in' : 'Create an account'}</h2>
        <button onClick={switchMode} className="text-blue-300 hover:text-white text-sm">
          {mode === 'login' ? 'Need an account? Register' : 'Have an account? Log in'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'register' && (
          <div>
            <label className="block text-blue-200 text-sm mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name" />
          </div>
        )}
        <div>
          <label className="block text-blue-200 text-sm mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-blue-200 text-sm mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded transition-colors disabled:opacity-60">
          {loading ? 'Please wait...' : (mode === 'login' ? 'Log in' : 'Create account')}
        </button>
      </form>
    </div>
  )
}

export default AuthForms
