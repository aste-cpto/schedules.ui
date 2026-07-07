import React, { createContext, useContext, useEffect, useState } from 'react'
import { tokenService } from '~/services/tokenService'

interface AuthContextType {
  isLoginModalOpen: boolean
  openLoginModal: () => void
  closeLoginModal: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(!tokenService.getToken())

  useEffect(() => {
    const handleUnauthorized = () => {
      setIsLoginModalOpen(true)
      tokenService.removeToken()
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => {
          if (tokenService.getToken()) {
            setIsLoginModalOpen(false)
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
