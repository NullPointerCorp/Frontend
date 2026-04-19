import { ref } from "vue";
import { useZodValidation } from "@/composables/useZodValidation";
import { actualizarRolSchema } from "@/modules/rol/schemas/RolSchema";
import { useToast } from "@/composables/useToast";
import type { Rol, EditarRolDTO } from "@/modules/rol/interfaces/rol-interface";
import rolAPI from "../api/rolAPI";

interface FormEditarRol {
  rol_nombre: string;
  descripcion: string;
}

export const useEditarRol = (onSuccess: (rol: Rol) => void) => {
  const { validate } = useZodValidation(actualizarRolSchema);
  const { showToast } = useToast();

  const dialog = ref(false);
  const loading = ref(false);
  const rolSeleccionado = ref<Rol | null>(null);

  const form = ref<FormEditarRol>({
    rol_nombre: "",
    descripcion: "",
  });

  const abrirModal = (rol: Rol) => {
    rolSeleccionado.value = rol;
    form.value = {
      rol_nombre: rol.rol_nombre ?? "",
      descripcion: rol.descripcion ?? "",
    };
    dialog.value = true;
  };

  const prepararDatos = (): EditarRolDTO => ({
    rol_nombre: form.value.rol_nombre.trim(),
    descripcion: form.value.descripcion.trim() || null,
  });

  const editarRol = async () => {
    if (!rolSeleccionado.value) return;

    loading.value = true;
    try {
      const { data } = await rolAPI.put<Rol>(
        `/${rolSeleccionado.value.rol_id}`,
        prepararDatos()
      );
      onSuccess(data);
      showToast("¡Rol modificado con éxito!", "success");
      dialog.value = false;
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Error al conectar con el servidor",
        "error"
      );
    } finally {
      loading.value = false;
    }
  };

  return {
    dialog,
    loading,
    form,
    rolSeleccionado,
    abrirModal,
    editarRol,
    validate,
  };
};
