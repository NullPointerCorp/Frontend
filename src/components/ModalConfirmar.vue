<script setup lang="ts">
defineProps<{ dialog: boolean; mensaje: string }>();
defineEmits<{ (e: "aceptar"): void; (e: "cancelar"): void }>();
</script>

<template>
  <v-dialog :model-value="dialog" max-width="400" persistent>
    <v-card rounded="lg">
      <v-card-title class="pt-5 px-6">¿Estás seguro?</v-card-title>
      <v-card-text class="px-6">{{ mensaje }}</v-card-text> 
      <v-card-actions class="px-6 pb-5">
        <v-spacer />
        <v-btn variant="text" @click="$emit('cancelar')">Cancelar</v-btn>
        <v-btn color="red" @click="$emit('aceptar')">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>