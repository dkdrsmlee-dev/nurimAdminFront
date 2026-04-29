import type { FormEvent } from 'react'
import type { LoginField, LoginFormValues } from '../model/useLoginForm'
import { BrandLogo } from '../../../shared/ui/BrandLogo'
import './login-view.css'

type LoginViewProps = {
  values: LoginFormValues
  noticeMessage: string
  onFieldChange: (field: LoginField, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onResetPassword: () => void
}

export function LoginView({
  values,
  noticeMessage,
  onFieldChange,
  onSubmit,
  onResetPassword,
}: LoginViewProps) {
  return (
    <section className="login-view">
      <div className="login-view__intro">
        <h1>환영합니다.</h1>
        <p>로그인 또는 회원 가입 후 이용해 주세요.</p>
      </div>

      <BrandLogo size="md" />

      <form className="login-form" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="login-username">
          아이디
        </label>
        <input
          id="login-username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="아이디를 입력해 주세요"
          value={values.username}
          onChange={(event) => onFieldChange('username', event.target.value)}
        />

        <label className="sr-only" htmlFor="login-password">
          비밀번호
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력해 주세요"
          value={values.password}
          onChange={(event) => onFieldChange('password', event.target.value)}
        />

        <button
          type="button"
          className="login-form__forgot"
          onClick={onResetPassword}
        >
          비밀번호를 잊으셨나요?
        </button>

        <button
          type="submit"
          className="login-form__submit"
        >
          로그인
        </button>
      </form>

      <p className="login-view__notice">{noticeMessage}</p>
      <p className="login-view__notice">허가된 관리자만 접근 가능합니다.</p>
    </section>
  )
}
