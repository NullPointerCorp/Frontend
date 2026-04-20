<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useEditarTipoPaquete } from '@/modules/tipo_paquete/controllers/useEditarTipoPaquete'
import type { TipoPaquete } from '@/modules/tipo_paquete/interfaces/paquete-interface'

const emit = defineEmits<{ (e: 'paqueteEditado', tipo_paquete: TipoPaquete): void }>()

const {
  dialog,
  loading,
  form,
  erroresForm,
  paqueteSeleccionado,
  abrirModal,
  cerrarModal,
  editarTipoPaquete,
} = useEditarTipoPaquete((tipo_paquete) => emit('paqueteEditado', tipo_paquete))

const precioCalculado = computed(() =>
  form.value.precio !== undefined ? form.value.precio : null
)

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') cerrarModal()
  if (e.key === 'Enter' && !(e.target instanceof HTMLInputElement)) editarTipoPaquete()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

defineExpose({ abrirModal })
</script>

<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card">

      <!-- HEADER -->
      <div class="modal-header">
        <button class="back-link" type="button" @click="cerrarModal">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Editar Paquete</h1>
        <p class="modal-subtitle">Actualiza la información del paquete.</p>
      </div>

      <!-- FORM -->
      <v-form @submit.prevent="editarTipoPaquete" class="modal-form">

        <!-- Folio -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Folio</label>
            <div class="readonly-field">{{ paqueteSeleccionado?.tipo_paquete_id }}</div>
          </div>
        </div>

        <!-- Tamaño y Forma -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              Tamaño <span class="required">*</span>
            </label>
            <v-text-field
              v-model="form.tamanio"
              variant="outlined"
              density="comfortable"
              placeholder="Ej: chico, mediano, grande"
              hide-details="auto"
              :error-messages="erroresForm.tamanio"
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              Forma <span class="required">*</span>
            </label>
            <v-text-field
              v-model="form.forma"
              variant="outlined"
              density="comfortable"
              placeholder="Ej: caja, sobre, irregular"
              hide-details="auto"
              :error-messages="erroresForm.forma"
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              Precio <span class="required">*</span>
            </label>
            <v-text-field
              v-model="form.precio"
              variant="outlined"
              density="comfortable"
              placeholder="Ej: 99.99"
              hide-details="auto"
              :error-messages="erroresForm.precio"
            />
          </div>
        </div>

        <!-- BOTONES -->
        <div class="modal-actions">
          <v-btn
            class="cancel-btn"
            variant="outlined"
            type="button"
            :disabled="loading"
            @click="cerrarModal"
          >
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>

          <v-btn
            class="save-btn"
            type="submit"
            :loading="loading"
          >
            <v-icon start>mdi-content-save-outline</v-icon>
            Guardar Paquete
          </v-btn>
        </div>

      </v-form>

      <!-- FOOTER -->
      <div class="modal-footer">
        <span>© 2026 NovaCode.</span>
      </div>

    </v-card>
  </v-dialog>
</template>

<style src="@/assets/styles/modal.style.css"></style>
