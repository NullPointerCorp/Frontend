<script setup lang="ts">
import { onMounted, watch } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import Tabla from '@/components/Tabla.vue'
import ModalRegistrarViaje from './components/ModalRegistrarViaje.vue'
import { useViajes } from '../controllers/useViajes'

const {
  viajesPaginados,
  totalPaginas,
  totalViajes,
  page,
  limit,
  search,
  loading,
  tipoFiltro,
  fetchViajes,
  agregarViaje,
} = useViajes()

onMounted(fetchViajes)
watch(search, () => { page.value = 1 })
watch(tipoFiltro, () => {
  page.value = 1
  fetchViajes()
})
</script>

<template>
  <v-app>
    <v-main class="main-content">
      <AppHeader />

      <div class="content-wrapper">
        <div class="page-header">
          <div>
            <h1 class="page-title">Catalogo de Viajes</h1>
            <p class="page-subtitle">Programacion y consulta de salidas y llegadas entre sucursales.</p>
          </div>
          <ModalRegistrarViaje @viajeCreado="agregarViaje" />
        </div>

        <div class="filters-row">
          <div class="search-wrapper">
            <v-text-field
              v-model="search"
              placeholder="Filtrar por viaje, transporte, origen o destino..."
              prepend-inner-icon="mdi-filter-variant"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              class="search-field"
            />
          </div>

          <v-select
            v-model="tipoFiltro"
            :items="[
              { title: 'Salidas', value: 'salidas' },
              { title: 'Entradas', value: 'entradas' },
              { title: 'Todos', value: 'todos' },
            ]"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
            class="items-select"
          />

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
          item-key="viaje_id"
          :headers="[
            { title: 'ID', key: 'viaje_id' },
            { title: 'Transporte', key: 'numero_serie' },
            { title: 'Transportista', key: 'transportista' },
            { title: 'Origen', key: 'origen' },
            { title: 'Destino', key: 'destino' },
            { title: 'Salida', key: 'fecha_salida' },
            { title: 'Llegada', key: 'fecha_llegada' },
          ]"
          :items="viajesPaginados"
          :loading="loading"
          :page="page"
          :limit="limit"
          :total-items="totalViajes"
          :total-paginas="totalPaginas"
          @update:page="page = $event"
        />

        <div class="page-footer">
          <span>© 2026 NovaLogistics.</span>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/catalogo.style.css"></style>
