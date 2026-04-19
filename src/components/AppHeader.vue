<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useAuthStore } from '@/modules/auth/store/auth.store'

const authStore = useAuthStore()
const theme = useTheme()

const esOscuro = computed(() => theme.global.current.value.dark)

function toggleTheme() {
  theme.change(esOscuro.value ? 'light' : 'dark')
}
</script>

<template>
  <div class="header">
    <div></div>
    <div class="user-info">
      <v-btn
        :icon="esOscuro ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
        variant="text"
        @click="toggleTheme"
      />
      <div class="user-details">
        <span class="user-name">{{ authStore.session?.nombre }}</span>
        <span class="user-role">{{ authStore.session?.rol }}</span>
      </div>
    </div>
  </div>
</template>
