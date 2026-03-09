<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
</script>

<template>
  <v-layout>
    <Sidebar />

    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>