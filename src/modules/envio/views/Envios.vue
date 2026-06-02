<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useEnvios } from "../controllers/useEnvios";
import type { EnvioConsultaDTO } from "../interfaces/envio-interface";
import { estadoEnvioConfig } from "../interfaces/envio-interface";
import ModalConfirmar from "@/components/ModalConfirmar.vue";
import ModalRegistrarEnvio from "./components/ModalRegistrarEnvio.vue";
import ModalMotivoCancelacion from "./components/ModalMotivoCancelacion.vue";
import ModalDetalleEnvio from "./components/ModalDetalleEnvio.vue";
import AppHeader from "@/components/AppHeader.vue";

const estadoEnvio = (estado: string) => {
  const key = estado.trim().toLowerCase().replace(/\s+/g, '_') as keyof typeof estadoEnvioConfig
  return estadoEnvioConfig[key] ?? { color: 'primary', label: estado }
}

const {
  enviosPaginados,
  totalPaginas,
  totalEnvios,
  page,
  limit,
  search,
  loading,
  filtroEstado,
  fetchEnvios,
  dialogConfirmar,
  aceptar,
  cancelar,
  mensajeConfirmar,
  dialogMotivo,
  motivo,
  solicitarCancelacion,
  confirmarCancelacion,
  cancelarMotivo,
} = useEnvios();

const dialogDetalle = ref(false);
const envioDetalle = ref<EnvioConsultaDTO | null>(null);

const abrirDetalle = (envio: EnvioConsultaDTO) => {
  envioDetalle.value = envio;
  dialogDetalle.value = true;
};

const cerrarDetalle = () => {
  dialogDetalle.value = false;
  envioDetalle.value = null;
};

const puedeCancelarEnvio = (estado: string) => {
  return ["registrado", "en_espera"].includes(
    estado.trim().toLowerCase().replace(/\s+/g, "_"),
  );
};

onMounted(fetchEnvios);
watch(search,       () => { page.value = 1; });
watch(filtroEstado, () => { page.value = 1; });
</script>

<template>
  <v-app>
    <v-main class="main-content">
      <AppHeader />

      <div class="content-wrapper">
        <div class="page-header">
          <div>
            <h1 class="page-title">Catálogo de Envíos</h1>
            <p class="page-subtitle">Gestione el registro y cancelacion de envios.</p>
          </div>

          <ModalRegistrarEnvio @envioCreado="fetchEnvios" />
        </div>

        <div class="filters-row">
          <div class="search-wrapper">
            <v-text-field
              v-model="search"
              placeholder="Filtrar por folio, correo, descripcion, origen o destino..."
              prepend-inner-icon="mdi-filter-variant"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              class="search-field"
            />
          </div>
          <v-select
            v-model="filtroEstado"
            :items="[
              { title: 'Todos los estados', value: '' },
              { title: 'En Espera',   value: 'en_espera'  },
              { title: 'Registrado',  value: 'registrado' },
              { title: 'En Camino',   value: 'en_camino'  },
              { title: 'Entregado',   value: 'entregado'  },
              { title: 'Cancelado',   value: 'cancelado'  },
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

        <v-card class="table-card">
          <div class="table-scroll">
            <v-data-table
              :headers="[
                { title: 'Folio', key: 'envio_id' },
                { title: 'Correo de Cliente', key: 'correo' },
                { title: 'Tipo de Paquete', key: 'tamanio' },
                { title: 'Transporte', key: 'nombre_subtipo' },
                { title: 'Fecha de Salida', key: 'fecha_salida' },
                { title: 'Destino', key: 'destino' },
                { title: 'Estado', key: 'estado_envio' },
                { title: 'Acciones', key: 'acciones', sortable: false },
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

              <template #item.estado_envio="{ item }">
                <v-chip
                  size="small"
                  :color="estadoEnvio(item.estado_envio).color"
                  variant="tonal"
                >
                  {{ estadoEnvio(item.estado_envio).label }}
                </v-chip>
              </template>

              <template #item.nombre_subtipo="{ item }">
                {{ item.nombre_subtipo || "Sin asignar" }}
              </template>

              <template #item.fecha_salida="{ item }">
                {{ item.fecha_salida || "En espera" }}
              </template>

              <template #item.acciones="{ item }">
                <div class="actions-cell">
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    title="Ver detalles"
                    @click="abrirDetalle(item)"
                  >
                    <v-icon size="18">mdi-eye-outline</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="error"
                    variant="text"
                    size="small"
                    title="Cancelar envio"
                    :disabled="!puedeCancelarEnvio(item.estado_envio)"
                    @click="solicitarCancelacion(item)"
                  >
                    <v-icon size="18">mdi-close-circle-outline</v-icon>
                  </v-btn>
                </div>
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

        <div class="page-footer">
          <span>© 2026 NovaCode.</span>
        </div>
      </div>

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

      <ModalDetalleEnvio
        :dialog="dialogDetalle"
        :envio="envioDetalle"
        @cerrar="cerrarDetalle"
      />
    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/catalogo.style.css"></style>

<style scoped>
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

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.9rem;
}
</style>
