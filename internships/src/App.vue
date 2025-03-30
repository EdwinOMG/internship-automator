<template>
  <router-view />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// Handle OAuth callback with token
watch(() => route.query.token, (token) => {
  if (token && typeof token === 'string') {
    try {
      // Store token and clear URL
      localStorage.setItem('auth_token', token)
      router.replace({ query: {} })

      // Parse and initialize user
      const userData = JSON.parse(atob(token))
      userStore.login(userData)

      // Redirect to dashboard or intended route
      const redirectPath = route.query.redirect?.toString() || '/dashboard'
      router.push(redirectPath)
    } catch (e) {
      console.error('Invalid token:', e)
      userStore.logout()
      router.push('/login')
    }
  }
})
</script>