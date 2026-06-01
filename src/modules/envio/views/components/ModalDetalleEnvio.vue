<script setup lang="ts">
import type { EnvioConsultaDTO } from "../../interfaces/envio-interface";
import { estadoEnvioConfig } from "../../interfaces/envio-interface";

const estadoEnvio = (estado: string) => {
  const key = estado.trim().toLowerCase().replace(/\s+/g, '_') as keyof typeof estadoEnvioConfig
  return estadoEnvioConfig[key] ?? { color: 'primary', label: estado }
}

defineProps<{
  dialog: boolean;
  envio: EnvioConsultaDTO | null;
}>();

defineEmits<{
  cerrar: [];
}>();
</script>

<template>
  <v-dialog :model-value="dialog" max-width="780" persistent>
    <v-card class="modal-card">
      <div class="modal-header">
        <button class="back-link" type="button" @click="$emit('cerrar')">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver a Envios
        </button>
        <h1 class="modal-title">Detalles de Envio</h1>
        <p class="modal-subtitle">
          Folio {{ envio?.envio_id ?? "-" }}
        </p>
      </div>

      <div v-if="envio" class="modal-form detail-sections">
        <section class="detail-section">
          <h2 class="detail-title">
            <v-icon size="18">mdi-account-outline</v-icon>
            Cliente
          </h2>
          <div class="detail-grid">
            <div>
              <span class="detail-label">Correo</span>
              <strong>{{ envio.correo }}</strong>
            </div>
            <div>
              <span class="detail-label">Estado del envio</span>
              <v-chip
                size="small"
                :color="estadoEnvio(envio.estado_envio).color"
                variant="tonal"
              >
                {{ estadoEnvio(envio.estado_envio).label }}
              </v-chip>
            </div>
          </div>
        </section>

        <section class="detail-section">
          <h2 class="detail-title">
            <v-icon size="18">mdi-package-variant-closed</v-icon>
            Paquete
          </h2>
          <div class="detail-grid">
            <div class="detail-wide">
              <span class="detail-label">Descripcion</span>
              <strong>{{ envio.descripcion }}</strong>
            </div>
            <div>
              <span class="detail-label">Tipo</span>
              <strong>{{ envio.tamanio }}</strong>
            </div>
            <div>
              <span class="detail-label">Forma</span>
              <strong>{{ envio.forma }}</strong>
            </div>
            <div>
              <span class="detail-label">Peso</span>
              <strong>{{ envio.peso }} kg</strong>
            </div>
            <div>
              <span class="detail-label">Precio</span>
              <strong>${{ Number(envio.precio).toFixed(2) }}</strong>
            </div>
          </div>
        </section>

        <section class="detail-section">
          <h2 class="detail-title">
            <v-icon size="18">mdi-truck-outline</v-icon>
            Transporte
          </h2>
          <div class="detail-grid">
            <div>
              <span class="detail-label">No. de serie</span>
              <strong>{{ envio.numero_serie || "Sin asignar" }}</strong>
            </div>
            <div>
              <span class="detail-label">Tipo de transporte</span>
              <strong>{{ envio.nombre_subtipo || "Sin asignar" }}</strong>
            </div>
          </div>
        </section>

        <section class="detail-section">
          <h2 class="detail-title">
            <v-icon size="18">mdi-badge-account-horizontal-outline</v-icon>
            Empleado de registro
          </h2>
          <div class="detail-grid">
            <div>
              <span class="detail-label">Nombre</span>
              <strong>{{ envio.nombre_empleado }}</strong>
            </div>
          </div>
        </section>

        <section class="detail-section">
          <h2 class="detail-title">
            <v-icon size="18">mdi-map-marker-path</v-icon>
            Viaje
          </h2>
          <div class="detail-grid">
            <div>
              <span class="detail-label">Origen</span>
              <strong>{{ envio.origen }}</strong>
            </div>
            <div>
              <span class="detail-label">Destino</span>
              <strong>{{ envio.destino }}</strong>
            </div>
          </div>
        </section>

        <section class="detail-section">
          <h2 class="detail-title">
            <v-icon size="18">mdi-calendar-clock</v-icon>
            Fechas
          </h2>
          <div class="detail-grid">
            <div>
              <span class="detail-label">Fecha de salida</span>
              <strong>{{ envio.fecha_salida || "En espera" }}</strong>
            </div>
            <div>
              <span class="detail-label">Fecha de llegada</span>
              <strong>{{ envio.fecha_llegada || "Pendiente" }}</strong>
            </div>
          </div>
        </section>

        <div class="modal-actions">
          <v-btn color="primary" variant="flat" @click="$emit('cerrar')">
            <v-icon start>mdi-check</v-icon>
            Entendido
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<style src="@/assets/styles/modal.style.css"></style>

<style scoped>
.detail-sections {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detail-section {
  padding: 16px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  background: rgba(var(--v-theme-on-surface), 0.025);
}

.detail-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  color: rgb(var(--v-theme-on-surface));
  font-size: 0.95rem;
  font-weight: 700;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.detail-wide {
  grid-column: 1 / -1;
}

.detail-label {
  display: block;
  margin-bottom: 4px;
  color: rgba(var(--v-theme-on-surface), 0.65);
  font-size: 0.78rem;
}

@media (max-width: 700px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
