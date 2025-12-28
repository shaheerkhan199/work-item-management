import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import client from "../api/client"
import type { WorkItem, HistoryEvent } from "../types"
import { Header } from "./Header"
import { StateTransitionModal } from "./StateTransitionModal"
import { BlockModal } from "./BlockModal"

export function WorkItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [workItem, setWorkItem] = useState<WorkItem | null>(null)
  const [history, setHistory] = useState<HistoryEvent[]>([])
  const [itemLoading, setItemLoading] = useState(true)
  const [error, setError] = useState("")
  const [showTransitionModal, setShowTransitionModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      try {
        const [itemResponse, historyResponse] = await Promise.all([
          client.get<WorkItem>(`/work-items/${id}`),
          client.get<HistoryEvent[]>(`/history/work-item/${id}`),
        ])
        setWorkItem(itemResponse.data)
        setHistory(historyResponse.data)
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || "Failed to load work item"
        setError(errorMessage)
        console.error(err)
      } finally {
        setItemLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchData()
    }
  }, [id, isAuthenticated])

  if (isLoading || itemLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!workItem) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-red-600">Work item not found</p>
          <button onClick={() => navigate("/dashboard")} className="mt-4 text-blue-600 hover:underline">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const canTransition = user && !workItem.isBlocked && (user.role === "ADMIN" || workItem.createdBy.id === user.id)
  const canBlock = user && (user.role === "ADMIN" || user.role === "OPERATOR")
  const isCompleted = workItem.currentState === "COMPLETED"

  const getStateColor = (state: string) => {
    const colors: Record<string, string> = {
      CREATED: "bg-gray-100 text-gray-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      IN_REVIEW: "bg-yellow-100 text-yellow-800",
      REWORK: "bg-red-100 text-red-800",
      COMPLETED: "bg-green-100 text-green-800",
    }
    return colors[state] || "bg-slate-100 text-slate-800"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button onClick={() => navigate("/dashboard")} className="text-blue-600 hover:underline mb-6">
          ← Back to Dashboard
        </button>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200 mb-6">{error}</div>}

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">{workItem.title}</h1>
                <p className="text-slate-600 mt-4">{workItem.description}</p>
              </div>

              {workItem.isBlocked && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 font-medium">Blocked</p>
                  <p className="text-red-700 text-sm mt-1">{workItem.blockedReason}</p>
                </div>
              )}

              <div className="flex items-center gap-4 mb-8">
                <div>
                  <p className="text-sm text-slate-600">Current State</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full font-medium mt-2 ${getStateColor(workItem.currentState)}`}
                  >
                    {workItem.currentState}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Created</p>
                  <p className="text-slate-900 font-medium mt-1">{new Date(workItem.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Actions</h3>
                <div className="flex flex-wrap gap-3">
                  {canTransition && !isCompleted && (
                    <button
                      onClick={() => setShowTransitionModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Change State
                    </button>
                  )}

                  {canBlock && (
                    <>
                      {!workItem.isBlocked ? (
                        <button
                          onClick={() => setShowBlockModal(true)}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            try {
                              const response = await client.post(`/work-items/${workItem.id}/unblock`)
                              setWorkItem(response.data)
                            } catch (err) {
                              setError("Failed to unblock work item")
                            }
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                        >
                          Unblock
                        </button>
                      )}
                    </>
                  )}

                  {isCompleted && <p className="text-green-600 font-medium">This work item is completed</p>}
                </div>
              </div>
            </div>
          </div>

          {/* History Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">History</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-slate-600 text-sm">No history yet</p>
                ) : (
                  history.map((event) => (
                    <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="text-sm font-medium text-slate-900">{event.eventType.replace(/_/g, " ")}</p>
                      <p className="text-xs text-slate-600 mt-1">By {event.performedBy.firstName}</p>
                      <p className="text-xs text-slate-500 mt-1">{new Date(event.createdAt).toLocaleString()}</p>
                      {event.details && <p className="text-xs text-slate-600 mt-2 italic">{event.details}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTransitionModal && workItem && (
        <StateTransitionModal
          workItem={workItem}
          onClose={() => setShowTransitionModal(false)}
          onSuccess={(updated) => {
            setWorkItem(updated)
            setShowTransitionModal(false)
          }}
        />
      )}

      {showBlockModal && workItem && (
        <BlockModal
          workItem={workItem}
          onClose={() => setShowBlockModal(false)}
          onSuccess={(updated) => {
            setWorkItem(updated)
            setShowBlockModal(false)
          }}
        />
      )}
    </div>
  )
}
