<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import {
  SUBTIPOS_POR_TIPO,
  TIPOS_TRANSPORTE,
  UNIDADES_MEDIDA,
  useRegistrarTransporte,
} from "@/composables/useRegistrarTransporte";
import { useToast } from "@/composables/useToast";
import type { Transporte, Transportista } from "@/types/transporte.types";

const { showToast } = useToast();
const { form, resetForm, fetchTransportistas, registrarTransporte } = useRegistrarTransporte();

const emit = defineEmits<{
  transporteCreado: [transporte: Transporte];
}>();

const dialog = ref(false);
const loading = ref(false);
const formRef = ref();
const serieRef = ref();
const transportistas = ref<Transportista[]>([]);

const subtipos = computed(() => SUBTIPOS_POR_TIPO[form.tipo_transporte] || []);
const esTerrestre = computed(() => form.tipo_transporte === "Terrestre");

watch(
  () => form.tipo_transporte,
  () => {
    form.subtipo_transporte = "";
    if (!esTerrestre.value) form.placas = "";
  },
);

watch(dialog, async (abierto) => {
  if (!abierto) return;
  transportistas.value = await fetchTransportistas();
  serieRef.value?.focus();
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
  loading.value = true;
  try {
    const nuevoTransporte = await registrarTransporte();
    emit("transporteCreado", nuevoTransporte);
    showToast("¡Transporte registrado con éxito!", "success");
    cancelar();
  } catch (error: any) {
    showToast(error.message || "Error de conexión con el servidor", "error");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-btn color="primary" class="register-btn" @click="dialog = true">
    <v-icon start>mdi-plus</v-icon>
    Registrar Nuevo Transporte
  </v-btn>

  <v-dialog v-model="dialog" max-width="700" persistent>
    <v-card class="modal-card" theme="light">
      <div class="modal-header">
        <button class="back-link" type="button" @click="cancelar">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Registrar Transporte</h1>
        <p class="modal-subtitle">Complete los datos necesarios para dar de alta a un nuevo Transporte en el sistema.</p>
      </div>

      <v-form ref="formRef" @submit.prevent="guardar" class="modal-form">
        <div class="form-group full-width">
          <label class="form-label">Numero de Serie <span class="required">*</span></label>
          <v-text-field
            ref="serieRef"
            v-model="form.numero_serie"
            placeholder="Ej: CAR"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tipo de Transporte <span class="required">*</span></label>
            <v-select
              v-model="form.tipo_transporte"
              :items="TIPOS_TRANSPORTE"
              placeholder="Seleccionar Transporte"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Subtipo de Transporte</label>
            <v-select
              v-model="form.subtipo_transporte"
              :items="subtipos"
              placeholder="Seleccionar Subtipo de Transporte"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :disabled="!form.tipo_transporte"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Transportista <span class="required">*</span></label>
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

        <div class="form-group full-width">
          <label class="form-label">Placas (Solo Transporte Terrestre)</label>
          <v-text-field
            v-model="form.placas"
            placeholder="Ej: TCV-7498"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :disabled="!esTerrestre"
          />
        </div>

        <div class="modal-actions">
          <v-btn variant="outlined" class="cancel-btn" type="button" @click="cancelar" :disabled="loading">
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn type="submit" class="save-btn" :loading="loading">
            <v-icon start>mdi-content-save-outline</v-icon>
            Guardar Transporte
          </v-btn>
        </div>
      </v-form>

      <div class="modal-footer">
        <span>© 2026 NovaLogistics.</span>
      </div>
    </v-card>
  </v-dialog>
</template>

<style src="@/assets/styles/modal.style.css"></style>
