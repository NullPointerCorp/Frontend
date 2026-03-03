<script setup lang="ts">
import { useAuthStore } from "../stores/auth.store";

const authStore = useAuthStore();
console.log(authStore.session)
</script>

<template>
  <div class="home">
    <h1>Bienvenido</h1>
    <p>Inicio de sesión correcto.</p>
  </div>
    <h1>Bienvenido, {{ authStore.session?.nombre }}</h1>
</template>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>