<script setup lang="ts">
import { useDashboard } from "./useDashboard";
import "./dashboard.style.css";
import logo from "../../assets/novacodeSP-png.png";
import { useAuthStore } from "../../stores/auth.store";

const authStore = useAuthStore();

const { menuItems, catalogItems, user, navigateTo } = useDashboard();
</script>

<template>
  <v-app>
    <v-navigation-drawer permanent class="sidebar" theme="light">
      <div class="sidebar-header">
        <img :src="logo" alt="NovaLogistics Logo" class="login-logo" />
        <span class="sidebar-logo-text">NovaLogistics</span>
      </div>

      <v-list class="sidebar-menu" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :class="{ 'menu-item-active': item.active }"
          @click="navigateTo(item.route)"
          rounded="lg"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main class="main-content" theme="light">
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
          Bienvenido al centro operativo de <span class="highlight">NovaLogistics</span>. Gestione catálogos, personal y logística desde aquí.
        </p>

        <div class="catalog-header">
          <h2 class="catalog-title">Catálogos de Gestión</h2>
          <p class="catalog-subtitle">Seleccione un módulo para administrar sus registros.</p>
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
              <span v-if="item.adminOnly" class="admin-badge">SOLO ADMIN</span>
            </div>
          </v-card>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped src="./dashboard.style.css"></style>