<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useEditarCliente } from '@/modules/cliente/controllers/useEditarCliente'
import type { Cliente } from '../../interfaces/cliente-interface'

const emit = defineEmits<{ (e: 'clienteEditado', cliente: Cliente): void }>()

const {
  dialog,
  loading,
  form,
  erroresForm,
  clienteSeleccionado,
  abrirModal,
  cerrarModal,
  editarCliente,
} = useEditarCliente((cliente) => emit('clienteEditado', cliente))

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') cerrarModal()
  if (e.key === 'Enter' && !(e.target instanceof HTMLInputElement)) editarCliente()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

defineExpose({ abrirModal })
</script>

<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card">

      <div class="modal-header">
        <button class="back-link" type="button" @click="cerrarModal">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Editar Cliente</h1>
        <p class="modal-subtitle">
          Actualice la información del perfil, contacto y parámetros comerciales del cliente.
        </p>
      </div>

      <v-form @submit.prevent="editarCliente" class="modal-form">

        <div class="form-group full-width">
          <label class="form-label">ID de Cliente</label>
          <div class="readonly-field">{{ clienteSeleccionado?.cliente_id }}</div>
        </div>

        <div class="form-group full-width">
          <label class="form-label">Nombre(s) <span class="required">*</span></label>
          <v-text-field
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
            <label class="form-label">Apellido Paterno <span class="required">*</span></label>
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
              Correo Electrónico
            </label>
            <div class="readonly-field">{{ form.correo }}</div>
          </div>
          <div class="form-group">
            <label class="form-label">
              <v-icon size="16" class="label-icon">mdi-phone-outline</v-icon>
              Teléfono de Contacto
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
          <v-btn class="cancel-btn" variant="outlined" type="button" :disabled="loading" @click="cerrarModal">
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn class="save-btn" type="submit" :loading="loading">
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
