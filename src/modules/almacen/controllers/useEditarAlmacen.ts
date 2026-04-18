import { ref } from "vue";
import type { ActualizarAlmacenDTO, Almacen } from "@/modules/almacen/interfaces/almacen-interface";
import { useZodValidation } from "@/composables/useZodValidation";
import { actualizarAlmacenSchema } from "@/modules/almacen/schemas/almacen.schema";
import { useToast } from "@/composables/useToast";
import almacenAPI from "../api/almacenAPI";

export const useEditarAlmacen = (onSuccess: (almacen: Almacen) => void) => {
  const { validate } = useZodValidation(actualizarAlmacenSchema);
  const { showToast } = useToast();

  const dialog = ref(false);
  const loading = ref(false);
  const almacenSeleccionado = ref<Almacen | null>(null);

  const form = ref<ActualizarAlmacenDTO>({
    nombre_almacen: "",
    descripcion: undefined,
  })

  const abrirModal = (almacen: Almacen) => {
    almacenSeleccionado.value = almacen;
    form.value = {
      nombre_almacen: almacen.nombre_almacen ?? "",
      descripcion: almacen.descripcion ?? "",
    };
    dialog.value = true;
  };

  const prepararDatos = (): ActualizarAlmacenDTO => ({
    nombre_almacen: form.value.nombre_almacen.trim(),
    descripcion: form.value.descripcion?.trim() || undefined,
  })

  const editarAlmacen = async () => {  
    if (!almacenSeleccionado.value) return;

    loading.value = true;
    try {
      const datos = prepararDatos();
      const { data } = await almacenAPI.put( 
        `/${almacenSeleccionado.value.almacen_id}`,
        datos
      );
      onSuccess(data);
      showToast("¡Almacén modificado con éxito!", "success");
      dialog.value = false;
    } catch (error: any) {
      showToast(error.message || "Error al conectar con el servidor", "error");
    } finally {
      loading.value = false;
    }
  };

  return {
    dialog,
    loading,
    form,
    almacenSeleccionado,
    abrirModal,
    editarAlmacen,
    validate,
  };
};
