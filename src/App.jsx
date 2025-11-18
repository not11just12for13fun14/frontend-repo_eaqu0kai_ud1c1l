import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import AuthForms from './components/AuthForms'
import UploadPanel from './components/UploadPanel'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const load = async () => {
      if (token) {
        try {
          const res = await fetch(`${baseUrl}/me`, { headers: { Authorization: `Bearer ${token}` } })
          if (res.ok) {
            const user = await res.json()
            setSession({ token, user })
          }
        } catch {}
      }
    }
    load()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setSession(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative min-h-screen flex flex-col p-6">
        <Navbar user={session?.user} onLogout={handleLogout} />

        <div className="flex-1 grid md:grid-cols-2 gap-6 items-start max-w-5xl w-full mx-auto mt-10">
          {!session ? (
            <div className="md:col-span-2">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome</h1>
                <p className="text-blue-200">Create an account, log in, and upload files securely.</p>
              </div>
              <AuthForms onAuth={setSession} />
            </div>
          ) : (
            <>
              <div className="md:col-span-2 text-center">
                <h2 className="text-2xl text-white">Hello, {session.user.name || session.user.email}</h2>
                <p className="text-blue-300/70">You can upload files below and see your list.</p>
              </div>
              <div className="md:col-span-2">
                <UploadPanel token={session.token} />
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-blue-300/60">Built with authentication and uploads</p>
        </div>
      </div>
    </div>
  )
}

export default App
