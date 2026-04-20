<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useEditarTransporte } from '@/modules/transporte/controllers/useEditarTransporte'
import type { Transporte } from '@/modules/transporte/interfaces/transporte-interface'

const emit = defineEmits<{ (e: 'transporteEditado', transporte: Transporte): void }>()

const {
  dialog,
  loading,
  form,
  erroresForm,
  transporteSeleccionado,
  transportistas,
  loadingTransportistas,
  abrirModal,
  cerrarModal,
  editarTransporte,
} = useEditarTransporte((transporte) => emit('transporteEditado', transporte))

const unidadesMedida = ['kg', 'ton', 'lb']

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') cerrarModal()
  if (e.key === 'Enter' && !(e.target instanceof HTMLInputElement)) editarTransporte()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

defineExpose({ abrirModal })
</script>

<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card">

      <div class="modal-header">
        <button class="back-link" type="button" @click="cerrarModal">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Editar Transporte</h1>
        <p class="modal-subtitle">Actualice los datos de un transporte ya existente en el sistema.</p>
      </div>

      <v-form @submit.prevent="editarTransporte" class="modal-form">

        <div class="form-section-title">
          <v-icon size="16">mdi-truck-outline</v-icon>
          DATOS DEL TRANSPORTE
        </div>

        <div class="form-group full-width">
          <label class="form-label">Número de Serie</label>
          <div class="readonly-field">{{ transporteSeleccionado?.numero_serie }}</div>
        </div>

        <div class="form-group full-width">
          <label class="form-label">Transportista</label>
          <v-select
            v-model="form.empleado_id"
            :items="transportistas"
            :item-title="(t) => `${t.nombre} ${t.apellido_paterno}`"
            item-value="empleado_id"
            placeholder="Seleccionar Transportista"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :loading="loadingTransportistas"
            :error-messages="erroresForm.empleado_id"
          />
        </div>

        <div class="form-group full-width">
          <label class="form-label">Capacidad de Carga <span class="required">*</span></label>
          <v-text-field
            v-model.number="form.capacidad_carga"
            type="number"
            placeholder="Ej: 50"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :error-messages="erroresForm.capacidad_carga"
          />
        </div>

        <div class="form-group full-width">
          <label class="form-label">Unidad de Medida <span class="required">*</span></label>
          <v-select
            v-model="form.unidad_medida"
            :items="unidadesMedida"
            placeholder="Seleccionar Medida"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :error-messages="erroresForm.unidad_medida"
          />
        </div>

        <div class="form-group full-width">
          <label class="form-label">Placas (Solo Transporte Terrestre)</label>
          <v-text-field
            v-model="form.placa"
            placeholder="Ej: TCV-7498"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :error-messages="erroresForm.placa"
          />
        </div>

        <div class="modal-actions">
          <v-btn class="cancel-btn" variant="outlined" type="button" :disabled="loading" @click="cerrarModal">
            <v-icon start>mdi-close</v-icon> Cancelar
          </v-btn>
          <v-btn class="save-btn" type="submit" :loading="loading">
            <v-icon start>mdi-content-save-outline</v-icon> Confirmar
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
