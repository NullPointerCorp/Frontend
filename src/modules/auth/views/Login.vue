<script setup lang="ts">
import { useLogin } from "../controllers/useLogin";
import logo from "@/assets/images/novacodepng.png";
import "./login.style.css";

const { email, password, errorMessage, isFormValid, loading, login } = useLogin();
</script>

<template>
  <v-app>
    <v-main class="login-background">
      <v-card class="login-card">
        
        <div class="login-header">
          <div class="logo-container">
            <img :src="logo" alt="NovaLogistics Logo" class="login-logo" />
          </div>
          <h1 class="login-title">NovaCode</h1>
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
              :disabled="loading"
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
              :disabled="loading"
            />
          </div>

          <!-- Error con mejor formato -->
          <Transition name="fade">
            <div v-if="errorMessage" class="error-container">
              <v-icon size="18" color="error">mdi-alert-circle-outline</v-icon>
              <span>{{ errorMessage }}</span>
            </div>
          </Transition>

          <!-- Botón aparece solo cuando ambos campos tienen texto -->
          <Transition name="slide-fade">
            <v-btn
              v-if="isFormValid"
              type="submit"
              block
              size="large"
              class="login-btn"
              :loading="loading"
            >
              <v-icon start>mdi-login</v-icon>
              Iniciar Sesión
            </v-btn>
          </Transition>

        </v-form>
      </v-card>

      <!-- Footer -->
      <div class="login-footer">
        <span>© 2026 NovaCode — Sistema de Logística</span>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped src="./login.style.css"></style>
