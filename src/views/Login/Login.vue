<script setup lang="ts">
import { useLogin } from "./useLogin";
import logo from "@/assets/images/novacodepng.png";
import "./login.style.css";

const { email, password, errorMessage, isFormValid, login } = useLogin();
</script>

<template>
  <v-app>
    <v-main class="login-background">
      <v-card class="login-card" theme="light">
        <!-- Header -->
        <div class="login-header">
          <img :src="logo" alt="NovaLogistics Logo" class="login-logo" />
          <h1 class="login-title">NovaLogistics</h1>
          <p class="login-subtitle">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        <!-- Formulario -->
        <v-form @submit.prevent="login">
          <div class="form-group">
            <label class="form-label">Correo Electrónico</label>
            <v-text-field
              v-model="email"
              placeholder="nombre@empresa.com"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-email-outline"
              hide-details
            />
          </div>

          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <v-text-field
              v-model="password"
              type="password"
              placeholder="••••••••"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-lock-outline"
              hide-details
            />
          </div>

          <!-- Error -->
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <!-- Botón -->
          <v-btn
            :disabled="!isFormValid"
            type="submit"
            block
            size="large"
            class="login-btn"
          >
            Iniciar Sesión
          </v-btn>
        </v-form>
      </v-card>

      <!-- Footer -->
      <div class="login-footer">
        <span>NovaLogistics — Gestión de Logística</span>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped src="./login.style.css"></style>