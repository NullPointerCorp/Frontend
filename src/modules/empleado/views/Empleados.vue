<script setup lang="ts">
import { onMounted, watch, ref, computed } from "vue";
import { useEmpleado } from "@/modules/empleado/controllers/useEmpleado";

import ModalRegistrarEmpleado from "./components/ModalRegistrarEmpleado.vue";
import ModalConfirmar from "@/components/ModalConfirmar.vue";
import ModalEditarEmpleado from "./components/ModalEditarEmpleado.vue";

import Tabla from "@/components/Tabla.vue";
import AppHeader from "@/components/AppHeader.vue";
import type { Empleado } from "../interfaces/empleado-interface";

const modalEditar = ref<any>(null);

const {
  empleadosPaginados,
  totalPaginas,
  totalEmpleados,
  page,
  limit,
  search,
  loading,
  fetchEmpleados,
  eliminarEmpleado,
  actualizarEmpleado,
  dialogConfirmar,
  mensajeConfirmar,
  aceptar,
  cancelar,
} = useEmpleado();

const handleEmpleadoCreado = async () => {
  await fetchEmpleados();
};

const handleEmpleadoEditado = (empleado: Empleado) => {
  actualizarEmpleado(empleado)
}

const empleadosTabla = computed(() =>
  empleadosPaginados.value.map((empleado) => ({
    ...empleado,
    apellido_paterno: empleado.apellido_paterno || "-",
    apellido_materno: empleado.apellido_materno || "-",
    telefono: empleado.telefono || "-",
    nombre_estado: empleado.nombre_estado || "-",
    nombre_ciudad: empleado.nombre_ciudad || "-",
    colonia: empleado.colonia || "-",
    codigo_postal: empleado.codigo_postal || "-",
    calle: empleado.calle || "-",
    numero_exterior: empleado.numero_exterior || "-",
    numero_interior: empleado.numero_interior || "-",
    rol_nombre: empleado.rol_nombre || "-",
    nombre_sucursal: empleado.nombre_sucursal || "-",
    _original: empleado,
  })),
);

onMounted(fetchEmpleados);
watch(search, () => { page.value = 1; });
</script>

<template>
  <v-app>
    <v-main class="main-content">

      <!-- Header -->
      <AppHeader/>

      <div class="content-wrapper">

        <div class="page-header">
          <div>
            <h1 class="page-title">Catálogo de Empleados</h1>
            <p class="page-subtitle">Gestiona el personal, roles y asignaciones de sucursales.</p>
          </div>
          <ModalRegistrarEmpleado @empleadoCreado="handleEmpleadoCreado" />
        </div>

        <div class="filters-row">
          <div class="search-wrapper">
            <v-text-field v-model="search" placeholder="Filtrar por nombre, correo..."
              prepend-inner-icon="mdi-filter-variant" variant="outlined" density="compact" hide-details
              class="search-field" />
          </div>
          <div class="items-per-page">
            <span>Mostrar:</span>
            <v-select v-model="limit" :items="[5, 10, 25, 50]" variant="outlined" density="compact" hide-details
              class="items-select" />
          </div>
        </div>

        <Tabla item-key="empleado_id" :headers="[
          { title: 'ID', key: 'empleado_id' },
          { title: 'Nombre', key: 'nombre' },
          { title: 'Apellido Paterno', key: 'apellido_paterno' },
          { title: 'Apellido Materno', key: 'apellido_materno' },
          { title: 'Teléfono', key: 'telefono' },
          { title: 'Correo', key: 'correo' },
          { title: 'Estado', key: 'nombre_estado' },
          { title: 'Ciudad', key: 'nombre_ciudad' },
          { title: 'Colonia', key: 'colonia' },
          { title: 'Codigo Postal', key: 'codigo_postal' },
          { title: 'Calle', key: 'calle' },
          { title: 'Numero Exterior', key: 'numero_exterior' },
          { title: 'Numero Interior', key: 'numero_interior' },
          { title: 'Rol', key: 'rol_nombre' },
          { title: 'Nombre de la Sucursal', key: 'nombre_sucursal' },
          { title: 'Acciones', key: 'acciones', sortable: false }
        ]" :items="empleadosTabla" :loading="loading" :page="page" :limit="limit" :total-items="totalEmpleados"
          :total-paginas="totalPaginas" @editar="modalEditar?.abrirModal($event)" @eliminar="eliminarEmpleado"
          @update:page="page = $event" />

        <div class="page-footer">
          <span>© 2026 NovaLogistics.</span>
        </div>

      </div>

      <ModalConfirmar :dialog="dialogConfirmar" :mensaje="mensajeConfirmar" @aceptar="aceptar" @cancelar="cancelar" />
      <ModalEditarEmpleado ref="modalEditar" @empleadoEditado="handleEmpleadoEditado" />

    </v-main>
  </v-app>
</template>

<style src="@/assets/styles/catalogo.style.css"></style>
