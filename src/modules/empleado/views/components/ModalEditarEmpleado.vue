<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useEditarEmpleado } from "@/modules/empleado/controllers/useEditarEmpleado";
import { useUbicacion } from "@/composables/useUbicacion";
import { useToast } from "@/composables/useToast";
import type { Empleado } from "@/modules/empleado/interfaces/empleado-interface";

const emit = defineEmits<{ (e: "empleadoEditado", empleado: Empleado): void }>();

const { showToast } = useToast();

const {
  dialog,
  loading,
  form,
  roles,
  sucursales,
  abrirModal,
  editarEmpleado,
} = useEditarEmpleado((empleado) => emit("empleadoEditado", empleado));

const { estados, ciudades, loadingEstados, loadingCiudades, estadoSeleccionado, fetchEstados } = useUbicacion();

const formRef = ref();

watch(dialog, async (abierto) => {
  if (abierto) {
    await fetchEstados();
    estadoSeleccionado.value = form.value.estado_id ?? null;
  }
});

const guardar = async () => {
  const { valid } = await formRef.value?.validate();
  if (!valid) {
    showToast("Por favor corrige los errores del formulario", "warning");
    return;
  }
  await editarEmpleado();
};

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return;
  if (e.key === "Escape") dialog.value = false;
  if (e.key === "Enter" && !(e.target instanceof HTMLInputElement)) guardar();
};

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));

defineExpose({ abrirModal });
</script>

<template>
  <v-dialog v-model="dialog" max-width="980" persistent>
    <v-card class="modal-card">
      <div class="modal-header">
        <button class="back-link" type="button" @click="dialog = false">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Editar Empleado</h1>
        <p class="modal-subtitle">Actualice los datos personales, información de contacto o puesto de un empleado.</p>
      </div>

      <v-form ref="formRef" @submit.prevent="guardar" validate-on="blur" class="modal-form">
        <div class="form-section-title">Datos Personales</div>

        <div class="form-group full-width">
          <label class="form-label">Nombre(s) <span class="required">*</span></label>
          <v-text-field v-model="form.nombre" placeholder="Ej: Juan Antonio" variant="outlined" density="comfortable"
            :rules="[v => !!v || 'El nombre es requerido']" hide-details="auto" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Apellido Paterno <span class="required">*</span></label>
            <v-text-field v-model="form.apellido_paterno" placeholder="Ej: García" variant="outlined"
              density="comfortable" :rules="[v => !!v || 'El apellido paterno es requerido']" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Apellido Materno</label>
            <v-text-field v-model="form.apellido_materno" placeholder="Ej: García" variant="outlined"
              density="comfortable" hide-details="auto" />
          </div>
        </div>

        <div class="form-section-title">Información de Contacto</div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Teléfono de Contacto <span class="required">*</span></label>
            <v-text-field v-model="form.telefono" placeholder="+34 600 000 000" prepend-inner-icon="mdi-phone-outline"
              variant="outlined" density="comfortable" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Correo <span class="required">*</span></label>
            <div class="readonly-field">{{ form.correo }}</div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Estado <span class="required">*</span></label>
            <v-select v-model="estadoSeleccionado" :items="estados" item-title="nombre_estado" item-value="estado_id"
              placeholder="Seleccionar estado" variant="outlined" density="comfortable" :loading="loadingEstados"
              hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Ciudad <span class="required">*</span></label>
            <v-select v-model="form.ciudad_id" :items="ciudades" item-title="nombre_ciudad" item-value="ciudad_id"
              placeholder="Seleccionar ciudad" variant="outlined" density="comfortable" :loading="loadingCiudades"
              :disabled="!estadoSeleccionado" hide-details="auto" />
          </div>
        </div>

        <div class="form-row-three">
          <div class="form-group">
            <label class="form-label">Colonia <span class="required">*</span></label>
            <v-text-field v-model="form.colonia" placeholder="Ej: Emiliano Zapata" variant="outlined" density="comfortable"
              :rules="[v => !!v || 'La colonia es requerida']" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Código Postal <span class="required">*</span></label>
            <v-text-field v-model="form.codigo_postal" placeholder="Ej: 80000" variant="outlined" density="comfortable"
              :rules="[v => !!v || 'El código postal es requerido']" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Calle <span class="required">*</span></label>
            <v-text-field v-model="form.calle" placeholder="Ej: Jesús García" variant="outlined" density="comfortable"
              :rules="[v => !!v || 'La calle es requerida']" hide-details="auto" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Numero Exterior <span class="required">*</span></label>
            <v-text-field v-model="form.numero_exterior" placeholder="Ej: 4569" variant="outlined" density="comfortable"
              :rules="[v => !!v || 'El número exterior es requerido']" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Numero Interior</label>
            <v-text-field v-model="form.numero_interior" placeholder="Ej: 302" variant="outlined" density="comfortable"
              hide-details="auto" />
          </div>
        </div>

        <div class="form-section-title">Puesto</div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Asignación de Rol <span class="required">*</span></label>
            <v-select v-model="form.rol_id" :items="roles" item-title="rol_nombre" item-value="rol_id"
              placeholder="Seleccionar rol del empleado..." variant="outlined" density="comfortable"
              :rules="[v => !!v || 'El rol es requerido']" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Sucursal Asignada <span class="required">*</span></label>
            <v-select v-model="form.sucursal_id" :items="sucursales" item-title="nombre_sucursal" item-value="sucursal_id"
              placeholder="Seleccionar sucursal principal..." variant="outlined" density="comfortable"
              :rules="[v => !!v || 'La sucursal es requerida']" hide-details="auto" />
          </div>
        </div>

        <div class="modal-actions">
          <v-btn class="cancel-btn" variant="outlined" type="button" @click="dialog = false" :disabled="loading">
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn class="save-btn" type="submit" :loading="loading">
            <v-icon start>mdi-content-save-outline</v-icon>
            Confirmar
          </v-btn>
        </div>
      </v-form>

      <div class="modal-footer">
        <span>© 2026 NovaLogistics.</span>
      </div>
    </v-card>
  </v-dialog>
</template>

<style src="@/assets/styles/modal.style.css"></style>
