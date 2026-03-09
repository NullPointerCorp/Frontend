<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useClientes } from "@/composables/useClientes";
import { useAuthStore } from "../../stores/auth.store";

import ModalRegistrarCliente from "./components/ModalRegistrarCliente.vue";
import ModalConfirmar from "@/components/ModalConfirmar.vue";
import ModalEditarCliente from "./components/ModalEditarCliente.vue";

import Tabla from "@/components/Tabla.vue";

const authStore = useAuthStore();
const modalEditar = ref<any>(null);

const {
  clientesPaginados,
  totalPaginas,
  totalClientes,
  page,
  limit,
  search,
  loading,
  fetchClientes,
  agregarCliente,
  actualizarCliente,
  eliminarCliente,
  dialogConfirmar,
  mensajeConfirmar,
  aceptar,
  cancelar,
} = useClientes();

onMounted(fetchClientes);

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
            <h1 class="page-title">Catálogo de Clientes</h1>
            <p class="page-subtitle">Gestione la base de datos de clientes.</p>
          </div>
          <ModalRegistrarCliente @clienteCreado="agregarCliente" />
        </div>

        <!-- Filtros -->
        <div class="filters-row">
          <div class="search-wrapper">
            <v-text-field v-model="search" placeholder="Filtrar por nombre, ID o ubicación..."
              prepend-inner-icon="mdi-filter-variant" variant="outlined" density="compact" hide-details
              class="search-field" />
          </div>
          <div class="items-per-page">
            <span>Mostrar:</span>
            <v-select v-model="limit" :items="[5, 10, 25, 50]" variant="outlined" density="compact" hide-details
              class="items-select" />
          </div>
        </div>

        <!-- Tabla -->
        <Tabla item-key="cliente_id" :headers="[
          { title: 'ID', key: 'cliente_id' },
          { title: 'Nombre', key: 'nombre' },
          { title: 'Apellido Paterno', key: 'apellido_paterno' },
          { title: 'Apellido Materno', key: 'apellido_materno' },
          { title: 'Correo', key: 'correo' },
          { title: 'Teléfono', key: 'telefono' },
          { title: 'Acciones', key: 'acciones', sortable: false }
        ]" :items="clientesPaginados" :loading="loading" :page="page" :limit="limit" :total-items="totalClientes"
          :total-paginas="totalPaginas" @editar="modalEditar?.abrirModal($event)" @eliminar="eliminarCliente"
          @update:page="page = $event" />

        <!-- Footer -->
        <div class="page-footer">
          <span>© 2026 NovaCode.</span>
        </div>

      </div>

      <!-- Modales -->
      <ModalConfirmar :dialog="dialogConfirmar" :mensaje="mensajeConfirmar" @aceptar="aceptar" @cancelar="cancelar" />
      <ModalEditarCliente ref="modalEditar" @clienteEditado="actualizarCliente" />

    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/catalogo.style.css"></style>