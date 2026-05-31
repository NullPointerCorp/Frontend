<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRegistrarEnvio } from "../../controllers/useRegistrarEnvio";
import { useClientes } from "@/modules/cliente/controllers/useClientes";
import BuscardorCorreoCliente from "@/components/BuscardorCorreoCliente.vue";
import type { Cliente } from "@/modules/cliente/interfaces/cliente-interface";

const emit = defineEmits<{ envioCreado: [envio: any] }>();

const dialog = ref(false);
const precioSeleccionado = ref<number | null>(null);
const clienteSeleccionado = ref<Cliente | null>(null);

const {
  form, erroresForm, loading,
  correoCliente, clienteEncontrado, errorCliente,
  tiposPaquete,
  estados, ciudadesDestino, sucursalesDestino,
  estadoDestino, ciudadDestino,
  loadingEstados, loadingCiudades, loadingSucursales,
  fetchCatalogos, registrarEnvio, resetForm,
} = useRegistrarEnvio((envio) => {
  emit("envioCreado", envio);
  cerrarModal();
});

const {
  clientes,
  fetchClientes,
} = useClientes();

const abrirModal = async () => {
  dialog.value = true;
  await Promise.all([fetchCatalogos(), fetchClientes()]);
};

const cerrarModal = () => {
  dialog.value = false;
  resetForm();
  clienteSeleccionado.value = null;
  precioSeleccionado.value = null;
};

const seleccionarCliente = (cliente: Cliente) => {
  clienteSeleccionado.value = cliente;
  clienteEncontrado.value = cliente;
  correoCliente.value = cliente.correo;
  form.value.correo = cliente.correo;
  form.value.cliente_id = cliente.cliente_id;
};

watch(() => form.value.tipo_paquete_id, (id) => {
  const seleccionado = tiposPaquete.value.find(
    (tipo) => tipo.tipo_paquete_id === id,
  );

  if (seleccionado) {
    precioSeleccionado.value = seleccionado.precio;
    form.value.forma_paquete = seleccionado.forma;
  } else {
    precioSeleccionado.value = null;
  }
});

watch(clienteSeleccionado, (cliente) => {
  if (!cliente) {
    clienteEncontrado.value = null;
    correoCliente.value = "";
    form.value.correo = "";
    form.value.cliente_id = null;
    errorCliente.value = "";
  }
});

onMounted(fetchClientes);
</script>

<template>
  <v-btn color="primary" class="register-btn" @click="abrirModal">
    <v-icon start>mdi-plus</v-icon>
    Registrar Envio
  </v-btn>

  <v-dialog v-model="dialog" max-width="1100" persistent scrollable>
    <v-card class="modal-card">
      <div class="modal-header">
        <button class="back-link" type="button" @click="cerrarModal">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver a Envios
        </button>
        <h1 class="modal-title">Registrar Envio</h1>
        <p class="modal-subtitle">
          Complete los datos para registrar un nuevo envio en el sistema de logistica.
        </p>
      </div>

      <v-form @submit.prevent="registrarEnvio" class="modal-form">
        <p class="text-caption text-medium-emphasis font-weight-medium text-uppercase mb-3">
          <v-icon size="14" class="mr-1">mdi-account-outline</v-icon>
          Cliente
        </p>

        <v-row align="center">
          <v-col cols="12" md="6">
            <BuscardorCorreoCliente
              v-model="clienteSeleccionado"
              :items="clientes"
              placeholder="Buscar cliente por nombre..."
              @seleccionar="seleccionarCliente"
            />
          </v-col>

          <v-col cols="12" md="6" v-if="clienteEncontrado">
            <v-alert type="success" density="compact" variant="tonal">
              <span class="font-weight-medium">
                {{ clienteEncontrado.nombre }} {{ clienteEncontrado.apellido_paterno }}
                {{ clienteEncontrado.apellido_materno ?? "" }} -
                {{ clienteEncontrado.correo }}
              </span>
            </v-alert>
          </v-col>
        </v-row>

        <v-divider class="my-5" />

        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="form.tipo_paquete_id"
              :items="tiposPaquete"
              :item-title="(item) => item ? `${item.tamanio} - ${item.forma}` : ''"
              item-value="tipo_paquete_id"
              label="Tipo de paquete"
              placeholder="Seleccionar tipo"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :error-messages="erroresForm.tipo_paquete_id"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              :model-value="precioSeleccionado"
              label="Precio"
              variant="outlined"
              density="compact"
              readonly
              prefix="$"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="form.peso"
              label="Peso (kg)"
              type="number"
              min="0"
              step="0.1"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :error-messages="erroresForm.peso"
            />
          </v-col>
        </v-row>

        <v-row class="mt-1">
          <v-col cols="12">
            <v-textarea
              v-model="form.descripcion"
              label="Descripcion del envio"
              placeholder="Ej. Documentos importantes, electronico fragil..."
              variant="outlined"
              density="comfortable"
              rows="2"
              auto-grow
              hide-details="auto"
              :error-messages="erroresForm.descripcion"
            />
          </v-col>
        </v-row>

        <v-divider class="my-5" />

        <p class="text-caption text-medium-emphasis font-weight-medium text-uppercase mb-3">
          <v-icon size="14" class="mr-1">mdi-store</v-icon>
          Sucursal destino
        </p>

        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="estadoDestino"
              :items="estados"
              item-title="nombre_estado"
              item-value="estado_id"
              label="Estado"
              placeholder="Seleccionar estado"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :loading="loadingEstados"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="ciudadDestino"
              :items="ciudadesDestino"
              item-title="nombre_ciudad"
              item-value="ciudad_id"
              label="Ciudad"
              placeholder="Seleccionar ciudad"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :loading="loadingCiudades"
              :disabled="!estadoDestino"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="form.destino_id"
              :items="sucursalesDestino"
              item-title="nombre_sucursal"
              item-value="sucursal_id"
              label="Sucursal"
              placeholder="Seleccionar sucursal"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :loading="loadingSucursales"
              :disabled="!ciudadDestino"
              :error-messages="erroresForm.destino_id"
            />
          </v-col>
        </v-row>

        <div class="modal-actions">
          <v-btn variant="outlined" class="cancel-btn" type="button" :disabled="loading" @click="cerrarModal">
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn type="submit" class="save-btn" :loading="loading">
            <v-icon start>mdi-content-save-outline</v-icon>
            Guardar Envio
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style src="@/assets/styles/modal.style.css"></style>
