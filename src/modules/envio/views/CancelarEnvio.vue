<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useCancelarEnvio } from "../controllers/useCancelarEnvio";
import ModalConfirmar from "@/components/ModalConfirmar.vue";
import ModalMotivoCancelacion from "./components/ModalMotivoCancelacion.vue";
import AppHeader from "@/components/AppHeader.vue";

const router = useRouter();

const {
  enviosPaginados,
  totalPaginas,
  totalEnvios,
  page,
  limit,
  search,
  loading,
  fetchEnvios,
  dialogConfirmar,
  mensajeConfirmar,
  aceptar,
  cancelar,
  dialogMotivo,
  motivo,
  solicitarCancelacion,
  confirmarCancelacion,
  cancelarMotivo,
} = useCancelarEnvio();

onMounted(fetchEnvios);
watch(search, () => { page.value = 1; });
</script>

<template>
  <v-app>
    <v-main class="main-content">

      <AppHeader />

      <div class="content-wrapper">

        <!-- Volver -->
        <div class="mb-4">
          <v-btn variant="text" prepend-icon="mdi-chevron-left" @click="router.back()">
            Volver
          </v-btn>
        </div>

        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Cancelar Envío</h1>
            <p class="page-subtitle">Complete los datos para cancelar un envío en el sistema de logística.</p>
          </div>
        </div>

        <!-- Filtro -->
        <div class="filters-row">
          <div class="search-wrapper">
            <v-text-field
              v-model="search"
              placeholder="Filtrar por correo o folio"
              prepend-inner-icon="mdi-filter-variant"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              class="search-field"
            />
          </div>
        </div>

        <!-- Tabla -->
        <v-card class="table-card">
          <div class="table-scroll">
            <v-data-table
              :headers="[
                { title: 'Folio', key: 'envio_id' },
                { title: 'Correo', key: 'correo' },
                { title: 'Tamaño de Paquete', key: 'tamanio' },
                { title: '', key: 'acciones', sortable: false },
              ]"
              :items="enviosPaginados"
              :loading="loading"
              hide-default-footer
              :items-per-page="-1"
            >
              <template #no-data>
                <div class="no-data">
                  <v-icon size="48" color="on-surface">mdi-database-off-outline</v-icon>
                  <p>No hay registros disponibles</p>
                </div>
              </template>

              <template #item.acciones="{ item }">
                <v-btn
                  color="red"
                  size="small"
                  @click="solicitarCancelacion(item)"
                >
                  <v-icon start size="16">mdi-close</v-icon>
                  Cancelar
                </v-btn>
              </template>
            </v-data-table>
          </div>

          <div class="table-footer">
            <span class="results-info">
              Mostrando {{ Math.min((page - 1) * limit + 1, totalEnvios) }} a
              {{ Math.min(page * limit, totalEnvios) }} de
              {{ totalEnvios.toLocaleString() }} resultados
            </span>
            <v-pagination
              :model-value="page"
              :length="totalPaginas"
              :total-visible="5"
              density="compact"
              @update:model-value="page = $event"
            />
          </div>
        </v-card>

        <!-- Footer -->
        <div class="page-footer">
          <span>© 2026 NovaCode.</span>
        </div>

      </div>

      <!-- Modales -->
      <ModalConfirmar
        :dialog="dialogConfirmar"
        :mensaje="mensajeConfirmar"
        @aceptar="aceptar"
        @cancelar="cancelar"
      />

      <ModalMotivoCancelacion
        :dialog="dialogMotivo"
        :motivo="motivo"
        @update:motivo="motivo = $event"
        @aceptar="confirmarCancelacion"
        @cancelar="cancelarMotivo"
      />

    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/catalogo.style.css"></style>

<style scoped>
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.9rem;
}

.table-scroll {
  max-height: 500px;
  overflow-y: auto;
}

.table-scroll :deep(thead) {
  position: sticky;
  top: 0;
  z-index: 1;
  background: rgb(var(--v-theme-surface));
}
</style>
