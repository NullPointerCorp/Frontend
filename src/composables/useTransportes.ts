import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { Transporte } from "@/types/transporte.types";
import { useConfirmar } from "@/composables/useConfirmar";
import { useToast } from "@/composables/useToast";

const { showToast } = useToast();

const todosLosTransportes = ref<Transporte[]>([]);
const search = ref("");
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

export const useTransportes = () => {
  const router = useRouter();

  const {
    dialog: dialogConfirmar,
    mensaje: mensajeConfirmar,
    confirmar,
    aceptar,
    cancelar,
  } = useConfirmar();

  const transportesFiltrados = computed(() => {
    const q = search.value.toLowerCase();
    return todosLosTransportes.value.filter(
      (t) =>
        t.numero_serie?.toLowerCase().includes(q) ||
        t.nombre_transportista?.toLowerCase().includes(q) ||
        t.tipo_transporte?.toLowerCase().includes(q) ||
        t.subtipo_transporte?.toLowerCase().includes(q) ||
        t.capacidad_carga?.toString().includes(q) ||
        t.unidad_medida?.toLowerCase().includes(q) ||
        t.placas?.toLowerCase().includes(q),
    );
  });

  const totalTransportes = computed(() => transportesFiltrados.value.length);

  const totalPaginas = computed(() =>
    Math.ceil(transportesFiltrados.value.length / limit.value),
  );

  const transportesPaginados = computed(() => {
    const start = (page.value - 1) * limit.value;
    return transportesFiltrados.value.slice(start, start + limit.value);
  });

  const fetchTransportes = async () => {
    loading.value = true;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await fetch("http://localhost:3000/transportes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401 || response.status === 403) {
        router.push("/login");
        return;
      }
      const data = await response.json();
      if (!response.ok) {
        showToast(data.message || "No se pudieron cargar los transportes", "error");
        todosLosTransportes.value = [];
        return;
      }
      todosLosTransportes.value = Array.isArray(data) ? data : [];
    } finally {
      loading.value = false;
    }
  };

  const agregarTransporte = (transporte: Transporte) => {
    todosLosTransportes.value = [...todosLosTransportes.value, transporte];
  };

  const actualizarTransporte = (transporte: Transporte) => {
    todosLosTransportes.value = todosLosTransportes.value.map((t) =>
      t.transporte_id === transporte.transporte_id ? transporte : t,
    );
  };

  const eliminarTransporte = async (item: Transporte) => {
    const confirmado = await confirmar(
      `¿Desea eliminar el transporte ${item.numero_serie} - ${item.nombre_transportista}?`,
    );
    if (!confirmado) return;

    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3000/transportes/${item.transporte_id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      showToast(
        "¡El transporte no se puede eliminar, ya que cuenta con registros asociados!",
        "error",
      );
      return;
    }

    todosLosTransportes.value = todosLosTransportes.value.filter(
      (t) => t.transporte_id !== item.transporte_id,
    );
    showToast("¡Transporte eliminado con éxito!", "success");
  };

  return {
    transportesPaginados,
    totalPaginas,
    totalTransportes,
    page,
    limit,
    search,
    loading,
    fetchTransportes,
    agregarTransporte,
    actualizarTransporte,
    eliminarTransporte,
    dialogConfirmar,
    mensajeConfirmar,
    aceptar,
    cancelar,
  };
};
