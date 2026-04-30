import { useLoginForm } from '../../features/auth/model/useLoginForm'
import { LoginView } from '../../features/auth/ui/LoginView'
import './login-page.css'

type LoginPageProps = {
  onLoginSuccess: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const {
    values,
    noticeMessage,
    isSubmitting,
    errorMessage,
    handleFieldChange,
    handleSubmit,
  } = useLoginForm({ onLoginSuccess })

  return (
    <div className="login-page">
      <header className="login-page__topbar">
        <span className="login-page__tag">로그인</span>
      </header>

      <main className="login-page__main">
        <LoginView
          values={values}
          noticeMessage={noticeMessage}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onResetPassword={() => {
            window.alert('비밀번호 재설정 페이지는 다음 단계에서 연결합니다.')
          }}
        />
      </main>

      <footer className="login-page__footer">
        본 시스템은 계정 승인 된 관계자만 사용할 수 있으며 불법적인 접근 및 사용 시
        관련 법규에 의해 처벌 될 수 있습니다. © 핏누림 멤버십 2024, All Rights
        Reserved
      </footer>
    </div>
  )
}
