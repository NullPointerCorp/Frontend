import { ref, watch } from "vue";
import type { Paquete } from "@/types/paquete.types";
import { useZodValidation } from "@/composables/useZodValidation";
import { actualizarPaqueteSchema } from "@/schemas/paquete.schema";
import { useToast } from "@/composables/useToast";

const { showToast } = useToast();

const preciosPorTamano: Record<string, number> = {
  'Pequeño': 5,
  'Mediano': 10,
  'Grande': 15,
  'Extra Grande': 20,
}

export const useEditarPaquete = (onSuccess: (paquete: Paquete) => void) => {
  const { validate } = useZodValidation(actualizarPaqueteSchema);

  const dialog = ref(false);
  const loading = ref(false);
  const errorMessage = ref("");
  const paqueteSeleccionado = ref<Paquete | null>(null);

  const form = ref({
    tamano: '',
    forma: '',
    precio: undefined as number | undefined,
    peso: undefined as number | undefined,
  });

  watch(() => form.value.tamano, (nuevo) => {
    form.value.precio = preciosPorTamano[nuevo] ?? undefined
  })

  const abrirModal = (paquete: Paquete) => {
  paqueteSeleccionado.value = paquete;
  form.value = {
    tamano: paquete.tamano ?? '',
    forma: paquete.forma ?? '',
    precio: preciosPorTamano[paquete.tamano] ?? paquete.precio,
    peso: paquete.peso ? Number(paquete.peso) : undefined,
  };
  dialog.value = true;
};

const prepararDatos = () => ({
  tamano: form.value.tamano,
  forma: form.value.forma,
  precio: form.value.precio ?? null,
  peso: form.value.peso ? Number(form.value.peso) : null,
  cliente_id: paqueteSeleccionado.value?.cliente_id ?? null,
});

  const editarPaquete = async (formRef: any) => {
    const { valid } = await formRef?.validate();

    if (!valid) {
      showToast("Por favor corrige los errores del formulario", "warning");
      return;
    }

    if (!paqueteSeleccionado.value) return;

    loading.value = true;
    errorMessage.value = "";

    try {
      const token = localStorage.getItem("token");
      const datos = prepararDatos();

      const response = await fetch(
        `http://localhost:3000/paquetes/${paqueteSeleccionado.value.folio}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        errorMessage.value = data.message || "Error al actualizar paquete";
        return;
      }

      onSuccess(data);
      showToast("¡Paquete modificado con éxito!", "success");
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
    paqueteSeleccionado,
    abrirModal,
    editarPaquete,
    validate,
    preciosPorTamano,
  };
};