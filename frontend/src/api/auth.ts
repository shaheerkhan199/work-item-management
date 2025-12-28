import client from "./client"
import type { AuthResponse } from "../types"

export const authAPI = {
  register: async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await client.post<{ message: string; userId: string }>("/auth/register", {
      email,
      password,
      firstName,
      lastName,
    })
    return response.data
  },

  login: async (email: string, password: string) => {
    const response = await client.post<AuthResponse>("/auth/login", {
      email,
      password,
    })
    return response.data
  },
}
