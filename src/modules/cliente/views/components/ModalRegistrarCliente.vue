<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRegistrarCliente } from "@/modules/cliente/controllers/useRegistrarCliente";
import { useToast } from '@/composables/useToast'
import type { Cliente } from '@/modules/cliente/interfaces/cliente-interface'

const { showToast } = useToast()
const { form, resetForm, registrarCliente, validate } = useRegistrarCliente()

const emit = defineEmits<{
  clienteCreado: [cliente: Cliente]
}>()

const dialog = ref(false)
const loading = ref(false)
const formRef = ref()
const nombreRef = ref()

watch(dialog, async (abierto) => {
  if (abierto) {
    await nextTick()
    nombreRef.value?.focus()
  }
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
    const nuevoCliente = await registrarCliente()
    emit('clienteCreado', nuevoCliente)
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
    Registrar Nuevo Cliente
  </v-btn>

  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card" theme="light">

      <div class="modal-header">
        <button class="back-link" type="button" @click="cancelar">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Registrar Cliente</h1>
        <p class="modal-subtitle">
          Complete los datos para dar de alta un nuevo cliente en el sistema de logística.
        </p>
      </div>

      <v-form ref="formRef" @submit.prevent="guardar" validate-on="input" class="modal-form">

        <div class="form-group full-width">
          <label class="form-label">
            Nombre(s) <span class="required">*</span>
          </label>
          <v-text-field ref="nombreRef" v-model="form.nombre" placeholder="Ej. Luis Enrique" variant="outlined"
            density="comfortable" :rules="[validate('nombre')]" hide-details="auto" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              Apellido Paterno <span class="required">*</span>
            </label>
            <v-text-field v-model="form.apellido_paterno" placeholder="Ej. Pérez" variant="outlined"
              density="comfortable" :rules="[validate('apellido_paterno')]" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Apellido Materno</label>
            <v-text-field v-model="form.apellido_materno" placeholder="Ej. López" variant="outlined"
              density="comfortable" :rules="[validate('apellido_materno')]" hide-details="auto" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <v-icon size="16" class="label-icon">mdi-email-outline</v-icon>
              Correo Electrónico <span class="required">*</span>
            </label>
            <v-text-field v-model="form.correo" placeholder="cliente@ejemplo.com" variant="outlined"
              density="comfortable" :rules="[validate('correo')]" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">
              <v-icon size="16" class="label-icon">mdi-phone-outline</v-icon>
              Teléfono de Contacto <span class="required">*</span>
            </label>
            <v-text-field v-model="form.telefono" placeholder="1234567890" variant="outlined" density="comfortable"
              :rules="[validate('telefono')]" hide-details="auto" maxlength="10" />
          </div>
        </div>

        <div class="modal-actions">
          <v-btn variant="outlined" class="cancel-btn" type="button" @click="cancelar" :disabled="loading">
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn type="submit" class="save-btn" :loading="loading">
            <v-icon start>mdi-content-save-outline</v-icon>
            Guardar Cliente
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
