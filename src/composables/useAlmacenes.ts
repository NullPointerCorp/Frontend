import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { Almacen } from "@/types/almacen.types";
import { useConfirmar } from "@/composables/useConfirmar";
import { useToast } from "@/composables/useToast";
const { showToast } = useToast();

const todosLosAlmacenes = ref<Almacen[]>([]);
const search = ref("");
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

export const useAlmacenes = () => {
  const router = useRouter();

  const {
    dialog: dialogConfirmar,
    mensaje: mensajeConfirmar,
    confirmar,
    aceptar,
    cancelar,
  } = useConfirmar();

  const almacenesFiltrados = computed(() => {
    const q = search.value.toLowerCase();
    return todosLosAlmacenes.value.filter(
      (a) =>
        a.almacen_id?.toString().includes(q) ||
        a.nombre_almacen?.toLowerCase().includes(q) ||
        a.nombre_sucursal?.toLowerCase().includes(q) ||
        a.descripcion?.toLowerCase().includes(q),
    );
  });

  const totalAlmacenes = computed(() => almacenesFiltrados.value.length);

  const totalPaginas = computed(() =>
    Math.ceil(almacenesFiltrados.value.length / limit.value),
  );

  const almacenesPaginados = computed(() => {
    const start = (page.value - 1) * limit.value;
    return almacenesFiltrados.value.slice(start, start + limit.value);
  });

  const fetchAlmacenes = async () => {
    loading.value = true;
    try {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      const response = await fetch("http://localhost:3000/almacenes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) { router.push("/login"); return; }
      const data = await response.json();
      todosLosAlmacenes.value = Array.isArray(data) ? data : [];
    } finally {
      loading.value = false;
    }
  };

  const agregarAlmacen = (almacen: Almacen) => {
    todosLosAlmacenes.value = [...todosLosAlmacenes.value, almacen];
  };

  const actualizarAlmacen = (almacen: Almacen) => {
    todosLosAlmacenes.value = todosLosAlmacenes.value.map((a) =>
      a.almacen_id === almacen.almacen_id ? almacen : a,
    );
  };

  const eliminarAlmacen = async (item: Almacen) => {
    const confirmado = await confirmar(
      `¿Desea eliminar el almacén ${item.nombre_almacen} - ${item.nombre_sucursal}?`,
    );
    if (!confirmado) return;

    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3000/almacenes/${item.almacen_id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      showToast(
        "¡El almacén no se puede eliminar, ya que cuenta con registros asociados!",
        "error",
      );
      return;
    }

    todosLosAlmacenes.value = todosLosAlmacenes.value.filter(
      (a) => a.almacen_id !== item.almacen_id,
    );
    showToast("¡Almacén eliminado con éxito!", "success");
  };

  const navigateTo = (route: string) => router.push(route);
  const logout = () => { localStorage.removeItem("token"); router.push("/login"); };

  return {
    almacenesPaginados,
    totalPaginas,
    totalAlmacenes,
    page,
    limit,
    search,
    loading,
    fetchAlmacenes,
    agregarAlmacen,
    actualizarAlmacen,
    eliminarAlmacen,
    dialogConfirmar,
    aceptar,
    cancelar,
    mensajeConfirmar,
    navigateTo,
    logout,
  };
};