import { type FormEvent, useState } from "react"
import type { WorkItem } from "../types"
import client from "../api/client"

interface Props {
  workItem: WorkItem
  onClose: () => void
  onSuccess: (updated: WorkItem) => void
}

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  CREATED: ["IN_PROGRESS"],
  IN_PROGRESS: ["IN_REVIEW", "REWORK"],
  IN_REVIEW: ["COMPLETED", "REWORK"],
  REWORK: ["IN_PROGRESS", "IN_REVIEW"],
  COMPLETED: [],
}

export function StateTransitionModal({ workItem, onClose, onSuccess }: Props) {
  const [selectedState, setSelectedState] = useState<string>("")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const allowedStates = ALLOWED_TRANSITIONS[workItem.currentState] || []

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedState) {
      setError("Please select a state")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await client.post<WorkItem>(`/work-items/${workItem.id}/transition`, {
        newState: selectedState,
        reason: reason || undefined,
      })
      onSuccess(response.data)
    } catch (err) {
      setError((err as any)?.response?.data?.message || "Failed to transition state")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Change State</h2>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="">Select state...</option>
              {allowedStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Reason (optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-400"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update State"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
