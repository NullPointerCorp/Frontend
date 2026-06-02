<script setup lang="ts">
import { useEditarViaje } from '../../controllers/useEditarViaje'
import type { Viaje } from '../../interfaces/viaje-interface'

const emit = defineEmits<{ viajeEditado: [viaje: Viaje] }>()

const {
  dialog,
  loading,
  loadingTransportes,
  form,
  erroresForm,
  transportes,
  viajeSeleccionado,
  nombreTransporte,
  abrirModal,
  cerrarModal,
  editarViaje,
} = useEditarViaje((viaje) => emit('viajeEditado', viaje))

defineExpose({ abrirModal })
</script>

<template>
  <v-dialog v-model="dialog" max-width="560" persistent>
    <v-card class="modal-card">
      <div class="modal-header">
        <button class="back-link" type="button" @click="cerrarModal">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catalogo
        </button>
        <h1 class="modal-title">Editar Viaje</h1>
        <p class="modal-subtitle">
          Viaje #{{ viajeSeleccionado?.viaje_id }} — {{ viajeSeleccionado?.origen }} →
          {{ viajeSeleccionado?.destino }}
        </p>
      </div>

      <v-form class="modal-form" @submit.prevent="editarViaje">
        <div class="form-section-title">
          <v-icon size="16">mdi-truck-outline</v-icon>
          TRANSPORTE
        </div>

        <div class="form-group full-width">
          <label class="form-label">Transporte <span class="required">*</span></label>
          <v-select
            v-model="form.numero_serie"
            :items="transportes"
            :item-title="nombreTransporte"
            item-value="numero_serie"
            placeholder="Seleccionar transporte"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :loading="loadingTransportes"
            :error-messages="erroresForm.numero_serie"
          />
        </div>

        <div class="form-section-title">
          <v-icon size="16">mdi-calendar-clock</v-icon>
          FECHAS
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Fecha de salida <span class="required">*</span></label>
            <v-text-field
              v-model="form.fecha_salida"
              type="datetime-local"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :error-messages="erroresForm.fecha_salida"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Fecha de llegada <span class="required">*</span></label>
            <v-text-field
              v-model="form.fecha_llegada"
              type="datetime-local"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :error-messages="erroresForm.fecha_llegada"
            />
          </div>
        </div>

        <div class="modal-actions">
          <v-btn class="cancel-btn" variant="outlined" type="button" :disabled="loading" @click="cerrarModal">
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn class="save-btn" type="submit" :loading="loading">
            <v-icon start>mdi-content-save-outline</v-icon>
            Guardar
          </v-btn>
        </div>
      </v-form>

      <div class="modal-footer">
        <span>© 2026 NovaLogistics.</span>
      </div>
    </v-card>
  </v-dialog>
</template>

<style src="@/assets/styles/modal.style.css"></style>
