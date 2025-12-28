import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { usersAPI } from "../api/users"
import type { User, UserRole, UserStatus } from "../types"
import { Header } from "./Header"

export function UsersManagement() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [error, setError] = useState("")
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const [updatingStatusUserId, setUpdatingStatusUserId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login")
      return
    }

    if (user && user.role !== "ADMIN") {
      navigate("/dashboard")
      return
    }
  }, [isAuthenticated, isLoading, user, navigate])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersAPI.getAllUsers()
        setUsers(data)
      } catch (err) {
        setError("Failed to load users")
        console.error(err)
      } finally {
        setIsLoadingUsers(false)
      }
    }

    if (isAuthenticated && user?.role === "ADMIN") {
      fetchUsers()
    }
  }, [isAuthenticated, user])

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    setUpdatingUserId(userId)
    setError("")
    try {
      const updatedUser = await usersAPI.updateUserRole(userId, newRole)
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    } catch (err) {
      setError("Failed to update user role")
      console.error(err)
    } finally {
      setUpdatingUserId(null)
    }
  }

  const handleStatusUpdate = async (userId: string, newStatus: UserStatus) => {
    setUpdatingStatusUserId(userId)
    setError("")
    try {
      const updatedUser = await usersAPI.updateUserStatus(userId, newStatus)
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    } catch (err) {
      setError("Failed to update user status")
      console.error(err)
    } finally {
      setUpdatingStatusUserId(null)
    }
  }

  if (isLoading || isLoadingUsers) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      </div>
    )
  }

  if (user?.role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Users Management</h2>
            <p className="text-slate-600 mt-2">Manage user roles and permissions</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-medium"
          >
            Back to Dashboard
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200 mb-6">{error}</div>}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Change Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Change Role
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {u.firstName} {u.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : u.role === "OPERATOR"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          u.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : u.status === "SUSPENDED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {u.status || "INACTIVE"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={u.status || "INACTIVE"}
                        onChange={(e) => handleStatusUpdate(u.id, e.target.value as UserStatus)}
                        disabled={updatingStatusUserId === u.id || u.id === user?.id}
                        className="px-3 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={u.id === user?.id ? "You cannot change your own status" : ""}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleUpdate(u.id, e.target.value as UserRole)}
                        disabled={updatingUserId === u.id || u.id === user?.id}
                        className="px-3 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={u.id === user?.id ? "You cannot change your own role" : ""}
                      >
                        <option value="VIEWER">VIEWER</option>
                        <option value="OPERATOR">OPERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

