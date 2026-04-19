import { ref, computed } from "vue";
import type { Rol } from "@/modules/rol/interfaces/rol-interface";
import { useConfirmar } from "@/composables/useConfirmar";
import { useToast } from "@/composables/useToast";
import rolAPI from "@/modules/rol/api/rolAPI";

const todosLosRoles = ref<Rol[]>([]);
const search = ref("");
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

export const useRol = () => {
  const { showToast } = useToast(); 

  const {
    dialog: dialogConfirmar,
    mensaje: mensajeConfirmar,
    confirmar,
    aceptar,
    cancelar,
  } = useConfirmar();
  
  const rolesFiltrados = computed(() => {
    const q = search.value.toLowerCase();
    return todosLosRoles.value.filter(
      (p) =>
        p.rol_id?.toString().includes(q) ||
        p.rol_nombre?.toLowerCase().includes(q) 
        //p.peso?.toString().includes(q),
    );
  });

  const totalRoles = computed(() => rolesFiltrados.value.length);

  const totalPaginas = computed(() =>
    Math.ceil(rolesFiltrados.value.length / limit.value),
  );
  
  const rolesPaginados = computed(() => {
    const start = (page.value - 1) * limit.value;
    return rolesFiltrados.value.slice(start, start + limit.value);
  });

  const fetchRoles = async () => {
    loading.value = true;
    try {
      const { data } = await rolAPI.get<Rol[]>('/') 
      todosLosRoles.value = Array.isArray(data) ? data : [];
    } catch {
      // interceptor maneja el error
    } finally {
      loading.value = false;
    }
  };

  const agregarRol = (rol: Rol) => {
    todosLosRoles.value = [...todosLosRoles.value, rol];
  };

  const actualizarRol = (rol: Rol) => {
    todosLosRoles.value = todosLosRoles.value.map((p) =>
      p.rol_id === rol.rol_id ? rol : p,
    );
  };

  const eliminarRol = async (item: Rol) => {
    const confirmado = await confirmar(
      `¿Desea eliminar el rol ID ${item.rol_id} - ${item.rol_nombre}?`,
    );
    if (!confirmado) return;

    try {
      await rolAPI.delete(`/${item.rol_id}`) 
      todosLosRoles.value = todosLosRoles.value.filter(
        (p) => p.rol_id !== item.rol_id,
      );
      showToast("Rol eliminado con éxito!", "success");
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "¡El Rol no se puede eliminar!",
        "error",
      );
    }
  };

  return {
    rolesPaginados,
    totalPaginas,
    totalRoles,
    page,
    limit,
    search,
    loading,
    fetchRoles,
    agregarRol,
    actualizarRol,
    eliminarRol,
    dialogConfirmar,
    mensajeConfirmar,
    aceptar,
    cancelar,
  };
};
