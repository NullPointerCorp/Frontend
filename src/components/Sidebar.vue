<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMenu } from "@/composables/useMenu";
import { useAuthStore } from "@/stores/auth.store";
import logo from "@/assets/images/novacodeSP-png.png";

const router = useRouter();
const auth = useAuthStore();

const { menuItems } = useMenu(auth.session?.id_rol || 0);

const navigateTo = (route: string) => {
  router.push(route);
};

const isActive = (path: string) => {
  return router.currentRoute.value.path.startsWith(path);
};

const logout = () => {
  auth.clearSession();
  router.push("/login");
};
</script>

<template>
  <v-navigation-drawer permanent>
    <div class="sidebar-header">
      <img :src="logo" alt="NovaLogistics Logo" class="login-logo" />
      <span class="sidebar-logo-text">NovaLogistics</span>
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