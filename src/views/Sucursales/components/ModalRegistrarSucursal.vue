<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRegistrarSucursal } from '@/composables/useRegistrarSucursal'
import { useUbicacion } from '@/composables/useubicacion'
import { useToast } from '@/composables/useToast'
import type { Sucursal } from '@/types/sucursal.types'

const { showToast } = useToast()
const { form, resetForm, registrarSucursal } = useRegistrarSucursal()
const { estados, ciudades, gerentes, loadingGerentes, gerenteSeleccionado,
        loadingEstados, loadingCiudades, estadoSeleccionado, fetchEstados, fetchGerentes } = useUbicacion()

const emit = defineEmits<{
  sucursalCreada: [sucursal: Sucursal]
}>()

const dialog = ref(false)
const loading = ref(false)
const formRef = ref()
const nombreRef = ref()

watch(dialog, async (abierto) => {
  if (abierto) {
    await nextTick()
    nombreRef.value?.focus()
    await Promise.all([fetchEstados(), fetchGerentes()])
  }
})

watch(estadoSeleccionado, (nuevo, anterior) => {
  if (anterior !== null) form.ciudad_id = null as any
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
    formRef.value?.resetValidation()
  }, 300)
}

const guardar = async () => {
  loading.value = true
  try {
    const nuevaSucursal = await registrarSucursal()
    emit('sucursalCreada', nuevaSucursal)
    showToast(`¡Sucursal registrada con éxito!`, 'success')
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
    Registrar Nueva Sucursal
  </v-btn>

  <v-dialog v-model="dialog" max-width="700" persistent>
    <v-card class="modal-card" theme="light">

      <div class="modal-header">
        <button class="back-link" type="button" @click="cancelar">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Registrar Sucursal</h1>
        <p class="modal-subtitle">Complete los detalles operativos para dar de alta una nueva sede en el sistema.</p>
      </div>

      <v-form ref="formRef" @submit.prevent="guardar" class="modal-form">

        <!-- Nombre -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <v-icon size="14" class="label-icon">mdi-store-outline</v-icon>
              Nombre de la Sucursal <span class="required">*</span>
            </label>
            <v-text-field
              ref="nombreRef"
              v-model="form.nombre_sucursal"
              placeholder="Ej: Sucursal Central Norte"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Gerente (si aplica)</label>
            <v-select
              v-model="gerenteSeleccionado"
              :items="gerentes"
              item-title="nombre"
              item-value="empleado_id"
              placeholder="Seleccionar gerente"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :loading="loadingGerentes"
            />
          </div>
        </div>

        <!-- Sección Localización -->
        <div class="form-section-title">
          <v-icon size="16">mdi-map-marker-outline</v-icon>
          LOCALIZACIÓN
        </div>

        <!-- Estado y Ciudad -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Estado <span class="required">*</span></label>
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
            <label class="form-label">Ciudad <span class="required">*</span></label>
            <v-select
              v-model="form.ciudad_id"
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

        <!-- Colonia, CP y Calle -->
        <div class="form-row-three">
          <div class="form-group">
            <label class="form-label">Colonia <span class="required">*</span></label>
            <v-text-field v-model="form.colonia" placeholder="Ej: Emiliano Zapata" variant="outlined" density="comfortable" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Código Postal <span class="required">*</span></label>
            <v-text-field v-model="form.codigo_postal" placeholder="Ej: 80000" variant="outlined" density="comfortable" hide-details="auto" maxlength="5" />
          </div>
          <div class="form-group">
            <label class="form-label">Calle <span class="required">*</span></label>
            <v-text-field v-model="form.calle" placeholder="Ej: Jesús García" variant="outlined" density="comfortable" hide-details="auto" />
          </div>
        </div>

        <!-- Número Exterior e Interior -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Numero Exterior <span class="required">*</span></label>
            <v-text-field v-model="form.numero_exterior" variant="outlined" density="comfortable" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Numero Interior</label>
            <v-text-field v-model="form.numero_interior" variant="outlined" density="comfortable" hide-details="auto" />
          </div>
        </div>

        <!-- Sección Ubicación -->
        <div class="form-section-title">
          <v-icon size="16">mdi-crosshairs-gps</v-icon>
          UBICACIÓN
        </div>

        <!-- Longitud y Latitud -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Longitud</label>
            <v-text-field v-model.number="form.longitud" type="number" variant="outlined" density="comfortable" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Latitud</label>
            <v-text-field v-model.number="form.latitud" type="number" variant="outlined" density="comfortable" hide-details="auto" />
          </div>
        </div>

        <div class="modal-actions">
          <v-btn class="cancel-btn" variant="outlined" type="button" @click="cancelar" :disabled="loading">
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
