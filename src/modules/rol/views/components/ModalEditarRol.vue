<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useEditarRol } from "@/modules/rol/controllers/useEditarRol";
import { useToast } from "@/composables/useToast";
import type { Rol } from "@/modules/rol/interfaces/rol-interface";

const emit = defineEmits<{ (e: "rolEditado", rol: Rol): void }>();

const { showToast } = useToast();
const { dialog, loading, form, abrirModal, editarRol, validate } =
  useEditarRol((rol) => emit("rolEditado", rol));

const formRef = ref();

const guardar = async () => {
  const { valid } = await formRef.value?.validate();
  if (!valid) {
    showToast("Por favor corrige los errores del formulario", "warning");
    return;
  }
  await editarRol();
};

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return;
  if (e.key === "Escape") dialog.value = false;
  if (e.key === "Enter" && !(e.target instanceof HTMLInputElement)) guardar();
};

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));

defineExpose({ abrirModal });
</script>

<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card">

      <div class="modal-header">
        <button class="back-link" type="button" @click="dialog = false">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Editar Rol</h1>
        <p class="modal-subtitle">Actualice el nombre o descripción de un rol existente.</p>
      </div>

      <v-form ref="formRef" @submit.prevent="guardar" validate-on="blur" class="modal-form">

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
            :rules="[validate('rol_nombre')]"
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
            :rules="[validate('descripcion')]"
          />
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
