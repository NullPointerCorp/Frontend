<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRegistrarSucursal } from '@/modules/sucursal/controllers/useRegistrarSucursal'
import { useUbicacion } from '@/composables/useUbicacion'
import { useToast } from '@/composables/useToast'
import type { Sucursal } from '@/modules/sucursal/interfaces/sucursal-interface'

const { showToast } = useToast()
const { form, resetForm, registrarSucursal, validate } = useRegistrarSucursal()
const {
  estados,
  ciudades,
  supervisores,
  loadingSupervisores,
  loadingEstados,
  loadingCiudades,
  estadoSeleccionado,
  fetchEstados,
  fetchSupervisores,
} = useUbicacion()

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
    await Promise.all([fetchEstados(), fetchSupervisores()])
  }
})

watch(estadoSeleccionado, (anterior) => {
  if (anterior !== null) form.ciudad_id = null
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
  const { valid } = await formRef.value?.validate()
  if (!valid) {
    showToast('Por favor corrige los errores del formulario', 'warning') 
    return
  }
  loading.value = true
  try {
    const nuevaSucursal = await registrarSucursal()
    emit('sucursalCreada', nuevaSucursal)
    cancelar()
  } catch {
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

        <!-- Nombre y Supervisor -->
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
              :rules="[validate('nombre_sucursal')]"
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
              :rules="[validate('ciudad_id')]"
            />
          </div>
        </div>

        <!-- Colonia, CP y Calle -->
        <div class="form-row-three">
          <div class="form-group">
            <label class="form-label">Colonia <span class="required">*</span></label>
            <v-text-field
              v-model="form.colonia"
              placeholder="Ej: Emiliano Zapata"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :rules="[validate('colonia')]"
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
              :rules="[validate('codigo_postal')]"
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
              :rules="[validate('calle')]"
            />
          </div>
        </div>

        <!-- Número Exterior e Interior -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Numero Exterior <span class="required">*</span></label>
            <v-text-field
              v-model="form.numero_exterior"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :rules="[validate('numero_exterior')]"
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

        <!-- Sección Ubicación -->
        <div class="form-section-title">
          <v-icon size="16">mdi-crosshairs-gps</v-icon>
          UBICACIÓN
        </div>

        <!-- Longitud y Latitud -->
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
          <v-btn class="cancel-btn" variant="outlined" type="button" @click="cancelar" :disabled="loading">
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
