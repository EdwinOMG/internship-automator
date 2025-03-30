<template>
    <div class="internship-form box">
      <h2 class="title is-4">Add New Internship</h2>
      <form @submit.prevent="handleSubmit">
        <!-- Company Name -->
        <div class="field">
          <label class="label">Company Name</label>
          <div class="control">
            <input 
              v-model="form.company" 
              class="input" 
              type="text" 
              placeholder="e.g. Google, Amazon" 
              required
            >
          </div>
        </div>
  
        <!-- Role -->
        <div class="field">
          <label class="label">Role/Position</label>
          <div class="control">
            <input 
              v-model="form.role" 
              class="input" 
              type="text" 
              placeholder="e.g. Software Engineer Intern" 
              required
            >
          </div>
        </div>
  
        <!-- Date -->
        <div class="field">
          <label class="label">Date</label>
          <div class="control">
            <input 
              v-model="form.date" 
              class="input" 
              type="date"
            >
          </div>
          <div class="control mt-2">
            <button 
              type="button" 
              class="button is-small is-info is-light"
              @click="setTodayDate"
            >
              Use Today's Date
            </button>
          </div>
        </div>
  
        <!-- Status Dropdown -->
        <div class="field">
          <label class="label">Status</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="form.status" required>
                <option value="" disabled>Select Status</option>
                <option value="Applied">Applied</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
                <option value="Interview">Interview</option>
                <option value="Coding Challenge">Coding Challenge</option>
              </select>
            </div>
          </div>
        </div>
  
        <!-- Submit Button -->
        <div class="field">
          <div class="control">
            <button type="submit" class="button is-primary">Add Internship</button>
          </div>
        </div>
      </form>
    </div>
  </template>
  
  <script lang="ts">
export default {
  data() {
    return {
      form: {
        company: '',
        role: '',
        date: '',
        status: ''
      }
    }
  },
  methods: {
    async handleSubmit() {
      try {
        // Format date if empty
        if (!this.form.date) {
          this.form.date = new Date().toISOString().split('T')[0];
        }

        const response = await fetch('http://localhost:3001/api/internships', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.form)
        });

        if (response.ok) {
          this.$emit('form-submitted', { ...this.form });
          this.resetForm();
          alert('Internship added to Excel!');
        } else {
          throw new Error('Failed to save');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to save internship');
      }
    },
    resetForm() {
      this.form = {
        company: '',
        role: '',
        date: '',
        status: ''
      };
    }
  }
}
</script>
  
  <style scoped>
  .internship-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }
  </style>