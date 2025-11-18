import { useEffect, useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function UploadPanel({ token }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchUploads = async () => {
    try {
      const res = await fetch(`${baseUrl}/uploads`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to load uploads')
      setFiles(data)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    if (token) fetchUploads()
  }, [token])

  const onSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${baseUrl}/uploads`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Upload failed')
      await fetchUploads()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">Your uploads</h2>
        <label className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
          <input type="file" className="hidden" onChange={onSelect} disabled={loading} />
          {loading ? 'Uploading...' : 'Upload file'}
        </label>
      </div>
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      {files.length === 0 ? (
        <p className="text-blue-200/80 text-sm">No files yet. Upload your first file.</p>
      ) : (
        <ul className="divide-y divide-slate-700/60">
          {files.map((f) => (
            <li key={f.id} className="py-2 flex items-center justify-between">
              <div>
                <p className="text-white text-sm">{f.filename}</p>
                <p className="text-blue-300/70 text-xs">{f.content_type || 'file'} • {typeof f.size === 'number' ? `${(f.size/1024).toFixed(1)} KB` : ''}</p>
              </div>
              <span className="text-blue-300/60 text-xs">{new Date(f.created_at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UploadPanel
