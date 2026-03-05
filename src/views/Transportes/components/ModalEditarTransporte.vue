<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useEditarTransporte } from "@/composables/useEditarTransporte";
import { UNIDADES_MEDIDA } from "@/composables/useRegistrarTransporte";
import type { Transporte } from "@/types/transporte.types";

const emit = defineEmits<{ (e: "transporteEditado", transporte: Transporte): void }>();

const {
  dialog,
  loading,
  errorMessage,
  form,
  transportistas,
  transporteSeleccionado,
  abrirModal,
  editarTransporte,
} = useEditarTransporte((transporte) => {
  emit("transporteEditado", transporte);
});

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return;
  if (e.key === "Escape") dialog.value = false;
  if (e.key === "Enter" && !(e.target instanceof HTMLInputElement)) editarTransporte();
};

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));

defineExpose({ abrirModal });
</script>

<template>
  <v-dialog v-model="dialog" max-width="700" persistent>
    <v-card class="modal-card" theme="light">
      <div class="modal-header">
        <button class="back-link" type="button" @click="dialog = false">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Editar Transporte</h1>
        <p class="modal-subtitle">Actualice los datos de un transporte ya existente en el sistema</p>
      </div>

      <div class="modal-form">
        <div class="form-group full-width">
          <label class="form-label">Numero de Serie</label>
          <div class="readonly-field">{{ transporteSeleccionado?.numero_serie }}</div>
        </div>

        <div class="form-group full-width">
          <label class="form-label">Tipo / Subtipo</label>
          <div class="readonly-field">{{ transporteSeleccionado?.tipo_transporte }} - {{ transporteSeleccionado?.subtipo_transporte }}</div>
        </div>

        <div class="form-group full-width">
          <label class="form-label">Transportista</label>
          <v-select
            v-model="form.transportista_id"
            :items="transportistas"
            :item-title="(item) => `${item.nombre} ${item.apellido_paterno}`"
            item-value="empleado_id"
            placeholder="Seleccionar Transportista"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Capacidad de Carga <span class="required">*</span></label>
            <v-text-field
              v-model.number="form.capacidad_carga"
              type="number"
              placeholder="Ej: 50"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Unidad de Medida</label>
            <v-select
              v-model="form.unidad_medida"
              :items="UNIDADES_MEDIDA"
              placeholder="Seleccionar Medida"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>
        </div>

        <div class="form-group full-width">
          <label class="form-label">Placas (Solo Transporte Terrestre)</label>
          <v-text-field
            v-model="form.placas"
            placeholder="Ej: TCV-7498"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </div>

        <p v-if="errorMessage" class="text-red text-sm mt-1">{{ errorMessage }}</p>
      </div>

      <div class="modal-actions">
        <v-btn class="cancel-btn" variant="outlined" type="button" @click="dialog = false" :disabled="loading">
          <v-icon start>mdi-close</v-icon>
          Cancelar
        </v-btn>
        <v-btn class="save-btn" :loading="loading" @click="editarTransporte">
          <v-icon start>mdi-content-save-outline</v-icon>
          Guardar Transporte
        </v-btn>
      </div>

      <div class="modal-footer">
        <span>© 2026 NovaLogistics.</span>
      </div>
    </v-card>
  </v-dialog>
</template>

<style src="@/assets/styles/modal.style.css"></style>
