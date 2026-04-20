import { ref, watch } from "vue";
import { actualizarRolSchema } from "@/modules/rol/schemas/RolSchema";
import { useToast } from "@/composables/useToast";
import type { Rol, EditarRolDTO } from "@/modules/rol/interfaces/rol-interface";
import rolAPI from "../api/rolAPI";

interface FormEditarRol {
  rol_nombre: string;
  descripcion: string;
}

export const useEditarRol = (onSuccess: (rol: Rol) => void) => {
  const { showToast } = useToast();

  const dialog = ref(false);
  const loading = ref(false);
  const rolSeleccionado = ref<Rol | null>(null);
  const erroresForm = ref<Record<string, string>>({});

  const form = ref<FormEditarRol>({
    rol_nombre: "",
    descripcion: "",
  });

  const resetErrores = () => {
    erroresForm.value = {};
  };

  // Limpia errores al cerrar el modal
  watch(dialog, (abierto) => {
    if (!abierto) resetErrores();
  });

  // Limpia el error del campo cuando el usuario lo edita
  watch(
    () => form.value.rol_nombre,
    () => delete erroresForm.value.rol_nombre,
  );
  watch(
    () => form.value.descripcion,
    () => delete erroresForm.value.descripcion,
  );

  const abrirModal = (rol: Rol) => {
    rolSeleccionado.value = rol;
    form.value = {
      rol_nombre: rol.rol_nombre ?? "",
      descripcion: rol.descripcion ?? "",
    };
    resetErrores();
    dialog.value = true;
  };

  const cerrarModal = () => {
    dialog.value = false;
  };

  const validarFormulario = (): EditarRolDTO | null => {
    const resultado = actualizarRolSchema.safeParse(form.value);

    if (!resultado.success) {
      const campos = resultado.error.flatten().fieldErrors;
      const errores: Record<string, string> = {};
      for (const [key, mensajes] of Object.entries(campos)) {
        errores[key] = mensajes?.[0] ?? "";
      }
      erroresForm.value = errores;
      return null;
    }

    return {
      rol_nombre: resultado.data.rol_nombre,
      descripcion: resultado.data.descripcion || null,
    };
  };

  const getMensajeError = (error: unknown): string => {
    if (typeof error === "object" && error !== null && "response" in error) {
      const respuesta = (
        error as { response?: { data?: { message?: string } } }
      ).response;
      return respuesta?.data?.message ?? "Error al conectar con el servidor";
    }
    return "Error al conectar con el servidor";
  };

  const editarRol = async (): Promise<void> => {
    if (!rolSeleccionado.value) return;

    const datos = validarFormulario();
    if (!datos) {
      showToast("Por favor corrige los errores del formulario", "warning");
      return;
    }

    loading.value = true;
    try {
      const { data } = await rolAPI.put<Rol>(
        `/${rolSeleccionado.value.rol_id}`,
        datos,
      );
      onSuccess(data);
      showToast("¡Rol modificado con éxito!", "success");
      cerrarModal();
    } catch (error: unknown) {
      showToast(getMensajeError(error), "error");
    } finally {
      loading.value = false;
    }
  };

  return {
    dialog,
    loading,
    form,
    erroresForm,
    rolSeleccionado,
    abrirModal,
    cerrarModal,
    editarRol,
  };
};
