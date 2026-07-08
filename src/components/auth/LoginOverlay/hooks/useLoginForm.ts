import { useEffect, useState, type FormEvent } from 'react'
import { useToast } from '~/components/ui/toast/useToast'
import { useAuth } from '~/contexts/AuthContext'
import { getErrorMessage } from '~/lib/formatApiError'
import { authService } from '~/services/authService'

type UseLoginFormOptions = {
  open: boolean
}

export const useLoginForm = ({ open }: UseLoginFormOptions) => {
  const { closeLoginModal } = useAuth()
  const toast = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    setUsername('')
    setPassword('')
    setError(null)
  }, [open])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await authService.login({ username, password })
      closeLoginModal()
      toast.success('Успішний вхід')
    } catch (err) {
      setError(getErrorMessage(err, 'Помилка входу. Перевірте свої дані.'))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    state: {
      username,
      password,
      error,
      isLoading,
    },
    actions: {
      setUsername,
      setPassword,
      submit,
    },
  }
}
