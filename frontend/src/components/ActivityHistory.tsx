import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { historyAPI } from "../api/history"
import type { HistoryEvent } from "../types"
import { Header } from "./Header"

export function ActivityHistory() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [history, setHistory] = useState<HistoryEvent[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [error, setError] = useState("")
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        let data: HistoryEvent[]
        if (user?.role === "ADMIN" && showAll) {
          data = await historyAPI.getAllHistory(100)
        } else {
          data = await historyAPI.getUserActivity(50)
        }
        setHistory(data)
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || "Failed to load activity history"
        setError(errorMessage)
        console.error(err)
      } finally {
        setIsLoadingHistory(false)
      }
    }

    if (isAuthenticated) {
      fetchHistory()
    }
  }, [isAuthenticated, user, showAll])

  if (isLoading || isLoadingHistory) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      </div>
    )
  }

  const getEventTypeColor = (eventType: string) => {
    const colors: Record<string, string> = {
      CREATED: "bg-green-100 text-green-800",
      STATE_CHANGED: "bg-blue-100 text-blue-800",
      BLOCKED: "bg-red-100 text-red-800",
      UNBLOCKED: "bg-yellow-100 text-yellow-800",
      REWORK_INITIATED: "bg-orange-100 text-orange-800",
      UPDATED: "bg-purple-100 text-purple-800",
    }
    return colors[eventType] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Activity History</h2>
            <p className="text-slate-600 mt-2">
              {showAll ? "All system activity" : "Your activity history"}
            </p>
          </div>
          <div className="flex gap-4">
            {user?.role === "ADMIN" && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                {showAll ? "Show My Activity" : "Show All Activity"}
              </button>
            )}
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200 mb-6">{error}</div>}

        {history.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-slate-600">No activity history found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((event) => (
              <div
                key={event.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(
                          event.eventType,
                        )}`}
                      >
                        {event.eventType.replace(/_/g, " ")}
                      </span>
                      {event.previousState && event.newState && (
                        <span className="text-sm text-slate-600">
                          {event.previousState} → {event.newState}
                        </span>
                      )}
                    </div>
                    {event.details && (
                      <p className="text-slate-700 mt-2 text-sm">{event.details}</p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                      <span>By: {event.performedBy.firstName} {event.performedBy.lastName}</span>
                      <span>•</span>
                      <span>{new Date(event.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {event.workItem && (
                      <span className="text-xs text-slate-500">{event.workItem.title}</span>
                    )}
                    <button
                      onClick={() => navigate(`/work-items/${event.workItemId}`)}
                      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View Work Item
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

