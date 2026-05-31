<script setup lang="ts">
import type { Cliente } from "@/modules/cliente/interfaces/cliente-interface";

defineProps<{
  modelValue: Cliente | null
  items: Cliente[]
  placeholder?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  "update:modelValue": [value: Cliente | null]
  seleccionar: [cliente: Cliente]
}>()

const nombreCompleto = (cliente: Cliente) =>
  `${cliente.nombre} ${cliente.apellido_paterno} ${cliente.apellido_materno ?? ""}`.trim()

const seleccionarCliente = (cliente: Cliente | null) => {
  emit("update:modelValue", cliente)

  if (cliente) {
    emit("seleccionar", cliente)
  }
}
</script>

<template>
  <v-autocomplete
    :model-value="modelValue"
    :items="items"
    :item-title="nombreCompleto"
    return-object
    :placeholder="placeholder ?? 'Buscar cliente...'"
    :loading="loading"
    prepend-inner-icon="mdi-account-search-outline"
    variant="outlined"
    density="compact"
    hide-details
    clearable
    auto-select-first
    class="search-field"
    @update:model-value="seleccionarCliente"
  >
    <template #item="{ props }">
      <v-list-item v-bind="props">
      </v-list-item>
    </template>

    <template #no-data>
      <v-list-item>
        <v-list-item-title>No se encontraron clientes</v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
