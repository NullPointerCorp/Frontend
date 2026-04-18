<script setup lang="ts">
import { useSidebar } from "@/composables/useSidebar";
import logo from "@/assets/images/novacodeSP-png.png";

const { menuItems, navigateTo, isActive, logout } = useSidebar();
</script>

<template>
  <v-navigation-drawer permanent>
    <div class="sidebar-header">
      <img :src="logo" alt="NovaLogistics Logo" class="login-logo" />
      <span class="sidebar-logo-text">NovaCode</span>
    </div>
    <v-list nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :class="{ 'menu-item-active': isActive(item.route) }"
        @click="navigateTo(item.route)"
      />
    </v-list>

    <template #append>
      <v-list-item
        prepend-icon="mdi-logout"
        title="Cerrar Sesión"
        @click="logout"
      />
    </template>
  </v-navigation-drawer>
</template>
