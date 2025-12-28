"use client"

import { type FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import client from "../api/client"
import { Header } from "./Header"

export function CreateWorkItem() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  if (isLoading || !isAuthenticated) {
    if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    navigate("/login")
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError("Title is required")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await client.post("/work-items", {
        title,
        description,
      })
      navigate(`/work-items/${response.data.id}`)
    } catch (err) {
      setError((err as any)?.response?.data?.message || "Failed to create work item")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button onClick={() => navigate("/dashboard")} className="text-blue-600 hover:underline mb-6">
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Create Work Item</h1>

          {error && <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200 mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter work item title"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
                placeholder="Enter work item description"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Work Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
