import { z } from "zod";

export const transporteSchema = z.object({
  numero_serie: z
    .string()
    .min(1, "El número de serie es requerido")
    .max(30, "Máximo 30 caracteres"),

  empleado_id: z
    .number({ invalid_type_error: "Selecciona un transportista" })
    .int()
    .positive("Selecciona un transportista")
    .nullable()
    .refine((val) => val !== null, "Selecciona un transportista"),

  tipo_id: z
    .number({ invalid_type_error: "Selecciona un tipo de transporte" })
    .int()
    .positive("Selecciona un tipo de transporte")
    .nullable()
    .refine((val) => val !== null, "Selecciona un tipo de transporte"),

  subtipo_id: z
    .number({ invalid_type_error: "Selecciona un subtipo de transporte" })
    .int()
    .positive("Selecciona un subtipo de transporte")
    .nullable()
    .refine((val) => val !== null, "Selecciona un subtipo de transporte"),

  capacidad_carga: z
    .number({ invalid_type_error: "Ingresa un número válido" })
    .positive("La capacidad debe ser mayor a 0")
    .nullable()
    .refine((val) => val !== null, "La capacidad de carga es requerida"),

  unidad_medida: z
    .string()
    .min(1, "La unidad de medida es requerida"),

  placa: z
    .string()
    .max(15, "Máximo 15 caracteres")
    .optional()
    .or(z.literal("")),
});

export const actualizarTransporteSchema = z.object({
  empleado_id: z
    .number({ invalid_type_error: "Selecciona un transportista" })
    .int()
    .positive("Selecciona un transportista")
    .nullable()
    .refine((val) => val !== null, "Selecciona un transportista"),

  capacidad_carga: z
    .number({ invalid_type_error: "Ingresa un número válido" })
    .positive("La capacidad debe ser mayor a 0")
    .nullable()
    .refine((val) => val !== null, "La capacidad de carga es requerida"),

  unidad_medida: z
    .string()
    .min(1, "La unidad de medida es requerida"),

  placa: z
    .string()
    .max(15, "Máximo 15 caracteres")
    .optional()
    .or(z.literal("")),
});

export type TransporteInput = z.infer<typeof transporteSchema>;
export type ActualizarTransporteInput = z.infer<typeof actualizarTransporteSchema>;
