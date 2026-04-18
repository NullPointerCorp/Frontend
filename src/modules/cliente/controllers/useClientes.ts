import { ref, computed } from "vue";
import type { Cliente } from "@/modules/cliente/interfaces/cliente-interface";
import { useConfirmar } from "@/composables/useConfirmar";
import { useToast } from "@/composables/useToast";
import clienteAPI from "../api/clienteAPI";

const todosLosClientes = ref<Cliente[]>([]);
const search = ref("");
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

export const useClientes = () => {
  const { showToast } = useToast();

  const {
    dialog: dialogConfirmar,
    mensaje: mensajeConfirmar,
    confirmar,
    aceptar,
    cancelar,
  } = useConfirmar();

  const clientesFiltrados = computed(() => {
    const q = search.value.toLowerCase();
    return todosLosClientes.value.filter(
      (c) =>
        c.cliente_id.toString().includes(q) ||
        c.nombre.toLowerCase().includes(q) ||
        c.apellido_paterno.toLowerCase().includes(q) ||
        (c.apellido_materno?.toLowerCase() ?? "").includes(q) ||
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

  const fetchClientes = async () => {
    loading.value = true;
    try {
      const { data } = await clienteAPI.get<Cliente[]>('/')
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

    try {
      await clienteAPI.delete(`/${item.cliente_id}`)
      todosLosClientes.value = todosLosClientes.value.filter(
        (c) => c.cliente_id !== item.cliente_id,
      );
      showToast("¡Cliente eliminado con éxito!", "success");
    } catch {
      showToast(
        "¡El cliente no se puede eliminar, ya que cuenta con registros asociados!",
        "error",
      );
    }
  };

  return {
    clientesPaginados,
    totalPaginas,
    totalClientes,
    page,
    limit,
    search,
    loading,
    fetchClientes,
    agregarCliente,
    actualizarCliente,
    eliminarCliente,
    dialogConfirmar,
    aceptar,
    cancelar,
    mensajeConfirmar,
  };
};
