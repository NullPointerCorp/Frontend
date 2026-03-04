import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { Cliente } from "@/types/cliente.types";
import { useConfirmar } from "@/composables/useConfirmar";
import { useToast } from "@/composables/useToast";
const { showToast } = useToast();

const todosLosClientes = ref<Cliente[]>([]);
const search = ref("");
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

export const useClientes = () => {
  const router = useRouter();

  const {
    dialog: dialogConfirmar,
    mensaje: mensajeConfirmar,
    confirmar,
    aceptar,
    cancelar,
  } = useConfirmar();

  // Computed
  const clientesFiltrados = computed(() => {
    const q = search.value.toLowerCase();
    return todosLosClientes.value.filter(
      (c) =>
        c.cliente_id.toString().includes(q) ||
        c.nombre.toLowerCase().includes(q) ||
        c.apellido_paterno.toLowerCase().includes(q) ||
        c.apellido_materno.toLowerCase().includes(q) ||
        c.correo.toLowerCase().includes(q) ||
        c.telefono.includes(q),
    );
  });

  const totalClientes = computed(() => clientesFiltrados.value.length);

  const totalPaginas = computed(() =>
    Math.ceil(clientesFiltrados.value.length / limit.value),
  );

  const clientesPaginados = computed(() => {
    const start = (page.value - 1) * limit.value;
    return clientesFiltrados.value.slice(start, start + limit.value);
  });

  // Acciones
  const fetchClientes = async () => {
    loading.value = true;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await fetch("http://localhost:3000/clientes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        router.push("/login");
        return;
      }
      const data = await response.json();
      todosLosClientes.value = Array.isArray(data) ? data : [];
    } finally {
      loading.value = false;
    }
  };

  const agregarCliente = (cliente: Cliente) => {
    todosLosClientes.value = [...todosLosClientes.value, cliente];
  };

  const actualizarCliente = (cliente: Cliente) => {
    todosLosClientes.value = todosLosClientes.value.map((c) =>
      c.cliente_id === cliente.cliente_id ? cliente : c,
    );
  };

  const eliminarCliente = async (item: Cliente) => {
    const nombreCompleto = `${item.nombre} ${item.apellido_paterno}`;
    const confirmado = await confirmar(
      `¿Desea eliminar el cliente ${nombreCompleto} - ${item.correo}?`,
    );
    if (!confirmado) return;

    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3000/clientes/${item.cliente_id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      showToast(
        "¡El cliente no se puede eliminar, ya que cuenta con registros asociados!",
        "error",
      );
      return;
    }

    todosLosClientes.value = todosLosClientes.value.filter(
      (c) => c.cliente_id !== item.cliente_id,
    );
    showToast("¡Cliente eliminado con éxito!", "success");
  };

  // Navegación
  const navigateTo = (route: string) => {
    router.push(route);
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return {
    // Estado
    clientesPaginados,
    totalPaginas,
    totalClientes,
    page,
    limit,
    search,
    loading,
    // Acciones
    fetchClientes,
    agregarCliente,
    actualizarCliente,
    eliminarCliente,
    // Confirmar
    dialogConfirmar,
    aceptar,
    cancelar,
    mensajeConfirmar,
    // Navegación
    navigateTo,
    logout,
  };
};
