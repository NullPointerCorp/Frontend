<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useEditarPaquete } from '@/composables/useEditarPaquete'
import type { Paquete } from '@/types/paquete.types'

const emit = defineEmits<{ (e: 'paqueteEditado', paquete: Paquete): void }>()

const { dialog, loading, errorMessage, form, paqueteSeleccionado, abrirModal, editarPaquete } =
  useEditarPaquete((paquete) => emit('paqueteEditado', paquete))

const tamanioOpciones = [
  { title: 'Pequeño', value: 'Pequeño' },
  { title: 'Mediano', value: 'Mediano' },
  { title: 'Grande', value: 'Grande' },
  { title: 'Extra Grande', value: 'Extra Grande' },
]

const formaOpciones = [
  { title: 'Cuadrada', value: 'cuadrada' },
  { title: 'Rectangular', value: 'rectangular' },
  { title: 'Circular', value: 'circular' },
]

const precioCalculado = computed(() => {
  return form.value.precio !== undefined ? form.value.precio : null
})

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') dialog.value = false
  if (e.key === 'Enter' && !(e.target instanceof HTMLInputElement)) editarPaquete()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

defineExpose({ abrirModal })
</script>

<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card" theme="light">

      <div class="modal-header">
        <button class="back-link" type="button" @click="dialog = false">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Editar Paquete</h1>
        <p class="modal-subtitle">Actualice la información del paquete.</p>
      </div>

      <div class="modal-form">

        <!-- Folio y Cliente (readonly) -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Folio</label>
            <div class="readonly-field">{{ paqueteSeleccionado?.folio }}</div>
          </div>
          <div class="form-group">
            <label class="form-label">Cliente</label>
            <div class="readonly-field">{{ paqueteSeleccionado?.nombre_cliente }}</div>
          </div>
        </div>

        <!-- Tamaño y Forma -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tamaño <span class="required">*</span></label>
            <v-select
              v-model="form.tamano"
              :items="tamanioOpciones"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Forma <span class="required">*</span></label>
            <v-select
              v-model="form.forma"
              :items="formaOpciones"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>
        </div>

        <!-- Peso y Precio -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Peso (kg) <span class="required">*</span></label>
            <v-text-field
              v-model.number="form.peso"
              type="number"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              suffix="KG"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Precio del paquete</label>
            <div class="precio-label" :class="{ 'precio-activo': precioCalculado !== null }">
              <v-icon size="16">mdi-currency-usd</v-icon>
              <span v-if="precioCalculado !== null">{{ precioCalculado }}.00 MXN</span>
              <span v-else class="text-grey">Se calcula según el tamaño</span>
            </div>
          </div>
        </div>

        <p v-if="errorMessage" class="text-red text-sm mt-1">{{ errorMessage }}</p>

      </div>

      <div class="modal-actions">
        <v-btn class="cancel-btn" variant="outlined" type="button" @click="dialog = false" :disabled="loading">
          <v-icon start>mdi-close</v-icon> Cancelar
        </v-btn>
        <v-btn class="save-btn" :loading="loading" @click="editarPaquete">
          <v-icon start>mdi-content-save-outline</v-icon> Guardar Paquete
        </v-btn>
      </div>

      <div class="modal-footer"><span>© 2026 NovaLogistics.</span></div>
    </v-card>
  </v-dialog>
</template>

<style src="@/assets/styles/modal.style.css"></style>

<style scoped>
.precio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid #e0e0e0;
  font-size: 0.95rem;
  color: #9e9e9e;
  min-height: 44px;
  background: #fafafa;
}

.precio-activo {
  color: #2e7d32;
  font-weight: 600;
  border-color: #2e7d32;
  background: #f1f8e9;
}
</style>