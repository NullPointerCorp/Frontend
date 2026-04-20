<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useEditarRol } from "@/modules/rol/controllers/useEditarRol";
import type { Rol } from "@/modules/rol/interfaces/rol-interface";

const emit = defineEmits<{ (e: "rolEditado", rol: Rol): void }>();

const {
  dialog,
  loading,
  form,
  erroresForm,
  abrirModal,
  cerrarModal,
  editarRol,
} = useEditarRol((rol) => emit("rolEditado", rol));

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return;
  if (e.key === "Escape") cerrarModal();
  if (e.key === "Enter" && !(e.target instanceof HTMLInputElement)) editarRol();
};

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));

defineExpose({ abrirModal });
</script>

<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card">

      <div class="modal-header">
        <button class="back-link" type="button" @click="cerrarModal">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Editar Rol</h1>
        <p class="modal-subtitle">Actualice el nombre o descripción de un rol existente.</p>
      </div>

      <v-form @submit.prevent="editarRol" class="modal-form">

        <div class="form-group full-width">
          <label class="form-label">
            <v-icon size="14" class="label-icon">mdi-shield-account-outline</v-icon>
            Nombre del Rol <span class="required">*</span>
          </label>
          <v-text-field
            v-model="form.rol_nombre"
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
