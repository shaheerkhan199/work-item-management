import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Work Item Management</h1>
            <p className="text-sm text-slate-600">Role: {user?.role}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-600">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
        <nav className="mt-4 flex gap-4 border-t border-slate-200 pt-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 text-sm text-slate-700 hover:text-slate-900 hover:underline"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/activity")}
            className="px-4 py-2 text-sm text-slate-700 hover:text-slate-900 hover:underline"
          >
            Activity
          </button>
          {user?.role === "ADMIN" && (
            <button
              onClick={() => navigate("/users")}
              className="px-4 py-2 text-sm text-slate-700 hover:text-slate-900 hover:underline"
            >
              Users Management
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
