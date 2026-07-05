import { useState } from 'react'
import { clearSession, getStoredUser, type User } from './api/auth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [user, setUser] = useState<User | null>(() => getStoredUser())

  const handleLogout = () => {
    clearSession()
    setUser(null)
  }

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}

export default App
