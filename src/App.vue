<template>
  <div>
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/AppNavbar.vue';

export default {
  components: {
    Navbar,
  },
};
</script>
