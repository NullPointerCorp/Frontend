import { ref } from "vue";
import type { Transporte, Transportista } from "@/types/transporte.types";
import { useToast } from "@/composables/useToast";

const { showToast } = useToast();

export const useEditarTransporte = (
  onSuccess: (transporte: Transporte) => void,
) => {
  const dialog = ref(false);
  const loading = ref(false);
  const errorMessage = ref("");
  const transporteSeleccionado = ref<Transporte | null>(null);
  const transportistas = ref<Transportista[]>([]);

  const form = ref({
    transporte_id: 0,
    transportista_id: null as number | null,
    capacidad_carga: null as number | null,
    unidad_medida: "",
    placas: "",
  });

  const fetchTransportistas = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/empleados/transportistas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      transportistas.value = [];
      return;
    }
    const data = await response.json();
    transportistas.value = Array.isArray(data) ? data : [];
  };

  const abrirModal = async (transporte: Transporte) => {
    transporteSeleccionado.value = transporte;
    form.value = {
      transporte_id: transporte.transporte_id,
      transportista_id: transporte.transportista_id ?? null,
      capacidad_carga: transporte.capacidad_carga,
      unidad_medida: transporte.unidad_medida,
      placas: transporte.placas ?? "",
    };
    await fetchTransportistas();
    dialog.value = true;
  };

  const editarTransporte = async () => {
    if (!transporteSeleccionado.value) return;
    loading.value = true;
    errorMessage.value = "";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/transportes/${transporteSeleccionado.value.transporte_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form.value),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        errorMessage.value = data.message || "Error al actualizar transporte";
        return;
      }

      onSuccess(data);
      showToast("¡Transporte modificado con éxito!", "success");
      dialog.value = false;
    } catch (error) {
      errorMessage.value = "Error al conectar con el servidor";
    } finally {
      loading.value = false;
    }
  };

  return {
    dialog,
    loading,
    errorMessage,
    form,
    transportistas,
    transporteSeleccionado,
    abrirModal,
    editarTransporte,
  };
};
