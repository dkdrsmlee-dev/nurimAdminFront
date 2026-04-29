import { useState } from 'react'
import { LoginPage } from '../pages/login/LoginPage'
import { DashboardPage } from '../pages/dashboard/DashboardPage'

type Screen = 'login' | 'dashboard'

function App() {
  const [screen, setScreen] = useState<Screen>('login')

  if (screen === 'login') {
    return <LoginPage onLoginSuccess={() => setScreen('dashboard')} />
  }

  return <DashboardPage />
}

export default App
