<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRegistrarEnvio } from "../controllers/useRegistrarEnvio";
import AppHeader from "@/components/AppHeader.vue";

const emit = defineEmits<{ envioCreado: [envio: any] }>();

const ciudadOrigenSeleccionada = ref<number | null>(null);
const ciudadDestinoSeleccionada = ref<number | null>(null);

const precioSeleccionado = ref<number | null>(null);

const {
  form, erroresForm, loading,
  correoCliente, clienteEncontrado, loadingCliente, errorCliente, buscarCliente,
  tiposPaquete, tiposTransporte, subtiposFiltrados, transportes,
  estados, ciudadesDestino, sucursalesDestino,
  estadoDestino, ciudadDestino,
  tipoTransporteSeleccionado, subtipoSeleccionado,
  loadingEstados, loadingCiudades, loadingSucursales, loadingTransportes,
  fetchCatalogos, registrarEnvio, resetForm,
} = useRegistrarEnvio((envio) => emit("envioCreado", envio));

watch(() => form.value.tipo_paquete_id, (id) => {
  const seleccionado = tiposPaquete.value.find(
    (t) => t.tipo_paquete_id === id
  );

  if (seleccionado) {
    precioSeleccionado.value = seleccionado.precio;
    form.value.forma_paquete = seleccionado.forma;
  } else {
    precioSeleccionado.value = null;
  }
});


onMounted(fetchCatalogos);
</script>

<template>
  <v-app>
    <v-main class="main-content">
      <AppHeader />

      <div class="content-wrapper">

        <div class="page-header">
          <div>
            <h1 class="page-title">Registrar Envío</h1>
            <p class="page-subtitle">Complete los datos para registrar un nuevo envío en el sistema de logística.</p>
          </div>
        </div>

        <v-card class="pa-6" rounded="lg">
          <v-form @submit.prevent="registrarEnvio">

            <!-- ── CLIENTE ── -->
            <p class="text-caption text-medium-emphasis font-weight-medium text-uppercase mb-3">
              <v-icon size="14" class="mr-1">mdi-account-outline</v-icon>
              Cliente
            </p>
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field v-model="correoCliente" label="Correo del cliente" placeholder="Ej. cliente@correo.com"
                  variant="outlined" density="comfortable" hide-details="auto" :error-messages="erroresForm.correo"
                  @keyup.enter="buscarCliente" />
              </v-col>
              <v-col cols="12" md="4" class="d-flex align-center">
                <v-btn variant="outlined" :loading="loadingCliente" @click="buscarCliente" block>
                  <v-icon start>mdi-magnify</v-icon>
                  Buscar cliente
                </v-btn>
              </v-col>

              <v-col cols="12" v-if="clienteEncontrado">
                <v-alert type="success" density="compact" variant="tonal">
                  <span class="font-weight-medium">
                    {{ clienteEncontrado.nombre }} {{ clienteEncontrado.apellido_paterno }}
                  </span>
                  &nbsp;— {{ clienteEncontrado.correo }}
                </v-alert>
              </v-col>
              <v-col cols="12" v-if="errorCliente">
                <v-alert type="error" density="compact" variant="tonal">
                  {{ errorCliente }}
                </v-alert>
              </v-col>
            </v-row>

            <v-divider class="my-5" />

            <!-- ── PAQUETE ── -->
            <!-- Tipo de paquete -->
            <v-row>
              <!-- Tipo de paquete -->
              <v-col cols="12" md="4">
                <v-select v-model="form.tipo_paquete_id" :items="tiposPaquete"
                  :item-title="(item) => item ? `${item.tamanio} - ${item.forma}` : ''" item-value="tipo_paquete_id"
                  label="Tipo de paquete" placeholder="Seleccionar tipo" variant="outlined" density="compact"
                  hide-details="auto" :error-messages="erroresForm.tipo_paquete_id" />
              </v-col>

              <!-- Precio -->
              <v-col cols="12" md="4">
                <v-text-field :model-value="precioSeleccionado" label="Precio" variant="outlined" density="compact"
                  readonly prefix="$" />
              </v-col>

              <!-- Peso -->
              <v-col cols="12" md="4">
                <v-text-field v-model.number="form.peso" label="Peso (kg)" type="number" min="0" step="0.1"
                  variant="outlined" density="compact" hide-details="auto"
                  :error-messages="erroresForm.peso" />
              </v-col>
            </v-row>

            <!-- Descripción -->
            <v-row class="mt-1">
              <v-col cols="12">
                <v-textarea v-model="form.descripcion" label="Descripción del envío"
                  placeholder="Ej. Documentos importantes, electrónico frágil…"
                  variant="outlined" density="comfortable" rows="2" auto-grow hide-details="auto"
                  :error-messages="erroresForm.descripcion" />
              </v-col>
            </v-row>

            <v-divider class="my-5" />

            <!-- ── DESTINO ── -->
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
                <v-select v-model="ciudadDestino" :items="ciudadesDestino" item-title="nombre_ciudad"
                  item-value="ciudad_id" label="Ciudad" placeholder="Seleccionar ciudad" variant="outlined"
                  density="comfortable" hide-details="auto" :loading="loadingCiudades" :disabled="!estadoDestino" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-model="form.destino_id" :items="sucursalesDestino" item-title="nombre_sucursal"
                  item-value="sucursal_id" label="Sucursal destino" placeholder="Seleccionar sucursal"
                  variant="outlined" density="comfortable" hide-details="auto" :loading="loadingSucursales"
                  :disabled="!ciudadDestino" :error-messages="erroresForm.destino_id" />
              </v-col>
            </v-row>

            <v-divider class="my-5" />

            <!-- ── TRANSPORTE ── -->
            <p class="text-caption text-medium-emphasis font-weight-medium text-uppercase mb-3">
              <v-icon size="14" class="mr-1">mdi-truck-outline</v-icon>
              Transporte
            </p>
            <v-row>
              <v-col cols="12" md="4">
                <v-select v-model="tipoTransporteSeleccionado" :items="tiposTransporte" item-title="nombre_tipo"
                  item-value="tipo_id" label="Tipo de transporte" placeholder="Seleccionar tipo"
                  variant="outlined" density="comfortable" hide-details="auto" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-model="subtipoSeleccionado" :items="subtiposFiltrados" item-title="nombre_subtipo"
                  item-value="subtipo_id" label="Subtipo de transporte" placeholder="Seleccionar subtipo"
                  variant="outlined" density="comfortable" hide-details="auto"
                  :disabled="!tipoTransporteSeleccionado" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-model="form.numero_serie" :items="transportes" item-title="placa"
                  item-value="numero_serie" label="Matrícula del vehículo" placeholder="Seleccionar vehículo"
                  variant="outlined" density="comfortable" hide-details="auto" :loading="loadingTransportes"
                  :disabled="!subtipoSeleccionado" :error-messages="erroresForm.numero_serie" />
              </v-col>
            </v-row>

            <!-- ── ACCIONES ── -->
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
