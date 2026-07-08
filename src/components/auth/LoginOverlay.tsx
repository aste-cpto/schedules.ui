import React, { useState } from 'react'
import { useAuth } from '~/contexts/AuthContext'
import { authService } from '~/services/authService'
import { useToast } from '~/components/ui/toast/useToast'

import { Lock, User, Loader2 } from 'lucide-react'

export const LoginOverlay: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal } = useAuth()
  const toast = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isLoginModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await authService.login({ username, password })
      closeLoginModal()
      toast.success('Успішний вхід')
    } catch (err: any) {
      setError(err.message || 'Помилка входу. Перевірте свої дані.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-text/30 backdrop-blur-sm transition-all duration-300">
      <div className="bg-bg-surface rounded-lg shadow-lg w-full max-w-md overflow-hidden transform transition-all duration-300 border border-border">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text">З поверненням</h2>
            <p className="text-sm text-text-secondary mt-1">Будь ласка, увійдіть, щоб продовжити</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-md bg-red-50 border border-red-100 text-red-600 text-sm flex items-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-text block">Логін</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10 w-full rounded-md border border-border bg-bg-surface px-4 py-3 text-text focus:ring-2 focus:ring-accent-indigo focus:border-transparent transition-all outline-none shadow-sm"
                  placeholder="Введіть ваш логін"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text block">Пароль</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 w-full rounded-md border border-border bg-bg-surface px-4 py-3 text-text focus:ring-2 focus:ring-accent-indigo focus:border-transparent transition-all outline-none shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 bg-accent-indigo hover:bg-accent-violet text-text-inverse font-medium py-3 px-4 rounded-md transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Увійти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
