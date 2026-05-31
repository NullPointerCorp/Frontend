<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRegistrarViaje } from '../../controllers/useRegistrarViaje'
import type { Viaje } from '../../interfaces/viaje-interface'

const emit = defineEmits<{ viajeCreado: [viaje: Viaje] }>()

const {
  dialog,
  loading,
  loadingCatalogos,
  erroresForm,
  catalogos,
  estados,
  ciudades,
  sucursalesDestino,
  estadoDestino,
  ciudadDestino,
  loadingCiudades,
  loadingSucursales,
  form,
  fetchCiudadesDestino,
  fetchSucursalesDestino,
  abrirModal,
  cerrarModal,
  registrarViaje,
} = useRegistrarViaje((viaje) => emit('viajeCreado', viaje))

const nombreTransporte = (t: any) => {
  const placa = t?.placa ? ` - ${t.placa}` : ''
  return `${t?.numero_serie ?? ''}${placa}`
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return
  if (e.key === 'Escape') cerrarModal()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <v-btn color="primary" class="register-btn" @click="abrirModal">
    <v-icon start>mdi-plus</v-icon>
    Registrar Viaje
  </v-btn>

  <v-dialog v-model="dialog" max-width="720" persistent>
    <v-card class="modal-card">
      <div class="modal-header">
        <button class="back-link" type="button" @click="cerrarModal">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catalogo
        </button>
        <h1 class="modal-title">Registrar Viaje</h1>
        <p class="modal-subtitle">Programa una salida desde tu sucursal asignada.</p>
      </div>

      <v-form class="modal-form" @submit.prevent="registrarViaje">
        <div class="form-section-title">
          <v-icon size="16">mdi-map-marker-path</v-icon>
          DATOS DEL VIAJE
        </div>

        <div class="form-group full-width">
          <label class="form-label">Origen</label>
          <div class="readonly-field">
            {{ catalogos?.origen?.nombre_sucursal ?? 'Sucursal asignada' }}
          </div>
        </div>

        <div class="form-group full-width">
            <label class="form-label">Transporte <span class="required">*</span></label>
            <v-select
              v-model="form.numero_serie"
              :items="catalogos?.transportes ?? []"
              :item-title="nombreTransporte"
              item-value="numero_serie"
              placeholder="Seleccionar transporte"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :loading="loadingCatalogos"
              :error-messages="erroresForm.numero_serie"
            />
        </div>

        <div class="form-section-title">
          <v-icon size="16">mdi-map-marker-outline</v-icon>
          DESTINO
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Estado <span class="required">*</span></label>
            <v-select
              v-model="estadoDestino"
              :items="estados"
              item-title="nombre_estado"
              item-value="estado_id"
              placeholder="Seleccionar estado"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :loading="loadingCatalogos"
              @update:model-value="fetchCiudadesDestino"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Ciudad <span class="required">*</span></label>
            <v-select
              v-model="ciudadDestino"
              :items="ciudades"
              item-title="nombre_ciudad"
              item-value="ciudad_id"
              placeholder="Seleccionar ciudad"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :loading="loadingCiudades"
              :disabled="!estadoDestino"
              @update:model-value="fetchSucursalesDestino"
            />
          </div>
        </div>

        <div class="form-group full-width">
          <label class="form-label">Sucursal destino <span class="required">*</span></label>
          <v-select
            v-model="form.sucursal_destino_id"
            :items="sucursalesDestino"
            item-title="nombre_sucursal"
            item-value="sucursal_id"
            placeholder="Seleccionar sucursal destino"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :loading="loadingSucursales"
            :disabled="!ciudadDestino"
            :error-messages="erroresForm.sucursal_destino_id"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Fecha de salida <span class="required">*</span></label>
            <v-text-field
              v-model="form.fecha_salida"
              type="datetime-local"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :error-messages="erroresForm.fecha_salida"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Fecha de llegada</label>
            <v-text-field
              v-model="form.fecha_llegada"
              type="datetime-local"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
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
