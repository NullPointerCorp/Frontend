<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useClientes } from "./useClientes";

import "./clientes.style.css";

import ModalRegistrarCliente from "./ModalRegistrarCliente.vue";
import ModalConfirmar from "../../components/ModalConfirmar.vue";
import ModalEditarCliente from "./ModalEditarCliente.vue";

const modalEditar = ref();
const { clientesPaginados, totalPaginas, page, search, loading, fetchClientes, agregarCliente,
  actualizarCliente, eliminarCliente, dialogConfirmar, aceptar, cancelar } = useClientes();

onMounted(fetchClientes);

watch(search, () => { page.value = 1; });
</script>

<template>
  <div class="clientes-container">
    <div class="clientes-header">
      <h1 class="clientes-title">Clientes</h1>
      <p class="clientes-subtitle">Gestiona el catálogo de clientes</p>
    </div>

    <div class="clientes-card">
      <v-row class="mb-4" align="center">
        <v-col cols="8">
          <v-text-field v-model="search" label="Buscar cliente" prepend-inner-icon="mdi-magnify" clearable hide-details
            variant="outlined" density="compact" />
        </v-col>
        <v-col cols="4" class="text-right">
          <ModalRegistrarCliente @clienteCreado="agregarCliente" />
        </v-col>
      </v-row>

      <v-data-table :headers="[
        { title: 'ID', key: 'id' },
        { title: 'Nombre', key: 'nombre' },
        { title: 'Apellido Paterno', key: 'apellido_paterno' },
        { title: 'Apellido Materno', key: 'apellido_materno' },
        { title: 'Correo', key: 'correo' },
        { title: 'Teléfono', key: 'telefono' },
        { title: 'Acciones', key: 'acciones', sortable: false },
      ]" :items="clientesPaginados" :loading="loading" hide-default-footer>
        <template #item.acciones="{ item }">
          <v-btn icon size="small" variant="text" @click="modalEditar.abrirModal(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="small" variant="text" color="red" @click="eliminarCliente(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <ModalConfirmar :dialog="dialogConfirmar" mensaje="¿Deseas eliminar este cliente?" @aceptar="aceptar"
            @cancelar="cancelar" />
          <ModalEditarCliente ref="modalEditar" @clienteEditado="actualizarCliente" />

        </template>
      </v-data-table>

      <v-pagination v-model="page" :length="totalPaginas" class="mt-4" />
    </div>
  </div>
</template>