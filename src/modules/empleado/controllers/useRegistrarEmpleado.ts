import { reactive } from "vue";
import type { Empleado, CrearEmpleadoDTO } from "@/modules/empleado/interfaces/empleado-interface";
import type { Rol } from "@/modules/rol/interfaces/rol-interface";
import { useZodValidation } from "@/composables/useZodValidation";
import { empleadoSchema } from "@/modules/empleado/schemas/EmpleadoSchema";
import { useToast } from "@/composables/useToast";
import type { SucursalOpcion } from "@/composables/useUbicacion";
import empleadoAPI from "../api/empleadoAPI";
import rolAPI from "@/modules/rol/api/rolAPI";
import sucursalAPI from "@/modules/sucursal/api/sucursalAPI";

interface FormRegistrarEmpleado {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  correo: string;
  password: string;
  confirm_password: string;
  ciudad_id: number | null;
  colonia: string;
  codigo_postal: string;
  calle: string;
  numero_exterior: string;
  numero_interior: string;
  rol_id: number | null;
  sucursal_id: number | null;
}

const formInicial = (): FormRegistrarEmpleado => ({
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  telefono: "",
  correo: "",
  password: "",
  confirm_password: "",
  ciudad_id: null,
  colonia: "",
  codigo_postal: "",
  calle: "",
  numero_exterior: "",
  numero_interior: "",
  rol_id: null,
  sucursal_id: null,
});

export const useRegistrarEmpleado = () => {
  const { validate } = useZodValidation(empleadoSchema);
  const { showToast } = useToast();

  const form = reactive<FormRegistrarEmpleado>(formInicial());

  const resetForm = () => Object.assign(form, formInicial());

  const fetchRoles = async (): Promise<Rol[]> => {
    const { data } = await rolAPI.get<Rol[]>("/");
    return Array.isArray(data) ? data : [];
  };

  const fetchSucursales = async (): Promise<SucursalOpcion[]> => {
    const { data } = await sucursalAPI.get<SucursalOpcion[]>("/");
    return Array.isArray(data) ? data : [];
  };

  const prepararDatos = (): CrearEmpleadoDTO => ({
    nombre: form.nombre.trim(),
    apellido_paterno: form.apellido_paterno.trim(),
    apellido_materno: form.apellido_materno.trim() || null,
    telefono: form.telefono.trim() || null,
    correo: form.correo.trim().toLowerCase(),
    contrasena: form.password,
    rol_id: form.rol_id,
    sucursal_id: form.sucursal_id,
    ciudad_id: form.ciudad_id,
    colonia: form.colonia.trim() || null,
    codigo_postal: form.codigo_postal.trim() || null,
    calle: form.calle.trim() || null,
    numero_exterior: form.numero_exterior.trim() || null,
    numero_interior: form.numero_interior.trim() || null,
  });

  const registrarEmpleado = async (): Promise<Empleado> => {
    try {
      const { data } = await empleadoAPI.post<Empleado>("/", prepararDatos());
      showToast("¡Empleado registrado con éxito!", "success");
      return data;
    } catch (error: any) {
      showToast(error.message || "Error al registrar empleado", "error");
      throw error;
    }
  };

  return { form, resetForm, registrarEmpleado, validate, fetchRoles, fetchSucursales };
};
