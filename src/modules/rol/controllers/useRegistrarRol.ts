import { reactive, ref, watch } from "vue";
import { rolSchema } from "@/modules/rol/schemas/RolSchema";
import { useToast } from "@/composables/useToast";
import type { Rol, CrearRol } from "@/modules/rol/interfaces/rol-interface";
import rolAPI from "../api/rolAPI";

interface FormRegistrarRol {
  rol_nombre: string;
  descripcion: string;
}

export const useRegistrarRol = (onSuccess: (rol: Rol) => void) => {
  const { showToast } = useToast();

  const dialog = ref(false);
  const loading = ref(false);
  const erroresForm = ref<Record<string, string>>({});

  const form = reactive<FormRegistrarRol>({
    rol_nombre: "",
    descripcion: "",
  });

  const resetForm = () => {
    form.rol_nombre = "";
    form.descripcion = "";
  };

  const resetErrores = () => {
    erroresForm.value = {};
  };

  watch(
    () => form.rol_nombre,
    () => delete erroresForm.value.rol_nombre
  );
  watch(
    () => form.descripcion,
    () => delete erroresForm.value.descripcion
  );

  const abrirModal = () => {
    resetForm();
    resetErrores();
    dialog.value = true;
  };

  const cerrarModal = () => {
    dialog.value = false;
    setTimeout(() => {
      resetForm();
      resetErrores();
    }, 300);
  };

  const validarFormulario = (): CrearRol | null => {
    const resultado = rolSchema.safeParse(form);

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
      const respuesta = (error as { response?: { data?: { message?: string } } })
        .response;
      return respuesta?.data?.message ?? "Error al registrar rol";
    }
    return "Error al registrar rol";
  };

  const registrarRol = async (): Promise<void> => {
    const datos = validarFormulario();
    if (!datos) {
      showToast("Por favor corrige los errores del formulario", "warning");
      return;
    }

    loading.value = true;
    try {
      const { data } = await rolAPI.post<Rol>("/nuevo", datos);
      onSuccess(data);
      showToast("¡Rol registrado con éxito!", "success");
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
    abrirModal,
    cerrarModal,
    registrarRol,
  };
};
