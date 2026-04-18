import { ref } from "vue";
import type { Empleado } from "@/modules/empleado/interfaces/empleado-interface";
import type { RolOpcion } from "@/modules/rol/interfaces/rol-interface";
import type { SucursalOpcion } from "@/composables/useUbicacion";
import { useToast } from "@/composables/useToast";
import empleadoAPI from "../api/empleadoAPI";
import rolAPI from "../../rol/api/rolAPI";
import sucursalAPI from "@/modules/sucursal/api/sucursalAPI";

export const useEditarEmpleado = (onSuccess: (empleado: Empleado) => void) => {
  const { showToast } = useToast();

  const dialog = ref(false);
  const loading = ref(false);
  const empleadoSeleccionado = ref<Empleado | null>(null);
  const roles = ref<RolOpcion[]>([]);
  const sucursales = ref<SucursalOpcion[]>([]);

  const form = ref({
    empleado_id: 0,
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    telefono: "",
    correo: "",
    estado_id: null as number | null,
    ciudad_id: null as number | null,
    colonia: "",
    codigo_postal: "",
    calle: "",
    numero_exterior: "",
    numero_interior: "",
    rol_id: null as number | null,
    sucursal_id: null as number | null,
  });

  const normalizarRoles = (data: unknown): RolOpcion[] => {
    if (!Array.isArray(data)) return [];
    return data
      .map((item: any) => ({
        rol_id: Number(item?.rol_id ?? item?.id_rol ?? item?.id ?? 0),
        nombre_rol: String(item?.nombre_rol ?? item?.rol_nombre ?? item?.rol ?? item?.nombre ?? item?.descripcion ?? ""),
      }))
      .filter((rol) => rol.rol_id > 0 && rol.nombre_rol);
  };

  const normalizarSucursales = (data: unknown): SucursalOpcion[] => {
    if (!Array.isArray(data)) return [];
    return data
      .map((item: any) => ({
        sucursal_id: Number(item?.sucursal_id ?? item?.id_sucursal ?? item?.id ?? 0),
        nombre_sucursal: String(item?.nombre_sucursal ?? item?.sucursal_nombre ?? item?.sucursal ?? item?.nombre ?? item?.descripcion ?? ""),
      }))
      .filter((sucursal) => sucursal.sucursal_id > 0 && sucursal.nombre_sucursal);
  };

  const obtenerPayload = (data: any) => {
    const candidato = data?.data ?? data?.rows ?? data?.result ?? data;
    if (Array.isArray(candidato)) return candidato;
    if (Array.isArray(candidato?.roles)) return candidato.roles;
    if (Array.isArray(candidato?.sucursales)) return candidato.sucursales;
    if (Array.isArray(candidato?.items)) return candidato.items;
    return candidato;
  };

  const fetchRoles = async () => {
    try {
      const { data } = await rolAPI.get('/')
      roles.value = normalizarRoles(obtenerPayload(data));
    } catch {
      roles.value = [];
    }
  };

  const fetchSucursales = async () => {
    try {
      const { data } = await sucursalAPI.get('/')
      sucursales.value = normalizarSucursales(obtenerPayload(data));
    } catch {
      sucursales.value = [];
    }
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
      rol_id: empleado.rol_id ? Number(empleado.rol_id) : null,
      sucursal_id: empleado.sucursal_id ? Number(empleado.sucursal_id) : null,
    };
    await Promise.all([fetchRoles(), fetchSucursales()]);
    dialog.value = true;
  };

  const editarEmpleado = async () => {
    if (!empleadoSeleccionado.value) return;
    loading.value = true;

    try {
      const { data } = await empleadoAPI.put( 
        `/${empleadoSeleccionado.value.empleado_id}`,
        form.value
      );
      onSuccess({ ...empleadoSeleccionado.value, ...form.value, ...data });
      showToast("¡Empleado modificado con éxito!", "success");
      dialog.value = false;
    } catch (error: any) {
      showToast(error.message || "Error al conectar con el servidor", "error"); 
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
