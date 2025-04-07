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

watch(() => route.query.token, (token) => {
  if (token) {
    if (typeof token === 'string') {
      handleLogin(token)
    }
  }
})

async function handleLogin(token: string) {
  try {
    // Store token immediately
    localStorage.setItem('auth_token', token)
    
    // Process token and update store
    const userData = decodeToken(token)
    userStore.login(userData)
    
    // Clear URL and redirect to home
    await router.replace('/')  // Redirect to homepage
    console.log('Login successful, redirected to home')
  } catch (error) {
    console.error('Login failed:', error)
    handleLogout()
  }
}

// Helper function to handle both JWT and base64 tokens
function decodeToken(token: string) {
  try {
    // Try JWT decode first (if you switched to JWT)
    if (token.split('.').length === 3) {
      return JSON.parse(atob(token.split('.')[1]))
    }
    // Fallback to your current base64 format
    return JSON.parse(atob(token))
  } catch (e) {
    throw new Error('Token decoding failed')
  }
}

function handleAuthError() {
  userStore.logout()
  localStorage.removeItem('auth_token')
  router.push('/login')
}
function handleLogout() {
  // Clear user data from the store
  userStore.logout()
  
  // Remove the authentication token from localStorage
  localStorage.removeItem('auth_token')
  
  // Redirect the user to the login page
  router.push('/login')
}
</script>