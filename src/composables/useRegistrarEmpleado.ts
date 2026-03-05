import { reactive } from "vue";
import type { Empleado, RolOpcion } from "@/types/empleado.types";
import { useZodValidation } from "@/composables/useZodValidation";
import { empleadoSchema } from "@/schemas/empleado.schema";
import type { SucursalOpcion } from "@/composables/useUbicacion";

export const useRegistrarEmpleado = () => {
  const { validate, validateAll } = useZodValidation(empleadoSchema);

  const form = reactive({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    telefono: "",
    correo: "",
    password: "",
    confirm_password: "",
    ciudad_id: null as number | null,
    colonia: "",
    codigo_postal: "",
    calle: "",
    numero_exterior: "",
    numero_interior: "",
    rol_id: null as number | null,
    sucursal_id: null as number | null,
  });

  const resetForm = () => {
    form.nombre = "";
    form.apellido_paterno = "";
    form.apellido_materno = "";
    form.telefono = "";
    form.correo = "";
    form.password = "";
    form.confirm_password = "";
    form.ciudad_id = null;
    form.colonia = "";
    form.codigo_postal = "";
    form.calle = "";
    form.numero_exterior = "";
    form.numero_interior = "";
    form.rol_id = null;
    form.sucursal_id = null;
  };

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

  const fetchRoles = async (): Promise<RolOpcion[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/roles", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return [];
    const data = await response.json();
    return normalizarRoles(obtenerPayload(data));
  };

  const fetchSucursales = async (): Promise<SucursalOpcion[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/sucursales", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return [];
    const data = await response.json();
    return normalizarSucursales(obtenerPayload(data));
  };

  const registrarEmpleado = async (): Promise<Empleado> => {
    const token = localStorage.getItem("token");
     const payload = {
        nombre: form.nombre.trim(),
        apellido_paterno: form.apellido_paterno.trim(),
        apellido_materno: form.apellido_materno?.trim() || null,
        telefono: form.telefono?.trim() || null,
        correo: form.correo.trim().toLowerCase(),
        contrasena: form.password, 
        rol_id: form.rol_id != null ? Number(form.rol_id) : null,
        sucursal_id: form.sucursal_id != null ? Number(form.sucursal_id) : null,
        ciudad_id: form.ciudad_id != null ? Number(form.ciudad_id) : null,
        colonia: form.colonia?.trim() || null,
        codigo_postal: form.codigo_postal?.trim() || null,
        calle: form.calle?.trim() || null,
        numero_exterior: form.numero_exterior?.trim() || null,
        numero_interior: form.numero_interior?.trim() || null,
    };
    const response = await fetch("http://localhost:3000/empleados/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al registrar empleado");
    return data;
  };

  return { form, resetForm, registrarEmpleado, validate, validateAll, fetchRoles, fetchSucursales };
};