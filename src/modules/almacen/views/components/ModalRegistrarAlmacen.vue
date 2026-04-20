<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRegistrarAlmacen } from '@/modules/almacen/controllers/useRegistrarAlmacen'
import type { Almacen } from '@/modules/almacen/interfaces/almacen-interface'

const emit = defineEmits<{
  almacenCreado: [almacen: Almacen]
}>()

const {
  dialog,
  loading,
  form,
  erroresForm,
  estados,
  ciudades,
  sucursalesOpciones,
  loadingEstados,
  loadingCiudades,
  loadingSucursales,
  estadoSeleccionado,
  ciudadSeleccionada,
  abrirModal,
  cerrarModal,
  registrarAlmacen,
} = useRegistrarAlmacen((almacen) => emit('almacenCreado', almacen))

const nombreRef = ref()

// Foco inicial al abrir el modal
watch(dialog, async (abierto) => {
  if (abierto) {
    await nextTick()
    nombreRef.value?.focus()
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') cerrarModal()
  if (e.key === 'Enter' && !(e.target instanceof HTMLInputElement)) registrarAlmacen()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <v-btn color="primary" class="register-btn" @click="abrirModal">
    <v-icon start>mdi-plus</v-icon>
    Registrar Nuevo Almacén
  </v-btn>

  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card">

      <div class="modal-header">
        <button class="back-link" type="button" @click="cerrarModal">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Registrar Almacén</h1>
        <p class="modal-subtitle">
          Complete los detalles a continuación para configurar una nueva instalación de almacenamiento en el sistema.
        </p>
      </div>

      <v-form @submit.prevent="registrarAlmacen" class="modal-form">

        <div class="form-group full-width">
          <label class="form-label">
            Nombre del Almacén <span class="required">*</span>
          </label>
          <v-text-field
            ref="nombreRef"
            v-model="form.nombre_almacen"
            placeholder="Ej. Almacén Central Norte"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :error-messages="erroresForm.nombre_almacen"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Estado</label>
            <v-select
              v-model="estadoSeleccionado"
              :items="estados"
              item-title="nombre_estado"
              item-value="estado_id"
              placeholder="Seleccionar estado"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :loading="loadingEstados"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Ciudad</label>
            <v-select
              v-model="ciudadSeleccionada"
              :items="ciudades"
              item-title="nombre_ciudad"
              item-value="ciudad_id"
              placeholder="Seleccionar ciudad"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :loading="loadingCiudades"
              :disabled="!estadoSeleccionado"
            />
          </div>
        </div>

        <div class="form-group full-width">
          <label class="form-label">
            Sucursal Vinculada <span class="required">*</span>
          </label>
          <v-select
            v-model="form.sucursal_id"
            :items="sucursalesOpciones"
            item-title="nombre_sucursal"
            item-value="sucursal_id"
            placeholder="Seleccionar Sucursal"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :loading="loadingSucursales"
            :disabled="!ciudadSeleccionada"
            :error-messages="erroresForm.sucursal_id"
          />
        </div>

        <div class="form-group full-width">
          <label class="form-label">Descripción</label>
          <v-text-field
            v-model="form.descripcion"
            placeholder="Este almacén ..."
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </div>

        <div class="modal-actions">
          <v-btn
            variant="outlined"
            class="cancel-btn"
            type="button"
            :disabled="loading"
            @click="cerrarModal"
          >
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn type="submit" class="save-btn" :loading="loading">
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
