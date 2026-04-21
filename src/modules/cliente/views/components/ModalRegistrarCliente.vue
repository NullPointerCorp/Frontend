<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRegistrarCliente } from '@/modules/cliente/controllers/useRegistrarCliente'
import type { Cliente } from '@/modules/cliente/interfaces/cliente-interface'

const emit = defineEmits<{
  clienteCreado: [cliente: Cliente]
}>()

const {
  dialog,
  loading,
  form,
  erroresForm,
  abrirModal,
  cerrarModal,
  registrarCliente,
} = useRegistrarCliente((cliente) => emit('clienteCreado', cliente))

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
  if (e.key === 'Enter' && !(e.target instanceof HTMLInputElement)) registrarCliente()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <v-btn color="primary" class="register-btn" @click="abrirModal">
    <v-icon start>mdi-plus</v-icon>
    Registrar Nuevo Cliente
  </v-btn>

  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card">

      <div class="modal-header">
        <button class="back-link" type="button" @click="cerrarModal">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Registrar Cliente</h1>
        <p class="modal-subtitle">
          Complete los datos para dar de alta un nuevo cliente en el sistema de logística.
        </p>
      </div>

      <v-form @submit.prevent="registrarCliente" class="modal-form">

        <div class="form-group full-width">
          <label class="form-label">
            Nombre(s) <span class="required">*</span>
          </label>
          <v-text-field
            ref="nombreRef"
            v-model="form.nombre"
            placeholder="Ej. Luis Enrique"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :error-messages="erroresForm.nombre"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              Apellido Paterno <span class="required">*</span>
            </label>
            <v-text-field
              v-model="form.apellido_paterno"
              placeholder="Ej. Pérez"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :error-messages="erroresForm.apellido_paterno"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Apellido Materno</label>
            <v-text-field
              v-model="form.apellido_materno"
              placeholder="Ej. López"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :error-messages="erroresForm.apellido_materno"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <v-icon size="16" class="label-icon">mdi-email-outline</v-icon>
              Correo Electrónico <span class="required">*</span>
            </label>
            <v-text-field
              v-model="form.correo"
              placeholder="cliente@ejemplo.com"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :error-messages="erroresForm.correo"
            />
          </div>
          <div class="form-group">
            <label class="form-label">
              <v-icon size="16" class="label-icon">mdi-phone-outline</v-icon>
              Teléfono de Contacto <span class="required">*</span>
            </label>
            <v-text-field
              v-model="form.telefono"
              placeholder="1234567890"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              maxlength="10"
              :error-messages="erroresForm.telefono"
            />
          </div>
        </div>

        <div class="modal-actions">
          <v-btn variant="outlined" class="cancel-btn" type="button" :disabled="loading" @click="cerrarModal">
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
