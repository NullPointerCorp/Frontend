<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRegistrarPaquete } from '@/composables/useRegistrarPaquete'
import { useToast } from '@/composables/useToast'
import type { Paquete } from '@/types/paquete.types'

const { showToast } = useToast()
const { form, resetForm, registrarPaquete, validate, preciosPorTamano } = useRegistrarPaquete()

const emit = defineEmits<{ paqueteCreado: [paquete: Paquete] }>()

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

const precioCalculado = computed(() => {
  if (!form.tamano) return null
  return preciosPorTamano[form.tamano] ?? null
})

watch(dialog, async (abierto) => {
  if (abierto) {
    await nextTick()
    correoRef.value?.focus()
  }
})

const buscarCliente = async () => {
  if (!correo.value.trim()) {
    nombreCliente.value = ''
    form.cliente_id = null
    return
  }
  loadingCliente.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:3000/clientes/buscar?correo=${encodeURIComponent(correo.value)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      nombreCliente.value = ''
      form.cliente_id = null
      showToast('Cliente no encontrado', 'error')
      return
    }
    const cliente = await res.json()
    nombreCliente.value = `${cliente.nombre} ${cliente.apellido_paterno}`
    form.cliente_id = cliente.cliente_id
  } catch (error) {
    showToast('Error al buscar cliente', 'error')
  } finally {
    loadingCliente.value = false
  }
}

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

  if (!form.cliente_id) {
    showToast('Debes buscar y seleccionar un cliente válido', 'warning')
    return
  }

  loading.value = true
  try {
    const nuevoPaquete = await registrarPaquete()
    emit('paqueteCreado', nuevoPaquete)
    showToast('¡Paquete registrado con éxito!', 'success')
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
    Registrar Nuevo Paquete
  </v-btn>

  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card" theme="light">

      <div class="modal-header">
        <button class="back-link" type="button" @click="cancelar">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Registrar Paquete</h1>
        <p class="modal-subtitle">Complete los datos necesarios para dar de alta un nuevo paquete en el sistema.</p>
      </div>

      <v-form ref="formRef" @submit.prevent="guardar" class="modal-form">

        <!-- Correo del cliente -->
        <div class="form-group full-width">
          <label class="form-label">
            Correo del Cliente <span class="required">*</span>
          </label>
          <v-text-field
            ref="correoRef"
            v-model="correo"
            placeholder="cliente@ejemplo.com"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :loading="loadingCliente"
            @keyup.enter="buscarCliente"
          >
            <template #append>
              <v-btn icon variant="text" :loading="loadingCliente" @click="buscarCliente">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-text-field>
          <div class="cliente-info" v-if="nombreCliente">
            <v-icon size="14" color="success">mdi-check-circle</v-icon>
            <span>{{ nombreCliente }}</span>
          </div>
          <div class="cliente-info text-grey" v-else>
            <v-icon size="14">mdi-account-outline</v-icon>
            <span>Nombre del cliente</span>
          </div>
        </div>

        <!-- Tamaño y Forma -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tamaño de caja <span class="required">*</span></label>
            <v-select
              v-model="form.tamano"
              :items="tamanioOpciones"
              item-title="title"
              item-value="value"
              placeholder="Seleccionar tamaño"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :rules="[validate('tamano')]"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Forma del paquete <span class="required">*</span></label>
            <v-select
              v-model="form.forma"
              :items="formaOpciones"
              item-title="title"
              item-value="value"
              placeholder="Seleccionar forma"
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
            <label class="form-label">Peso <span class="required">*</span></label>
            <v-text-field
              v-model.number="form.peso"
              type="number"
              placeholder="0"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              suffix="KG"
              :rules="[validate('peso')]"
            />
          </div>
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