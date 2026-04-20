<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRegistrarTipoPaquete } from '@/modules/tipo_paquete/controllers/useRegistrarTipoPaquete'
import type { TipoPaquete } from '@/modules/tipo_paquete/interfaces/paquete-interface'

const emit = defineEmits<{ paqueteCreado: [paquete: TipoPaquete] }>()

const {
  dialog,
  loading,
  form,
  erroresForm,
  abrirModal,
  cerrarModal,
  registrarTipoPaquete,
} = useRegistrarTipoPaquete((paquete) => emit('paqueteCreado', paquete))

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') cerrarModal()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <v-btn color="primary" class="register-btn" @click="abrirModal">
    <v-icon start>mdi-plus</v-icon>
    Registrar Nuevo Tipo de paquete
  </v-btn>

  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card">

      <div class="modal-header">
        <button class="back-link" type="button" @click="cerrarModal">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Registrar Tipo de paquete</h1>
        <p class="modal-subtitle">Complete los datos necesarios para dar de alta un nuevo tipo de paquete en el sistema.</p>
      </div>

      <v-form @submit.prevent="registrarTipoPaquete" class="modal-form">

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tamaño de caja <span class="required">*</span></label>
            <v-text-field
              v-model="form.tamanio"
              placeholder="Ej: Grande"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :error-messages="erroresForm.tamanio"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Forma del paquete <span class="required">*</span></label>
            <v-text-field
              v-model="form.forma"
              placeholder="Ej: Cuadrada"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :error-messages="erroresForm.forma"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <v-icon size="14" class="label-icon">mdi-currency-usd</v-icon>
              Precio <span class="required">*</span>
            </label>
            <v-text-field
              v-model.number="form.precio"
              type="number"
              placeholder="Ej: 99.99"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :error-messages="erroresForm.precio"
            />
          </div>
        </div>

        <div class="modal-actions">
          <v-btn variant="outlined" class="cancel-btn" type="button" :disabled="loading" @click="cerrarModal">
            <v-icon start>mdi-close</v-icon> Cancelar
          </v-btn>
          <v-btn type="submit" class="save-btn" :loading="loading">
            <v-icon start>mdi-content-save-outline</v-icon> Registrar paquete
          </v-btn>
        </div>

      </v-form>

      <div class="modal-footer">
        <span>© 2026 NovaCode.</span>
      </div>

    </v-card>
  </v-dialog>
</template>

<style src="@/assets/styles/modal.style.css"></style>
