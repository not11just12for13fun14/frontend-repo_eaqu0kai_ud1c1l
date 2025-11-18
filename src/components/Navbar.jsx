import { useEffect } from 'react'

function Navbar({ user, onLogout }) {
  useEffect(() => {}, [user])
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <img src="/flame-icon.svg" alt="Logo" className="w-8 h-8" />
        <span className="text-white font-semibold">Flames Blue</span>
      </div>
      <div className="text-sm text-blue-200">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">{user.name || user.email}</span>
            <button onClick={onLogout} className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white">Logout</button>
          </div>
        ) : (
          <span>Welcome</span>
        )}
      </div>
    </div>
  )
}

export default Navbar
