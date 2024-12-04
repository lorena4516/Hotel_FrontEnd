<template>
  <div class="container d-flex justify-content-center align-items-center" style="height: 100vh;">
    <div class="card shadow-sm p-4" style="width: 100%; max-width: 400px;">
      <h1 class="text-center mb-4">Iniciar Sesión</h1>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico:</label>
          <input
            type="email"
            v-model="email"
            id="email"
            class="form-control"
            placeholder="Correo Electrónico"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña:</label>
          <input
            type="password"
            v-model="password"
            id="password"
            class="form-control"
            placeholder="Contraseña"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
      </form>
      <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '', 
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:8000/api/login', {
          email: this.email,
          password: this.password,
        });

      
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

       
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

       
        this.$router.push('/hotels');
      } catch (error) {
        // Manejo de errores
        console.error("Error al iniciar sesión:", error.response || error);
        this.error = error.response?.data?.message || 'Error desconocido al iniciar sesión';
      }
    },
  },
};
</script>

<style scoped>
.container {
  height: 100vh;
}
.card {
  border-radius: 10px;
}
</style>
