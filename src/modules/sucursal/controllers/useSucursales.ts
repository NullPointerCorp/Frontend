import { ref, computed } from "vue";
import type { Sucursal } from "@/modules/sucursal/interfaces/sucursal-interface";
import { useConfirmar } from "@/composables/useConfirmar";
import { useToast } from "@/composables/useToast";
import sucursalAPI from "../api/sucursalAPI";

const todasLasSucursales = ref<Sucursal[]>([]);
const search = ref("");
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

export const useSucursales = () => {
  const { showToast } = useToast(); 

  const {
    dialog: dialogConfirmar,
    mensaje: mensajeConfirmar,
    confirmar,
    aceptar,
    cancelar,
  } = useConfirmar();

  const sucursalesFiltradas = computed(() => {
    const q = search.value.toLowerCase();
    return todasLasSucursales.value.filter(
      (s) =>
        s.sucursal_id?.toString().includes(q) ||
        s.nombre_supervisor?.toLowerCase().includes(q) ||
        s.nombre_sucursal?.toLowerCase().includes(q) ||
        s.nombre_estado?.toLowerCase().includes(q) ||
        s.nombre_ciudad?.toLowerCase().includes(q) ||
        s.colonia?.toLowerCase().includes(q) ||
        s.codigo_postal?.includes(q) ||
        s.calle?.toLowerCase().includes(q) ||
        s.numero_exterior?.toLowerCase().includes(q) ||
        s.numero_interior?.toLowerCase().includes(q) ||
        s.longitud?.toString().includes(q) ||
        s.latitud?.toString().includes(q)
    );
  });

  const totalSucursales = computed(() => sucursalesFiltradas.value.length);
  const totalPaginas = computed(() =>
    Math.ceil(sucursalesFiltradas.value.length / limit.value),
  );
  const sucursalesPaginadas = computed(() => {
    const start = (page.value - 1) * limit.value;
    return sucursalesFiltradas.value.slice(start, start + limit.value);
  });

  const fetchSucursales = async () => {
    loading.value = true;
    try {
      const { data } = await sucursalAPI.get<Sucursal[]>('/') 
      todasLasSucursales.value = Array.isArray(data) ? data : [];
    } catch {
      // interceptor maneja el error
    } finally {
      loading.value = false;
    }
  };

  const agregarSucursal = (sucursal: Sucursal) => {
    todasLasSucursales.value = [...todasLasSucursales.value, sucursal];
  };

  const actualizarSucursal = (sucursal: Sucursal) => {
    todasLasSucursales.value = todasLasSucursales.value.map((s) =>
      s.sucursal_id === sucursal.sucursal_id ? sucursal : s,
    );
  };

  const eliminarSucursal = async (item: Sucursal) => {
    const confirmado = await confirmar(
      `¿Desea eliminar la sucursal ${item.nombre_sucursal} - ${item.nombre_ciudad}?`,
    );
    if (!confirmado) return;

    try {
      await sucursalAPI.delete(`/${item.sucursal_id}`) 
      todasLasSucursales.value = todasLasSucursales.value.filter(
        (s) => s.sucursal_id !== item.sucursal_id,
      );
      showToast("¡Sucursal eliminada con éxito!", "success");
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "¡La sucursal no se puede eliminar, ya que cuenta con registros asociados!",
        "error",
      );
    }
  };

  return {
    sucursalesPaginadas,
    totalPaginas,
    totalSucursales,
    page,
    limit,
    search,
    loading,
    fetchSucursales,
    agregarSucursal,
    actualizarSucursal,
    eliminarSucursal,
    dialogConfirmar,
    mensajeConfirmar,
    aceptar,
    cancelar,
  };
};
