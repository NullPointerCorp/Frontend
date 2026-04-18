import { z } from "zod";

const tamanioValidos = ['Pequeño', 'Mediano', 'Grande', 'Extra Grande'] as const;
const formaValidos = ['Cuadrada', 'Rectangular', 'Circular'] as const;

export const paqueteSchema = z.object({
  cliente_id: z
    .number({
      required_error: "El cliente es requerido",
      invalid_type_error: "Selecciona un cliente",
    })
    .int()
    .positive("Selecciona un cliente"),

  tamano: z
    .string()
    .min(1, "El tamaño es requerido")
    .refine(
      (val) => tamanioValidos.includes(val as any),
      "Selecciona un tamaño válido"
    ),

  forma: z
    .string()
    .min(1, "La forma es requerida")
    .refine(
      (val) => formaValidos.includes(val as any),
      "Selecciona una forma válida"
    ),

  peso: z
    .number({
      required_error: "El peso es requerido",
      invalid_type_error: "Ingresa un peso válido",
    })
    .positive("El peso debe ser mayor a 0")
    .max(999.99, "El peso máximo es 999.99 kg"),

  precio: z
    .number()
    .positive()
    .optional()
    .or(z.literal(undefined)),
});

export const actualizarPaqueteSchema = paqueteSchema.omit({ cliente_id: true });

export type PaqueteInput = z.infer<typeof paqueteSchema>;
export type ActualizarPaqueteInput = z.infer<typeof actualizarPaqueteSchema>;