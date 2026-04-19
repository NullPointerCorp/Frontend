<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useRol } from "@/modules/rol/controllers/useRoles";

import ModalRegistrarRol from "./components/ModalRegistrarRol.vue";
import ModalEditarRol from "./components/ModalEditarRol.vue";
import ModalConfirmar from "@/components/ModalConfirmar.vue";

import Tabla from "@/components/Tabla.vue";
import AppHeader from "@/components/AppHeader.vue";

const modalEditar = ref<any>(null);

const {
  rolesPaginados,
  totalPaginas,
  totalRoles,
  page,
  limit,
  search,
  loading,
  fetchRoles,
  agregarRol,
  actualizarRol,
  eliminarRol,
  dialogConfirmar,
  mensajeConfirmar,
  aceptar,
  cancelar,
} = useRol();

onMounted(fetchRoles);
watch(search, () => { page.value = 1; });
</script>

<template>
  <v-app>
    <v-main class="main-content">

      <!-- Header -->
      <AppHeader/>

      <div class="content-wrapper">

        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Catálogo de Roles</h1>
            <p class="page-subtitle">Gestione la base de datos de roles.</p>
          </div>
          <ModalRegistrarRol @rolCreado="agregarRol" />        
        </div>

        <!-- Filtros -->
        <div class="filters-row">
          <div class="search-wrapper">
            <v-text-field v-model="search" placeholder="Filtrar por nombre, descripcion..."
              prepend-inner-icon="mdi-filter-variant" variant="outlined" density="compact" hide-details clearable
              class="search-field" />
          </div>
          <div class="items-per-page">
            <span>Mostrar:</span>
            <v-select v-model="limit" :items="[5, 10, 25, 50]" variant="outlined" density="compact" hide-details
              class="items-select" />
          </div>
        </div>

        <!-- Tabla -->
        <Tabla item-key="rol_id" :headers="[
          { title: 'ID', key: 'rol_id' },
          { title: 'Nombre', key: 'rol_nombre' },
          { title: 'Descripción', key: 'descripcion' },
          { title: 'Acciones', key: 'acciones', sortable: false }
        ]" :items="rolesPaginados" :loading="loading" :page="page" :limit="limit" :total-items="totalRoles"
          :total-paginas="totalPaginas" @editar="modalEditar?.abrirModal($event)" @eliminar="eliminarRol"
          @update:page="page = $event" />
        
        <!-- Footer -->
        <div class="page-footer">
          <span>© 2026 NovaCode.</span>
        </div>

      </div>

      <!-- Modales -->
      <ModalConfirmar :dialog="dialogConfirmar" :mensaje="mensajeConfirmar" @aceptar="aceptar" @cancelar="cancelar" />
      <ModalEditarRol ref="modalEditar" @rolEditado="actualizarRol" />

    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/catalogo.style.css"></style>
