<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRegistrarRol } from "@/modules/rol/controllers/useRegistrarRol";
import { useToast } from "@/composables/useToast";
import type { Rol } from "@/modules/rol/interfaces/rol-interface";

const { showToast } = useToast();
const { form, resetForm, registrarRol, validate } = useRegistrarRol();

const emit = defineEmits<{
  rolCreado: [rol: Rol];
}>();

const dialog = ref(false);
const loading = ref(false);
const formRef = ref();
const nombreRef = ref();

watch(dialog, async (abierto) => {
  if (abierto) {
    await nextTick();
    nombreRef.value?.focus();
  }
});

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return;
  if (e.key === "Escape") cancelar();
  if (e.key === "Enter" && !(e.target instanceof HTMLInputElement)) guardar();
};

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));

const cancelar = () => {
  dialog.value = false;
  setTimeout(() => {
    resetForm();
    formRef.value?.resetValidation();
  }, 300);
};

const guardar = async () => {
  const { valid } = await formRef.value?.validate();
  if (!valid) {
    showToast("Por favor corrige los errores del formulario", "warning");
    return;
  }
  loading.value = true;
  try {
    const nuevoRol = await registrarRol();
    emit("rolCreado", nuevoRol);
    cancelar();
  } catch {
    // el controlador ya muestra el toast
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-btn color="primary" class="register-btn" @click="dialog = true">
    <v-icon start>mdi-plus</v-icon>
    Registrar Nuevo Rol
  </v-btn>

  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="modal-card">

      <div class="modal-header">
        <button class="back-link" type="button" @click="cancelar">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Registrar Rol</h1>
        <p class="modal-subtitle">Complete los datos para dar de alta un nuevo rol en el sistema.</p>
      </div>

      <v-form ref="formRef" @submit.prevent="guardar" class="modal-form">

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
            :rules="[validate('rol_nombre')]"
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
            :rules="[validate('descripcion')]"
          />
        </div>

        <div class="modal-actions">
          <v-btn class="cancel-btn" variant="outlined" type="button" @click="cancelar" :disabled="loading">
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
