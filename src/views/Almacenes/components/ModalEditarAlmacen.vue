<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useEditarAlmacen } from "@/composables/useEditarAlmacen"
import type { Almacen } from "@/types/almacen.types"

const emit = defineEmits<{ (e: "almacenEditado", almacen: Almacen): void }>()

const { dialog, loading, errorMessage, form, almacenSeleccionado, abrirModal, editarAlmacen, validate } =
  useEditarAlmacen((almacen) => emit("almacenEditado", almacen))

const formRef = ref()

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') dialog.value = false
  if (e.key === 'Enter' && !(e.target instanceof HTMLInputElement)) editarAlmacen(formRef.value)
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
        <h1 class="modal-title">Editar Almacén</h1>
        <p class="modal-subtitle">
          Actualice la información del almacén.
        </p>
      </div>

      <v-form ref="formRef" @submit.prevent="editarAlmacen(formRef)" class="modal-form">

        <div class="form-group full-width">
          <label class="form-label">ID de Almacén</label>
          <div class="readonly-field">{{ almacenSeleccionado?.almacen_id }}</div>
        </div>

        <div class="form-group full-width">
          <label class="form-label">Sucursal</label>
          <div class="readonly-field">{{ almacenSeleccionado?.nombre_sucursal }}</div>
        </div>

        <!-- Nombre -->
        <div class="form-group full-width">
          <label class="form-label">
            Nombre del Almacén <span class="required">*</span>
          </label>
          <v-text-field
            v-model="form.nombre_almacen"
            placeholder="Ej. Almacén Central"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[validate('nombre_almacen')]"
          />
        </div>

        <!-- Descripción -->
        <div class="form-group full-width">
          <label class="form-label">Descripción</label>
          <v-textarea
            v-model="form.descripcion"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            rows="3"
          />
        </div>

        <p v-if="errorMessage" class="text-red text-sm mt-1">{{ errorMessage }}</p>

        <div class="modal-actions">
          <v-btn class="cancel-btn" variant="outlined" type="button" @click="dialog = false" :disabled="loading">
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn class="save-btn" type="submit" :loading="loading">
            <v-icon start>mdi-content-save-outline</v-icon>
            Guardar Almacén
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