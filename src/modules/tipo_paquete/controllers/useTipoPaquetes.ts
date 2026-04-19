import { ref, computed } from "vue";
import type { TipoPaquete } from "@/modules/tipo_paquete/interfaces/paquete-interface";
import { useConfirmar } from "@/composables/useConfirmar";
import { useToast } from "@/composables/useToast";
import tipoPaqueteAPI from "@/modules/tipo_paquete/api/tipo_paqueteAPI";

const todosLosPaquetes = ref<TipoPaquete[]>([]);
const search = ref("");
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

export const useTipoPaquete = () => {
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

  const totalTiposPaquetes = computed(() => paquetesFiltrados.value.length);

  const totalPaginas = computed(() =>
    Math.ceil(paquetesFiltrados.value.length / limit.value),
  );

  const tiposPaquetesPaginados = computed(() => {
    const start = (page.value - 1) * limit.value;
    return paquetesFiltrados.value.slice(start, start + limit.value);
  });

  const fetchTiposPaquetes = async () => {
    loading.value = true;
    try {
      const { data } = await tipoPaqueteAPI.get<TipoPaquete[]>('/') 
      todosLosPaquetes.value = Array.isArray(data) ? data : [];
    } catch {
      // interceptor maneja el error
    } finally {
      loading.value = false;
    }
  };

  const agregarTipoPaquete = (paquete: TipoPaquete) => {
    todosLosPaquetes.value = [...todosLosPaquetes.value, paquete];
  };

  const actualizarTipoPaquete = (paquete: TipoPaquete) => {
    todosLosPaquetes.value = todosLosPaquetes.value.map((p) =>
      p.folio === paquete.folio ? paquete : p,
    );
  };

  const eliminarTipoPaquete = async (item: TipoPaquete) => {
    const confirmado = await confirmar(
      `¿Desea eliminar el paquete folio ${item.folio} - ${item.nombre_cliente}?`,
    );
    if (!confirmado) return;

    try {
      await tipoPaqueteAPI.delete(`/${item.folio}`) 
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
    tiposPaquetesPaginados,
    totalPaginas,
    totalTiposPaquetes,
    page,
    limit,
    search,
    loading,
    fetchTiposPaquetes,
    agregarTipoPaquete,
    actualizarTipoPaquete,
    eliminarTipoPaquete,
    dialogConfirmar,
    mensajeConfirmar,
    aceptar,
    cancelar,
  };
};
