<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRegistrarAlmacen } from "@/composables/useRegistrarAlmacen";
import { useUbicacion } from '@/composables/useubicacion'
import { useToast } from '@/composables/useToast'
import type { Almacen } from '@/types/almacen.types'

const { showToast } = useToast()
const { form, resetForm, registrarAlmacen } = useRegistrarAlmacen()
const {
  estados, ciudades, sucursalesOpciones,
  loadingEstados, loadingCiudades, loadingSucursales,
  estadoSeleccionado, ciudadSeleccionada,
  fetchEstados,
} = useUbicacion()

const emit = defineEmits<{
  almacenCreado: [almacen: Almacen]
}>()

const dialog = ref(false)
const loading = ref(false)
const formRef = ref()
const nombreRef = ref()

watch(dialog, async (abierto) => {
  if (abierto) {
    await nextTick()
    nombreRef.value?.focus()
    await fetchEstados()
  }
})

// Cuando cambia la ciudad limpia la sucursal seleccionada
watch(ciudadSeleccionada, (nuevo, anterior) => {
  if (anterior !== null) form.sucursal_id = null
})

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') cancelar()
  if (e.key === 'Enter' && !(e.target instanceof HTMLInputElement)) guardar()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

const cancelar = () => {
  dialog.value = false
  setTimeout(() => {
    resetForm()
    estadoSeleccionado.value = null
    ciudadSeleccionada.value = null
    formRef.value?.resetValidation()
  }, 300)
}

const guardar = async () => {
  loading.value = true
  try {
    const nuevoAlmacen = await registrarAlmacen()
    emit('almacenCreado', nuevoAlmacen)
    showToast(`¡Almacén "${form.nombre_almacen}" registrado con éxito!`, 'success')
    cancelar()
  } catch (error: any) {
    showToast(error.message || 'Error de conexión con el servidor', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-btn color="primary" class="register-btn" @click="dialog = true">
    <v-icon start>mdi-plus</v-icon>
    Registrar Nuevo Almacén
  </v-btn>

  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card" theme="light">

      <!-- Header -->
      <div class="modal-header">
        <button class="back-link" type="button" @click="cancelar">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Registrar Almacén</h1>
        <p class="modal-subtitle">
          Complete los detalles a continuación para configurar una nueva instalación de almacenamiento en el sistema.
        </p>
      </div>

      <!-- Form -->
      <v-form ref="formRef" @submit.prevent="guardar" class="modal-form">

        <!-- Nombre -->
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
          />
        </div>

        <!-- Estado y Ciudad -->
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

        <!-- Sucursal -->
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
          />
        </div>

        <!-- Descripción -->
        <div class="form-group full-width">
          <label class="form-label">Descripción</label>
          <v-text-field
            v-model="form.descripcion"
            placeholder="Esta almacén ..."
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <v-btn variant="outlined" class="cancel-btn" type="button" @click="cancelar" :disabled="loading">
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn type="submit" class="save-btn" :loading="loading">
            <v-icon start>mdi-content-save-outline</v-icon>
            Guardar Almacén
          </v-btn>
        </div>

      </v-form>

      <!-- Footer -->
      <div class="modal-footer">
        <span>© 2026 NovaLogistics.</span>
      </div>

    </v-card>
  </v-dialog>
</template>

<style src="@/assets/styles/modal.style.css"></style>