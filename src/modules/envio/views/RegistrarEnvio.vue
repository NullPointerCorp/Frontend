<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRegistrarEnvio } from "../controllers/useRegistrarEnvio";
import AppHeader from "@/components/AppHeader.vue";

const emit = defineEmits<{ envioCreado: [envio: any] }>();

const ciudadOrigenSeleccionada = ref<number | null>(null);
const ciudadDestinoSeleccionada = ref<number | null>(null);

const {
  form, erroresForm, loading,
  estados, ciudadesOrigen, ciudadesDestino,
  sucursalesOrigen, sucursalesDestino,
  loadingEstados, loadingCiudadesOrigen, loadingCiudadesDestino,
  loadingSucursalesOrigen, loadingSucursalesDestino,
  estadoOrigen, estadoDestino,
  fetchEstados, onCiudadOrigenChange, onCiudadDestinoChange,
  registrarEnvio, resetForm, tiposPaquete
} = useRegistrarEnvio((envio) => emit("envioCreado", envio));

import { watch } from "vue";
watch(ciudadOrigenSeleccionada, (val) => { if (val) onCiudadOrigenChange(val); });
watch(ciudadDestinoSeleccionada, (val) => { if (val) onCiudadDestinoChange(val); });

onMounted(fetchEstados);
</script>

<template>
  <v-app>
    <v-main class="main-content">

      <AppHeader />

      <div class="content-wrapper">

        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Registrar Envío</h1>
            <p class="page-subtitle">Complete los datos para registrar un nuevo envío en el sistema de logística.</p>
          </div>
        </div>

        <!-- Formulario -->
        <v-card class="pa-6" rounded="lg">
          <v-form @submit.prevent="registrarEnvio">

            <!-- Fila 1 -->
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.correo" label="Correo" placeholder="Ej. Luis Enrique" variant="outlined"
                  density="comfortable" hide-details="auto" :error-messages="erroresForm.correo" />
              </v-col>
              <v-col cols="12" md="3">
                <v-select v-model="form.tipo_paquete_id" :items="tiposPaquete" item-title="nombre"
                  item-value="tipo_paquete_id" label="Paquete" />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="form.fecha_llegada" label="Precio" placeholder="Ej. 5" type="number"
                  variant="outlined" density="comfortable" hide-details="auto" />
              </v-col>
            </v-row>

            <!-- Fila 2 -->
            <v-row>
              <v-col cols="12" md="4">
                <v-select v-model="form.fecha_llegada" :items="['Terrestre', 'Aéreo']" label="Tipo de transporte"
                  placeholder="Seleccionar tipo" variant="outlined" density="comfortable" hide-details="auto" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-model="form.fecha_llegada" :items="['Camión', 'Moto', 'Avión']"
                  label="Subtipo de transporte" placeholder="Seleccionar subtipo" variant="outlined"
                  density="comfortable" hide-details="auto" />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field v-model="form.cliente_id" label="Peso" placeholder="Ej. 10 Kg" variant="outlined"
                  density="comfortable" hide-details="auto" />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field v-model="form.numero_serie" label="Número de serie" placeholder="Ej. CAR-01"
                  variant="outlined" density="comfortable" hide-details="auto"
                  :error-messages="erroresForm.numero_serie" />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- Origen -->
            <p class="text-caption text-medium-emphasis font-weight-medium text-uppercase mb-3">
              <v-icon size="14" class="mr-1">mdi-map-marker-outline</v-icon>
              Origen
            </p>
            <v-row>
              <v-col cols="12" md="4">
                <v-select v-model="estadoOrigen" :items="estados" item-title="nombre_estado" item-value="estado_id"
                  label="Estado" placeholder="Seleccionar estado" variant="outlined" density="comfortable"
                  hide-details="auto" :loading="loadingEstados" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-model="ciudadOrigenSeleccionada" :items="ciudadesOrigen" item-title="nombre_ciudad"
                  item-value="ciudad_id" label="Ciudad" placeholder="Seleccionar ciudad" variant="outlined"
                  density="comfortable" hide-details="auto" :loading="loadingCiudadesOrigen"
                  :disabled="!estadoOrigen" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-model="form.origen_id" :items="sucursalesOrigen" item-title="nombre_sucursal"
                  item-value="sucursal_id" label="Sucursal origen" placeholder="Seleccionar sucursal" variant="outlined"
                  density="comfortable" hide-details="auto" :loading="loadingSucursalesOrigen"
                  :disabled="!ciudadOrigenSeleccionada" :error-messages="erroresForm.origen_id" />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- Destino -->
            <p class="text-caption text-medium-emphasis font-weight-medium text-uppercase mb-3">
              <v-icon size="14" class="mr-1">mdi-map-marker-check-outline</v-icon>
              Destino
            </p>
            <v-row>
              <v-col cols="12" md="4">
                <v-select v-model="estadoDestino" :items="estados" item-title="nombre_estado" item-value="estado_id"
                  label="Estado" placeholder="Seleccionar estado" variant="outlined" density="comfortable"
                  hide-details="auto" :loading="loadingEstados" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-model="ciudadDestinoSeleccionada" :items="ciudadesDestino" item-title="nombre_ciudad"
                  item-value="ciudad_id" label="Ciudad" placeholder="Seleccionar ciudad" variant="outlined"
                  density="comfortable" hide-details="auto" :loading="loadingCiudadesDestino"
                  :disabled="!estadoDestino" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-model="form.destino_id" :items="sucursalesDestino" item-title="nombre_sucursal"
                  item-value="sucursal_id" label="Sucursal destino" placeholder="Seleccionar sucursal"
                  variant="outlined" density="comfortable" hide-details="auto" :loading="loadingSucursalesDestino"
                  :disabled="!ciudadDestinoSeleccionada" :error-messages="erroresForm.destino_id" />
              </v-col>
            </v-row>

            <!-- Acciones -->
            <div class="d-flex justify-end gap-3 mt-6">
              <v-btn variant="outlined" :disabled="loading" @click="resetForm">
                <v-icon start>mdi-close</v-icon> Cancelar
              </v-btn>
              <v-btn color="primary" type="submit" :loading="loading">
                <v-icon start>mdi-content-save-outline</v-icon> Guardar Envío
              </v-btn>
            </div>

          </v-form>
        </v-card>

        <div class="page-footer">
          <span>© 2026 NovaCode.</span>
        </div>

      </div>
    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/catalogo.style.css"></style>
