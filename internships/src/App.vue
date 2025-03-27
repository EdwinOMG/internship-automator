<template>
  <div class="home">
    <Form @form-submitted="handleFormSubmission" />
  </div>
</template>

<script>
import Form from '@/components/Form.vue';

export default {
  components: {
    Form
  },
  methods: {
    handleFormSubmission(formData) {
      // Handle the form data (e.g., save to database or state management)
      console.log('Form submitted:', formData);
      // You can add your logic here to save the data
    }
  }
}
</script>