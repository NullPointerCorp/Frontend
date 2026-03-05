import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { Paquete } from "@/types/paquete.types";
import { useConfirmar } from "@/composables/useConfirmar";
import { useToast } from "@/composables/useToast";

const { showToast } = useToast();

const todosLosPaquetes = ref<Paquete[]>([]);
const search = ref("");
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

export const usePaquetes = () => {
  const router = useRouter();

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
        p.tamanio?.toLowerCase().includes(q) ||
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
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await fetch("http://localhost:3000/paquetes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        router.push("/login");
        return;
      }
      const data = await response.json();
      todosLosPaquetes.value = Array.isArray(data) ? data : [];
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

    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3000/paquetes/${item.folio}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      showToast(
        "¡El paquete no se puede eliminar, ya que cuenta con registros asociados!",
        "error",
      );
      return;
    }

    todosLosPaquetes.value = todosLosPaquetes.value.filter(
      (p) => p.folio !== item.folio,
    );
    showToast("¡Paquete eliminado con éxito!", "success");
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
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
    logout,
  };
};
