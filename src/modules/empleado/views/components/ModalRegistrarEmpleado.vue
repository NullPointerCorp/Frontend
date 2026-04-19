<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRegistrarEmpleado } from "@/modules/empleado/controllers/useRegistrarEmpleado";
import { useUbicacion } from "@/composables/useUbicacion";
import { useToast } from "@/composables/useToast";
import type { Empleado } from "@/modules/empleado/interfaces/empleado-interface";
import type { Rol } from "@/modules/rol/interfaces/rol-interface";
import type { SucursalOpcion } from "@/composables/useUbicacion";

const { showToast } = useToast();
const { form, resetForm, registrarEmpleado, validate, fetchRoles, fetchSucursales } = useRegistrarEmpleado();
const { estados, ciudades, loadingEstados, loadingCiudades, estadoSeleccionado, fetchEstados } = useUbicacion();

const emit = defineEmits<{ empleadoCreado: [empleado: Empleado] }>();

const dialog = ref(false);
const loading = ref(false);
const formRef = ref();
const nombreRef = ref();
const roles = ref<Rol[]>([]);
const sucursales = ref<SucursalOpcion[]>([]);

watch(dialog, async (abierto) => {
  if (abierto) {
    await nextTick();
    nombreRef.value?.focus();
    const [rolesData, sucursalesData] = await Promise.all([fetchRoles(), fetchSucursales(), fetchEstados()]);
    roles.value = rolesData;
    sucursales.value = sucursalesData;
  }
});

watch(estadoSeleccionado, (_, anterior) => {
  if (anterior !== null) form.ciudad_id = null;
});

const handleKeydown = (e: KeyboardEvent) => {
  if (!dialog.value) return;
  if (e.key === "Escape") cancelar();
  if (e.key === "Enter" && !(e.target instanceof HTMLInputElement)) guardar();
};

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));

const cancelar = () => {
  dialog.value = false;
  setTimeout(() => {
    resetForm();
    estadoSeleccionado.value = null;
    formRef.value?.resetValidation();
  }, 300);
};

const guardar = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) {
    showToast("Por favor corrige los errores del formulario", "warning") 
    return
  }

  if (form.password !== form.confirm_password) {
    showToast("Las contraseñas no coinciden", "warning") 
    return
  }

  loading.value = true;
  try {
    const nuevoEmpleado = await registrarEmpleado()
    emit("empleadoCreado", nuevoEmpleado)
    cancelar()
  } catch {
    // el controlador ya muestra el toast
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-btn color="primary" class="register-btn" @click="dialog = true">
    <v-icon start>mdi-plus</v-icon>
    Registrar Empleado
  </v-btn>

  <v-dialog v-model="dialog" max-width="980" persistent>
    <v-card class="modal-card">
      <div class="modal-header">
        <button class="back-link" type="button" @click="cancelar">
          <v-icon size="18">mdi-chevron-left</v-icon>
          Volver al Catálogo
        </button>
        <h1 class="modal-title">Registrar Empleado</h1>
        <p class="modal-subtitle">Complete los datos para dar de alta un nuevo miembro en el sistema.</p>
      </div>

      <v-form ref="formRef" @submit.prevent="guardar" class="modal-form">
        <div class="form-section-title">Datos Personales</div>

        <div class="form-group full-width">
          <label class="form-label">Nombre(s) <span class="required">*</span></label>
          <v-text-field ref="nombreRef" v-model="form.nombre" placeholder="Ej: Juan Antonio" variant="outlined"
            density="comfortable" :rules="[validate('nombre')]" hide-details="auto" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Apellido Paterno <span class="required">*</span></label>
            <v-text-field v-model="form.apellido_paterno" placeholder="Ej: García" variant="outlined"
              density="comfortable" :rules="[validate('apellido_paterno')]" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Apellido Materno</label>
            <v-text-field v-model="form.apellido_materno" placeholder="Ej: García" variant="outlined"
              density="comfortable" :rules="[validate('apellido_materno')]" hide-details="auto" />
          </div>
        </div>

        <div class="form-section-title">Información de Contacto</div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Teléfono de Contacto <span class="required">*</span></label>
            <v-text-field v-model="form.telefono" placeholder="+34 600 000 000" prepend-inner-icon="mdi-phone-outline"
              variant="outlined" density="comfortable" :rules="[validate('telefono')]" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Correo <span class="required">*</span></label>
            <v-text-field v-model="form.correo" placeholder="juan.perez@novelogistics.com"
              prepend-inner-icon="mdi-email-outline" variant="outlined" density="comfortable"
              :rules="[validate('correo')]" hide-details="auto" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Contraseña <span class="required">*</span></label>
            <v-text-field v-model="form.password" type="password" placeholder="********" variant="outlined"
              density="comfortable" :rules="[validate('password')]" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Confirmar Contraseña <span class="required">*</span></label>
            <v-text-field v-model="form.confirm_password" type="password" placeholder="********" variant="outlined"
              density="comfortable" :rules="[validate('confirm_password')]" hide-details="auto" />
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
              :rules="[validate('colonia')]" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Código Postal <span class="required">*</span></label>
            <v-text-field v-model="form.codigo_postal" placeholder="Ej: 80000" variant="outlined" density="comfortable"
              :rules="[validate('codigo_postal')]" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Calle <span class="required">*</span></label>
            <v-text-field v-model="form.calle" placeholder="Ej: Jesús García" variant="outlined" density="comfortable"
              :rules="[validate('calle')]" hide-details="auto" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Numero Exterior <span class="required">*</span></label>
            <v-text-field v-model="form.numero_exterior" placeholder="Ej: 4569" variant="outlined" density="comfortable"
              :rules="[validate('numero_exterior')]" hide-details="auto" />
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
              placeholder="Seleccionar rol del empleado..." variant="outlined" density="comfortable" hide-details="auto" />
          </div>
          <div class="form-group">
            <label class="form-label">Sucursal Asignada <span class="required">*</span></label>
            <v-select v-model="form.sucursal_id" :items="sucursales" item-title="nombre_sucursal" item-value="sucursal_id"
              placeholder="Seleccionar sucursal principal..." variant="outlined" density="comfortable" hide-details="auto" />
          </div>
        </div>

        <div class="modal-actions">
          <v-btn variant="outlined" class="cancel-btn" type="button" @click="cancelar" :disabled="loading">
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn type="submit" class="save-btn" :loading="loading">
            <v-icon start>mdi-content-save-outline</v-icon>
            Guardar Empleado
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
