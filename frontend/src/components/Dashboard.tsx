"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import client from "../api/client"
import type { WorkItem } from "../types"
import { Header } from "./Header"

export function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth()
  const [workItems, setWorkItems] = useState<WorkItem[]>([])
  const [isLoadingItems, setIsLoadingItems] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    const fetchWorkItems = async () => {
      try {
        const response = await client.get<WorkItem[]>("/work-items")
        setWorkItems(response.data)
      } catch (err) {
        setError("Failed to load work items")
        console.error(err)
      } finally {
        setIsLoadingItems(false)
      }
    }

    if (isAuthenticated) {
      fetchWorkItems()
    }
  }, [isAuthenticated])

  if (isLoading || isLoadingItems) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Work Items</h2>
            <p className="text-slate-600 mt-2">Manage and track your work items</p>
          </div>
          <button
            onClick={() => navigate("/work-items/create")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Work Item
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200 mb-6">{error}</div>}

        {workItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-slate-600">No work items yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {workItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/work-items/${item.id}`)}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 mt-1">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                      {item.currentState}
                    </span>
                    {item.isBlocked && <div className="text-xs text-red-600 mt-2 font-medium">Blocked</div>}
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
