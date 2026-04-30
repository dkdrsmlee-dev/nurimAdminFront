import { useState, type FormEvent } from 'react'
import { AdminAuthApiError, loginAdmin } from '../api/adminAuthApi'
import { saveAdminAuthSession } from './adminAuthSession'

export type LoginField = 'adminId' | 'password'

export type LoginFormValues = {
  adminId: string
  password: string
}

const initialValues: LoginFormValues = {
  adminId: '',
  password: '',
}

type UseLoginFormOptions = {
  onLoginSuccess: () => void
}

function toLoginErrorMessage(error: unknown): string {
  if (error instanceof AdminAuthApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return '로그인 중 알 수 없는 오류가 발생했습니다.'
}

export function useLoginForm({ onLoginSuccess }: UseLoginFormOptions) {
  const [values, setValues] = useState<LoginFormValues>(initialValues)
  const [noticeMessage] = useState(
    '세션 유지 시간은 8시간 입니다. 로그인 5회 실패 시 계정 잠금 상태가 됩니다.'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleFieldChange = (field: LoginField, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const adminId = values.adminId.trim()
    const password = values.password

    if (adminId.length === 0 || password.length === 0) {
      setErrorMessage('아이디와 비밀번호를 입력해 주세요.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const loginResponse = await loginAdmin({ adminId, password })
      saveAdminAuthSession(loginResponse)
      onLoginSuccess()
    } catch (error) {
      setErrorMessage(toLoginErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    noticeMessage,
    isSubmitting,
    errorMessage,
    handleFieldChange,
    handleSubmit,
  }
}
