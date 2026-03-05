import { ref } from "vue";
import type { Almacen } from "@/types/almacen.types";
import { useZodValidation } from "@/composables/useZodValidation";
import { actualizarAlmacenSchema } from "@/schemas/almacen.schema";
import { useToast } from "@/composables/useToast";

const { showToast } = useToast();

export const useEditarAlmacen = (onSuccess: (almacen: Almacen) => void) => {
  const { validate } = useZodValidation(actualizarAlmacenSchema);

  const dialog = ref(false);
  const loading = ref(false);
  const errorMessage = ref("");
  const almacenSeleccionado = ref<Almacen | null>(null);

  const form = ref({
    nombre_almacen: "",
    descripcion: "",
  });

  const abrirModal = (almacen: Almacen) => {
    almacenSeleccionado.value = almacen;
    form.value = {
      nombre_almacen: almacen.nombre_almacen ?? "",
      descripcion: almacen.descripcion ?? "",
    };
    dialog.value = true;
  };

  const prepararDatos = () => ({
    nombre_almacen: form.value.nombre_almacen.trim(),
    descripcion: form.value.descripcion?.trim() || null,
  });

  const editarAlmacen = async (formRef: any) => {
    const { valid } = await formRef?.validate();

    if (!valid) {
      showToast("Por favor corrige los errores del formulario", "warning");
      return;
    }

    if (!almacenSeleccionado.value) return;

    loading.value = true;
    errorMessage.value = "";

    try {
      const token = localStorage.getItem("token");
      const datos = prepararDatos();

      const response = await fetch(
        `http://localhost:3000/almacenes/${almacenSeleccionado.value.almacen_id}`,
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
        errorMessage.value = data.message || "Error al actualizar almacén";
        return;
      }

      onSuccess(data);
      showToast("¡Almacén modificado con éxito!", "success");
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
    almacenSeleccionado,
    abrirModal,
    editarAlmacen,
    validate,
  };
};