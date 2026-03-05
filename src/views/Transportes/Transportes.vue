<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useTransportes } from "@/composables/useTransportes";
import { useAuthStore } from "@/stores/auth.store";

import ModalRegistrarTransporte from "./components/ModalRegistrarTransporte.vue";
import ModalEditarTransporte from "./components/ModalEditarTransporte.vue";
import ModalConfirmar from "@/components/ModalConfirmar.vue";
import Tabla from "@/components/Tabla.vue";

const authStore = useAuthStore();
const modalEditar = ref<any>(null);

const {
  transportesPaginados,
  totalPaginas,
  totalTransportes,
  page,
  limit,
  search,
  loading,
  fetchTransportes,
  agregarTransporte,
  actualizarTransporte,
  eliminarTransporte,
  mensajeConfirmar,
  dialogConfirmar,
  aceptar,
  cancelar,
} = useTransportes();

onMounted(fetchTransportes);
watch(search, () => {
  page.value = 1;
});
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
            <h1 class="page-title">Catálogo de Transportes</h1>
            <p class="page-subtitle">Gestión y monitoreo de la flota de vehículos de la red logística.</p>
          </div>
          <ModalRegistrarTransporte @transporteCreado="agregarTransporte" />
        </div>

        <div class="filters-row">
          <div class="search-wrapper">
            <v-text-field
              v-model="search"
              placeholder="Filtrar por serie, transportista o placas..."
              prepend-inner-icon="mdi-filter-variant"
              variant="outlined"
              density="compact"
              hide-details
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

        <Tabla
          item-key="transporte_id"
          :headers="[
            { title: 'Numero de Serie', key: 'numero_serie' },
            { title: 'Transportista', key: 'nombre_transportista' },
            { title: 'Tipo de Transporte', key: 'tipo_transporte' },
            { title: 'Subtipo de Transporte', key: 'subtipo_transporte' },
            { title: 'Capacidad de Carga', key: 'capacidad_carga' },
            { title: 'Unidad de Medida', key: 'unidad_medida' },
            { title: 'Placas', key: 'placas' },
            { title: 'Acciones', key: 'acciones', sortable: false }
          ]"
          :items="transportesPaginados"
          :loading="loading"
          :page="page"
          :limit="limit"
          :total-items="totalTransportes"
          :total-paginas="totalPaginas"
          @editar="modalEditar?.abrirModal($event)"
          @eliminar="eliminarTransporte"
          @update:page="page = $event"
        />

        <div class="page-footer">
          <span>© 2026 NovaLogistics.</span>
        </div>
      </div>

      <ModalConfirmar :dialog="dialogConfirmar" :mensaje="mensajeConfirmar" @aceptar="aceptar" @cancelar="cancelar" />
      <ModalEditarTransporte ref="modalEditar" @transporteEditado="actualizarTransporte" />
    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/catalogo.style.css"></style>
