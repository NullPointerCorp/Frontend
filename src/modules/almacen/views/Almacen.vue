<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useAlmacenes } from "@/modules/almacen/controllers/useAlmacenes";

import ModalRegistrarAlmacen from "./components/ModalRegistrarAlmacen.vue";
import ModalConfirmar from "@/components/ModalConfirmar.vue";
import ModalEditarAlmacen from "./components/ModalEditarAlmacen.vue";
import Tabla from "@/components/Tabla.vue";
import AppHeader from "@/components/AppHeader.vue";

const modalEditar = ref<any>(null);

const {
  almacenesPaginados,
  totalPaginas,
  totalAlmacenes,
  page,
  limit,
  search,
  loading,
  fetchAlmacenes,
  agregarAlmacen,
  actualizarAlmacen,
  eliminarAlmacen,
  dialogConfirmar,
  mensajeConfirmar,
  aceptar,
  cancelar,
} = useAlmacenes();

onMounted(fetchAlmacenes);
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
            <h1 class="page-title">Catálogo de Almacenes</h1>
            <p class="page-subtitle">Gestione la base de datos de almacenes.</p>
          </div>
          <ModalRegistrarAlmacen @almacenCreado="agregarAlmacen" />
        </div>

        <!-- Filtros -->
        <div class="filters-row">
          <div class="search-wrapper">
            <v-text-field v-model="search" placeholder="Filtrar por nombre, sucursal..."
              prepend-inner-icon="mdi-filter-variant" variant="outlined" density="compact" hide-details
              clearable class="search-field" />
          </div>
          <div class="items-per-page">
            <span>Mostrar:</span>
            <v-select v-model="limit" :items="[5, 10, 25, 50]" variant="outlined" density="compact" hide-details
              class="items-select" />
          </div>
        </div>

        <!-- Tabla -->
        <Tabla item-key="almacen_id" :headers="[
          { title: 'ID', key: 'almacen_id' },
          { title: 'Nombre', key: 'nombre_almacen' },
          { title: 'Sucursal', key: 'nombre_sucursal' },
          { title: 'Descripción', key: 'descripcion' },
          { title: 'Acciones', key: 'acciones', sortable: false }
        ]" :items="almacenesPaginados" :loading="loading" :page="page" :limit="limit" :total-items="totalAlmacenes"
          :total-paginas="totalPaginas" @editar="modalEditar?.abrirModal($event)" @eliminar="eliminarAlmacen"
          @update:page="page = $event" />

        <!-- Footer -->
        <div class="page-footer">
          <span>© 2026 NovaCode.</span>
        </div>

      </div>

      <!-- Modales -->
      <ModalConfirmar :dialog="dialogConfirmar" :mensaje="mensajeConfirmar" @aceptar="aceptar" @cancelar="cancelar" />
      <ModalEditarAlmacen ref="modalEditar" @almacenEditado="actualizarAlmacen" />

    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/catalogo.style.css"></style>
