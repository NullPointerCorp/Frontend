<script setup lang="ts">
import { ref } from "vue";
import { useSidebar } from "@/composables/useSidebar";
import ModalCerrarSesion from "@/components/ModalCerrarSesion.vue";
import logo from "@/assets/images/novacodeSP-png.png";

const { menuItems, navigateTo, isActive, logout } = useSidebar();

const dialogLogout = ref(false);

const confirmarLogout = () => {
  dialogLogout.value = false;
  logout();
};
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
        class="logout-btn"
        @click="dialogLogout = true"
      />
    </template>

    <ModalCerrarSesion
      :dialog="dialogLogout"
      @aceptar="confirmarLogout"
      @cancelar="dialogLogout = false"
    />
  </v-navigation-drawer>
</template>
