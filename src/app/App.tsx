import { useAppRoute } from './model/useAppRoute'
import { LoginPage } from '../pages/login/LoginPage'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { UiPreviewPage } from '../pages/ui-preview/UiPreviewPage'

function App() {
  const { route, navigate } = useAppRoute()

  if (route === 'login') {
    return <LoginPage onLoginSuccess={() => navigate('dashboard')} />
  }

  if (route === 'ui-preview') {
    return (
      <UiPreviewPage
        onMoveToLogin={() => navigate('login')}
        onMoveToDashboard={() => navigate('dashboard')}
      />
    )
  }

  return <DashboardPage onMoveToPreview={() => navigate('ui-preview')} />
}

export default App
