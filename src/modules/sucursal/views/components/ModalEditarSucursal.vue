<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useEditarSucursal } from '@/modules/sucursal/controllers/useEditarSucursal'
import { useUbicacion } from '@/composables/useUbicacion'
import { useToast } from '@/composables/useToast'
import type { Sucursal } from '@/modules/sucursal/interfaces/sucursal-interface'

const emit = defineEmits<{ (e: 'sucursalEditada', sucursal: Sucursal): void }>()

const { showToast } = useToast()
const { dialog, loading, form, sucursalSeleccionada, abrirModal, editarSucursal, validate } =
  useEditarSucursal((sucursal) => emit('sucursalEditada', sucursal)) 

const { supervisores, loadingSupervisores, fetchSupervisores } = useUbicacion()
const formRef = ref() 

watch(dialog, async (abierto) => {
  if (abierto) {
    await nextTick()
    await fetchSupervisores()
  }
})

const guardar = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) {
    showToast('Por favor corrige los errores del formulario', 'warning')
    return
  }
  await editarSucursal()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') dialog.value = false
  if (e.key === 'Enter' && !(e.target instanceof HTMLInputElement)) guardar() 
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

defineExpose({ abrirModal })
</script>

<template>
  <v-dialog v-model="dialog" max-width="700" persistent>
    <v-card class="modal-card">

      <div class="modal-header">
        <button class="back-link" type="button" @click="dialog = false">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Editar Sucursal</h1>
        <p class="modal-subtitle">Actualice el nombre, localización y ubicación de una sede ya existente.</p>
      </div>

      <v-form ref="formRef" @submit.prevent="guardar" validate-on="blur" class="modal-form">

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <v-icon size="14" class="label-icon">mdi-store-outline</v-icon>
              Nombre de la Sucursal <span class="required">*</span>
            </label>
            <v-text-field v-model="form.nombre_sucursal" variant="outlined" density="comfortable" hide-details="auto"
              :rules="[validate('nombre_sucursal')]" />
          </div>
          <div class="form-group">
            <label class="form-label">Supervisor de sucursal (si aplica)</label>
            <v-select v-model="form.empleado_id_supervisor" :items="supervisores"
              :item-title="(s: any) => `${s.nombre} ${s.apellido_paterno}`" item-value="empleado_id"
              placeholder="Seleccionar supervisor" variant="outlined" density="comfortable" hide-details="auto"
              :loading="loadingSupervisores" clearable />
          </div>
        </div>

        <div class="form-section-title">
          <v-icon size="16">mdi-map-marker-outline</v-icon>
          LOCALIZACIÓN
        </div>

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

        <div class="form-row-three">
          <div class="form-group">
            <label class="form-label">Colonia <span class="required">*</span></label>
            <v-text-field v-model="form.colonia" variant="outlined" density="comfortable" hide-details="auto"
              :rules="[validate('colonia')]" />
          </div>
          <div class="form-group">
            <label class="form-label">Código Postal <span class="required">*</span></label>
            <v-text-field v-model="form.codigo_postal" variant="outlined" density="comfortable" hide-details="auto"
              maxlength="5" :rules="[validate('codigo_postal')]" />
          </div>
          <div class="form-group">
            <label class="form-label">Calle <span class="required">*</span></label>
            <v-text-field v-model="form.calle" variant="outlined" density="comfortable" hide-details="auto"
              :rules="[validate('calle')]" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Numero Exterior <span class="required">*</span></label>
            <v-text-field v-model="form.numero_exterior" variant="outlined" density="comfortable" hide-details="auto"
              :rules="[validate('numero_exterior')]" />
          </div>
          <div class="form-group">
            <label class="form-label">Numero Interior</label>
            <v-text-field v-model="form.numero_interior" variant="outlined" density="comfortable" hide-details="auto" />
          </div>
        </div>

        <div class="form-section-title">
          <v-icon size="16">mdi-crosshairs-gps</v-icon>
          UBICACIÓN
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Longitud</label>
            <v-text-field v-model.number="form.longitud" type="number" variant="outlined" density="comfortable"
              hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Latitud</label>
            <v-text-field v-model.number="form.latitud" type="number" variant="outlined" density="comfortable"
              hide-details="auto" />
          </div>
        </div>

        <div class="modal-actions">
          <v-btn class="cancel-btn" variant="outlined" type="button" @click="dialog = false" :disabled="loading">
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
