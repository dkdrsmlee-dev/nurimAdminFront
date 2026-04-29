import { useState } from 'react'

export type LoginField = 'username' | 'password'

export type LoginFormValues = {
  username: string
  password: string
}

const initialValues: LoginFormValues = {
  username: '',
  password: '',
}

export function useLoginForm() {
  const [values, setValues] = useState<LoginFormValues>(initialValues)
  const [noticeMessage] = useState(
    '세션 유지 시간은 8시간 입니다. 로그인 5회 실패 시 계정 잠금 상태가 됩니다.'
  )

  const handleFieldChange = (field: LoginField, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return {
    values,
    noticeMessage,
    handleFieldChange,
  }
}
