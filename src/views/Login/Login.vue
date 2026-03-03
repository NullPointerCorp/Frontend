<script setup lang="ts">
import { useLogin } from "./useLogin";
import logo from "../../assets/novacodepng.png";
import "./login.style.css";

const { email, password, errorMessage, isFormValid, login } = useLogin();
</script>

<template>
  <div class="container">
    <div class="card">
      <img :src="logo" alt="Logo" class="logo" />
      <h2>Iniciar sesión</h2>

      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Correo" />
        <input v-model="password" type="password" placeholder="Contraseña" />
        <button  v-if="isFormValid" type="submit">Entrar</button>

        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>
      </form>

    </div>
  </div>
</template>