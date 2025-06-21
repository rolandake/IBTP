import { useEffect, useState } from 'preact/hooks'

export function ChatHistory() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/history', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setHistory(data)
    }
    fetchHistory()
  }, [])

  if (!history.length) return <p>Aucun historique.</p>

  return (
    <div className="space-y-3 max-h-60 overflow-y-auto p-3 bg-gray-50 rounded-lg border">
      {history.map((item) => (
        <div key={item._id} className="p-2 border-b border-gray-200 last:border-none">
          <p className="font-semibold text-gray-700">Q: {item.prompt}</p>
          <p className="text-gray-800">R: {item.response}</p>
        </div>
      ))}
    </div>
  )
}
