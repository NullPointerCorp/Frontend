<script setup lang="ts">
import { onMounted, watch, ref, computed } from "vue";
import { useEmpleados } from "@/composables/useEmpleados";
import { useAuthStore } from "../../stores/auth.store";

import ModalRegistrarEmpleado from "./components/ModalRegistrarEmpleado.vue";
import ModalConfirmar from "@/components/ModalConfirmar.vue";
import ModalEditarEmpleado from "./components/ModalEditarEmpleado.vue";

import Tabla from "@/components/Tabla.vue";

const authStore = useAuthStore();
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
  dialogConfirmar,
  mensajeConfirmar,
  aceptar,
  cancelar,
} = useEmpleados();

const handleEmpleadoCreado = async () => {
  await fetchEmpleados();
};

const handleEmpleadoEditado = async () => {
  await fetchEmpleados();
};

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
    nombre_rol: empleado.nombre_rol || "-",
    nombre_sucursal: empleado.nombre_sucursal || "-",
    _original: empleado,
  })),
);

onMounted(fetchEmpleados);
watch(search, () => { page.value = 1; });
</script>

<template>
  <v-app>
    <v-main class="main-content" theme="light">

      <div class="header">
        <div></div>
        <div class="user-info">
          <div class="user-details">
            <span class="user-name">{{ authStore.session?.nombre }}</span>
            <span class="user-role">{{ authStore.session?.rol }}</span>
          </div>
        </div>
      </div>

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
          { title: 'Rol', key: 'nombre_rol' },
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