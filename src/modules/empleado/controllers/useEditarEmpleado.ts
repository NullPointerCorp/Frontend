import { ref } from "vue";
import type { Empleado } from "@/modules/empleado/interfaces/empleado-interface";
import type { Rol } from "@/modules/rol/interfaces/rol-interface";
import type { SucursalOpcion } from "@/composables/useUbicacion";
import { useToast } from "@/composables/useToast";
import empleadoAPI from "../api/empleadoAPI";
import rolAPI from "@/modules/rol/api/rolAPI";
import sucursalAPI from "@/modules/sucursal/api/sucursalAPI";

interface FormEditarEmpleado {
  empleado_id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  correo: string;
  estado_id: number | null;
  ciudad_id: number | null;
  colonia: string;
  codigo_postal: string;
  calle: string;
  numero_exterior: string;
  numero_interior: string;
  rol_id: number | null;
  sucursal_id: number | null;
}

const formInicial = (): FormEditarEmpleado => ({
  empleado_id: 0,
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  telefono: "",
  correo: "",
  estado_id: null,
  ciudad_id: null,
  colonia: "",
  codigo_postal: "",
  calle: "",
  numero_exterior: "",
  numero_interior: "",
  rol_id: null,
  sucursal_id: null,
});

export const useEditarEmpleado = (onSuccess: (empleado: Empleado) => void) => {
  const { showToast } = useToast();

  const dialog = ref(false);
  const loading = ref(false);
  const empleadoSeleccionado = ref<Empleado | null>(null);
  const roles = ref<Rol[]>([]);
  const sucursales = ref<SucursalOpcion[]>([]);

  const form = ref<FormEditarEmpleado>(formInicial());

  const fetchRoles = async () => {
    const { data } = await rolAPI.get<Rol[]>("/");
    roles.value = Array.isArray(data) ? data : [];
  };

  const fetchSucursales = async () => {
    const { data } = await sucursalAPI.get<SucursalOpcion[]>("/");
    sucursales.value = Array.isArray(data) ? data : [];
  };

  const abrirModal = async (empleado: Empleado) => {
    empleadoSeleccionado.value = empleado;
    form.value = {
      empleado_id: empleado.empleado_id,
      nombre: empleado.nombre,
      apellido_paterno: empleado.apellido_paterno,
      apellido_materno: empleado.apellido_materno,
      telefono: empleado.telefono,
      correo: empleado.correo,
      estado_id: empleado.estado_id ?? null,
      ciudad_id: empleado.ciudad_id,
      colonia: empleado.colonia,
      codigo_postal: empleado.codigo_postal,
      calle: empleado.calle,
      numero_exterior: empleado.numero_exterior,
      numero_interior: empleado.numero_interior || "",
      rol_id: empleado.rol_id,
      sucursal_id: empleado.sucursal_id,
    };
    await Promise.all([fetchRoles(), fetchSucursales()]);
    dialog.value = true;
  };

  const editarEmpleado = async () => {
    if (!empleadoSeleccionado.value) return;
    loading.value = true;

    try {
      const { data } = await empleadoAPI.put<Empleado>(
        `/${empleadoSeleccionado.value.empleado_id}`,
        form.value
      );
      onSuccess({ ...empleadoSeleccionado.value, ...form.value, ...data });
      showToast("¡Empleado modificado con éxito!", "success");
      dialog.value = false;
    } catch (error: any) {
      showToast(error.response?.data?.message || "Error al conectar con el servidor", "error");
    } finally {
      loading.value = false;
    }
  };

  return {
    dialog,
    loading,
    form,
    roles,
    sucursales,
    empleadoSeleccionado,
    abrirModal,
    editarEmpleado,
  };
};
