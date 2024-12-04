<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light" v-if="!isLoginPage">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Gestión de Hoteles</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/hotels">Hoteles</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/assign-room-type">Asignaciones</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/login" @click="logout">Cerrar Sesión</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    
    isLoginPage() {
      return this.$route.name === 'LoginForm';
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
    },
  },
};
</script>
