import { useState } from 'react'
import { adminMenuSections } from '../../features/navigation/model/adminMenu'
import { useSidebarTree } from '../../features/navigation/model/useSidebarTree'
import { AdminSidebarTree } from '../../features/navigation/ui/AdminSidebarTree'
import type { LoginField } from '../../features/auth/model/useLoginForm'
import { LoginView } from '../../features/auth/ui/LoginView'
import './ui-preview-page.css'

type UiPreviewPageProps = {
  onMoveToLogin: () => void
  onMoveToDashboard: () => void
}

export function UiPreviewPage({
  onMoveToLogin,
  onMoveToDashboard,
}: UiPreviewPageProps) {
  const { expandedSections, toggleSection } = useSidebarTree(adminMenuSections)
  const [loginValues, setLoginValues] = useState({
    adminId: '',
    password: '',
  })

  const handleFieldChange = (field: LoginField, value: string) => {
    setLoginValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="ui-preview-page">
      <header className="ui-preview-page__header">
        <h1>UI Preview</h1>
        <div className="ui-preview-page__actions">
          <button type="button" onClick={onMoveToLogin}>
            로그인 화면
          </button>
          <button type="button" onClick={onMoveToDashboard}>
            대시보드 화면
          </button>
        </div>
      </header>

      <main className="ui-preview-page__main">
        <section className="ui-preview-page__panel">
          <h2>LoginView</h2>
          <div className="ui-preview-page__login-stage">
            <LoginView
              values={loginValues}
              noticeMessage="세션 유지 시간은 8시간 입니다. 로그인 5회 실패 시 계정 잠금 상태가 됩니다."
              isSubmitting={false}
              errorMessage=""
              onFieldChange={handleFieldChange}
              onSubmit={(event) => event.preventDefault()}
              onResetPassword={() => window.alert('비밀번호 재설정 페이지 연결 예정')}
            />
          </div>
        </section>

        <section className="ui-preview-page__panel">
          <h2>AdminSidebarTree</h2>
          <div className="ui-preview-page__sidebar-stage">
            <AdminSidebarTree
              sections={adminMenuSections}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              activeSectionKey="home"
            />
          </div>
        </section>
      </main>
    </div>
  )
}
