<script setup lang="ts">
import { ref } from "vue";
import { useSidebar } from "@/composables/useSidebar";
import ModalCerrarSesion from "@/components/ModalCerrarSesion.vue";
import logo from "@/assets/images/novacodeSP-png.png";

const { menuItems, navigateTo, isActive, logout, isCollapsed, toggleSidebar } = useSidebar();

const dialogLogout = ref(false);

const confirmarLogout = () => {
  dialogLogout.value = false;
  logout();
};
</script>

<template>
  <v-navigation-drawer
    permanent
    :rail="isCollapsed"
    class="sidebar-drawer"
    :class="{ 'sidebar-drawer-collapsed': isCollapsed }"
  >
    <div class="sidebar-shell">
      <div class="sidebar-header" :class="{ 'sidebar-header-collapsed': isCollapsed }">
        <img v-if="!isCollapsed" :src="logo" alt="NovaLogistics Logo" class="login-logo" />
        <span v-if="!isCollapsed" class="sidebar-logo-text">NovaCode</span>

        <v-btn
          icon
          variant="text"
          size="small"
          class="sidebar-toggle"
          :aria-label="isCollapsed ? 'Mostrar menu' : 'Ocultar menu'"
          @click="toggleSidebar"
        >
          <v-icon size="20">
            {{ isCollapsed ? "mdi-chevron-right" : "mdi-chevron-left" }}
          </v-icon>
        </v-btn>
      </div>

      <v-list nav class="sidebar-menu">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :class="{ 'menu-item-active': isActive(item.route) }"
          @click="navigateTo(item.route)"
        />
      </v-list>

      <div class="sidebar-logout">
        <v-list-item
          prepend-icon="mdi-logout"
          title="Cerrar Sesion"
          class="logout-btn"
          @click="dialogLogout = true"
        />
      </div>
    </div>

    <ModalCerrarSesion
      :dialog="dialogLogout"
      @aceptar="confirmarLogout"
      @cancelar="dialogLogout = false"
    />
  </v-navigation-drawer>
</template>

<style scoped>
.sidebar-drawer {
  height: 100dvh !important;
  position: fixed !important;
  top: 0;
  bottom: 0;
}

.sidebar-shell {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  min-height: 0;
}

.sidebar-header {
  flex-shrink: 0;
}

.login-logo {
  width: 38px;
  height: 38px;
  object-fit: contain;
}

.sidebar-toggle {
  margin-left: auto;
}

.sidebar-header-collapsed {
  justify-content: center;
  padding: 12px 0;
}

.sidebar-header-collapsed .sidebar-toggle {
  margin-left: 0;
}

.sidebar-menu {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.sidebar-drawer-collapsed .sidebar-menu {
  padding: 8px 6px;
}

.sidebar-drawer-collapsed :deep(.v-list-item) {
  width: 44px;
  min-height: 44px;
  margin: 0 auto 4px;
  padding-inline: 0 !important;
  display: grid;
  place-items: center;
}

.sidebar-drawer-collapsed :deep(.v-list-item__prepend) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  margin-inline-end: 0;
  grid-area: 1 / 1;
}

.sidebar-drawer-collapsed :deep(.v-list-item__prepend > .v-icon) {
  margin-inline-start: 0;
  margin-inline-end: 0;
}

.sidebar-drawer-collapsed :deep(.v-list-item__spacer),
.sidebar-drawer-collapsed :deep(.v-list-item__content) {
  display: none;
}

.sidebar-logout {
  flex-shrink: 0;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
}

:deep(.v-navigation-drawer__content) {
  overflow: hidden;
  height: 100dvh;
}
</style>
