import { useCallback } from 'react'
import { authService } from '~/services/authService'

export const useLogout = () => {
  const logout = useCallback(async (onComplete?: () => void) => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      onComplete?.()
      window.location.reload()
    }
  }, [])

  return { logout }
}
