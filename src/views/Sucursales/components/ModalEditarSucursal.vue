<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useEditarSucursal } from '@/composables/useEditarSucursal'
import type { Sucursal } from '@/types/sucursal.types'

const emit = defineEmits<{ (e: 'sucursalEditada', sucursal: Sucursal): void }>()

const { dialog, loading, errorMessage, form, sucursalSeleccionada, abrirModal, editarSucursal } = useEditarSucursal((sucursal) => {
  emit('sucursalEditada', sucursal)
})

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') dialog.value = false
  if (e.key === 'Enter' && !(e.target instanceof HTMLInputElement)) editarSucursal()
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
        <h1 class="modal-title">Editar Sucursal</h1>
        <p class="modal-subtitle">Actualice la información de la sucursal.</p>
      </div>

      <div class="modal-form">

        <!-- ID solo lectura -->
        <div class="form-group full-width">
          <label class="form-label">ID de Sucursal</label>
          <div class="readonly-field">{{ sucursalSeleccionada?.sucursal_id }}</div>
        </div>

        <!-- Nombre -->
        <div class="form-group full-width">
          <label class="form-label">Nombre de Sucursal <span class="required">*</span></label>
          <v-text-field v-model="form.nombre_sucursal" placeholder="Ej. Sucursal Centro" variant="outlined" density="comfortable" hide-details="auto" />
        </div>

        <!-- Ciudad solo lectura -->
        <div class="form-group full-width">
          <label class="form-label">Ciudad</label>
          <div class="readonly-field">{{ sucursalSeleccionada?.nombre_ciudad }}</div>
        </div>

        <!-- Colonia y CP -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Colonia <span class="required">*</span></label>
            <v-text-field v-model="form.colonia" variant="outlined" density="comfortable" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Código Postal <span class="required">*</span></label>
            <v-text-field v-model="form.codigo_postal" variant="outlined" density="comfortable" hide-details="auto" maxlength="5" />
          </div>
        </div>

        <!-- Calle y Número -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Calle <span class="required">*</span></label>
            <v-text-field v-model="form.calle" variant="outlined" density="comfortable" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Número Exterior <span class="required">*</span></label>
            <v-text-field v-model="form.numero_exterior" variant="outlined" density="comfortable" hide-details="auto" />
          </div>
        </div>

        <!-- Número Interior -->
        <div class="form-group full-width">
          <label class="form-label">Número Interior</label>
          <v-text-field v-model="form.numero_interior" placeholder="Opcional" variant="outlined" density="comfortable" hide-details="auto" />
        </div>

        <p v-if="errorMessage" class="text-red text-sm mt-1">{{ errorMessage }}</p>

      </div>

      <div class="modal-actions">
        <v-btn class="cancel-btn" variant="outlined" type="button" @click="dialog = false" :disabled="loading">
          <v-icon start>mdi-close</v-icon> Cancelar
        </v-btn>
        <v-btn class="save-btn" :loading="loading" @click="editarSucursal">
          <v-icon start>mdi-content-save-outline</v-icon> Guardar Sucursal
        </v-btn>
      </div>

      <div class="modal-footer">
        <span>© 2026 NovaLogistics.</span>
      </div>

    </v-card>
  </v-dialog>
</template>

<style src="@/assets/styles/modal.style.css"></style>