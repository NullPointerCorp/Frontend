<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import Tabla from '@/components/Tabla.vue'
import ModalRegistrarViaje from './components/ModalRegistrarViaje.vue'
import ModalEditarViaje from './components/ModalEditarViaje.vue'
import ModalConfirmar from '@/components/ModalConfirmar.vue'
import { useViajes } from '../controllers/useViajes'
import type { EstadoViaje } from '../interfaces/viaje-interface'

const modalEditar = ref<any>(null)

const {
  viajesPaginados,
  totalPaginas,
  totalViajes,
  page,
  limit,
  search,
  loading,
  tipoFiltro,
  filtroEstado,
  fechaDesde,
  fechaHasta,
  fetchViajes,
  agregarViaje,
  actualizarViaje,
  cancelarViaje,
  dialogConfirmar,
  mensajeConfirmar,
  textoAceptar,
  colorAceptar,
  aceptar,
  cancelar,
} = useViajes()

onMounted(fetchViajes)
watch(search,       () => { page.value = 1 })
watch(filtroEstado, () => { page.value = 1 })
watch(fechaDesde,   () => { page.value = 1 })
watch(fechaHasta,   () => { page.value = 1 })
watch(tipoFiltro,   () => { page.value = 1; fetchViajes() })

const estadoConfig: Record<EstadoViaje, { color: string; label: string }> = {
  programado:  { color: 'primary',  label: 'Programado'  },
  en_camino:   { color: 'warning',  label: 'En camino'   },
  entregado:   { color: 'success',  label: 'Entregado'   },
  regresando:  { color: 'purple',   label: 'Regresando'  },
  finalizado:  { color: 'default',  label: 'Finalizado'  },
  cancelado:   { color: 'error',    label: 'Cancelado'   },
}
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

          <v-select
            v-model="filtroEstado"
            :items="[
              { title: 'Todos los estados', value: '' },
              { title: 'Programado',  value: 'programado'  },
              { title: 'En camino',   value: 'en_camino'   },
              { title: 'Entregado',   value: 'entregado'   },
              { title: 'Regresando',  value: 'regresando'  },
              { title: 'Finalizado',  value: 'finalizado'  },
              { title: 'Cancelado',   value: 'cancelado'   },
            ]"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
            class="items-select"
          />

          <v-text-field
            v-model="fechaDesde"
            label="Salida desde"
            type="date"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            class="items-select"
          />

          <v-text-field
            v-model="fechaHasta"
            label="Salida hasta"
            type="date"
            variant="outlined"
            density="compact"
            hide-details
            clearable
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
            { title: 'Estado', key: 'estado', sortable: false },
            { title: 'Acciones', key: 'acciones', sortable: false },
          ]"
          :items="viajesPaginados"
          :loading="loading"
          :page="page"
          :limit="limit"
          :total-items="totalViajes"
          :total-paginas="totalPaginas"
          @update:page="page = $event"
        >
          <template #item.estado="{ item }">
            <v-chip
              size="small"
              :color="estadoConfig[item.estado as EstadoViaje]?.color"
              variant="tonal"
            >
              {{ estadoConfig[item.estado as EstadoViaje]?.label ?? item.estado }}
            </v-chip>
          </template>

          <template #acciones="{ item }">
            <v-btn
              v-if="item.estado === 'programado'"
              icon variant="text" size="small"
              @click="modalEditar?.abrirModal(item)"
            >
              <v-icon size="18">mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn
              v-if="item.estado === 'programado'"
              icon variant="text" size="small" color="warning"
              @click="cancelarViaje(item)"
            >
              <v-icon size="18">mdi-cancel</v-icon>
            </v-btn>
          </template>
        </Tabla>

        <div class="page-footer">
          <span>© 2026 NovaLogistics.</span>
        </div>
      </div>

      <ModalConfirmar
        :dialog="dialogConfirmar"
        :mensaje="mensajeConfirmar"
        :texto-aceptar="textoAceptar"
        :color-aceptar="colorAceptar"
        @aceptar="aceptar"
        @cancelar="cancelar"
      />
      <ModalEditarViaje ref="modalEditar" @viajeEditado="actualizarViaje" />

    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/catalogo.style.css"></style>
