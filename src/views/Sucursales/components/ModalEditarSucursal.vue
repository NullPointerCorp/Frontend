<script setup lang="ts">
import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useEditarSucursal } from '@/composables/useEditarSucursal'
import { useUbicacion } from '@/composables/useUbicacion'
import type { Sucursal } from '@/types/sucursal.types'

const emit = defineEmits<{ (e: 'sucursalEditada', sucursal: Sucursal): void }>()

const { dialog, loading, errorMessage, form, sucursalSeleccionada, abrirModal, editarSucursal } =
  useEditarSucursal((sucursal) => emit('sucursalEditada', sucursal))

const {
  supervisores,
  loadingSupervisores,
  fetchSupervisores,
} = useUbicacion()

watch(dialog, async (abierto) => {
  if (abierto) {
    await nextTick()
    await fetchSupervisores()
  }
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
  <v-dialog v-model="dialog" max-width="700" persistent>
    <v-card class="modal-card" theme="light">

      <div class="modal-header">
        <button class="back-link" type="button" @click="dialog = false">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Editar Sucursal</h1>
        <p class="modal-subtitle">Actualice el nombre, localización y ubicación de una sede ya existente en el sistema.</p>
      </div>

      <div class="modal-form">

        <!-- Nombre y Gerente -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <v-icon size="14" class="label-icon">mdi-store-outline</v-icon>
              Nombre de la Sucursal <span class="required">*</span>
            </label>
            <v-text-field v-model="form.nombre_sucursal" variant="outlined" density="comfortable" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Supervisor de sucursal (si aplica)</label>
            <v-select
              v-model="form.empleado_id_supervisor"
              :items="supervisores"
              :item-title="(g) => `${g.nombre} ${g.apellido_paterno}`"
              item-value="empleado_id"
              placeholder="Seleccionar supervisor"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :loading="loadingSupervisores"
              clearable
            />
          </div>
        </div>

        <!-- Sección Localización -->
        <div class="form-section-title">
          <v-icon size="16">mdi-map-marker-outline</v-icon>
          LOCALIZACIÓN
        </div>

        <!-- Estado y Ciudad (readonly) -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Estado</label>
            <div class="readonly-field">{{ sucursalSeleccionada?.nombre_estado }}</div>
          </div>
          <div class="form-group">
            <label class="form-label">Ciudad</label>
            <div class="readonly-field">{{ sucursalSeleccionada?.nombre_ciudad }}</div>
          </div>
        </div>

        <!-- Colonia, CP y Calle -->
        <div class="form-row-three">
          <div class="form-group">
            <label class="form-label">Colonia <span class="required">*</span></label>
            <v-text-field v-model="form.colonia" variant="outlined" density="comfortable" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Código Postal <span class="required">*</span></label>
            <v-text-field v-model="form.codigo_postal" variant="outlined" density="comfortable" hide-details="auto" maxlength="5" />
          </div>
          <div class="form-group">
            <label class="form-label">Calle <span class="required">*</span></label>
            <v-text-field v-model="form.calle" variant="outlined" density="comfortable" hide-details="auto" />
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

        <p v-if="errorMessage" class="text-red text-sm mt-1">{{ errorMessage }}</p>

      </div>

      <div class="modal-actions">
        <v-btn class="cancel-btn" variant="outlined" type="button" @click="dialog = false" :disabled="loading">
          <v-icon start>mdi-close</v-icon> Cancelar
        </v-btn>
        <v-btn class="save-btn" :loading="loading" @click="editarSucursal">
          <v-icon start>mdi-content-save-outline</v-icon> Confirmar
        </v-btn>
      </div>

      <div class="modal-footer">
        <span>© 2026 NovaLogistics.</span>
      </div>

    </v-card>
  </v-dialog>
</template>

<style src="@/assets/styles/modal.style.css"></style>