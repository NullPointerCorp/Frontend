<script setup lang="ts">
import { watch, onUnmounted } from "vue";

const props = defineProps<{
  dialog: boolean;
}>();

const emit = defineEmits<{
  aceptar: [];
  cancelar: [];
}>();

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") emit("cancelar");
  if (e.key === "Enter") emit("aceptar");
};

watch(
  () => props.dialog,
  (abierto) => {
    if (abierto) {
      window.addEventListener("keydown", handleKeydown);
    } else {
      window.removeEventListener("keydown", handleKeydown);
    }
  }
);

onUnmounted(() => window.removeEventListener("keydown", handleKeydown));
</script>

<template>
  <v-dialog :model-value="dialog" max-width="360" persistent>
    <v-card class="logout-modal">
      <button class="close-btn" type="button" @click="emit('cancelar')">
        <v-icon size="20">mdi-close</v-icon>
      </button>

      <h2 class="logout-title">Cerrar sesión</h2>

      <p class="logout-message">¿Desea cerrar sesión en la plataforma?</p>

      <div class="logout-actions">
        <v-btn
          class="logout-cancel"
          variant="flat"
          @click="emit('cancelar')"
        >
          Cancelar
        </v-btn>
        <v-btn
          class="logout-confirm"
          color="primary"
          variant="flat"
          @click="emit('aceptar')"
        >
          Cerrar sesión
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.logout-modal {
  padding: 32px 28px 24px;
  border-radius: 12px !important;
  text-align: center;
  position: relative;
  background-color: rgb(var(--v-theme-surface));
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(var(--v-theme-on-surface), 0.6);
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(var(--v-theme-on-surface), 0.08);
  color: rgb(var(--v-theme-on-surface));
}

.logout-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 12px 0;
}

.logout-message {
  font-size: 0.9rem;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 16px 0;
}

.logout-warning {
  font-size: 0.8rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin: 0 0 24px 0;
}

.logout-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.logout-cancel {
  text-transform: none !important;
  font-weight: 500;
  border-radius: 8px !important;
  background-color: rgba(var(--v-theme-on-surface), 0.08) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  flex: 1;
  max-width: 120px;
}

.logout-cancel:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.12) !important;
}

.logout-confirm {
  text-transform: none !important;
  font-weight: 500;
  border-radius: 8px !important;
  flex: 1;
  max-width: 140px;
}
</style>
