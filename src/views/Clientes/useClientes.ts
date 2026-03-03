import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { Cliente } from "../../types/cliente.types";
import { useConfirmar } from "../../composables/useConfirmar";

export const useClientes = () => {
  const router = useRouter();
  const todosLosClientes = ref<Cliente[]>([]);
  const search = ref("");
  const page = ref(1);
  const limit = 10;
  const loading = ref(false);

  const clientesFiltrados = computed(() => {
    const q = search.value.toLowerCase();
    return todosLosClientes.value.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.apellido_paterno.toLowerCase().includes(q) ||
        c.correo.toLowerCase().includes(q),
    );
  });

  const totalPaginas = computed(() =>
    Math.ceil(clientesFiltrados.value.length / limit),
  );

  const clientesPaginados = computed(() => {
    const start = (page.value - 1) * limit;
    return clientesFiltrados.value.slice(start, start + limit);
  });

  const agregarCliente = (cliente: Cliente) => {
    todosLosClientes.value.push(cliente);
  };

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

  const actualizarCliente = (cliente: Cliente) => {
    const index = todosLosClientes.value.findIndex((c) => c.id === cliente.id);
    if (index !== -1) todosLosClientes.value[index] = cliente;
  };

  const {
    dialog: dialogConfirmar,
    confirmar,
    aceptar,
    cancelar,
  } = useConfirmar();

  const eliminarCliente = async (id: number) => {
    const confirmado = await confirmar();
    if (!confirmado) return;

    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/clientes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    todosLosClientes.value = todosLosClientes.value.filter((c) => c.id !== id);
  };

  return {
    clientesPaginados,
    totalPaginas,
    page,
    search,
    loading,
    fetchClientes,
    agregarCliente,
    actualizarCliente,
    eliminarCliente,
    dialogConfirmar,
    aceptar,
    cancelar,
  };
};