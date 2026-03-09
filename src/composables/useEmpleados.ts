import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { Empleado } from "@/types/empleado.types";
import { useConfirmar } from "@/composables/useConfirmar";
import { useToast } from "@/composables/useToast";

const { showToast } = useToast();

const todosLosEmpleados = ref<Empleado[]>([]);
const search = ref("");
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

const obtenerPayload = (data: any) => {
  const candidato = data?.data ?? data?.rows ?? data?.result ?? data;

  if (Array.isArray(candidato)) return candidato;
  if (Array.isArray(candidato?.empleados)) return candidato.empleados;
  if (Array.isArray(candidato?.items)) return candidato.items;

  return candidato;
};

const obtenerTexto = (...valores: any[]) => {
  for (const valor of valores) {
    if (valor === undefined || valor === null) continue;
    const texto = String(valor).trim();
    if (texto) return texto;
  }
  return "";
};

const obtenerNumero = (...valores: any[]) => {
  for (const valor of valores) {
    if (valor === undefined || valor === null || valor === "") continue;
    const numero = Number(valor);
    if (!Number.isNaN(numero) && numero > 0) return numero;
  }
  return null;
};

const normalizarEmpleado = (item: any): Empleado => {
  const empleado_id = Number(item?.empleado_id ?? item?.id_empleado ?? item?.id ?? 0);
  const nombre = obtenerTexto(item?.nombre, item?.nombres, item?.name);
  const apellido_paterno = obtenerTexto(item?.apellido_paterno, item?.apellidoPaterno, item?.apaterno);
  const apellido_materno = obtenerTexto(item?.apellido_materno, item?.apellidoMaterno, item?.amaterno);
  const telefono = obtenerTexto(item?.telefono, item?.celular, item?.telefono_contacto);
  const correo = obtenerTexto(item?.correo, item?.email, item?.correo_electronico);
  const ciudad_id = obtenerNumero(item?.ciudad_id, item?.id_ciudad, item?.ciudadId);
  const estado_id = obtenerNumero(item?.estado_id, item?.id_estado, item?.estadoId);
  const colonia = obtenerTexto(item?.colonia, item?.direccion?.colonia);
  const codigo_postal = obtenerTexto(item?.codigo_postal, item?.codigoPostal, item?.cp, item?.direccion?.codigo_postal);
  const calle = obtenerTexto(item?.calle, item?.direccion?.calle);
  const numero_exterior = obtenerTexto(item?.numero_exterior, item?.numeroExterior, item?.num_exterior, item?.direccion?.numero_exterior);
  const numero_interior = obtenerTexto(item?.numero_interior, item?.numeroInterior, item?.num_interior, item?.direccion?.numero_interior);
  const rol_id = obtenerNumero(item?.rol_id, item?.id_rol, item?.rolId, item?.rol?.rol_id);
  const sucursal_id = obtenerNumero(item?.sucursal_id, item?.id_sucursal, item?.sucursalId, item?.sucursal?.sucursal_id);
  const nombre_estado = obtenerTexto(item?.nombre_estado, item?.estado, item?.estado_nombre, item?.ubicacion?.estado, item?.direccion?.estado);
  const nombre_ciudad = obtenerTexto(item?.nombre_ciudad, item?.ciudad, item?.ciudad_nombre, item?.ubicacion?.ciudad, item?.direccion?.ciudad);
  const nombre_rol = obtenerTexto(item?.nombre_rol, item?.rol_nombre, item?.rol, item?.rol?.nombre_rol, item?.rol?.nombre);
  const nombre_sucursal = obtenerTexto(item?.nombre_sucursal, item?.sucursal_nombre, item?.sucursal, item?.nombre_sucural, item?.sucursal?.nombre_sucursal, item?.sucursal?.nombre);

  return {
    empleado_id,
    nombre,
    apellido_paterno,
    apellido_materno,
    telefono,
    correo,
    ciudad_id,
    estado_id,
    colonia,
    codigo_postal,
    calle,
    numero_exterior,
    numero_interior,
    rol_id,
    sucursal_id,
    nombre_estado,
    nombre_ciudad,
    nombre_rol,
    nombre_sucursal,
  };
};

export const useEmpleados = () => {
  const router = useRouter();

  const {
    dialog: dialogConfirmar,
    mensaje: mensajeConfirmar,
    confirmar,
    aceptar,
    cancelar,
  } = useConfirmar();

  const empleadosFiltrados = computed(() => {
    const q = search.value.toLowerCase();
    return todosLosEmpleados.value.filter((e) =>
      e.empleado_id.toString().includes(q) ||
      e.nombre.toLowerCase().includes(q) ||
      e.apellido_paterno.toLowerCase().includes(q) ||
      (e.apellido_materno || "").toLowerCase().includes(q) ||
      e.correo.toLowerCase().includes(q) ||
      e.telefono.includes(q) ||
      (e.nombre_estado || "").toLowerCase().includes(q) ||
      (e.nombre_ciudad || "").toLowerCase().includes(q),
    );
  });

  const totalEmpleados = computed(() => empleadosFiltrados.value.length);
  const totalPaginas = computed(() => Math.ceil(empleadosFiltrados.value.length / limit.value));

  const empleadosPaginados = computed(() => {
    const start = (page.value - 1) * limit.value;
    return empleadosFiltrados.value.slice(start, start + limit.value);
  });

  const fetchEmpleados = async () => {
    loading.value = true;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await fetch("http://localhost:3000/empleados", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        router.push("/login");
        return;
      }
      const data = await response.json();
      const payload = obtenerPayload(data);
      todosLosEmpleados.value = Array.isArray(payload) ? payload.map(normalizarEmpleado) : [];
    } finally {
      loading.value = false;
    }
  };

  const agregarEmpleado = (empleado: Empleado) => {
    todosLosEmpleados.value = [...todosLosEmpleados.value, normalizarEmpleado(empleado)];
  };

  const actualizarEmpleado = (empleado: Empleado) => {
    todosLosEmpleados.value = todosLosEmpleados.value.map((e) =>
      e.empleado_id === empleado.empleado_id ? normalizarEmpleado(empleado) : e,
    );
  };

  const eliminarEmpleado = async (item: Empleado) => {
    const nombreCompleto = `${item.nombre} ${item.apellido_paterno}`;
    const confirmado = await confirmar(`¿Desea eliminar el empleado ${nombreCompleto} - ${item.correo}?`);
    if (!confirmado) return;

    const token = localStorage.getItem("token");

    const endpoints = [
      { url: `http://localhost:3000/empleados/${item.empleado_id}`, method: "DELETE" },
      { url: `http://localhost:3000/empleados/eliminar/${item.empleado_id}`, method: "DELETE" },
      { url: `http://localhost:3000/empleados/eliminar/${item.empleado_id}`, method: "PUT" },
    ];

    let eliminado = false;
    let error = "¡El empleado no se puede eliminar!";

    for (const endpoint of endpoints) {
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        eliminado = true;
        break;
      }

      error = data?.message || error;
    }

    if (!eliminado) {
      showToast(error, "error");
      return;
    }

    todosLosEmpleados.value = todosLosEmpleados.value.filter((e) => e.empleado_id !== item.empleado_id);
    showToast("¡Empleado eliminado con éxito!", "success");
  };

  return {
    empleadosPaginados,
    totalPaginas,
    totalEmpleados,
    page,
    limit,
    search,
    loading,
    fetchEmpleados,
    agregarEmpleado,
    actualizarEmpleado,
    eliminarEmpleado,
    dialogConfirmar,
    mensajeConfirmar,
    aceptar,
    cancelar,
  };
};