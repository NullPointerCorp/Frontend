<script setup lang="ts">
import { useToast } from "../composables/useToast";

const { toasts, removeToast } = useToast();

const getIcon = (type: string) => {
  switch (type) {
    case "success": return "mdi-check-circle";
    case "error": return "mdi-alert-circle";
    case "warning": return "mdi-alert";
    case "info": return "mdi-information";
    default: return "mdi-information";
  }
};

const getColor = (type: string) => {
  switch (type) {
    case "success": return "#2e7d32";
    case "error": return "#d32f2f";
    case "warning": return "#f9a825";
    case "info": return "#1565c0";
    default: return "#1565c0";
  }
};
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :style="{ borderLeftColor: getColor(toast.type) }"
        >
          <v-icon :color="getColor(toast.type)" class="toast-icon">
            {{ getIcon(toast.type) }}
          </v-icon>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" @click="removeToast(toast.id)">
            <v-icon size="18">mdi-close</v-icon>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  animation: slideIn 0.3s ease;
}

.toast-icon {
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 0.9rem;
  color: #212121;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #757575;
  padding: 0;
  display: flex;
}

.toast-close:hover {
  color: #212121;
}

/* Animaciones */
.toast-enter-active {
  animation: slideIn 0.3s ease;
}

.toast-leave-active {
  animation: slideOut 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>