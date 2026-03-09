<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { usePaquetes } from "@/composables/usePaquetes";
import { useAuthStore } from "@/stores/auth.store";

import ModalRegistrarPaquete from "./components/ModalRegistrarPaquete.vue";
import ModalEditarPaquete from "./components/ModalEditarPaquete.vue";
import ModalConfirmar from "@/components/ModalConfirmar.vue";
import Tabla from "@/components/Tabla.vue";

const authStore = useAuthStore();
const modalEditar = ref<any>(null);

const {
  paquetesPaginados,
  totalPaginas,
  totalPaquetes,
  page,
  limit,
  search,
  loading,
  fetchPaquetes,
  agregarPaquete,
  actualizarPaquete,
  eliminarPaquete,
  dialogConfirmar,
  mensajeConfirmar,
  aceptar,
  cancelar,
} = usePaquetes();

onMounted(fetchPaquetes);
watch(search, () => { page.value = 1; });
</script>

<template>
  <v-app>
    <v-main class="main-content" theme="light">

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

        <div class="page-header">
          <div>
            <h1 class="page-title">Catálogo de Paquetes</h1>
            <p class="page-subtitle">Gestione la base de datos de paquetes.</p>
          </div>
          <ModalRegistrarPaquete @paqueteCreado="agregarPaquete" />
        </div>

        <div class="filters-row">
          <div class="search-wrapper">
            <v-text-field v-model="search" placeholder="Filtrar por folio, cliente, tamaño..."
              prepend-inner-icon="mdi-filter-variant" variant="outlined" density="compact"
              hide-details clearable class="search-field" />
          </div>
          <div class="items-per-page">
            <span>Mostrar:</span>
            <v-select v-model="limit" :items="[5, 10, 25, 50]" variant="outlined"
              density="compact" hide-details class="items-select" />
          </div>
        </div>

        <Tabla
          item-key="folio"
          :headers="[
            { title: 'Folio', key: 'folio' },
            { title: 'Cliente', key: 'nombre_cliente' },
            { title: 'Tamaño', key: 'tamano' },
            { title: 'Forma', key: 'forma' },
            { title: 'Peso (kg)', key: 'peso' },
            { title: 'Precio', key: 'precio' },
            { title: 'Acciones', key: 'acciones', sortable: false }
          ]"
          :items="paquetesPaginados"
          :loading="loading"
          :page="page"
          :limit="limit"
          :total-items="totalPaquetes"
          :total-paginas="totalPaginas"
          @editar="modalEditar?.abrirModal($event)"
          @eliminar="eliminarPaquete"
          @update:page="page = $event"
        />

        <div class="page-footer">
          <span>© 2026 NovaCode.</span>
        </div>

      </div>

      <ModalConfirmar :dialog="dialogConfirmar" :mensaje="mensajeConfirmar" @aceptar="aceptar" @cancelar="cancelar" />
      <ModalEditarPaquete ref="modalEditar" @paqueteEditado="actualizarPaquete" />

    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/catalogo.style.css"></style>