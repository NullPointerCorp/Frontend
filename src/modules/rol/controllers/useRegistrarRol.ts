import { reactive } from "vue";
import { useZodValidation } from "@/composables/useZodValidation";
import { rolSchema } from "@/modules/rol/schemas/RolSchema";
import { useToast } from "@/composables/useToast";
import type { Rol, CrearRol } from "@/modules/rol/interfaces/rol-interface";
import rolAPI from "../api/rolAPI";

interface FormRegistrarRol {
  rol_nombre: string;
  descripcion: string;
}

export const useRegistrarRol = () => {
  const { validate } = useZodValidation(rolSchema);
  const { showToast } = useToast();

  const form = reactive<FormRegistrarRol>({
    rol_nombre: "",
    descripcion: "",
  });

  const resetForm = () => {
    form.rol_nombre = "";
    form.descripcion = "";
  };

  const prepararDatos = (): CrearRol => ({
    rol_nombre: form.rol_nombre.trim(),
    descripcion: form.descripcion.trim() || null,
  });

  const registrarRol = async (): Promise<Rol> => {
    try {
      const { data } = await rolAPI.post<Rol>("/nuevo", prepararDatos());
      showToast("¡Rol registrado con éxito!", "success");
      return data;
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Error al registrar rol",
        "error"
      );
      throw error;
    }
  };

  return { form, resetForm, registrarRol, validate };
};
