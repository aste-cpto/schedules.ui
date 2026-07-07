import { apiClient } from '~/lib/apiClient'
import type { LoginDto, AuthResponseDto } from '~/types/api/auth'

import { tokenService } from './tokenService'

export const authService = {
  async login(payload: LoginDto) {
    const response = await apiClient<AuthResponseDto>('/auth/login', {
      method: 'POST',
      body: payload,
    })
    tokenService.setToken(response.token)
    return response
  },
  async logout() {
    try {
      await apiClient<void>('/auth/logout', {
        method: 'POST',
      })
    } finally {
      tokenService.removeToken()
    }
  },
}
