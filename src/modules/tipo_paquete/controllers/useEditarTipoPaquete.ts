import { ref, watch } from "vue";
import type { TipoPaquete, ActualizarTipoPaqueteDTO } from "@/modules/tipo_paquete/interfaces/paquete-interface";
import { useZodValidation } from "@/composables/useZodValidation";
import { actualizarTipoPaqueteSchema } from "@/modules/tipo_paquete/schemas/TipoPaqueteSchema";
import { useToast } from "@/composables/useToast";
import tipopaqueteAPI from "../api/tipo_paqueteAPI";

const preciosPorTamano: Record<string, number> = {
  'Pequeño': 5,
  'Mediano': 10,
  'Grande': 15,
  'Extra Grande': 20,
}

interface FormEditarPaquete {
  tamano: string;
  forma: string;
  precio: number | undefined;
  peso: number | undefined;
}

export const useEditarTipoPaquete = (onSuccess: (paquete: TipoPaquete) => void) => {
  const { validate } = useZodValidation(actualizarTipoPaqueteSchema);
  const { showToast } = useToast(); 

  const dialog = ref(false);
  const loading = ref(false);
  const paqueteSeleccionado = ref<TipoPaquete | null>(null);

  const form = ref<FormEditarPaquete>({
    tamano: '',
    forma: '',
    precio: undefined,
    peso: undefined,
  });

  watch(() => form.value.tamano, (nuevo) => {
    form.value.precio = preciosPorTamano[nuevo] ?? undefined
  })

  const abrirModal = (paquete: TipoPaquete) => {
    paqueteSeleccionado.value = paquete;
    form.value = {
      tamano: paquete.tamano ?? '',
      forma: paquete.forma ?? '',
      precio: preciosPorTamano[paquete.tamano] ?? paquete.precio,
      peso: paquete.peso ? Number(paquete.peso) : undefined,
    };
    dialog.value = true;
  };

  const prepararDatos = (): ActualizarTipoPaqueteDTO => ({
    tamano: form.value.tamano,
    forma: form.value.forma,
    precio: form.value.precio ?? null,
    peso: form.value.peso ? Number(form.value.peso) : null,
    cliente_id: paqueteSeleccionado.value?.cliente_id ?? null,
  });

  const editarTipoPaquete = async () => { 
    if (!paqueteSeleccionado.value) return;

    loading.value = true;
    try {
      const { data } = await tipopaqueteAPI.put( 
        `/${paqueteSeleccionado.value.folio}`,
        prepararDatos()
      );
      onSuccess(data);
      showToast("¡Paquete modificado con éxito!", "success");
      dialog.value = false;
    } catch (error: any) {
      showToast(error.response?.data?.message || "Error al conectar con el servidor", "error");
    } finally {
      loading.value = false;
    }
  };

  return {
    dialog,
    loading,
    form,
    paqueteSeleccionado,
    abrirModal,
    editarTipoPaquete,
    validate,
    preciosPorTamano,
  };
};
