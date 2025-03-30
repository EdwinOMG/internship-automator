import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  email: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false
  }),
  actions: {
    login(userData: User) {
      this.user = userData
      this.isAuthenticated = true
    },
    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('auth_token')
    }
  }
})