<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useSucursales } from "@/composables/useSucursales";
import { useAuthStore } from "@/stores/auth.store";

import ModalRegistrarSucursal from "./components/ModalRegistrarSucursal.vue";
import ModalEditarSucursal from "./components/ModalEditarSucursal.vue";
import ModalConfirmar from "@/components/ModalConfirmar.vue";
import Tabla from "@/components/Tabla.vue";

const authStore = useAuthStore();
const modalEditar = ref<any>(null);

const {
  sucursalesPaginadas,
  totalPaginas,
  totalSucursales,
  page,
  limit,
  search,
  loading,
  fetchSucursales,
  agregarSucursal,
  actualizarSucursal,
  mensajeConfirmar,
  eliminarSucursal,
  dialogConfirmar,
  aceptar,
  cancelar,
} = useSucursales();

onMounted(fetchSucursales);
watch(search, () => { page.value = 1; });
</script>

<template>
  <v-app>
    <v-main class="main-content" theme="light">

      <!-- Header -->
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

        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Catálogo de Sucursales</h1>
            <p class="page-subtitle">Gestione la base de datos de sucursales.</p>
          </div>
          <ModalRegistrarSucursal @sucursalCreada="agregarSucursal" />
        </div>

        <!-- Filtros -->
        <div class="filters-row">
          <div class="search-wrapper">
            <v-text-field
              v-model="search"
              placeholder="Filtrar por nombre, ciudad..."
              prepend-inner-icon="mdi-filter-variant"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              class="search-field"
            />
          </div>
          <div class="items-per-page">
            <span>Mostrar:</span>
            <v-select
              v-model="limit"
              :items="[5, 10, 25, 50]"
              variant="outlined"
              density="compact"
              hide-details
              class="items-select"
            />
          </div>
        </div>

        <!-- Tabla -->
        <Tabla item-key="sucursal_id"
          :headers="[
            { title: 'ID', key: 'sucursal_id' },
            { title: 'Nombre', key: 'nombre_sucursal' },
            { title: 'Ciudad', key: 'nombre_ciudad' },
            { title: 'Colonia', key: 'colonia' },
            { title: 'Calle', key: 'calle' },
            { title: 'Acciones', key: 'acciones', sortable: false }
          ]"
          :items="sucursalesPaginadas"
          :loading="loading"
          :page="page"
          :limit="limit"
          :total-items="totalSucursales"
          :total-paginas="totalPaginas"
          @editar="modalEditar?.abrirModal($event)"
          @eliminar="eliminarSucursal"
          @update:page="page = $event"
        />

        <!-- Footer -->
        <div class="page-footer">
          <span>© 2026 NovaLogistics.</span>
        </div>

      </div>

      <!-- Modales -->
      <ModalConfirmar
  :dialog="dialogConfirmar"
  :mensaje="mensajeConfirmar"
  @aceptar="aceptar"
  @cancelar="cancelar"
/>
      <ModalEditarSucursal ref="modalEditar" @sucursalEditada="actualizarSucursal" />

    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/modal.style.css"></style>