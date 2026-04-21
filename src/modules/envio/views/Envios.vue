<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useEnvios } from "../controllers/useEnvios";

//import ModalRegistrarRol from "./components/ModalRegistrarRol.vue";
//import ModalEditarRol from "./components/ModalEditarRol.vue";
import ModalConfirmar from "@/components/ModalConfirmar.vue";

import Tabla from "@/components/Tabla.vue";
import AppHeader from "@/components/AppHeader.vue";

const modalEditar = ref<any>(null);

const {
  enviosPaginados,
  totalPaginas,
  totalEnvios,
  page,
  limit,
  search,
  loading,
  fetchEnvios,
  dialogConfirmar,
  aceptar,
  cancelar,
  mensajeConfirmar,
} = useEnvios();

onMounted(fetchEnvios);
watch(search, () => { page.value = 1; });
</script>

<template>
  <v-app>
    <v-main class="main-content">

      <!-- Header -->
      <AppHeader />

      <div class="content-wrapper">

        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Envíos</h1>
            <p class="page-subtitle">Gestione los envíos.</p>
          </div>
          <!-- <ModalRegistrarRol @rolCreado="agregarRol" />-->
        </div>

        <!-- Filtros -->
        <div class="filters-row">
          <div class="search-wrapper">
            <v-text-field v-model="search" placeholder="Filtrar por nombre, descripcion..."
              prepend-inner-icon="mdi-filter-variant" variant="outlined" density="compact" hide-details clearable
              class="search-field" />
          </div>
          <div class="items-per-page">
            <span>Mostrar:</span>
            <v-select v-model="limit" :items="[5, 10, 25, 50]" variant="outlined" density="compact" hide-details
              class="items-select" />
          </div>
        </div>

        <!-- Tabla -->
        <Tabla item-key="rol_id" :headers="[
          { title: 'ID', key: 'envio_id' },
          { title: 'Correo de Cliente', key: 'correo' },
          { title: 'Descripción', key: 'descripcion' },
          { title: 'Tipo de Paquete', key: 'tamanio' },
          { title: 'Forma', key: 'forma' },
          { title: 'Peso', key: 'peso' },
          { title: 'Empleado', key: 'nombre_empleado' },
          { title: 'No. de Serie', key: 'numero_serie' },
          { title: 'Transporte', key: 'nombre_subtipo' },
          { title: 'Fecha de Salida', key: 'fecha_salida' },
          { title: 'Fecha de Llegada', key: 'fecha_llegada' },
          { title: 'Origen', key: 'origen' },
          { title: 'Destino', key: 'destino' },
          { title: 'Estado de envío', key: 'estado_envio' }
        ]" :items="enviosPaginados" :loading="loading" :page="page" :limit="limit" :total-items="totalEnvios"
          :total-paginas="totalPaginas"
          @update:page="page = $event" />

        <!-- Footer -->
        <div class="page-footer">
          <span>© 2026 NovaCode.</span>
        </div>

      </div>

      <!-- Modales -->
      <ModalConfirmar :dialog="dialogConfirmar" :mensaje="mensajeConfirmar" @aceptar="aceptar" @cancelar="cancelar" />
      <!--<ModalEditarRol ref="modalEditar" @rolEditado="actualizarRol" />-->

    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/catalogo.style.css"></style>
