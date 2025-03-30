<template>
    <button 
      @click="handleGoogleLogin" 
      class="google-auth-button"
      type="button"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
        alt="Google logo"
        class="google-logo"
      />
      Sign in with Google
    </button>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'GoogleAuthButton',
    emits: ['error'],
    methods: {
      handleGoogleLogin(): void {
        try {
          window.location.href = 'http://localhost:3001/auth/google';
        } catch (error) {
          console.error('Google login error:', error);
          this.$emit('error', 'Failed to initiate Google login');
        }
      }
    }
  });
  </script>
  
  <style scoped>
  .google-auth-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px 20px;
    background: white;
    color: #757575;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.25);
  }
  
  .google-auth-button:hover {
    background: #f8f8f8;
    box-shadow: 0 0 3px 3px rgba(66,133,244,0.3);
  }
  
  .google-logo {
    width: 18px;
    height: 18px;
  }
  </style>