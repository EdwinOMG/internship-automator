<template>
  <div class="home">
    <Form @form-submitted="handleFormSubmission" />
    <Button />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Form from '@/components/Form.vue';
import Button from '@/components/Buttonauth.vue';

interface FormData {
  Company: string;
  Role: string;
  Date: string;
  Status: string;
}

export default defineComponent({
  name: 'HomeView',
  components: {
    Form,
    Button

  },
  methods: {
    handleFormSubmission(formData: FormData): void {
      console.log('Form submitted:', formData);
      
    }
  }
});
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
</style>