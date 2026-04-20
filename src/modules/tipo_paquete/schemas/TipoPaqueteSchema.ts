import { z } from "zod";

export const tipoPaqueteSchema = z.object({
  tamanio: z
    .string()
    .min(1, "El tamaño es requerido"),
    

  forma: z
    .string()
    .min(1, "La forma es requerida"),

  precio: z.coerce
  .number({
    required_error: "El precio es requerido",
    invalid_type_error: "Ingresa un precio válido",
  })
  .positive("El precio debe ser mayor a 0")
  .max(999999.99, "El precio máximo es 999999.99 pesos"),
});

export const actualizarTipoPaqueteSchema = tipoPaqueteSchema;

export type TipoPaqueteInput = z.infer<typeof tipoPaqueteSchema>;
export type ActualizarTipoPaqueteInput = z.infer<typeof actualizarTipoPaqueteSchema>;
