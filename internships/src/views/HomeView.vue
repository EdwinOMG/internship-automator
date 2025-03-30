<script setup lang="ts">
import Form from "../components/Form.vue";
import Button from "../components/Buttonauth.vue";
</script>

<template>
  <main class="auth-page">
    <Form />
    <div class="auth-divider">or</div>
    <Button />
  </main>
</template>

<style scoped>
.auth-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.auth-divider {
  margin: 1.5rem 0;
  color: #666;
  text-transform: uppercase;
  font-size: 0.875rem;
}
</style>