<script setup lang="ts">
import { useEditarCliente } from "@/composables/useEditarCliente";
import type { Cliente } from "../../../types/cliente.types";
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{ (e: "clienteEditado", cliente: Cliente): void }>()

const { dialog, loading, errorMessage, form, clienteSeleccionado, abrirModal, editarCliente, validate } =
  useEditarCliente((cliente) => emit("clienteEditado", cliente))

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') dialog.value = false
  if (e.key === 'Enter' && !(e.target instanceof HTMLInputElement)) editarCliente()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

defineExpose({ abrirModal })
</script>

<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card" theme="light">

      <div class="modal-header">
        <button class="back-link" type="button" @click="dialog = false">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Editar Cliente</h1>
        <p class="modal-subtitle">
          Actualice la información del perfil, contacto y parámetros comerciales del cliente.
        </p>
      </div>

      <div class="modal-form">

        <div class="form-group full-width">
          <label class="form-label">ID de Cliente</label>
          <div class="readonly-field">{{ clienteSeleccionado?.cliente_id }}</div>
        </div>

        <!-- Nombre -->
        <div class="form-group full-width">
          <label class="form-label">Nombre(s) <span class="required">*</span></label>
          <v-text-field
            v-model="form.nombre"
            placeholder="Ej. Luis Enrique"
            variant="outlined"
            density="comfortable"
            :rules="[validate('nombre')]"
            hide-details="auto"
          />
        </div>

        <!-- Apellidos -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Apellido Paterno <span class="required">*</span></label>
            <v-text-field
              v-model="form.apellido_paterno"
              placeholder="Ej. Pérez"
              variant="outlined"
              density="comfortable"
              :rules="[validate('apellido_paterno')]"
              hide-details="auto"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Apellido Materno</label>
            <v-text-field
              v-model="form.apellido_materno"
              placeholder="Ej. López"
              variant="outlined"
              density="comfortable"
              :rules="[validate('apellido_materno')]"
              hide-details="auto"
            />
          </div>
        </div>

        <!-- Correo readonly y Teléfono -->
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
              :rules="[validate('telefono')]"
              hide-details="auto"
              maxlength="10"
            />
          </div>
        </div>

        <p v-if="errorMessage" class="text-red text-sm mt-1">{{ errorMessage }}</p>

      </div>

      <div class="modal-actions">
        <v-btn class="cancel-btn" variant="outlined" type="button" @click="dialog = false" :disabled="loading">
          <v-icon start>mdi-close</v-icon> Cancelar
        </v-btn>
        <v-btn class="save-btn" :loading="loading" @click="editarCliente">
          <v-icon start>mdi-content-save-outline</v-icon> Guardar Cliente
        </v-btn>
      </div>

      <div class="modal-footer">
        <span>© 2026 NovaCode.</span>
      </div>

    </v-card>
  </v-dialog>
</template>

<style src="@/assets/styles/modal.style.css"></style>