import client from "./client"
import type { User, UserRole, UserStatus } from "../types"

export const usersAPI = {
  getCurrentUser: async () => {
    const response = await client.get<User>("/users/me")
    return response.data
  },

  getAllUsers: async () => {
    const response = await client.get<User[]>("/users")
    return response.data
  },

  updateUserRole: async (userId: string, role: UserRole) => {
    const response = await client.patch<User>(`/users/${userId}/role`, { role })
    return response.data
  },

  updateUserStatus: async (userId: string, status: UserStatus) => {
    const response = await client.patch<User>(`/users/${userId}/status`, { status })
    return response.data
  },
}

