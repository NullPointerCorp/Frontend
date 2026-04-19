<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRegistrarTipoPaquete } from '@/modules/tipo_paquete/controllers/useRegistrarTipoPaquete'
import { useToast } from '@/composables/useToast'
import type { TipoPaquete } from '@/modules/tipo_paquete/interfaces/paquete-interface'
import clienteAPI from '@/modules/cliente/api/clienteAPI'

const { showToast } = useToast()
const { form, resetForm, registrarTipoPaquete, validate, preciosPorTamano } = useRegistrarTipoPaquete()

const emit = defineEmits<{ paqueteCreado: [paquete: TipoPaquete] }>()

const dialog = ref(false)
const loading = ref(false)
const loadingCliente = ref(false)
const formRef = ref()
const correoRef = ref()

const correo = ref('')
const nombreCliente = ref('')

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

watch(dialog, async (abierto) => {
  if (abierto) {
    await nextTick()
    correoRef.value?.focus()
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') cancelar()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

const cancelar = () => {
  dialog.value = false
  setTimeout(() => {
    resetForm()
    correo.value = ''
    nombreCliente.value = ''
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
    const nuevoPaquete = await registrarTipoPaquete()
    emit('paqueteCreado', nuevoPaquete)
    cancelar()
  } catch {
    // el controller ya mostró el toast
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-btn color="primary" class="register-btn" @click="dialog = true">
    <v-icon start>mdi-plus</v-icon>
    Registrar Nuevo Tipo de paquete
  </v-btn>

  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card">

      <div class="modal-header">
        <button class="back-link" type="button" @click="cancelar">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Registrar Tipo de paquete</h1>
        <p class="modal-subtitle">Complete los datos necesarios para dar de alta un nuevo tipo de paquete en el sistema.</p>
      </div>

      <v-form ref="formRef" @submit.prevent="guardar" class="modal-form">
        <!-- Tamaño y Forma -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tamaño de caja <span class="required">*</span></label>
            <v-text-field
              ref="tamanoRef"
              v-model="form.tamano"
              placeholder="Ej: Grande"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :rules="[validate('tamano')]"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Forma del paquete <span class="required">*</span></label>
            <v-text-field
              ref="formaRef"
              v-model="form.forma"
              placeholder="Ej: Cuadrada"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :rules="[validate('forma')]"
            />
          </div>
        </div>

        <!-- Peso y Precio -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <v-icon size="14" class="label-icon">mdi-currency-usd</v-icon>
              Precio <span class="required">*</span>
            </label>
            <v-text-field
              ref="precioRef"
              v-model.number="form.precio"
              type="number"
              placeholder="Ej: 99.99"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :rules="[validate('precio')]"
            />
          </div>
        </div>

        <div class="modal-actions">
          <v-btn variant="outlined" class="cancel-btn" type="button" @click="cancelar" :disabled="loading">
            <v-icon start>mdi-close</v-icon> Cancelar
          </v-btn>
          <v-btn type="submit" class="save-btn" :loading="loading">
            <v-icon start>mdi-content-save-outline</v-icon> Registrar paquete
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

<style scoped>
.cliente-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  margin-top: 6px;
  color: #2e7d32;
  font-weight: 500;
}

.cliente-info.text-grey {
  color: #9e9e9e;
  font-weight: 400;
}

.precio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid #e0e0e0;
  font-size: 0.95rem;
  color: #9e9e9e;
  min-height: 44px;
  background: #fafafa;
}

.precio-activo {
  color: #2e7d32;
  font-weight: 600;
  border-color: #2e7d32;
  background: #f1f8e9;
}
</style>
