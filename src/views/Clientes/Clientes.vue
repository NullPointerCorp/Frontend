<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useClientes } from "./useClientes";
import "./clientes.style.css";
import ModalRegistrarCliente from "./ModalRegistrarCliente.vue";
import ModalConfirmar from "../../components/ModalConfirmar.vue";
import ModalEditarCliente from "./ModalEditarCliente.vue";
import { useAuthStore } from "../../stores/auth.store";

import logo from "../../assets/novacodeSP-png.png";

const authStore = useAuthStore();

const modalEditar = ref();

const {
  menuItems,
  user,
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
  navigateTo,
  logout,
} = useClientes();

onMounted(fetchClientes);
watch(search, () => { page.value = 1; });
</script>

<template>
  <v-app>
    <!-- Sidebar -->
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

      <template #append>
        <div class="sidebar-footer">
          <v-list-item
            prepend-icon="mdi-logout"
            title="Cerrar Sesión"
            class="logout-btn"
            @click="logout"
            rounded="lg"
          />
        </div>
      </template>
    </v-navigation-drawer>

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

      <!-- Content -->
      <div class="content-wrapper">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Catálogo de Clientes</h1>
            <p class="page-subtitle">
              Gestione la base de datos de clientes.
            </p>
          </div>
          <ModalRegistrarCliente @clienteCreado="agregarCliente" />
        </div>

        <!-- Filters -->
        <div class="filters-row">
          <div class="search-wrapper">
            <v-text-field
              v-model="search"
              placeholder="Filtrar por nombre, ID o ubicación..."
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

        <!-- Table -->
        <v-card class="table-card" theme="light">
          <v-data-table
            :headers="[
              { title: 'ID', key: 'id' },
              { title: 'Nombre', key: 'nombre' },
              { title: 'Apellido Paterno', key: 'apellido_paterno' },
              { title: 'Apellido Materno', key: 'apellido_materno' },
              { title: 'Correo', key: 'correo' },
              { title: 'Teléfono', key: 'telefono' },
              { title: 'Acciones', key: 'acciones', sortable: false },
            ]"
            :items="clientesPaginados"
            :loading="loading"
            hide-default-footer
            class="clientes-table"
          >
            <template #item.id="{ item }">
              <span class="id-cell">{{ String(item.id)}}</span>
            </template>

            <template #item.correo="{ item }">
              <span class="email-cell">{{ item.correo }}</span>
            </template>

            <template #item.acciones="{ item }">
              <div class="actions-cell">
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  @click="modalEditar.abrirModal(item)"
                >
                  <v-icon size="18">mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  @click="eliminarCliente(item.id)"
                >
                  <v-icon size="18">mdi-trash-can-outline</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table>

          <!-- Pagination -->
          <div class="table-footer">
            <span class="results-info">
              Mostrando {{ (page - 1) * limit + 1 }} a {{ Math.min(page * limit, totalClientes) }} de {{ totalClientes.toLocaleString() }} resultados
            </span>
            <v-pagination
              v-model="page"
              :length="totalPaginas"
              :total-visible="5"
              density="compact"
              class="custom-pagination"
            />
          </div>
        </v-card>

        <!-- Footer -->
        <div class="page-footer">
          <span>© 2026 NovaLogistics.</span>
        </div>
      </div>

      <!-- Modales -->
      <ModalConfirmar
        :dialog="dialogConfirmar"
        mensaje="¿Deseas eliminar este cliente?"
        @aceptar="aceptar"
        @cancelar="cancelar"
      />
      <ModalEditarCliente ref="modalEditar" @clienteEditado="actualizarCliente" />
    </v-main>
  </v-app>
</template>

<style scoped src="./clientes.style.css"></style>