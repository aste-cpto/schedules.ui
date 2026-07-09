import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from '~/ui/toast/ToastProvider'
import '~/styles/tailwind.css'
import '~/styles/main.scss'
import { App } from '~/App'
import { AuthProvider } from '~/contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
      <ToastProvider>
          <App />
      </ToastProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
