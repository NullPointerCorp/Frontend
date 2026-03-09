<script setup lang="ts">
import { useDashboard } from "./useDashboard";
import "./dashboard.style.css";
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();
const { catalogItems, navigateTo } = useDashboard();
</script>

<template>
  <div class="main-content" theme="light">
    <div class="header">
      <div></div>
      <div class="user-info">
        <div class="user-details">
          <span class="user-name">{{ authStore.session?.nombre }}</span>
          <span class="user-role">{{ authStore.session?.rol }}</span>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <h1 class="page-title">Panel de Control</h1>
      <p class="page-subtitle">
        Bienvenido al centro operativo de
        <span class="highlight">NovaCode</span>.
      </p>

      <div class="catalog-header">
        <h2 class="catalog-title">Catálogos de Gestión</h2>
        <p class="catalog-subtitle">
          Seleccione un módulo para administrar sus registros.
        </p>
      </div>

      <div class="cards-grid">
        <v-card
          v-for="item in catalogItems"
          :key="item.title"
          class="catalog-card"
          theme="light"
          @click="navigateTo(item.route)"
        >
          <div class="card-content">
            <div class="card-icon-wrapper">
              <v-icon class="card-icon">{{ item.icon }}</v-icon>
            </div>
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-description">{{ item.description }}</p>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<style scoped src="./dashboard.style.css"></style>