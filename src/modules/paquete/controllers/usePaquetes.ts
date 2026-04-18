import { ref, computed } from "vue";
import type { Paquete } from "@/modules/paquete/interfaces/paquete-interface";
import { useConfirmar } from "@/composables/useConfirmar";
import { useToast } from "@/composables/useToast";
import paqueteAPI from "../api/paqueteAPI";

const todosLosPaquetes = ref<Paquete[]>([]);
const search = ref("");
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

export const usePaquetes = () => {
  const { showToast } = useToast(); 

  const {
    dialog: dialogConfirmar,
    mensaje: mensajeConfirmar,
    confirmar,
    aceptar,
    cancelar,
  } = useConfirmar();
  
  const paquetesFiltrados = computed(() => {
    const q = search.value.toLowerCase();
    return todosLosPaquetes.value.filter(
      (p) =>
        p.folio?.toString().includes(q) ||
        p.nombre_cliente?.toLowerCase().includes(q) ||
        p.tamano?.toLowerCase().includes(q) || 
        p.forma?.toLowerCase().includes(q) ||
        p.precio?.toString().includes(q) ||
        p.peso?.toString().includes(q),
    );
  });

  const totalPaquetes = computed(() => paquetesFiltrados.value.length);

  const totalPaginas = computed(() =>
    Math.ceil(paquetesFiltrados.value.length / limit.value),
  );

  const paquetesPaginados = computed(() => {
    const start = (page.value - 1) * limit.value;
    return paquetesFiltrados.value.slice(start, start + limit.value);
  });

  const fetchPaquetes = async () => {
    loading.value = true;
    try {
      const { data } = await paqueteAPI.get<Paquete[]>('/') 
      todosLosPaquetes.value = Array.isArray(data) ? data : [];
    } catch {
      // interceptor maneja el error
    } finally {
      loading.value = false;
    }
  };

  const agregarPaquete = (paquete: Paquete) => {
    todosLosPaquetes.value = [...todosLosPaquetes.value, paquete];
  };

  const actualizarPaquete = (paquete: Paquete) => {
    todosLosPaquetes.value = todosLosPaquetes.value.map((p) =>
      p.folio === paquete.folio ? paquete : p,
    );
  };

  const eliminarPaquete = async (item: Paquete) => {
    const confirmado = await confirmar(
      `¿Desea eliminar el paquete folio ${item.folio} - ${item.nombre_cliente}?`,
    );
    if (!confirmado) return;

    try {
      await paqueteAPI.delete(`/${item.folio}`) 
      todosLosPaquetes.value = todosLosPaquetes.value.filter(
        (p) => p.folio !== item.folio,
      );
      showToast("¡Paquete eliminado con éxito!", "success");
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "¡El paquete no se puede eliminar!",
        "error",
      );
    }
  };

  return {
    paquetesPaginados,
    totalPaginas,
    totalPaquetes,
    page,
    limit,
    search,
    loading,
    fetchPaquetes,
    agregarPaquete,
    actualizarPaquete,
    eliminarPaquete,
    dialogConfirmar,
    mensajeConfirmar,
    aceptar,
    cancelar,
  };
};
