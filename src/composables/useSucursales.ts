import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { Sucursal } from "@/types/sucursal.types";
import { useConfirmar } from "@/composables/useConfirmar";
import { useToast } from "@/composables/useToast";

const { showToast } = useToast()

// Estado compartido
const todasLasSucursales = ref<Sucursal[]>([]);
const search = ref("");
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

export const useSucursales = () => {
  const router = useRouter();
  const { dialog: dialogConfirmar, confirmar, aceptar, cancelar } = useConfirmar();

  // Computed
  const sucursalesFiltradas = computed(() => {
    const q = search.value.toLowerCase();
    return todasLasSucursales.value.filter((s) =>
      s.sucursal_id?.toString().includes(q) ||
      s.nombre_sucursal?.toLowerCase().includes(q) ||
      s.nombre_ciudad?.toLowerCase().includes(q) ||
      s.colonia?.toLowerCase().includes(q) ||
      s.calle?.toLowerCase().includes(q)
    );
  });

  const totalSucursales = computed(() => sucursalesFiltradas.value.length);

  const totalPaginas = computed(() =>
    Math.ceil(sucursalesFiltradas.value.length / limit.value)
  );

  const sucursalesPaginadas = computed(() => {
    const start = (page.value - 1) * limit.value;
    return sucursalesFiltradas.value.slice(start, start + limit.value);
  });

  // Acciones
  const fetchSucursales = async () => {
    loading.value = true;
    try {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      const response = await fetch("http://localhost:3000/sucursales", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) { router.push("/login"); return; }
      const data = await response.json();
      todasLasSucursales.value = Array.isArray(data) ? data : [];
    } finally {
      loading.value = false;
    }
  };

  const agregarSucursal = (sucursal: Sucursal) => {
    todasLasSucursales.value = [...todasLasSucursales.value, sucursal];
  };

  const actualizarSucursal = (sucursal: Sucursal) => {
    todasLasSucursales.value = todasLasSucursales.value.map((s) =>
      s.sucursal_id === sucursal.sucursal_id ? sucursal : s
    );
  };
  
  const eliminarSucursal = async (sucursal_id: number) => {
    const confirmado = await confirmar();
    if (!confirmado) return;
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3000/sucursales/${sucursal_id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.message, "error");
      return;
    }

    todasLasSucursales.value = todasLasSucursales.value.filter((s) => s.sucursal_id !== sucursal_id);
    showToast("Sucursal eliminada correctamente", "success");
  };

  return {
    sucursalesPaginadas,
    totalPaginas,
    totalSucursales,
    page,
    limit,
    search,
    loading,
    fetchSucursales,
    agregarSucursal,
    actualizarSucursal,
    eliminarSucursal,
    dialogConfirmar,
    aceptar,
    cancelar,
  };
};