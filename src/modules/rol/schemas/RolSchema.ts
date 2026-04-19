import { z } from "zod";

export const rolSchema = z.object({
  rol_nombre: z
    .string()
    .min(1, "El nombre del rol es requerido")
    .max(60, "El nombre no puede exceder 60 caracteres"),
  descripcion: z
    .string()
    .max(255, "La descripción no puede exceder 255 caracteres")
    .nullable()
    .optional(),
});

export const actualizarRolSchema = rolSchema;
