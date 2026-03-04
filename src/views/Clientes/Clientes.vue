<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useClientes } from "@/composables/useClientes";
import { useAuthStore } from "../../stores/auth.store";

import ModalRegistrarCliente from "./components/ModalRegistrarCliente.vue";
import ModalConfirmar from "@/components/ModalConfirmar.vue";
import ModalEditarCliente from "./components/ModalEditarCliente.vue";

import "./clientes.style.css";
import router from "@/router";

const authStore = useAuthStore();
const modalEditar = ref<any>(null); // referencia para el modal de edición

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
  aceptar,
  cancelar,
} = useClientes();

onMounted(fetchClientes);

// Reseteamos la página cuando cambia el search
watch(search, () => { page.value = 1; });
</script>

<template>
  <v-app>
    <!-- Main Content -->
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

      <!-- Content Wrapper -->
      <div class="content-wrapper">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Catálogo de Clientes</h1>
            <p class="page-subtitle">
              Gestione la base de datos de clientes.
            </p>
          </div>
          
          <!-- Botón + Modal -->
          <ModalRegistrarCliente @clienteCreado="agregarCliente" />
        </div>

        <!-- Filtros -->
        <div class="filters-row">
          <div class="search-wrapper">
            <v-text-field v-model="search" placeholder="Filtrar por nombre, ID o ubicación..."
              prepend-inner-icon="mdi-filter-variant" variant="outlined" density="compact" hide-details clearable
              class="search-field" />
          </div>
          <div class="items-per-page">
            <span>Mostrar:</span>
            <v-select v-model="limit" :items="[5, 10, 25, 50]" variant="outlined" density="compact" hide-details
              class="items-select" />
          </div>
        </div>

        <!-- Tabla de clientes -->
        <v-card class="table-card" theme="light">
          <v-data-table :headers="[
            { title: 'ID', key: 'id' },
            { title: 'Nombre', key: 'nombre' },
            { title: 'Apellido Paterno', key: 'apellido_paterno' },
            { title: 'Apellido Materno', key: 'apellido_materno' },
            { title: 'Correo', key: 'correo' },
            { title: 'Teléfono', key: 'telefono' },
            { title: 'Acciones', key: 'acciones', sortable: false }
          ]" :items="clientesPaginados" :loading="loading" hide-default-footer class="clientes-table">
            <template #item.id="{ item }">
              <span class="id-cell">{{ item.id }}</span>
            </template>

            <template #item.correo="{ item }">
              <span class="email-cell">{{ item.correo }}</span>
            </template>

            <template #item.acciones="{ item }">
              <div class="actions-cell">
                <v-btn icon variant="text" size="small" @click="modalEditar?.abrirModal(item)">
                  <v-icon size="18">mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn icon variant="text" size="small" @click="eliminarCliente(item.id)">
                  <v-icon size="18">mdi-trash-can-outline</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table>

          <!-- Paginación -->
          <div class="table-footer">
            <span class="results-info">
              Mostrando {{ (page - 1) * limit + 1 }} a
              {{ Math.min(page * limit, totalClientes) }} de
              {{ totalClientes.toLocaleString() }} resultados
            </span>
            <v-pagination v-model="page" :length="totalPaginas" :total-visible="5" density="compact"
              class="custom-pagination" />
          </div>
        </v-card>

        <!-- Footer -->
        <div class="page-footer">
          <span>© 2026 NovaLogistics.</span>
        </div>
      </div>

      <!-- Modales -->
      <ModalConfirmar :dialog="dialogConfirmar" mensaje="¿Deseas eliminar este cliente?" @aceptar="aceptar"
        @cancelar="cancelar" />
      <ModalEditarCliente ref="modalEditar" @clienteEditado="actualizarCliente" />
    </v-main>
  </v-app>
</template>

<style scoped src="./clientes.style.css"></style>