import { createPortal } from 'react-dom'
import { useAuth } from '~/contexts/AuthContext'
import { LoginForm } from './components/LoginForm'
import { useLoginForm } from './hooks/useLoginForm'

export const LoginOverlay = () => {
  const { isLoginModalOpen } = useAuth()
  const { state, actions } = useLoginForm({ open: isLoginModalOpen })

  if (!isLoginModalOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-text/30 p-4 backdrop-blur-sm transition-all duration-300"
      role="presentation"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-lg border border-border bg-bg-surface shadow-lg transition-all duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <LoginForm state={state} actions={actions} />
      </div>
    </div>,
    document.body,
  )
}
