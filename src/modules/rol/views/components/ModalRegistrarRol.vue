<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRegistrarRol } from "@/modules/rol/controllers/useRegistrarRol";
import type { Rol } from "@/modules/rol/interfaces/rol-interface";

const emit = defineEmits<{
  rolCreado: [rol: Rol];
}>();

const {
  dialog,
  loading,
  form,
  erroresForm,
  abrirModal,
  cerrarModal,
  registrarRol,
} = useRegistrarRol((rol) => emit("rolCreado", rol));

const nombreRef = ref();

// Foco inicial al abrir el modal
watch(dialog, async (abierto) => {
  if (abierto) {
    await nextTick();
    nombreRef.value?.focus();
  }
});

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return;
  if (e.key === "Escape") cerrarModal();
  if (e.key === "Enter" && !(e.target instanceof HTMLInputElement)) registrarRol();
};

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));
</script>

<template>
  <v-btn color="primary" class="register-btn" @click="abrirModal">
    <v-icon start>mdi-plus</v-icon>
    Registrar Nuevo Rol
  </v-btn>

  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card">

      <div class="modal-header">
        <button class="back-link" type="button" @click="cerrarModal">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Registrar Rol</h1>
        <p class="modal-subtitle">Complete los datos para dar de alta un nuevo rol en el sistema.</p>
      </div>

      <v-form @submit.prevent="registrarRol" class="modal-form">

        <div class="form-group full-width">
          <label class="form-label">
            <v-icon size="14" class="label-icon">mdi-shield-account-outline</v-icon>
            Nombre del Rol <span class="required">*</span>
          </label>
          <v-text-field
            ref="nombreRef"
            v-model="form.rol_nombre"
            placeholder="Ej: Jefe de Sucursal"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :error-messages="erroresForm.rol_nombre"
          />
        </div>

        <div class="form-group full-width">
          <label class="form-label">Descripción</label>
          <v-textarea
            v-model="form.descripcion"
            placeholder="Ej: Responsable de supervisar las operaciones diarias de una sucursal."
            variant="outlined"
            density="comfortable"
            rows="3"
            auto-grow
            hide-details="auto"
            :error-messages="erroresForm.descripcion"
          />
        </div>

        <div class="modal-actions">
          <v-btn
            class="cancel-btn"
            variant="outlined"
            type="button"
            :disabled="loading"
            @click="cerrarModal"
          >
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
