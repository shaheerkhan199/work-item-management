import { type FormEvent, useState } from "react"
import type { WorkItem } from "../types"
import client from "../api/client"

interface Props {
  workItem: WorkItem
  onClose: () => void
  onSuccess: (updated: WorkItem) => void
}

export function BlockModal({ workItem, onClose, onSuccess }: Props) {
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError("Please provide a reason for blocking")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await client.post<WorkItem>(`/work-items/${workItem.id}/block`, {
        reason,
      })
      onSuccess(response.data)
    } catch (err) {
      setError((err as any)?.response?.data?.message || "Failed to block work item")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Block Work Item</h2>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Blocking</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              rows={4}
              placeholder="Explain why this work item is being blocked..."
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
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium disabled:bg-yellow-400"
              disabled={isLoading}
            >
              {isLoading ? "Blocking..." : "Block"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
