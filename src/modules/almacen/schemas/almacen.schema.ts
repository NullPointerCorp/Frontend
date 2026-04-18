import { z } from "zod";

export const almacenSchema = z.object({
  nombre_almacen: z
    .string()
    .min(1, "El nombre es requerido")
    .max(80, "Máximo 80 caracteres"),

  sucursal_id: z
    .number({
      required_error: "La sucursal es requerida",
      invalid_type_error: "Selecciona una sucursal",
    })
    .int()
    .positive("Selecciona una sucursal"),

  descripcion: z
    .string()
    .max(255, "Máximo 255 caracteres")
    .optional()
    .or(z.literal("")),
});

export const actualizarAlmacenSchema = almacenSchema.omit({ sucursal_id: true });

export type AlmacenInput = z.infer<typeof almacenSchema>;
export type ActualizarAlmacenInput = z.infer<typeof actualizarAlmacenSchema>;