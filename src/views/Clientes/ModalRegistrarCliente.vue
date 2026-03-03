<script setup lang="ts">
import { useCrearCliente } from "./useCrearClientes";
import type { Cliente } from "../../types/cliente.types";

const emit = defineEmits<{ (e: "clienteCreado", cliente: Cliente): void }>();

const { dialog, loading, errorMessage, form, crearCliente, resetForm } = useCrearCliente((cliente) => {
  emit("clienteCreado", cliente);
});
</script>

<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <template #activator="{ props }">
      <v-btn color="black" v-bind="props">Registrar</v-btn>
    </template>

    <v-card rounded="lg">
      <v-card-title class="pt-5 px-6">Registrar Cliente</v-card-title>
      <v-card-subtitle class="px-6">Ingresa los datos del nuevo cliente</v-card-subtitle>

      <v-card-text class="px-6">
        <v-text-field v-model="form.nombre" label="Nombre" variant="outlined" density="compact" class="mb-2" />
        <v-text-field v-model="form.apellido_paterno" label="Apellido Paterno" variant="outlined" density="compact"
          class="mb-2" />
        <v-text-field v-model="form.apellido_materno" label="Apellido Materno" variant="outlined" density="compact"
          class="mb-2" />
        <v-text-field v-model="form.correo" label="Correo" type="email" variant="outlined" density="compact"
          class="mb-2" />
        <v-text-field v-model="form.telefono" label="Teléfono" variant="outlined" density="compact" class="mb-2" />

        <p v-if="errorMessage" class="text-red text-sm mt-1">{{ errorMessage }}</p>
      </v-card-text>

      <v-card-actions class="px-6 pb-5">
        <v-spacer />
        <v-btn variant="text" @click="() => { resetForm(); dialog = false; }">Cancelar</v-btn>
        <v-btn color="black" :loading="loading" @click="crearCliente">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>