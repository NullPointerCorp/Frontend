<script setup lang="ts">
import ToastContainer from '@/components/ToastContainer.vue'
</script>

<template>
  <v-app>
    <router-view />
    <ToastContainer />
  </v-app>
</template>
