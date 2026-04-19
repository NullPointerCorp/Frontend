<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useEditarTipoPaquete } from '@/modules/tipo_paquete/controllers/useEditarTipoPaquete'
import { useToast } from '@/composables/useToast'
import type { TipoPaquete } from '@/modules/tipo_paquete/interfaces/paquete-interface'

const emit = defineEmits<{ (e: 'paqueteEditado', tipo_paquete: TipoPaquete): void }>()

const { showToast } = useToast()
const { dialog, loading, form, paqueteSeleccionado, abrirModal, editarTipoPaquete, validate, preciosPorTamano } =
  useEditarTipoPaquete((tipo_paquete) => emit('paqueteEditado', tipo_paquete)) 

const formRef = ref()

const tamanioOpciones = [
  { title: 'Pequeño', value: 'Pequeño' },
  { title: 'Mediano', value: 'Mediano' },
  { title: 'Grande', value: 'Grande' },
  { title: 'Extra Grande', value: 'Extra Grande' },
]

const formaOpciones = [
  { title: 'Cuadrada', value: 'Cuadrada' },
  { title: 'Rectangular', value: 'Rectangular' },
  { title: 'Circular', value: 'Circular' },
]

const precioCalculado = computed(() =>
  form.value.precio !== undefined ? form.value.precio : null
)

const guardar = async () => { 
  const { valid } = await formRef.value?.validate()
  if (!valid) {
    showToast('Por favor corrige los errores del formulario', 'warning')
    return
  }
  await editarTipoPaquete()
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
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card">

      <div class="modal-header">
        <button class="back-link" type="button" @click="dialog = false">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Editar Paquete</h1>
        <p class="modal-subtitle">Actualice la información del paquete.</p>
      </div>

      <v-form ref="formRef" @submit.prevent="guardar" validate-on="blur" class="modal-form">

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Folio</label>
            <div class="readonly-field">{{ paqueteSeleccionado?.folio }}</div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tamaño <span class="required">*</span></label>
            <v-select v-model="form.tamano" :items="tamanioOpciones" item-title="title" item-value="value"
              variant="outlined" density="comfortable" hide-details="auto" :rules="[validate('tamano')]" />
          </div>
          <div class="form-group">
            <label class="form-label">Forma <span class="required">*</span></label>
            <v-select v-model="form.forma" :items="formaOpciones" item-title="title" item-value="value"
              variant="outlined" density="comfortable" hide-details="auto" :rules="[validate('forma')]" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Precio del paquete</label>
            <div class="precio-label" :class="{ 'precio-activo': precioCalculado !== null }">
              <v-icon size="16">mdi-currency-usd</v-icon>
              <span v-if="precioCalculado !== null">{{ precioCalculado }}.00 MXN</span>
              <span v-else class="text-grey">0.00 MXN</span>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <v-btn class="cancel-btn" variant="outlined" type="button" @click="dialog = false" :disabled="loading">
            <v-icon start>mdi-close</v-icon> Cancelar
          </v-btn>
          <v-btn class="save-btn" type="submit" :loading="loading">
            <v-icon start>mdi-content-save-outline</v-icon> Guardar Paquete
          </v-btn>
        </div>

      </v-form>

      <div class="modal-footer"><span>© 2026 NovaCode.</span></div>
    </v-card>
  </v-dialog>
</template>
