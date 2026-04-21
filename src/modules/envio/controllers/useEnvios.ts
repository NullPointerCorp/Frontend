import { ref, computed } from "vue";
import type { Cliente } from "@/modules/cliente/interfaces/cliente-interface";
import type { EnvioConsultaDTO } from "../interfaces/envio-interface"; 
import { useConfirmar } from "@/composables/useConfirmar";
import { useToast } from "@/composables/useToast";
import envioAPI from "../api/envioAPI";

const todosLosEnvios = ref<EnvioConsultaDTO[]>([]);
const search = ref("");
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

export const useEnvios = () => {
  const { showToast } = useToast();

  const {
    dialog: dialogConfirmar,
    mensaje: mensajeConfirmar,
    confirmar,
    aceptar,
    cancelar,
  } = useConfirmar();

  const enviosFiltrados = computed(() => {
    const q = search.value.toLowerCase();
    return todosLosEnvios.value.filter(
      (c) =>
        c.envio_id.toString().includes(q)
    );
  });
  
  const totalEnvios = computed(() => enviosFiltrados.value.length);

  const totalPaginas = computed(() =>
    Math.ceil(enviosFiltrados.value.length / limit.value),
  );

  const enviosPaginados = computed(() => {
    const start = (page.value - 1) * limit.value;
    return enviosFiltrados.value.slice(start, start + limit.value);
  });

  const fetchEnvios = async () => {
    loading.value = true;
    try {
      const { data } = await envioAPI.get<EnvioConsultaDTO[]>('/')
      todosLosEnvios.value = Array.isArray(data) ? data : [];
    } catch (err) {
      // interceptor maneja el error
    } 
    finally {
      loading.value = false;
    }
  };

  return {
    enviosPaginados,
    totalPaginas,
    totalEnvios,
    page,
    limit,
    search,
    loading,
    fetchEnvios,
    dialogConfirmar,
    aceptar,
    cancelar,
    mensajeConfirmar,
  };
};
