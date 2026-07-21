import api from '@/lib/api'
import type { AuthResponse, LoginCredentials, RegisterData } from '@/types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', credentials)
    return data
  },

  // register returns a message (OTP sent). Complete registration with verifyRegister.
  async register(payload: RegisterData): Promise<any> {
    const { data } = await api.post('/auth/register', payload)
    return data
  },

  async verifyRegister(email: string, code: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/register/verify', { email, code })
    return data
  },

  async me() {
    const { data } = await api.get('/auth/me')
    return data
  },

  async refresh(refreshToken: string) {
    const { data } = await api.post('/auth/refresh', { refreshToken })
    return data
  },

  async logout() {
    await api.post('/auth/logout').catch(() => { })
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const { data } = await api.patch('/auth/change-password', { currentPassword, newPassword })
    return data
  },

  async forgotPassword(email: string) {
    const { data } = await api.post('/auth/forgot-password', { email })
    return data
  },

  async resetPassword(email: string, code: string, newPassword: string) {
    const { data } = await api.post('/auth/reset-password', { email, code, newPassword })
    return data
  },
}
