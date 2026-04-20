<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRegistrarSucursal } from '@/modules/sucursal/controllers/useRegistrarSucursal'
import type { Sucursal } from '@/modules/sucursal/interfaces/sucursal-interface'

const emit = defineEmits<{
  sucursalCreada: [sucursal: Sucursal]
}>()

const {
  dialog,
  loading,
  form,
  erroresForm,
  estados,
  ciudades,
  supervisores,
  loadingEstados,
  loadingCiudades,
  loadingSupervisores,
  estadoSeleccionado,
  abrirModal,
  cerrarModal,
  registrarSucursal,
} = useRegistrarSucursal((sucursal) => emit('sucursalCreada', sucursal))

const nombreRef = ref()

watch(dialog, async (abierto) => {
  if (abierto) {
    await nextTick()
    nombreRef.value?.focus()
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') cerrarModal()
  if (e.key === 'Enter' && !(e.target instanceof HTMLInputElement)) registrarSucursal()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <v-btn color="primary" class="register-btn" @click="abrirModal">
    <v-icon start>mdi-plus</v-icon>
    Registrar Nueva Sucursal
  </v-btn>

  <v-dialog v-model="dialog" max-width="700" persistent>
    <v-card class="modal-card">

      <div class="modal-header">
        <button class="back-link" type="button" @click="cerrarModal">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Registrar Sucursal</h1>
        <p class="modal-subtitle">Complete los detalles operativos para dar de alta una nueva sede en el sistema.</p>
      </div>

      <v-form @submit.prevent="registrarSucursal" class="modal-form">

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
              :error-messages="erroresForm.nombre_sucursal"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Supervisor de sucursal (si aplica)</label>
            <v-select
              v-model="form.empleado_id_supervisor"
              :items="supervisores"
              :item-title="(s: any) => `${s.nombre} ${s.apellido_paterno}`"
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

        <div class="form-section-title">
          <v-icon size="16">mdi-map-marker-outline</v-icon>
          LOCALIZACIÓN
        </div>

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
              :error-messages="erroresForm.ciudad_id"
            />
          </div>
        </div>

        <div class="form-row-three">
          <div class="form-group">
            <label class="form-label">Colonia <span class="required">*</span></label>
            <v-text-field
              v-model="form.colonia"
              placeholder="Ej: Emiliano Zapata"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :error-messages="erroresForm.colonia"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Código Postal <span class="required">*</span></label>
            <v-text-field
              v-model="form.codigo_postal"
              placeholder="Ej: 80000"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              maxlength="5"
              :error-messages="erroresForm.codigo_postal"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Calle <span class="required">*</span></label>
            <v-text-field
              v-model="form.calle"
              placeholder="Ej: Jesús García"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :error-messages="erroresForm.calle"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Numero Exterior <span class="required">*</span></label>
            <v-text-field
              v-model="form.numero_exterior"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :error-messages="erroresForm.numero_exterior"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Numero Interior</label>
            <v-text-field
              v-model="form.numero_interior"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>
        </div>

        <div class="form-section-title">
          <v-icon size="16">mdi-crosshairs-gps</v-icon>
          UBICACIÓN
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Longitud</label>
            <v-text-field
              v-model.number="form.longitud"
              type="number"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Latitud</label>
            <v-text-field
              v-model.number="form.latitud"
              type="number"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>
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
        <span>© 2026 NovaCode.</span>
      </div>

    </v-card>
  </v-dialog>
</template>

<style src="@/assets/styles/modal.style.css"></style>
