<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useTransporte } from '@/modules/transporte/controllers/useTransporte'

import ModalRegistrarTransporte from './components/ModalRegistrarTransporte.vue'
import ModalEditarTransporte from './components/ModalEditarTransporte.vue'
import ModalConfirmar from '@/components/ModalConfirmar.vue'

import Tabla from '@/components/Tabla.vue'
import AppHeader from '@/components/AppHeader.vue'

const modalEditar = ref<any>(null)

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
  dialogConfirmar,
  mensajeConfirmar,
  aceptar,
  cancelar,
} = useTransporte()

onMounted(fetchTransportes)
watch(search, () => { page.value = 1 })
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
            <h1 class="page-title">Catálogo de Transporte</h1>
            <p class="page-subtitle">Gestión y monitoreo de la flota de vehículos de la red logística.</p>
          </div>
          <ModalRegistrarTransporte @transporteCreado="agregarTransporte" />
        </div>

        <!-- Filtros -->
        <div class="filters-row">
          <div class="search-wrapper">
            <v-text-field
              v-model="search"
              placeholder="Filtrar por numero de serie, o transportista..."
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
        <Tabla
          item-key="numero_serie"
          :headers="[
            { title: 'Numero de Serie', key: 'numero_serie' },
            { title: 'Transportista', key: 'transportista' },
            { title: 'Tipo de Transporte', key: 'tipo_transporte' },
            { title: 'Subtipo de Transporte', key: 'subtipo_transporte' },
            { title: 'Capacidad de Carga', key: 'capacidad_carga' },
            { title: 'Unidad de Medida', key: 'unidad_medida' },
            { title: 'Placas', key: 'placa' },
            { title: 'Acciones', key: 'acciones', sortable: false },
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
      <ModalEditarTransporte ref="modalEditar" @transporteEditado="actualizarTransporte" />

    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/catalogo.style.css"></style>
