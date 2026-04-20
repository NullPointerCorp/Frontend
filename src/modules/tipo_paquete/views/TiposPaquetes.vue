<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useTipoPaquete } from "../controllers/useTipoPaquetes";
import { useAuthStore } from "@/modules/auth/store/auth.store";

import ModalRegistrarPaquete from "./components/ModalRegistrarTipoPaquete.vue";
import ModalEditarPaquete from "./components/ModalEditarTipoPaquete.vue";
import ModalConfirmar from "@/components/ModalConfirmar.vue";
import Tabla from "@/components/Tabla.vue";
import AppHeader from "@/components/AppHeader.vue";

const authStore = useAuthStore();
const modalEditar = ref<any>(null);

const {
  tiposPaquetesPaginados,
  totalPaginas,
  totalTiposPaquetes,
  page,
  limit,
  search,
  loading,
  fetchTiposPaquetes,
  agregarTipoPaquete,
  actualizarTipoPaquete,
  eliminarTipoPaquete,
  dialogConfirmar,
  mensajeConfirmar,
  aceptar,
  cancelar,
} = useTipoPaquete();

onMounted(fetchTiposPaquetes);
watch(search, () => { page.value = 1; });
</script>

<template>
  <v-app>
    <v-main class="main-content">

      <AppHeader />

      <div class="content-wrapper">

        <div class="page-header">
          <div>
            <h1 class="page-title">Catálogo de Tipos de Paquetes</h1>
            <p class="page-subtitle">Gestione la base de datos de tipos de paquetes.</p>
          </div>
          <ModalRegistrarPaquete @paqueteCreado="agregarTipoPaquete" />
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
            { title: 'ID', key: 'tipo_paquete_id' },
            { title: 'Tamaño', key: 'tamanio' },
            { title: 'Forma', key: 'forma' },
            { title: 'Precio', key: 'precio' },
            { title: 'Acciones', key: 'acciones', sortable: false }
          ]"
          :items="tiposPaquetesPaginados"
          :loading="loading"
          :page="page"
          :limit="limit"
          :total-items="totalTiposPaquetes"
          :total-paginas="totalPaginas"
          @editar="modalEditar?.abrirModal($event)"
          @eliminar="eliminarTipoPaquete"
          @update:page="page = $event"
        />

        <div class="page-footer">
          <span>© 2026 NovaCode.</span>
        </div>

      </div>

      <ModalConfirmar :dialog="dialogConfirmar" :mensaje="mensajeConfirmar" @aceptar="aceptar" @cancelar="cancelar" />
      <ModalEditarPaquete ref="modalEditar" @paqueteEditado="actualizarTipoPaquete" />

    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/catalogo.style.css"></style>
