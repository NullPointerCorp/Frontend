import { ref, watch } from "vue";
import type { Paquete } from "@/types/paquete.types";
import { useToast } from "@/composables/useToast";

const { showToast } = useToast();

const preciosPorTamano: Record<string, number> = {
  'Pequeño': 5,
  'Mediano': 10,
  'Grande': 15,
  'Extra Grande': 20,
}

export const useEditarPaquete = (onSuccess: (paquete: Paquete) => void) => {
  const dialog = ref(false);
  const loading = ref(false);
  const errorMessage = ref("");
  const paqueteSeleccionado = ref<Paquete | null>(null);

  const form = ref({
    folio: 0,
    cliente_id: null as number | null,
    tamano: '',
    forma: '',
    precio: undefined as number | undefined,
    peso: undefined as number | undefined,
  });

  // Recalcula el precio automáticamente cuando cambia el tamaño
  watch(() => form.value.tamano, (nuevo) => {
    form.value.precio = preciosPorTamano[nuevo] ?? undefined
  })

  const abrirModal = (paquete: Paquete) => {
    paqueteSeleccionado.value = paquete;
    form.value = {
      folio: paquete.folio,
      cliente_id: paquete.cliente_id,
      tamano: paquete.tamano,
      forma: paquete.forma,
      precio: preciosPorTamano[paquete.tamano] ?? paquete.precio,
      peso: paquete.peso,
    };
    dialog.value = true;
  };

  const editarPaquete = async () => {
    if (!paqueteSeleccionado.value) return;
    loading.value = true;
    errorMessage.value = "";
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/paquetes/${paqueteSeleccionado.value.folio}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form.value),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        errorMessage.value = data.message || "Error al actualizar paquete";
        return;
      }
      onSuccess(data);
      showToast(`¡Paquete modificado con éxito!`, "success");
      dialog.value = false;
    } catch (error) {
      errorMessage.value = "Error al conectar con el servidor";
    } finally {
      loading.value = false;
    }
  };

  return { dialog, loading, errorMessage, form, paqueteSeleccionado, abrirModal, editarPaquete };
};