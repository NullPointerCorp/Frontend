import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { Cliente } from "../../types/cliente.types";
import { useConfirmar } from "../../composables/useConfirmar";

import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

export const useClientes = () => {
  const router = useRouter();

  // Menu items para sidebar
  const menuItems = ref([
    { icon: "mdi-view-dashboard", title: "Dashboard", route: "/dashboard" },
    {
      icon: "mdi-account-group",
      title: "Clientes",
      route: "/clientes",
      active: true,
    },
    { icon: "mdi-badge-account", title: "Empleados", route: "/empleados" },
    { icon: "mdi-store", title: "Sucursales", route: "/sucursales" },
    { icon: "mdi-warehouse", title: "Almacenes", route: "/almacenes" },
    { icon: "mdi-truck", title: "Transporte", route: "/transporte" },
    {
      icon: "mdi-package-variant-closed",
      title: "Paquetes",
      route: "/paquetes",
    },
  ]);

  // Usuario
  const user = ref({
    name: "Admin User",
    role: "Logistics Manager",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  });

  // Estado de clientes
  const todosLosClientes = ref<Cliente[]>([]);
  const search = ref("");
  const page = ref(1);
  const limit = ref(10);
  const loading = ref(false);

  // Computed
  const clientesFiltrados = computed(() => {
    const q = search.value.toLowerCase();
    return todosLosClientes.value.filter(
      (c) =>
        c.id.toString().includes(q) ||
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

  // Acciones de clientes
  const agregarCliente = (cliente: Cliente) => {
    if (!cliente) {
      console.error("Cliente es null o undefined");
      return;
    }

    console.log("Agregando cliente a la lista:", cliente);

    // Agregar al inicio de la lista
    todosLosClientes.value = [cliente, ...todosLosClientes.value];
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

  // Confirmar eliminación
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

  // Navegación
  const navigateTo = (route: string) => {
    router.push(route);
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return {
    // UI
    menuItems,
    user,
    // Clientes
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
    // Navegación
    navigateTo,
    logout,
  };
};
