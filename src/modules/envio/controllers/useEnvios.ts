import { ref, computed } from "vue";
import type { EnvioConsultaDTO } from "../interfaces/envio-interface";
import { useConfirmar } from "@/composables/useConfirmar";
import { useToast } from "@/composables/useToast";
import envioAPI from "../api/envioAPI";
import { useAuthStore } from "@/modules/auth/store/auth.store";

const todosLosEnvios = ref<EnvioConsultaDTO[]>([]);
const search = ref("");
const page = ref(1);
const limit = ref(10);
const loading = ref(false);
const filtroEstado = ref("");

const normalizarEstadoEnvio = (estado: string) => {
  return estado.trim().toLowerCase().replace(/\s+/g, "_");
};

export const useEnvios = () => {
  const { showToast } = useToast();
  const authStore = useAuthStore();

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
    const q = search.value.toLowerCase().trim();
    return todosLosEnvios.value.filter((e) => {
      if (q && !(
        e.envio_id.toString().includes(q) ||
        e.correo.toLowerCase().includes(q) ||
        e.descripcion.toLowerCase().includes(q) ||
        e.estado_envio.toLowerCase().includes(q) ||
        e.destino.toLowerCase().includes(q) ||
        e.origen.toLowerCase().includes(q)
      )) return false;

      if (filtroEstado.value && normalizarEstadoEnvio(e.estado_envio) !== filtroEstado.value) return false;

      return true;
    });
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
    const empleado_id = authStore.session?.id;
    const empleado_rol = authStore.session?.rol?.toLowerCase();

    if (!empleado_id) {
      todosLosEnvios.value = [];
      return;
    }

    loading.value = true;

    try {
      const endpoint =
        empleado_rol?.toLowerCase() === "jefe" ? "/" : `/empleado/${empleado_id}`;

      const { data } = await envioAPI.get<EnvioConsultaDTO[]>(endpoint);

      todosLosEnvios.value = Array.isArray(data) ? data : [];
    } catch (err) {
      todosLosEnvios.value = [];
    } finally {
      loading.value = false;
    }
  };

  const solicitarCancelacion = async (item: EnvioConsultaDTO) => {
    if (!["registrado", "en_espera"].includes(normalizarEstadoEnvio(item.estado_envio))) {
      showToast("Solo se pueden cancelar envios registrados o en espera", "warning");
      return;
    }

    const confirmado = await confirmar(
      `Desea cancelar el envio ${item.envio_id} - ${item.correo}?`,
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
      showToast("El envio ha sido cancelado con exito", "success");
    } catch {
      showToast("Error al cancelar el envio", "error");
    } finally {
      envioPendiente.value = null;
      motivo.value = "";
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
    filtroEstado,
    fetchEnvios,
    dialogConfirmar,
    aceptar,
    cancelar,
    mensajeConfirmar,
    dialogMotivo,
    motivo,
    solicitarCancelacion,
    confirmarCancelacion,
    cancelarMotivo,
  };
};
