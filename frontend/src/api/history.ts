import client from "./client"
import type { HistoryEvent } from "../types"

export const historyAPI = {
  getWorkItemHistory: async (workItemId: string) => {
    const response = await client.get<HistoryEvent[]>(`/history/work-item/${workItemId}`)
    return response.data
  },

  getUserActivity: async (limit?: number) => {
    const response = await client.get<HistoryEvent[]>(`/history/user/me`, {
      params: limit ? { limit } : {},
    })
    return response.data
  },

  getAllHistory: async (limit?: number) => {
    const response = await client.get<HistoryEvent[]>(`/history/all`, {
      params: limit ? { limit } : {},
    })
    return response.data
  },
}

