<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRegistrarTransporte } from '@/modules/transporte/controllers/useRegistrarTransporte'
import { useToast } from '@/composables/useToast'
import type { Transporte } from '@/modules/transporte/interfaces/transporte-interface'

const { showToast } = useToast()
const {
  form,
  tipos,
  subtiposFiltrados,
  transportistas,
  loadingTipos,
  loadingSubtipos,
  loadingTransportistas,
  resetForm,
  registrarTransporte,
  fetchTipos,
  fetchSubtipos,
  fetchTransportistas,
  validate,
} = useRegistrarTransporte()

const emit = defineEmits<{ transporteCreado: [transporte: Transporte] }>()

const dialog = ref(false)
const loading = ref(false)
const formRef = ref()
const numeroSerieRef = ref()

const unidadesMedida = ['kg', 'ton', 'lb']

watch(dialog, async (abierto) => {
  if (abierto) {
    await nextTick()
    numeroSerieRef.value?.focus()
    await Promise.all([fetchTipos(), fetchSubtipos(), fetchTransportistas()])
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') cancelar()
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
    const nuevoTransporte = await registrarTransporte()
    emit('transporteCreado', nuevoTransporte)
    cancelar()
  } catch {
  } finally {
    loading.value = false
  }
}
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
        <p class="modal-subtitle">Complete los datos necesarios para dar de alta un nuevo Transporte en el sistema.</p>
      </div>

      <v-form ref="formRef" @submit.prevent="guardar" class="modal-form">

        <div class="form-section-title">
          <v-icon size="16">mdi-truck-outline</v-icon>
          DATOS DEL TRANSPORTE
        </div>

        <!-- Número de Serie -->
        <div class="form-group full-width">
          <label class="form-label">
            Numero de Serie <span class="required">*</span>
          </label>
          <v-text-field
            ref="numeroSerieRef"
            v-model="form.numero_serie"
            placeholder="Ej: CAR"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[validate('numero_serie')]"
          />
        </div>

        <!-- Tipo de Transporte -->
        <div class="form-group full-width">
          <label class="form-label">Tipo de Transporte <span class="required">*</span></label>
          <v-select
            v-model="form.tipo_id"
            :items="tipos"
            item-title="nombre_tipo"
            item-value="tipo_id"
            placeholder="Seleccionar Transporte"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :loading="loadingTipos"
            clearable
            :rules="[validate('tipo_id')]"
          />
        </div>

        <!-- Transportista y Subtipo -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              Transportista <span class="required">*</span>
            </label>
            <v-select
              v-model="form.empleado_id"
              :items="transportistas"
              :item-title="(t) => `${t.nombre} ${t.apellido_paterno}`"
              item-value="empleado_id"
              placeholder="Seleccionar Transportista"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :loading="loadingTransportistas"
              :rules="[validate('empleado_id')]"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Subtipo de Transporte <span class="required">*</span></label>
            <v-select
              v-model="form.subtipo_id"
              :items="subtiposFiltrados"
              item-title="nombre_subtipo"
              item-value="subtipo_id"
              placeholder="Seleccionar Subtipo de Transporte"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :loading="loadingSubtipos"
              :disabled="!form.tipo_id"
              :rules="[validate('subtipo_id')]"
            />
          </div>
        </div>

        <!-- Capacidad y Unidad -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              Capacidad de Carga <span class="required">*</span>
            </label>
            <v-text-field
              v-model.number="form.capacidad_carga"
              type="number"
              placeholder="Ej: 50"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :rules="[validate('capacidad_carga')]"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Unidad de Medida <span class="required">*</span></label>
            <v-select
              v-model="form.unidad_medida"
              :items="unidadesMedida"
              placeholder="Seleccionar Medida"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :rules="[validate('unidad_medida')]"
            />
          </div>
        </div>

        <!-- Placas -->
        <div class="form-group full-width">
          <label class="form-label">Placas (Solo Transporte Terrestre)</label>
          <v-text-field
            v-model="form.placa"
            placeholder="Ej: TCV-7498"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[validate('placa')]"
          />
        </div>

        <div class="modal-actions">
          <v-btn class="cancel-btn" variant="outlined" type="button" @click="cancelar" :disabled="loading">
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn class="save-btn" type="submit" :loading="loading">
            <v-icon start>mdi-content-save-outline</v-icon>
            Confirmar
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
