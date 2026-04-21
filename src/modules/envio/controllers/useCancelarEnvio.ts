import { ref, computed } from "vue";
import type { EnvioConsultaDTO } from "../interfaces/envio-interface";
import { useConfirmar } from "@/composables/useConfirmar";
import { useToast } from "@/composables/useToast";
import envioAPI from "../api/envioAPI";

const todosLosEnvios = ref<EnvioConsultaDTO[]>([]);
const search = ref("");
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

export const useCancelarEnvio = () => {
  const { showToast } = useToast();

  const {
    dialog: dialogConfirmar,
    mensaje: mensajeConfirmar,
    confirmar,
    aceptar,
    cancelar,
  } = useConfirmar();

  const dialogMotivo = ref(false);
  const motivo = ref("");
  const envioPendiente = ref<EnvioConsultaDTO | null>(null);

  const enviosFiltrados = computed(() => {
    const q = search.value.toLowerCase();
    return todosLosEnvios.value
      .filter((e) => e.estado_envio !== "cancelado")
      .filter(
        (e) =>
          e.correo.toLowerCase().includes(q) ||
          e.envio_id.toString().includes(q),
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
      const { data } = await envioAPI.get<EnvioConsultaDTO[]>("/");
      todosLosEnvios.value = Array.isArray(data) ? data : [];
    } finally {
      loading.value = false;
    }
  };

  const solicitarCancelacion = async (item: EnvioConsultaDTO) => {
    const confirmado = await confirmar(
      `¿Desea cancelar el envío ${item.envio_id} - ${item.correo}?`,
    );
    if (!confirmado) return;

    envioPendiente.value = item;
    motivo.value = "";
    dialogMotivo.value = true;
  };

  const confirmarCancelacion = async () => {
    if (!envioPendiente.value) return;
    dialogMotivo.value = false;

    try {
      await envioAPI.put(`/${envioPendiente.value.envio_id}/cancelar`, {
        motivo: motivo.value,
      });
      todosLosEnvios.value = todosLosEnvios.value.map((e) =>
        e.envio_id === envioPendiente.value!.envio_id
          ? { ...e, estado_envio: "cancelado" }
          : e,
      );
      showToast("¡El envío ha sido cancelado con éxito!", "success");
    } catch {
      showToast("Error al cancelar el envío", "error");
    } finally {
      envioPendiente.value = null;
    }
  };

  const cancelarMotivo = () => {
    dialogMotivo.value = false;
    envioPendiente.value = null;
    motivo.value = "";
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
    mensajeConfirmar,
    aceptar,
    cancelar,
    dialogMotivo,
    motivo,
    solicitarCancelacion,
    confirmarCancelacion,
    cancelarMotivo,
  };
};
